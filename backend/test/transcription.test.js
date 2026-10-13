const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

// Set mock environment before requiring server
process.env.MOCK_TRANSCRIPTION = 'true';
process.env.PORT = '0'; // ephemeral port

const { 
  app, 
  transcribeAudio, 
  extractTicketInfo, 
  redactPII, 
  heuristicExtract 
} = require('../server');

// Helper to create a minimal valid PCM WAV buffer (44 bytes header + sample audio data)
function createDummyWavBuffer(durationSeconds = 1) {
  const sampleRate = 8000;
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = Math.floor(sampleRate * durationSeconds * blockAlign);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // Bits per sample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate a simple square wave
  for (let i = 0; i < dataSize / 2; i++) {
    const val = (i % 20 < 10) ? 2000 : -2000;
    buffer.writeInt16LE(val, 44 + i * 2);
  }

  return buffer;
}

test('SmartDesk AI Nexus - Audio & Transcription Test Suite', async (t) => {
  let server;
  let baseUrl;

  t.before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  t.after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // 1. PII Redaction Unit Tests
  await t.test('Unit: redactPII masks emails, SSNs, credit cards, and phone numbers', () => {
    const raw = 'My email is user@example.com, my SSN is 123-45-6789, card 4111-2222-3333-4444, and phone (555) 123-4567.';
    const sanitized = redactPII(raw);
    assert.ok(sanitized.includes('[REDACTED_EMAIL]'));
    assert.ok(sanitized.includes('[REDACTED_SSN]'));
    assert.ok(sanitized.includes('[REDACTED_CARD]'));
    assert.ok(sanitized.includes('[REDACTED_PHONE]'));
    assert.ok(!sanitized.includes('user@example.com'));
    assert.ok(!sanitized.includes('123-45-6789'));
  });

  // 2. Unit: Heuristic Extractor Fallback
  await t.test('Unit: heuristicExtract produces valid ITIL ticket structure', () => {
    const transcript = 'I cannot connect to the GlobalProtect VPN on my Windows laptop after updating today.';
    const ticket = heuristicExtract(transcript);
    assert.equal(typeof ticket.title, 'string');
    assert.equal(ticket.category, 'Networking');
    assert.ok(ticket.sentiment);
    assert.ok(ticket.priority);
    assert.ok(ticket.assigned_team);
  });

  // 3. Stage 1: Dedicated Transcribe endpoint with valid audio
  await t.test('Stage 1: POST /api/transcribe returns 200 and transcript on valid audio', async () => {
    const wavBuffer = createDummyWavBuffer(1.5);
    const formData = new FormData();
    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    formData.append('audio', blob, 'sample.wav');

    const res = await fetch(`${baseUrl}/api/transcribe`, {
      method: 'POST',
      body: formData
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.transcript);
    assert.ok(typeof data.transcript === 'string');
    assert.ok(data.transcriptId);
    assert.ok(data.duration >= 0);
  });

  // 4. Stage 1: Unsupported file type returns 415
  await t.test('Stage 1: POST /api/transcribe rejects unsupported format with 415', async () => {
    const txtBuffer = Buffer.from('This is a text file, not audio.');
    const formData = new FormData();
    const blob = new Blob([txtBuffer], { type: 'text/plain' });
    formData.append('audio', blob, 'notes.txt');

    const res = await fetch(`${baseUrl}/api/transcribe`, {
      method: 'POST',
      body: formData
    });

    assert.equal(res.status, 415);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(data.error.includes('Unsupported audio format'));
  });

  // 5. Stage 1: Missing audio file returns 400
  await t.test('Stage 1: POST /api/transcribe returns 400 when audio file is missing', async () => {
    const formData = new FormData();
    formData.append('unrelated_field', 'some_value');

    const res = await fetch(`${baseUrl}/api/transcribe`, {
      method: 'POST',
      body: formData
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(data.error.includes('No audio file provided'));
  });

  // 6. Stage 1: Empty audio file returns 400
  await t.test('Stage 1: POST /api/transcribe returns 400 when audio file is empty (0 bytes)', async () => {
    const emptyBuffer = Buffer.alloc(0);
    const formData = new FormData();
    const blob = new Blob([emptyBuffer], { type: 'audio/wav' });
    formData.append('audio', blob, 'empty.wav');

    const res = await fetch(`${baseUrl}/api/transcribe`, {
      method: 'POST',
      body: formData
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(data.error.includes('empty'));
  });

  // 7. Stage 2: POST /api/tickets/extract with valid transcript
  await t.test('Stage 2: POST /api/tickets/extract generates ticket from transcript', async () => {
    const res = await fetch(`${baseUrl}/api/tickets/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcript: 'My Outlook desktop client crashes with error 0x8004010F when opening shared mailboxes.'
      })
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.ticket);
    assert.ok(data.ticket.title);
    assert.ok(data.ticket.category);
    assert.ok(data.ticket.priority);
  });

  // 8. Stage 2: POST /api/tickets/extract with empty transcript returns 400
  await t.test('Stage 2: POST /api/tickets/extract rejects empty transcript with 400', async () => {
    const res = await fetch(`${baseUrl}/api/tickets/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: '   ' })
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(data.error.includes('Transcript text is required'));
  });

  // 9. Backwards compatibility: POST /api/transcript end-to-end ingestion
  await t.test('E2E: POST /api/transcript processes full audio-to-ticket ingestion', async () => {
    const wavBuffer = createDummyWavBuffer(2.0);
    const formData = new FormData();
    const blob = new Blob([wavBuffer], { type: 'audio/wav' });
    formData.append('audio', blob, 'ticket_request.wav');

    const res = await fetch(`${baseUrl}/api/transcript`, {
      method: 'POST',
      body: formData
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.transcript);
    assert.ok(data.analysis);
    assert.ok(data.ticketNumber);
  });

  // 10. Credentials handling: 503 when providers unconfigured and mock disabled
  await t.test('Credentials: transcribeAudio throws 503 when provider unconfigured and MOCK disabled', async () => {
    const originalMock = process.env.MOCK_TRANSCRIPTION;
    const originalGroq = process.env.GROQ_API_KEY;
    const originalOpenAI = process.env.OPENAI_API_KEY;

    delete process.env.MOCK_TRANSCRIPTION;
    delete process.env.GROQ_API_KEY;
    delete process.env.OPENAI_API_KEY;

    try {
      const dummyBuf = createDummyWavBuffer(0.5);
      await assert.rejects(
        async () => {
          await transcribeAudio(dummyBuf, 'test.wav', 'audio/wav');
        },
        (err) => {
          assert.equal(err.status || err.statusCode, 503);
          assert.ok(err.message.includes('not configured'));
          return true;
        }
      );
    } finally {
      process.env.MOCK_TRANSCRIPTION = originalMock;
      if (originalGroq) process.env.GROQ_API_KEY = originalGroq;
      if (originalOpenAI) process.env.OPENAI_API_KEY = originalOpenAI;
    }
  });
});
