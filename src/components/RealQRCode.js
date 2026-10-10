import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, X, Check } from "lucide-react";

function RealQRCode({ 
  Nama, 
  Nim, 
  Jurusan, 
  Kampus, 
  size = 52,
  className = ""
}) {
  const [qrUrl, setQrUrl] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Compact, structured single-line payload for low matrix density & instant scanning
  const qrTextPayload = `NIM: ${Nim || "0000"} | Nama: ${Nama || "Mahasiswa"} | Prodi: ${Jurusan || "-"}`;

  useEffect(() => {
    // Generate high-resolution 1:1 square QR Code with Error Correction 'H', margin 2 (quiet zone)
    QRCode.toDataURL(qrTextPayload, {
      width: 300, // High-res 1:1 square canvas
      margin: 2,  // Built-in white Quiet Zone
      color: {
        dark: "#000000",
        light: "#ffffff"
      },
      errorCorrectionLevel: "H"
    })
      .then((url) => {
        setQrUrl(url);
      })
      .catch((err) => {
        console.error("Gagal membuat QR Code", err);
      });
  }, [qrTextPayload]);

  if (!qrUrl) {
    return (
      <div 
        className={`real-qr-placeholder ${className}`} 
        style={{ width: size, height: size, aspectRatio: "1 / 1" }}
      >
        <span className="qr-loading-dot"></span>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`real-qr-wrapper ${className}`} 
        style={{ width: size, height: size, aspectRatio: "1 / 1" }}
        title="Klik untuk perbesar & scan dengan kamera HP"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      >
        <img
          src={qrUrl}
          alt={`QR Code Verifikasi Mahasiswa ${Nama || ''}`}
          width={size}
          height={size}
          className="real-qr-img"
          style={{ width: size, height: size, aspectRatio: "1 / 1", objectFit: "contain" }}
        />
      </div>

      {/* Modal Zoom Preview for Instant Mobile Phone Testing */}
      {showModal && (
        <div 
          className="qr-modal-backdrop no-print" 
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(false);
          }}
        >
          <div className="qr-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <div className="qr-modal-title-row">
                <QrCode size={18} className="text-amber-400" />
                <h4 className="qr-modal-title">Uji Scan QR Code Mahasiswa</h4>
              </div>
              <button 
                type="button" 
                className="qr-modal-close" 
                onClick={() => setShowModal(false)}
                aria-label="Tutup"
              >
                <X size={16} />
              </button>
            </div>

            <div className="qr-modal-body">
              <div className="qr-zoom-frame">
                <img 
                  src={qrUrl} 
                  alt="QR Code Siap Scan" 
                  width={200} 
                  height={200} 
                  className="qr-zoom-img"
                  style={{ width: 200, height: 200, aspectRatio: "1 / 1", objectFit: "contain" }}
                />
              </div>

              <div className="qr-scan-badge">
                <Check size={14} className="text-emerald-500" />
                <span>Rasio 1:1 Bujur Sangkar • Level 'H' • Quiet Zone Penuh</span>
              </div>

              <div className="qr-modal-data-box">
                <span className="data-box-label">Data Ringkas Terbaca Kamera HP:</span>
                <pre className="data-box-pre">{qrTextPayload}</pre>
              </div>

              <p className="qr-modal-instruction">
                Arahkan kamera smartphone (Google Lens, iOS Camera, atau scanner) ke QR code di atas.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RealQRCode;
