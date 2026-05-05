"use client";

import { useRef, useState } from "react";
import { Camera, X, Loader2 } from "lucide-react";

type Photo = { id: number; dataUrl: string; name: string };

type Props = {
  photos:     Photo[];
  onChange:   (photos: Photo[]) => void;
  maxPhotos?: number;
};

let photoId = 1;

function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas  = document.createElement("canvas");
        const ratio   = Math.min(1, maxWidth / img.width);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas context unavailable")); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PhotoUpload({ photos, onChange, maxPhotos = 2 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const remaining = maxPhotos - photos.length;
    const toProcess = files.slice(0, remaining);
    setLoading(true);
    try {
      const newPhotos: Photo[] = await Promise.all(
        toProcess.map(async (f) => ({ id: photoId++, dataUrl: await compressImage(f), name: f.name }))
      );
      onChange([...photos, ...newPhotos]);
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removePhoto(id: number) { onChange(photos.filter((p) => p.id !== id)); }

  const canAdd = photos.length < maxPhotos;

  return (
    <div>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        {photos.map((p) => (
          <div key={p.id} style={{ position: "relative", width: "120px", height: "120px", borderRadius: "var(--r-md)", overflow: "hidden", flexShrink: 0, border: "1px solid var(--c-border)" }}>
            <img src={p.dataUrl} alt="photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button type="button" onClick={() => removePhoto(p.id)}
              style={{ position: "absolute", top: "4px", right: "4px", width: "22px", height: "22px", borderRadius: "50%", background: "rgba(220,38,38,0.85)", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={12} strokeWidth={3} />
            </button>
          </div>
        ))}
        {canAdd && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={loading}
            style={{ width: "120px", height: "120px", borderRadius: "var(--r-md)", border: "2px dashed var(--c-border)", background: "var(--c-blue-light)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.4rem", cursor: loading ? "wait" : "pointer", color: "var(--c-blue-primary)", flexShrink: 0 }}>
            {loading
              ? <Loader2 size={20} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />
              : <>
                  <Camera size={24} strokeWidth={1.75} />
                  <span style={{ fontSize: "var(--font-xs)", fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
                    {photos.length === 0 ? "Ajouter\nune photo" : "Ajouter\nune 2ème"}
                  </span>
                </>
            }
          </button>
        )}
      </div>
      <p style={{ margin: "0.5rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-muted)" }}>
        {photos.length}/{maxPhotos} photo{maxPhotos > 1 ? "s" : ""} · Depuis l'appareil photo ou la galerie
      </p>
      <input ref={inputRef} type="file" accept="image/*" capture="environment"
        multiple={maxPhotos > 1} style={{ display: "none" }} onChange={handleFiles} />
    </div>
  );
}