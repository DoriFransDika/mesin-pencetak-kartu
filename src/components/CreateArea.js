import React, { useState, useRef } from "react";
import { 
  User, 
  Hash, 
  GraduationCap, 
  Building2, 
  Upload, 
  Sparkles, 
  Plus, 
  Palette, 
  Image as ImageIcon,
  Check
} from "lucide-react";

// Preset sample avatars for instant selection
const PRESET_AVATARS = [
  {
    name: "Pria 1",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Wanita 1",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Pria 2",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Wanita 2",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
  }
];

const THEME_OPTIONS = [
  { id: "black-gold", name: "Midnight Gold", color: "#d4af37", bg: "linear-gradient(135deg, #111827 0%, #000000 100%)" },
  { id: "sapphire-blue", name: "Royal Sapphire", color: "#38bdf8", bg: "linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)" },
  { id: "emerald-green", name: "Emerald Prestige", color: "#34d399", bg: "linear-gradient(135deg, #064e3b 0%, #022c22 100%)" },
  { id: "cyber-purple", name: "Cyber Violet", color: "#c084fc", bg: "linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)" },
  { id: "minimal-white", name: "Modern Minimal", color: "#64748b", bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)" }
];

function CreateArea({ onAdd }) {
  const fileInputRef = useRef(null);
  const [photoMode, setPhotoMode] = useState("upload"); // 'upload', 'url', 'preset'

  const [formData, setFormData] = useState({
    Nama: "",
    Nim: "",
    Jurusan: "",
    Kampus: "UNIVERSITAS INDONESIA",
    Foto: "",
    theme: "black-gold",
    validThru: "09/2028",
    role: "MAHASISWA AKTIF"
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  // Handle local file upload (image to DataURL)
  function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Harap pilih file berupa gambar (JPG, PNG, atau WEBP)");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          Foto: uploadEvent.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSelectPreset(avatarUrl) {
    setFormData((prev) => ({
      ...prev,
      Foto: avatarUrl
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!formData.Nama.trim() && !formData.Nim.trim()) {
      alert("Harap isi setidaknya Nama Mahasiswa dan NIM!");
      return;
    }

    onAdd(formData);

    // Reset with default campus preserved for convenience
    setFormData({
      Nama: "",
      Nim: "",
      Jurusan: "",
      Kampus: formData.Kampus || "UNIVERSITAS INDONESIA",
      Foto: "",
      theme: formData.theme,
      validThru: "09/2028",
      role: "MAHASISWA AKTIF"
    });
  }

  return (
    <div className="creator-card-panel no-print">
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="badge-glow">
            <Sparkles size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="panel-title">Buat Kartu Baru</h2>
            <p className="panel-subtitle">Isi data mahasiswa dan sesuaikan gaya kartu cetak</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="creator-form">
        <div className="form-grid">
          {/* Nama Lengkap */}
          <div className="input-group">
            <label className="input-label">
              <User size={15} />
              <span>Nama Lengkap</span>
            </label>
            <input
              type="text"
              name="Nama"
              value={formData.Nama}
              onChange={handleChange}
              placeholder="Contoh: Raden Aditya Pratama"
              required
              className="form-input"
            />
          </div>

          {/* NIM */}
          <div className="input-group">
            <label className="input-label">
              <Hash size={15} />
              <span>Nomor Induk Mahasiswa (NIM)</span>
            </label>
            <input
              type="text"
              name="Nim"
              value={formData.Nim}
              onChange={handleChange}
              placeholder="Contoh: 21081010045"
              required
              className="form-input"
            />
          </div>

          {/* Program Studi / Jurusan */}
          <div className="input-group">
            <label className="input-label">
              <GraduationCap size={15} />
              <span>Program Studi / Jurusan</span>
            </label>
            <input
              type="text"
              name="Jurusan"
              value={formData.Jurusan}
              onChange={handleChange}
              placeholder="Contoh: Sistem Informasi & AI"
              required
              className="form-input"
            />
          </div>

          {/* Nama Kampus / Institusi */}
          <div className="input-group">
            <label className="input-label">
              <Building2 size={15} />
              <span>Nama Universitas / Kampus</span>
            </label>
            <input
              type="text"
              name="Kampus"
              value={formData.Kampus}
              onChange={handleChange}
              placeholder="Contoh: UNIVERSITAS TEKNOLOGI NUSANTARA"
              required
              className="form-input"
            />
          </div>

          {/* Masa Berlaku */}
          <div className="input-group">
            <label className="input-label">
              <span>Berlaku Sampai (Bulan/Tahun)</span>
            </label>
            <input
              type="text"
              name="validThru"
              value={formData.validThru}
              onChange={handleChange}
              placeholder="Contoh: 09/2028"
              className="form-input"
            />
          </div>

          {/* Status Label */}
          <div className="input-group">
            <label className="input-label">
              <span>Status Mahasiswa</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input form-select"
            >
              <option value="MAHASISWA AKTIF">MAHASISWA AKTIF</option>
              <option value="MAHASISWA REGULER">MAHASISWA REGULER</option>
              <option value="PASCASARJANA">PASCASARJANA</option>
              <option value="PENGURUS BEM">PENGURUS BEM</option>
              <option value="ASISTEN DOSEN">ASISTEN DOSEN</option>
            </select>
          </div>
        </div>

        {/* PHOTO INPUT SECTION */}
        <div className="photo-selection-section">
          <div className="photo-section-top">
            <label className="input-label">
              <ImageIcon size={15} />
              <span>Foto Mahasiswa</span>
            </label>
            <div className="photo-mode-tabs">
              <button
                type="button"
                className={`mode-tab ${photoMode === "upload" ? "active" : ""}`}
                onClick={() => setPhotoMode("upload")}
              >
                Upload File
              </button>
              <button
                type="button"
                className={`mode-tab ${photoMode === "preset" ? "active" : ""}`}
                onClick={() => setPhotoMode("preset")}
              >
                Pilihan Avatar
              </button>
              <button
                type="button"
                className={`mode-tab ${photoMode === "url" ? "active" : ""}`}
                onClick={() => setPhotoMode("url")}
              >
                URL Gambar
              </button>
            </div>
          </div>

          {/* File Upload Box */}
          {photoMode === "upload" && (
            <div 
              className="dropzone-box" 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <div className="dropzone-content">
                <Upload size={24} className="dropzone-icon" />
                <span className="dropzone-text">
                  {formData.Foto && formData.Foto.startsWith("data:") 
                    ? "✓ Foto lokal berhasil dipilih (Klik untuk ganti)" 
                    : "Klik untuk memilih foto dari komputer (JPG / PNG)"}
                </span>
              </div>
            </div>
          )}

          {/* Preset Avatars */}
          {photoMode === "preset" && (
            <div className="presets-row">
              {PRESET_AVATARS.map((av, idx) => (
                <div
                  key={idx}
                  className={`preset-thumb ${formData.Foto === av.url ? "selected" : ""}`}
                  onClick={() => handleSelectPreset(av.url)}
                  title={av.name}
                >
                  <img src={av.url} alt={av.name} />
                  {formData.Foto === av.url && (
                    <div className="preset-check">
                      <Check size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Direct URL Input */}
          {photoMode === "url" && (
            <div className="input-group">
              <input
                type="url"
                name="Foto"
                value={formData.Foto}
                onChange={handleChange}
                placeholder="https://example.com/foto-mahasiswa.jpg"
                className="form-input"
              />
            </div>
          )}
        </div>

        {/* THEME SELECTION */}
        <div className="theme-selection-section">
          <label className="input-label">
            <Palette size={15} />
            <span>Pilih Gaya & Tema Kartu</span>
          </label>
          <div className="theme-chips-grid">
            {THEME_OPTIONS.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-chip-btn ${formData.theme === theme.id ? "active" : ""}`}
                onClick={() => setFormData((p) => ({ ...p, theme: theme.id }))}
              >
                <span className="theme-dot" style={{ background: theme.bg }}></span>
                <span className="theme-name">{theme.name}</span>
                {formData.theme === theme.id && <Check size={14} className="theme-check" />}
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="form-submit-row">
          <button type="submit" className="btn btn-primary submit-btn">
            <Plus size={18} />
            <span>Tambahkan ke Antrean Cetak</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateArea;
