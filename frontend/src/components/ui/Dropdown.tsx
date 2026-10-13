"use client";

import React, { useState, useRef, useEffect } from "react";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
  align?: "left" | "right";
  width?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  children,
  align = "right",
  width = "w-56",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0}>
        {trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-2 ${width} bg-white border border-brand-border rounded-xl shadow-dropdown p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100`}
        >
          {items
            ? items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                    item.active
                      ? "bg-blue-50 text-brand-blue font-semibold"
                      : item.danger
                      ? "text-brand-error hover:bg-red-50"
                      : "text-brand-text hover:bg-slate-50"
                  } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {item.icon && (
                    <span className="mt-0.5 shrink-0 text-brand-muted">
                      {item.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.label}</p>
                    {item.description && (
                      <p className="text-[11px] text-brand-muted truncate mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </button>
              ))
            : children}
        </div>
      )}
    </div>
  );
};
