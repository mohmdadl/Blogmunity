import React from "react";

export default function ImageViewer({ src, alt = "Image", open, onClose }) {
  if (!open) return null;
  return (
    <div className="modal modal-open" onClick={onClose}>
      <div className="modal-box max-w-5xl p-2 bg-base-100" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <img src={src} alt={alt} className="w-full h-auto object-contain rounded-lg" />
          <button
            className="btn btn-sm btn-circle absolute top-2 right-2"
            onClick={onClose}
            aria-label="Close image viewer"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
}
