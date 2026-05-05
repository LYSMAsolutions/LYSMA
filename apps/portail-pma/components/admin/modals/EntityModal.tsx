"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type EntityModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
};

export default function EntityModal({
  open,
  onClose,
  title,
  description,
  children,
}: EntityModalProps) {
  const portalRef = useRef<Element | null>(null);

  useEffect(() => {
    portalRef.current = document.body;
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open || !portalRef.current) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(4px)",
          border: "none",
          cursor: "pointer",
        }}
      />

      {/* Modale */}
      <div
        style={{
          position: "relative",
          zIndex: 10000,
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: "1.75rem",
          border: "1px solid rgba(217,227,240,0.9)",
          background: "#ffffff",
          boxShadow: "0 32px 80px rgba(15,23,42,0.22), 0 0 0 1px rgba(255,255,255,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.5rem 1.75rem",
          borderBottom: "1px solid rgba(226,232,240,0.8)",
          flexShrink: 0,
          background: "linear-gradient(180deg, #ffffff, #f8fbff)",
        }}>
          <div>
            {title && (
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", letterSpacing: "-0.02em" }}>
                {title}
              </h2>
            )}
            {description && (
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.875rem", color: "#6b7280" }}>
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "0.75rem",
              border: "1px solid #e2e8f0",
              background: "#f8fafc",
              cursor: "pointer",
              flexShrink: 0,
              transition: "background 0.15s",
            }}
          >
            <X size={16} color="#6b7280" />
          </button>
        </div>

        {/* Body scrollable */}
        <div style={{
          overflowY: "auto",
          padding: "1.75rem",
          flex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}