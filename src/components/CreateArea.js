import React, { useState, useRef, useEffect } from "react";
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
  Check,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Loader2,
  Search,
  X,
  RefreshCw,
  Clock
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

// Rich fallback database of Indonesian Universities in Title Case
const INDONESIA_UNIVERSITIES_FALLBACK = [
  "Universitas Indonesia (UI)",
  "Institut Teknologi Bandung (ITB)",
  "Institut Teknologi Padang (ITP)",
  "Universitas Gadjah Mada (UGM)",
  "Institut Teknologi Sepuluh Nopember (ITS)",
  "Universitas Airlangga (UNAIR)",
  "Universitas Diponegoro (UNDIP)",
  "Universitas Brawijaya (UB)",
  "Universitas Padjadjaran (UNPAD)",
  "Institut Pertanian Bogor (IPB)",
  "Universitas Sebelas Maret (UNS)",
  "Universitas Hasanuddin (UNHAS)",
  "Universitas Negeri Yogyakarta (UNY)",
  "Universitas Negeri Semarang (UNNES)",
  "Universitas Negeri Jakarta (UNJ)",
  "Universitas Pendidikan Indonesia (UPI)",
  "Universitas Bina Nusantara (BINUS University)",
  "Telkom University",
  "Universitas Trisakti",
  "Universitas Tarumanagara (UNTAR)",
  "Universitas Katolik Parahyangan (UNPAR)",
  "Universitas Islam Indonesia (UII)",
  "Universitas Muhammadiyah Yogyakarta (UMY)",
  "Universitas Multimedia Nusantara (UMN)",
  "Universitas Atma Jaya Yogyakarta",
  "Universitas Kristen Petra",
  "Universitas Udayana (UNUD)",
  "Universitas Sumatera Utara (USU)",
  "Universitas Andalas (UNAND)",
  "Universitas Sriwijaya (UNSRI)",
  "Universitas Syiah Kuala (USK)",
  "Universitas Sam Ratulangi (UNSRAT)",
  "Universitas Mataram (UNRAM)",
  "Universitas Terbuka (UT)"
];

// Curated list of popular Indonesian majors/study programs
const INDONESIA_MAJORS_SUGGESTIONS = [
  "Teknik Informatika",
  "Sistem Informasi",
  "Ilmu Komputer",
  "Rekayasa Perangkat Lunak",
  "Kecerdasan Buatan (AI) & Sains Data",
  "Teknologi Informasi",
  "Desain Komunikasi Visual (DKV)",
  "Desain Produk",
  "Teknik Elektro",
  "Teknik Sipil",
  "Teknik Mesin",
  "Teknik Industri",
  "Teknik Kimia",
  "Manajemen Bisnis",
  "Akuntansi",
  "Ilmu Ekonomi",
  "Ilmu Komunikasi",
  "Hubungan Internasional",
  "Ilmu Hukum",
  "Kedokteran Umum",
  "Kedokteran Gigi",
  "Farmasi",
  "Psikologi",
  "Arsitektur",
  "Sastra Inggris",
  "Sastra Indonesia",
  "Pendidikan Guru Sekolah Dasar (PGSD)",
  "Administrasi Publik",
  "Statistika",
  "Matematika",
  "Fisika",
  "Biologi",
  "Kesehatan Masyarakat",
  "Pariwisata & Perhotelan"
];

// Helper: Convert string to proper Title Case using regex (?:^|\s|-)\S
export function toTitleCase(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s|-)\S/g, function(a) { return a.toUpperCase(); });
}

