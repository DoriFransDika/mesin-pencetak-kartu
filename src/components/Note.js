import React, { useState } from "react";
import { 
  Trash2, 
  Printer, 
  RotateCw, 
  GraduationCap, 
  Wifi, 
  Sparkles, 
  ChevronDown, 
  CheckCircle,
  Copy,
  Scissors,
  QrCode
} from "lucide-react";
import RealQRCode from "./RealQRCode";

// Reusable Front Card Content
function CardFrontContent({ Nama, Nim, Jurusan, Kampus, displayPhoto, role, validThru, defaultAvatar }) {
  return (
    <>
      {/* Subtle Ambient Background Watermark/Pattern */}
      <div className="card-decor-mesh"></div>
      <div className="card-hologram-glow"></div>

      {/* Header section with Campus Name */}
      <div className="card-header-bar">
        <div className="campus-emblem">
          <GraduationCap size={20} className="emblem-icon" />
        </div>
        <div className="campus-meta">
          <h3 className="campus-name capitalize-text">{Kampus || "Universitas Indonesia"}</h3>
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
            <span className="field-value-primary capitalize-text">{Nama || "Nama Lengkap Mahasiswa"}</span>
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
    </>
  );
}

// Reusable Back Card Content with Real Scannable QR Code
function CardBackContent({ Nama, Nim, Jurusan, Kampus, validThru, role }) {
  return (
    <>
      {/* Black Magnetic Stripe */}
      <div className="magnetic-stripe"></div>

      <div className="back-content-inner">
        {/* Signature & Security Code Area */}
        <div className="signature-area-wrapper">
          <div className="signature-strip">
            <span className="signature-placeholder capitalize-text">{Nama || "Tanda Tangan Pemilik"}</span>
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

        {/* Visual Barcode & Real Scannable QR Code */}
        <div className="back-footer-codes">
          <div className="mock-barcode-container">
            <div className="barcode-bars"></div>
            <span className="barcode-number">*{Nim || "1234567890"}*</span>
          </div>

          {/* Real Dynamic QR Code (Scannable via Camera) */}
          <div className="real-qr-container">
            <RealQRCode 
              Nama={Nama}
              Nim={Nim}
              Jurusan={Jurusan}
              Kampus={Kampus}
              size={50}
              className="card-back-qr"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function Note({ 
  id, 
  Nama, 
  Nim, 
  Jurusan, 
  Kampus, 
  Foto, 
  theme = "black-gold", 
  validThru = "09/2028", 
  role = "MAHASISWA AKTIF", 
  onDelete, 
  onPrintSingle,
  globalPrintMode = "both" // 'both', 'front', 'back', 'active'
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPrintMenu, setShowPrintMenu] = useState(false);

  // Default fallback avatar if photo is missing or broken
  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
  const displayPhoto = Foto && Foto.trim() !== "" ? Foto : defaultAvatar;

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(id, Nama);
  }

  function handlePrintAction(mode) {
    setShowPrintMenu(false);
    if (onPrintSingle) {
      onPrintSingle(id, mode, Nama);
    } else {
      window.print();
    }
  }

  const cardProps = {
    Nama,
    Nim,
    Jurusan,
    Kampus,
    displayPhoto,
    role,
    validThru,
    defaultAvatar
  };

  const backProps = {
    Nama,
    Nim,
    Jurusan,
    Kampus,
    validThru,
    role
  };

  return (
    <div className="id-card-wrapper">
      {/* Action Toolbar above card (screen only) */}
      <div className="card-top-toolbar no-print">
        <span className="card-index-pill">Kartu #{id + 1}</span>
        <div className="card-quick-actions">
          <button 
            type="button" 
            className="action-icon-btn flip-btn" 
            onClick={() => setIsFlipped(!isFlipped)} 
            title="Balik Sisi Depan / Belakang"
          >
            <RotateCw size={15} />
            <span>{isFlipped ? "Sisi Depan" : "Sisi Belakang"}</span>
          </button>

          {/* Print Single Dropdown Menu */}
          <div className="print-menu-dropdown-wrap">
            <button 
              type="button" 
              className="action-icon-btn print-single-btn" 
              onClick={() => handlePrintAction(globalPrintMode)}
              title="Cetak Kartu Ini"
            >
              <Printer size={15} />
              <span>Cetak</span>
            </button>
            <button
              type="button"
              className="action-icon-btn print-caret-btn"
              onClick={() => setShowPrintMenu(!showPrintMenu)}
              title="Pilihan Format Cetak"
            >
              <ChevronDown size={13} />
            </button>

            {showPrintMenu && (
              <div className="print-dropdown-menu">
                <button 
                  type="button" 
                  className="dropdown-item"
                  onClick={() => handlePrintAction("both")}
                >
                  <Scissors size={14} />
                  <span>Depan &amp; Belakang (Bolak-Balik)</span>
                </button>
                <button 
                  type="button" 
                  className="dropdown-item"
                  onClick={() => handlePrintAction("front")}
                >
                  <span>Hanya Sisi Depan</span>
                </button>
                <button 
                  type="button" 
                  className="dropdown-item"
                  onClick={() => handlePrintAction("back")}
                >
                  <span>Hanya Sisi Belakang</span>
                </button>
              </div>
            )}
          </div>

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

      {/* =========================================================================
          1. SCREEN VIEW: Interactive 3D Flippable Card
          HANYA AKTIF DI LAYAR. DI @media print disembunyikan sepenuhnya 
          sehingga TIDAK AKAN PERNAH terjadi glitch gambar tumpang tindih!
          ========================================================================= */}
      <div className={`id-card-container card-theme-${theme} ${isFlipped ? "flipped" : ""} screen-display-only`}>
        {/* FRONT SIDE */}
        <div className="card-face card-front">
          <CardFrontContent {...cardProps} />
        </div>

        {/* BACK SIDE */}
        <div className="card-face card-back">
          <CardBackContent {...backProps} />
        </div>
      </div>

      {/* =========================================================================
          2. PRINT VIEW: Dedicated 2D Flat Layout (Standard CR80 85.6mm x 54mm)
          HANYA AKTIF DI @media print. Bebas 3D transform, tidak ada elemen bertumpuk,
          teks tidak terbalik/mirror, dan resolusi cetak sempurna!
          ========================================================================= */}
      <div className={`card-container print-output-container card-theme-${theme} print-display-only`}>
        {/* MODE: BOTH (Front & Back Side-by-Side with Fold/Cut Guide) */}
        {globalPrintMode === "both" && (
          <div className="card-container print-both-sides-wrapper">
            <div className="print-side-card print-side-front">
              <span className="print-side-badge">SISI DEPAN</span>
              <div className="print-face-inner card-face card-front">
                <CardFrontContent {...cardProps} />
              </div>
            </div>

            <div className="print-cut-divider">
              <span className="cut-line"></span>
              <span className="cut-icon-tag"><Scissors size={10} /> Potong / Lipat</span>
              <span className="cut-line"></span>
            </div>

            <div className="print-side-card print-side-back">
              <span className="print-side-badge">SISI BELAKANG</span>
              <div className="print-face-inner card-face card-back card-back-flat">
                <CardBackContent {...backProps} />
              </div>
            </div>
          </div>
        )}

        {/* MODE: FRONT ONLY */}
        {globalPrintMode === "front" && (
          <div className="card-container print-single-card-wrapper">
            <div className="print-side-card print-side-front">
              <div className="print-face-inner card-face card-front">
                <CardFrontContent {...cardProps} />
              </div>
            </div>
          </div>
        )}

        {/* MODE: BACK ONLY */}
        {globalPrintMode === "back" && (
          <div className="card-container print-single-card-wrapper">
            <div className="print-side-card print-side-back">
              <div className="print-face-inner card-face card-back card-back-flat">
                <CardBackContent {...backProps} />
              </div>
            </div>
          </div>
        )}

        {/* MODE: ACTIVE (Tergantung sisi yang dibalik di layar) */}
        {globalPrintMode === "active" && (
          <div className="card-container print-single-card-wrapper">
            {!isFlipped ? (
              <div className="print-side-card print-side-front">
                <div className="print-face-inner card-face card-front">
                  <CardFrontContent {...cardProps} />
                </div>
              </div>
            ) : (
              <div className="print-side-card print-side-back">
                <div className="print-face-inner card-face card-back card-back-flat">
                  <CardBackContent {...backProps} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Note;
