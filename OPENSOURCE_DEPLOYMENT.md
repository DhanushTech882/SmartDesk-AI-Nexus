# Origin X SmartDesk AI: Enterprise Open-Source ITSM Platform

> **Origin X SmartDesk AI** is an autonomous, cognitive IT Service Management (ITSM) platform designed for companies seeking an open-source, voice-first alternative to ServiceNow, Jira Service Management, and Zendesk.

---

## 🌟 Key Architecture & Portals

1. **🏠 Employee Self-Service Hub (`/employee`)**:
   - Voice and text intake for company employees.
   - Live status tracking of submitted tickets (`Pending`, `In Progress`, `Resolved`).
   - One-click presets for common workplace problems (VPN drops, Okta lockouts, workstation crashes).

2. **⚡ IT Support Agent Console (`/console`)**:
   - Ticket queue triage, interactive word-level audio scrubbing.
   - Zero-touch self-healing runbook execution (`flush_dns_vpn`, `okta_password_reset`, `restart_service`, `reprovision_email`).
   - AI canned responses with empathetic, technical, and executive tones.

3. **📡 SRE Outage Radar & Telemetry (`/incidents` & `/analytics`)**:
   - Real-time ticket velocity monitoring to detect cascading infrastructure incidents.
   - Mean Time to Resolution (MTTR) analytics and SLA compliance tracking.

---

## 🚀 Quick Start (Local Development)

### 1. Start the Node.js Express Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000` with embedded database storage (`data/embedded_db.json`). Zero external setup required!*

### 2. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
*Access the Origin X Enterprise Portal at `http://localhost:3000`.*

### 3. (Optional) Run the Streamlit Python Prototype
```bash
python -m pip install -r requirements.txt
python -m streamlit run app.py
```

---

## 🐳 1-Click Production Deployment (Docker Compose)

Deploy the entire enterprise platform (Frontend + Backend + PostgreSQL Database) in a single command:

```bash
docker compose up -d
```

### Services Deployed:
* **Origin X Web Portal**: `http://<your-server-ip>:3000`
* **ITSM REST API**: `http://<your-server-ip>:5000`
* **PostgreSQL 16**: Port `5432` with persistent Docker volume storage

---

## 👥 Persona Switching
In the top right navigation header, click the profile icon to instantaneously switch between:
* **Alex Rivera** (Origin X Employee)
* **Devon Vance** (Tier 2 IT Support Agent)
* **Elena Rostova** (Cloud Infrastructure & SRE Admin)
