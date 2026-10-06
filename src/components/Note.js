import React, { useState } from "react";
import { Trash2, Printer, RotateCw, GraduationCap, ShieldCheck, Wifi, Sparkles, Building2 } from "lucide-react";

function Note({ id, Nama, Nim, Jurusan, Kampus, Foto, theme = "black-gold", validThru = "09/2028", role = "MAHASISWA AKTIF", onDelete, onPrintSingle }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Default fallback avatar if photo is missing or broken
  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
  const displayPhoto = Foto && Foto.trim() !== "" ? Foto : defaultAvatar;

  function handleDelete(e) {
    e.stopPropagation();
    if (window.confirm(`Hapus kartu mahasiswa atas nama "${Nama || 'ini'}"?`)) {
      onDelete(id);
    }
  }

  function handlePrintThis(e) {
    e.stopPropagation();
    if (onPrintSingle) {
      onPrintSingle(id);
    } else {
      window.print();
    }
  }

  return (
    <div className="id-card-wrapper">
      {/* Action Toolbar above card */}
      <div className="card-top-toolbar no-print">
        <span className="card-index-pill">Kartu #{id + 1}</span>
        <div className="card-quick-actions">
          <button 
            type="button" 
            className="action-icon-btn" 
            onClick={() => setIsFlipped(!isFlipped)} 
            title="Balik Sisi Depan / Belakang"
          >
            <RotateCw size={15} />
            <span>{isFlipped ? "Sisi Depan" : "Sisi Belakang"}</span>
          </button>
          <button 
            type="button" 
            className="action-icon-btn print-single-btn" 
            onClick={handlePrintThis} 
            title="Cetak Kartu Ini Saja"
          >
            <Printer size={15} />
            <span>Cetak</span>
          </button>
          <button 
            type="button" 
            className="action-icon-btn delete-btn" 
            onClick={handleDelete} 
            title="Hapus Kartu Ini"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* The Physical Card Container */}
      <div className={`id-card-container card-theme-${theme} ${isFlipped ? "flipped" : ""}`}>
        {/* FRONT SIDE */}
        <div className="card-face card-front">
          {/* Subtle Ambient Background Watermark/Pattern */}
          <div className="card-decor-mesh"></div>
          <div className="card-hologram-glow"></div>

          {/* Header section with Campus Name */}
          <div className="card-header-bar">
            <div className="campus-emblem">
              <GraduationCap size={20} className="emblem-icon" />
            </div>
            <div className="campus-meta">
              <h3 className="campus-name">{Kampus || "NAMA UNIVERSITAS / KAMPUS"}</h3>
              <p className="card-type-label">KARTU TANDA MAHASISWA</p>
            </div>
            <div className="card-security-chip-rfid">
              <Wifi size={18} className="rfid-icon" />
            </div>
          </div>

          {/* Body Section: Photo & Identity details */}
          <div className="card-body-content">
            {/* Student Photo with Frame & Badge */}
            <div className="card-photo-wrapper">
              <div className="photo-frame">
                <img
                  src={displayPhoto}
                  alt={Nama || "Foto Mahasiswa"}
                  className="student-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
              <div className="status-pill">
                <span className="status-indicator"></span>
                <span>{role || "AKTIF"}</span>
              </div>
            </div>

            {/* Structured details */}
            <div className="card-details-grid">
              <div className="detail-row name-row">
                <span className="field-label">NAMA LENGKAP</span>
                <span className="field-value-primary">{Nama || "Nama Lengkap Mahasiswa"}</span>
              </div>

              <div className="detail-row">
                <span className="field-label">NOMOR INDUK (NIM)</span>
                <span className="field-value mono-text">{Nim || "202400000000"}</span>
              </div>

              <div className="detail-row">
                <span className="field-label">PROGRAM STUDI / JURUSAN</span>
                <span className="field-value">{Jurusan || "Teknik Informatika & Desain"}</span>
              </div>

              <div className="detail-footer-meta">
                <div>
                  <span className="field-label">BERLAKU S/D</span>
                  <span className="field-value-sm">{validThru || "09/2028"}</span>
                </div>
                {/* Gold Smart EMV Chip visual */}
                <div className="emv-chip" title="Smart Card Microchip">
                  <div className="chip-lines"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Bar with Hologram & QR Code */}
          <div className="card-bottom-strip">
            <div className="security-hologram">
              <Sparkles size={14} className="holo-icon" />
              <span>OFFICIAL IDENTITY</span>
            </div>
            <div className="card-serial-code">
              ID: KTM-{(Nim || "0000").slice(-4)}-{new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* BACK SIDE */}
        <div className="card-face card-back">
          {/* Black Magnetic Stripe */}
          <div className="magnetic-stripe"></div>

          <div className="back-content-inner">
            {/* Signature & Security Code Area */}
            <div className="signature-area-wrapper">
              <div className="signature-strip">
                <span className="signature-placeholder">{Nama || "Tanda Tangan Pemilik"}</span>
              </div>
              <div className="cvv-badge">CVV 894</div>
            </div>

            {/* Terms of use */}
            <div className="card-terms-box">
              <p className="terms-heading">KETENTUAN KARTU MAHASISWA:</p>
              <ul className="terms-list">
                <li>Kartu ini adalah identitas resmi civitas akademika {Kampus || "Universitas"}.</li>
                <li>Wajib dibawa saat kegiatan akademik dan ujian semester.</li>
                <li>Jika menemukan kartu ini, harap hubungi bagian administrasi kampus.</li>
              </ul>
            </div>

            {/* Visual Barcode & QR Code */}
            <div className="back-footer-codes">
              <div className="mock-barcode-container">
                <div className="barcode-bars"></div>
                <span className="barcode-number">*{Nim || "1234567890"}*</span>
              </div>

              {/* Clean Vector SVG QR Code */}
              <div className="mock-qr-code">
                <svg viewBox="0 0 100 100" width="46" height="46" className="qr-svg">
                  <rect width="100" height="100" fill="#ffffff" />
                  {/* Outer corner boxes */}
                  <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff" />
                  <rect x="18" y="18" width="8" height="8" fill="#0f172a" />

                  <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff" />
                  <rect x="74" y="18" width="8" height="8" fill="#0f172a" />

                  <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff" />
                  <rect x="18" y="74" width="8" height="8" fill="#0f172a" />

                  {/* Random QR bit data patterns */}
                  <rect x="42" y="12" width="6" height="14" fill="#0f172a" />
                  <rect x="52" y="20" width="8" height="6" fill="#0f172a" />
                  <rect x="42" y="42" width="16" height="16" fill="#0f172a" />
                  <rect x="64" y="44" width="8" height="10" fill="#0f172a" />
                  <rect x="14" y="46" width="14" height="6" fill="#0f172a" />
                  <rect x="42" y="68" width="8" height="14" fill="#0f172a" />
                  <rect x="62" y="72" width="16" height="8" fill="#0f172a" />
                  <rect x="80" y="58" width="8" height="16" fill="#0f172a" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Note;