function CreateArea({ onAdd, existingNims = [], onNotify }) {
  const fileInputRef = useRef(null);
  const univDropdownRef = useRef(null);
  const jurusanDropdownRef = useRef(null);
  const [photoMode, setPhotoMode] = useState("upload"); // 'upload', 'url', 'preset'

  // Calculate minimum valid month (Current Month: YYYY-MM)
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthNum = today.getMonth() + 1;
  const minMonthString = `${currentYear}-${String(currentMonthNum).padStart(2, "0")}`;
  
  // Default valid thru is 4 years from now (Standard Bachelor duration)
  const defaultFutureYear = currentYear + 4;
  const defaultMonthString = `${defaultFutureYear}-09`;
  const defaultCardValidThru = `09/${defaultFutureYear}`;

  const [monthInput, setMonthInput] = useState(defaultMonthString);
  const [photoPreviewAnim, setPhotoPreviewAnim] = useState(false);

  const [formData, setFormData] = useState({
    Nama: "",
    Nim: "",
    Jurusan: "",
    Kampus: "Universitas Indonesia",
    Foto: "",
    theme: "black-gold",
    validThru: defaultCardValidThru,
    role: "MAHASISWA AKTIF"
  });

  // Autocomplete state: Universitas
  const [univSuggestions, setUnivSuggestions] = useState([]);
  const [isUnivLoading, setIsUnivLoading] = useState(false);
  const [showUnivDropdown, setShowUnivDropdown] = useState(false);

  // Autocomplete state: Jurusan / Program Studi
  const [jurusanSuggestions, setJurusanSuggestions] = useState([]);
  const [showJurusanDropdown, setShowJurusanDropdown] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (univDropdownRef.current && !univDropdownRef.current.contains(event.target)) {
        setShowUnivDropdown(false);
      }
      if (jurusanDropdownRef.current && !jurusanDropdownRef.current.contains(event.target)) {
        setShowJurusanDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live Title Case formatter for Name input
  function handleNameChange(event) {
    const rawVal = event.target.value;
    // Capitalize the first letter of each word live
    const titleCased = rawVal.replace(/\b\w/g, (char) => char.toUpperCase());
    setFormData((prev) => ({
      ...prev,
      Nama: titleCased
    }));
  }

  // Extra normalization on blur for Name input
  function handleNameBlur() {
    setFormData((prev) => ({
      ...prev,
      Nama: toTitleCase(prev.Nama.trim())
    }));
  }

  // Handle only numeric input for NIM
  function handleNimChange(event) {
    const rawVal = event.target.value;
    // Strip non-digit characters
    const numericVal = rawVal.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      Nim: numericVal
    }));
  }

  // Block non-numeric keystrokes
  function handleNimKeyDown(event) {
    if (
      event.key === "Backspace" ||
      event.key === "Tab" ||
      event.key === "Enter" ||
      event.key === "Delete" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.ctrlKey ||
      event.metaKey
    ) {
      return;
    }
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Autocomplete: Universitas Search with API + Fallback
  useEffect(() => {
    const query = formData.Kampus.trim();
    if (!query || query.length < 2) {
      setUnivSuggestions([]);
      return;
    }

    // 1. Instant local fallback filtering
    const localMatches = INDONESIA_UNIVERSITIES_FALLBACK.filter((u) =>
      u.toLowerCase().includes(query.toLowerCase())
    );
    setUnivSuggestions(localMatches.slice(0, 6));

    // 2. Fetch from Hipolabs Universities API
    setIsUnivLoading(true);
    const timer = setTimeout(() => {
      fetch(`https://universities.hipolabs.com/search?country=Indonesia&name=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            const apiNames = data.map((item) => toTitleCase(item.name));
            // Combine and deduplicate
            const combined = Array.from(new Set([...apiNames, ...localMatches]));
            setUnivSuggestions(combined.slice(0, 8));
          }
        })
        .catch((err) => {
          console.warn("Hipolabs API fallback to local cache:", err);
        })
        .finally(() => {
          setIsUnivLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [formData.Kampus]);

  // Handle University live Title Case typing
  function handleKampusChange(e) {
    const rawVal = e.target.value;
    const titleCased = toTitleCase(rawVal);
    setFormData((p) => ({ ...p, Kampus: titleCased }));
    setShowUnivDropdown(true);
  }

  function handleKampusBlur() {
    setFormData((p) => ({
      ...p,
      Kampus: toTitleCase(p.Kampus.trim())
    }));
  }

  function handleSelectUniv(univName) {
    setFormData((prev) => ({
      ...prev,
      Kampus: toTitleCase(univName)
    }));
    setShowUnivDropdown(false);
  }

  // Autocomplete: Jurusan / Program Studi
  function handleJurusanChange(e) {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      Jurusan: val
    }));

    if (val.trim().length > 0) {
      const filtered = INDONESIA_MAJORS_SUGGESTIONS.filter((m) =>
        m.toLowerCase().includes(val.toLowerCase())
      );
      setJurusanSuggestions(filtered.slice(0, 6));
      setShowJurusanDropdown(true);
    } else {
      setJurusanSuggestions([]);
      setShowJurusanDropdown(false);
    }
  }

  function handleSelectJurusan(majorName) {
    setFormData((prev) => ({
      ...prev,
      Jurusan: majorName
    }));
    setShowJurusanDropdown(false);
  }

  // Handle Valid Thru Month Input (Validation: Must be > today)
  function handleMonthChange(e) {
    const selectedMonth = e.target.value; // Format: YYYY-MM
    setMonthInput(selectedMonth);

    if (selectedMonth < minMonthString) {
      if (onNotify) {
        onNotify({
          type: "error",
          title: "Tanggal Kedaluwarsa",
          message: "Masa berlaku kartu tidak boleh lebih lampau dari tanggal hari ini!"
        });
      }
      return;
    }

    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const formattedCardDate = `${month}/${year}`;
      setFormData((prev) => ({
        ...prev,
        validThru: formattedCardDate
      }));
    }
  }

  // Quick preset buttons for expiration (+1, +2, +3, +4 Tahun)
  function handleSetExpiryYears(additionalYears) {
    const targetYear = currentYear + additionalYears;
    const month = String(currentMonthNum).padStart(2, "0");
    const newMonthStr = `${targetYear}-${month}`;
    const newCardDate = `${month}/${targetYear}`;
    setMonthInput(newMonthStr);
    setFormData((prev) => ({
      ...prev,
      validThru: newCardDate
    }));

    if (onNotify) {
      onNotify({
        type: "info",
        title: "Masa Berlaku Diperbarui",
        message: `Masa berlaku diatur ke ${newCardDate} (+${additionalYears} tahun).`
      });
    }
  }

  // Real-time Photo Upload with FileReader & Animation
  function handleFileUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        if (onNotify) {
          onNotify({
            type: "error",
            title: "Format File Tidak Didukung",
            message: "Harap pilih file berupa gambar (JPG, PNG, atau WEBP)!"
          });
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Img = uploadEvent.target.result;
        setFormData((prev) => ({
          ...prev,
          Foto: base64Img
        }));
        setPhotoPreviewAnim(true);
        setTimeout(() => setPhotoPreviewAnim(false), 1200);

        if (onNotify) {
          onNotify({
            type: "success",
            title: "Foto Berhasil Dimuat",
            message: `Foto "${file.name}" berhasil diunggah dan langsung tampil di kartu.`
          });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSelectPreset(avatarUrl, avatarName) {
    setFormData((prev) => ({
      ...prev,
      Foto: avatarUrl
    }));
    setPhotoPreviewAnim(true);
    setTimeout(() => setPhotoPreviewAnim(false), 1000);

    if (onNotify) {
      onNotify({
        type: "info",
        title: "Avatar Terpilih",
        message: `Avatar "${avatarName || 'Contoh'}" dipilih untuk kartu ini.`
      });
    }
  }

  function handleRemovePhoto() {
    setFormData((prev) => ({
      ...prev,
      Foto: ""
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  // NIM status calculations
  const currentNim = formData.Nim.trim();
  const isDuplicateNim = currentNim.length > 0 && existingNims.some(
    (existing) => String(existing).trim() === currentNim
  );
  const isNimTooShort = currentNim.length > 0 && currentNim.length < 4;
  const isNimValid = currentNim.length >= 4 && !isDuplicateNim;

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.Nama.trim()) {
      if (onNotify) {
        onNotify({
          type: "warning",
          title: "Nama Belum Diisi",
          message: "Harap isi nama lengkap mahasiswa!"
        });
      }
      return;
    }

    if (!currentNim) {
      if (onNotify) {
        onNotify({
          type: "warning",
          title: "NIM Belum Diisi",
          message: "Nomor Induk Mahasiswa (NIM) wajib diisi!"
        });
      }
      return;
    }

    if (currentNim.length < 4) {
      if (onNotify) {
        onNotify({
          type: "error",
          title: "NIM Terlalu Pendek",
          message: `NIM harus memiliki minimal 4 digit angka unik! (Saat ini baru: ${currentNim.length} digit)`
        });
      }
      return;
    }

    if (isDuplicateNim) {
      if (onNotify) {
        onNotify({
          type: "error",
          title: "NIM Sudah Digunakan",
          message: `NIM "${currentNim}" sudah terdaftar pada kartu lain! NIM mahasiswa harus unik.`
        });
      }
      return;
    }

    if (!formData.Jurusan.trim()) {
      if (onNotify) {
        onNotify({
          type: "warning",
          title: "Jurusan Belum Diisi",
          message: "Harap isi program studi atau jurusan mahasiswa!"
        });
      }
      return;
    }

    if (monthInput < minMonthString) {
      if (onNotify) {
        onNotify({
          type: "error",
          title: "Masa Berlaku Kedaluwarsa",
          message: "Masa berlaku kartu harus lebih besar dari tanggal hari ini!"
        });
      }
      return;
    }

    // Ensure final name and university are clean Title Case
    const submissionData = {
      ...formData,
      Nama: toTitleCase(formData.Nama.trim()),
      Kampus: toTitleCase(formData.Kampus.trim() || "Universitas Indonesia")
    };

    onAdd(submissionData);

    if (onNotify) {
      onNotify({
        type: "success",
        title: "Kartu Berhasil Ditambahkan",
        message: `Kartu mahasiswa untuk ${submissionData.Nama} (NIM: ${currentNim}) berhasil masuk ke antrean cetak.`
      });
    }

    // Reset form
    setFormData({
      Nama: "",
      Nim: "",
      Jurusan: "",
      Kampus: formData.Kampus || "Universitas Indonesia",
      Foto: "",
      theme: formData.theme,
      validThru: defaultCardValidThru,
      role: "MAHASISWA AKTIF"
    });
    setMonthInput(defaultMonthString);
  }

  return (
    <div className="creator-card-panel no-print">
      <div className="panel-header">
        <div className="panel-title-group">
          <div className="badge-glow">
            <Sparkles size={18} className="text-amber-400" />
          </div>
          <div>
            <h2 className="panel-title">Buat Kartu Mahasiswa Baru</h2>
            <p className="panel-subtitle">Sistem otomatis format Title Case, Autocomplete Kampus & QR Code Asli</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="creator-form" noValidate>
        <div className="form-grid">
          {/* 1. NAMA LENGKAP DENGAN FORMAT TITLE CASE */}
          <div className="input-group">
            <div className="input-label-row">
              <label className="input-label" htmlFor="input-nama">
                <User size={15} />
                <span>Nama Lengkap (Otomatis Title Case)</span>
              </label>
              <span className="nim-rules-pill">Auto Capitalize</span>
            </div>
            <input
              id="input-nama"
              type="text"
              name="Nama"
              value={formData.Nama}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              placeholder="Contoh: Budi Santoso Pratama"
              required
              className="form-input input-titlecase"
              autoComplete="name"
            />
            <span className="input-hint-micro">
              Setiap awal kata otomatis berhuruf besar (contoh: "budi santoso" → "Budi Santoso").
            </span>
          </div>

          {/* 2. NIM DENGAN KUNCI ANGKA, MIN 4 DIGIT, DAN UNIK */}
          <div className="input-group">
            <div className="input-label-row">
              <label className="input-label" htmlFor="input-nim">
                <Hash size={15} />
                <span>Nomor Induk Mahasiswa (NIM)</span>
              </label>
              <span className="nim-rules-pill">Angka • Min 4 • Unik</span>
            </div>
            
            <div className="input-with-status">
              <input
                id="input-nim"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={20}
                autoComplete="off"
                name="Nim"
                value={formData.Nim}
                onChange={handleNimChange}
                onKeyDown={handleNimKeyDown}
                placeholder="Contoh: 22040120018 (min. 4 angka)"
                required
                className={`form-input ${
                  isDuplicateNim
                    ? "input-state-error"
                    : isNimTooShort
                    ? "input-state-warning"
                    : isNimValid
                    ? "input-state-success"
                    : ""
                }`}
              />
              <div className="input-status-icon-box">
                {isDuplicateNim && (
                  <AlertCircle size={17} className="status-ico status-ico-error" title="NIM sudah terdaftar!" />
                )}
                {isNimTooShort && (
                  <AlertTriangle size={17} className="status-ico status-ico-warning" title="Minimal 4 digit angka" />
                )}
                {isNimValid && (
                  <CheckCircle2 size={17} className="status-ico status-ico-success" title="NIM valid & unik" />
                )}
              </div>
            </div>

            {/* Live Feedback helper text */}
            <div className="nim-feedback-container">
              {currentNim.length === 0 ? (
                <span className="feedback-text feedback-neutral">
                  Kunci: Hanya angka, minimal 4 digit dan wajib unik.
                </span>
              ) : isDuplicateNim ? (
                <span className="feedback-text feedback-error">
                  <AlertCircle size={13} />
                  <span>NIM <strong>{currentNim}</strong> sudah terdaftar pada kartu lain! Harap gunakan NIM unik.</span>
                </span>
              ) : isNimTooShort ? (
                <span className="feedback-text feedback-warning">
                  <AlertTriangle size={13} />
                  <span>Minimal 4 digit angka (saat ini baru <strong>{currentNim.length}</strong>/4 digit).</span>
                </span>
              ) : (
                <span className="feedback-text feedback-success">
                  <CheckCircle2 size={13} />
                  <span>NIM valid & unik (<strong>{currentNim.length}</strong> digit angka). Siap disimpan.</span>
                </span>
              )}
            </div>
          </div>

          {/* 3. AUTOCOMPLETE PROGRAM STUDI / JURUSAN */}
          <div className="input-group" ref={jurusanDropdownRef}>
            <div className="input-label-row">
              <label className="input-label" htmlFor="input-jurusan">
                <GraduationCap size={15} />
                <span>Program Studi / Jurusan</span>
              </label>
              <span className="nim-rules-pill">Autocomplete</span>
            </div>
            <div className="autocomplete-wrapper">
              <input
                id="input-jurusan"
                type="text"
                name="Jurusan"
                value={formData.Jurusan}
                onChange={handleJurusanChange}
                onFocus={() => {
                  if (INDONESIA_MAJORS_SUGGESTIONS.length > 0) setShowJurusanDropdown(true);
                }}
                placeholder="Ketik atau pilih jurusan (misal: Teknik Informatika)..."
                required
                className="form-input"
                autoComplete="off"
              />
              {showJurusanDropdown && (
                <div className="autocomplete-dropdown">
                  <div className="dropdown-header">
                    <span>Saran Jurusan Populer:</span>
                  </div>
                  {jurusanSuggestions.length > 0 ? (
                    jurusanSuggestions.map((major, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="dropdown-option-btn"
                        onClick={() => handleSelectJurusan(major)}
                      >
                        <GraduationCap size={14} className="opt-icon" />
                        <span>{major}</span>
                      </button>
                    ))
                  ) : (
                    INDONESIA_MAJORS_SUGGESTIONS.slice(0, 6).map((major, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="dropdown-option-btn"
                        onClick={() => handleSelectJurusan(major)}
                      >
                        <GraduationCap size={14} className="opt-icon" />
                        <span>{major}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. AUTOCOMPLETE UNIVERSITAS (REAL-TIME SEARCH AJAX/FETCH) */}
          <div className="input-group" ref={univDropdownRef}>
            <div className="input-label-row">
              <label className="input-label" htmlFor="input-kampus">
                <Building2 size={15} />
                <span>Nama Universitas / Kampus</span>
              </label>
              <span className="nim-rules-pill">Live Search API</span>
            </div>
            <div className="autocomplete-wrapper">
              <input
                id="input-kampus"
                type="text"
                name="Kampus"
                value={formData.Kampus}
                onChange={handleKampusChange}
                onBlur={handleKampusBlur}
                onFocus={() => setShowUnivDropdown(true)}
                placeholder="Ketik nama kampus (misal: Institut Teknologi Padang)..."
                required
                className="form-input input-titlecase"
                autoComplete="off"
              />
              <div className="autocomplete-trailing-icon">
                {isUnivLoading ? (
                  <Loader2 size={16} className="spin-icon text-amber-400" />
                ) : (
                  <Search size={16} className="text-slate-400" />
                )}
              </div>

              {showUnivDropdown && (
                <div className="autocomplete-dropdown">
                  <div className="dropdown-header">
                    <span>Daftar Kampus (Hipolabs API & Nasional):</span>
                    {isUnivLoading && <span className="loading-badge">Mencari...</span>}
                  </div>
                  {univSuggestions.length > 0 ? (
                    univSuggestions.map((univ, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="dropdown-option-btn"
                        onClick={() => handleSelectUniv(univ)}
                      >
                        <Building2 size={14} className="opt-icon" />
                        <span>{univ}</span>
                      </button>
                    ))
                  ) : (
                    <div className="dropdown-empty">
                      <span>Ketik nama kampus untuk memunculkan saran resmi atau masukkan nama kustom.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 5. VALIDASI MASA BERLAKU (WAJIB LEBIH BESAR DARI TANGGAL HARI INI) */}
          <div className="input-group">
            <div className="input-label-row">
              <label className="input-label" htmlFor="input-validthru">
                <Calendar size={15} />
                <span>Masa Berlaku (Wajib &gt; Hari Ini)</span>
              </label>
              <span className="expiry-tag">Format: {formData.validThru}</span>
            </div>

            <div className="validity-input-wrapper">
              <input
                id="input-validthru"
                type="month"
                min={minMonthString}
                value={monthInput}
                onChange={handleMonthChange}
                required
                className="form-input form-month-picker"
              />
            </div>

            {/* Quick Presets for Expiration */}
            <div className="expiry-presets-row">
              <span className="presets-label">Pintasan Masa Studi:</span>
              <button 
                type="button" 
                className="expiry-chip-btn" 
                onClick={() => handleSetExpiryYears(1)}
              >
                +1 Tahun
              </button>
              <button 
                type="button" 
                className="expiry-chip-btn" 
                onClick={() => handleSetExpiryYears(2)}
              >
                +2 Tahun (D3)
              </button>
              <button 
                type="button" 
                className="expiry-chip-btn" 
                onClick={() => handleSetExpiryYears(3)}
              >
                +3 Tahun
              </button>
              <button 
                type="button" 
                className="expiry-chip-btn active-chip" 
                onClick={() => handleSetExpiryYears(4)}
              >
                +4 Tahun (S1 Standar)
              </button>
            </div>
          </div>

          {/* Status Label */}
          <div className="input-group">
            <label className="input-label" htmlFor="select-role">
              <span>Status Mahasiswa</span>
            </label>
            <select
              id="select-role"
              name="role"
              value={formData.role}
              onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
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

        {/* 6. PHOTO INPUT SECTION WITH REAL-TIME PREVIEW & ANIMASI */}
        <div className="photo-selection-section">
          <div className="photo-section-top">
            <label className="input-label">
              <ImageIcon size={15} />
              <span>Foto Mahasiswa (Preview Real-Time)</span>
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

          {/* Real-Time Preview Badge & Frame if Photo exists */}
          {formData.Foto && (
            <div className={`live-photo-preview-panel ${photoPreviewAnim ? "preview-pop-anim" : ""}`}>
              <div className="preview-avatar-box">
                <img 
                  src={formData.Foto} 
                  alt="Preview Foto Mahasiswa" 
                  className="preview-avatar-img"
                />
                <div className="preview-success-dot" title="Foto Terhubung"></div>
              </div>
              <div className="preview-meta">
                <div className="preview-title-row">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="preview-title">Foto Terhubung ke Kartu</span>
                </div>
                <p className="preview-desc">Foto ini langsung ditampilkan di kartu cetak &amp; frame KTM.</p>
              </div>
              <button
                type="button"
                className="preview-remove-btn"
                onClick={handleRemovePhoto}
                title="Hapus foto saat ini"
              >
                <X size={15} />
                <span>Ganti</span>
              </button>
            </div>
          )}

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
                    ? "✓ Foto lokal aktif! Klik untuk memilih foto baru (JPG / PNG / WEBP)" 
                    : "Klik untuk memilih foto dari komputer (JPG / PNG / WEBP)"}
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
                  onClick={() => handleSelectPreset(av.url, av.name)}
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
                onChange={(e) => setFormData((p) => ({ ...p, Foto: e.target.value }))}
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
            <span>Pilih Gaya &amp; Tema Kartu</span>
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
          <button 
            type="submit" 
            className="btn btn-primary submit-btn"
            disabled={isDuplicateNim || isNimTooShort}
          >
            <Plus size={18} />
            <span>Tambahkan ke Antrean Cetak</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateArea;
