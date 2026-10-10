import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import ToastContainer from "./Toast";
import { IdCard, Search, Layers, Printer, Sliders } from "lucide-react";

const INITIAL_DEMO_CARDS = [
  {
    Nama: "Raden Aditya Pratama",
    Nim: "22081010045",
    Jurusan: "Teknik Informatika & AI",
    Kampus: "Institut Teknologi Bandung",
    Foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    theme: "black-gold",
    validThru: "09/2028",
    role: "MAHASISWA AKTIF"
  },
  {
    Nama: "Clarissa Aurelia Putri",
    Nim: "22040120018",
    Jurusan: "Desain Komunikasi Visual",
    Kampus: "Universitas Indonesia",
    Foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    theme: "sapphire-blue",
    validThru: "09/2027",
    role: "MAHASISWA REGULER"
  }
];

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem("cardcraft_cards");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca localStorage", e);
    }
    return INITIAL_DEMO_CARDS;
  });

  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [printSingleId, setPrintSingleId] = useState(null);
  const [printMode, setPrintMode] = useState("both"); // 'both', 'front', 'back', 'active'

  // Toast notification helper
  const addToast = ({ type = "info", title = "", message = "", duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    const newToast = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cardcraft_cards", JSON.stringify(notes));
    } catch (e) {
      console.error("Gagal menyimpan ke localStorage", e);
    }
  }, [notes]);

  function addNote(newNote) {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  }

  function deleteNote(idToDelete, studentName = "") {
    const target = notes[idToDelete];
    const name = studentName || (target ? target.Nama : "mahasiswa ini");
    if (window.confirm(`Hapus kartu mahasiswa atas nama "${name}"?`)) {
      setNotes((prevNotes) => prevNotes.filter((_, index) => index !== idToDelete));
      addToast({
        type: "info",
        title: "Kartu Dihapus",
        message: `Kartu mahasiswa atas nama ${name} telah dihapus dari antrean.`
      });
    }
  }

  function resetDemoCards() {
    if (window.confirm("Muat ulang contoh data kartu awal? Data saat ini akan diganti dengan contoh.")) {
      setNotes(INITIAL_DEMO_CARDS);
      addToast({
        type: "success",
        title: "Contoh Data Dimuat",
        message: "2 contoh kartu mahasiswa berhasil dimuat ulang ke dalam antrean cetak."
      });
    }
  }

  function handlePrintAll() {
    if (notes.length === 0) {
      addToast({
        type: "warning",
        title: "Antrean Kosong",
        message: "Belum ada kartu untuk dicetak! Silakan buat kartu terlebih dahulu."
      });
      return;
    }

    setPrintSingleId(null);
    const modeLabel = 
      printMode === "both" 
        ? "Bolak-Balik (Depan & Belakang)" 
        : printMode === "front" 
        ? "Hanya Sisi Depan" 
        : printMode === "back" 
        ? "Hanya Sisi Belakang" 
        : "Sesuai Tampilan Layar";

    addToast({
      type: "info",
      title: "Membuka Dialog Cetak",
      message: `Menyiapkan ${notes.length} kartu untuk dicetak (Format: ${modeLabel}).`
    });

    setTimeout(() => {
      window.print();
    }, 200);
  }

  function handlePrintSingle(id, customMode = null, studentName = "") {
    if (customMode) {
      setPrintMode(customMode);
    }
    setPrintSingleId(id);
    const name = studentName || (notes[id] ? notes[id].Nama : "Mahasiswa");
    
    addToast({
      type: "info",
      title: "Mencetak Satuan",
      message: `Menyiapkan pencetakan kartu untuk ${name}.`
    });

    setTimeout(() => {
      window.print();
      // Reset single filter after print dialog closes
      setTimeout(() => setPrintSingleId(null), 1000);
    }, 200);
  }

  // Filter cards for display
  const filteredNotes = notes.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.Nama && item.Nama.toLowerCase().includes(q)) ||
      (item.Nim && item.Nim.toLowerCase().includes(q)) ||
      (item.Jurusan && item.Jurusan.toLowerCase().includes(q)) ||
      (item.Kampus && item.Kampus.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`app-root ${printSingleId !== null ? "printing-single-mode" : ""}`}>
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      <Header 
        totalCards={notes.length} 
        onPrint={handlePrintAll} 
        onResetDemo={resetDemoCards}
        printMode={printMode}
        onPrintModeChange={setPrintMode}
      />

      <main className="main-layout">
        {/* LEFT COLUMN: Creator Form */}
        <section className="sidebar-section no-print">
          <CreateArea 
            onAdd={addNote} 
            existingNims={notes.map((n) => n.Nim)}
            onNotify={addToast}
          />
        </section>

        {/* RIGHT COLUMN: Cards Gallery */}
        <section className="gallery-section">
          {/* Gallery Header Toolbar */}
          <div className="gallery-toolbar no-print">
            <div className="gallery-title-box">
              <Layers size={20} className="text-amber-400" />
              <h2 className="gallery-title">Antrean Kartu Cetak ({notes.length})</h2>
            </div>

            {/* Print Mode Quick Badges */}
            <div className="gallery-mode-indicator">
              <span className="mode-desc">Mode Cetak Aktif:</span>
              <span className="mode-badge">
                {printMode === "both" && "🪪 Bolak-Balik (Depan & Belakang)"}
                {printMode === "front" && "📄 Sisi Depan Saja"}
                {printMode === "back" && "🔄 Sisi Belakang Saja"}
                {printMode === "active" && "👁️ Sesuai Sisi Layar"}
              </span>
            </div>

            {/* Search Input */}
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIM, jurusan, kampus..."
                className="search-input"
              />
            </div>
          </div>

          {/* Cards Grid */}
          {filteredNotes.length === 0 ? (
            <div className="empty-state-card no-print">
              <div className="empty-icon-wrap">
                <IdCard size={48} />
              </div>
              <h3 className="empty-title">Belum Ada Kartu Yang Cocok</h3>
              <p className="empty-desc">
                {notes.length === 0 
                  ? "Tambahkan kartu baru melalui formulir di samping atau muat contoh data."
                  : "Tidak ditemukan kartu dengan kata kunci pencarian tersebut."}
              </p>
              {notes.length === 0 && (
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    setNotes(INITIAL_DEMO_CARDS);
                    addToast({
                      type: "success",
                      title: "Data Dimuat",
                      message: "Contoh kartu berhasil dimuat kembali."
                    });
                  }}
                >
                  Muat Contoh Data Kartu
                </button>
              )}
            </div>
          ) : (
            <div className="cards-grid">
              {filteredNotes.map((noteItem, index) => {
                // If in single-print mode, hide other cards during print
                const isTargetForPrint = printSingleId === null || printSingleId === index;
                return (
                  <div 
                    key={index} 
                    className={`card-grid-item ${!isTargetForPrint ? "hide-on-single-print" : ""}`}
                  >
                    <Note
                      id={index}
                      Nama={noteItem.Nama}
                      Nim={noteItem.Nim}
                      Jurusan={noteItem.Jurusan}
                      Kampus={noteItem.Kampus}
                      Foto={noteItem.Foto}
                      theme={noteItem.theme || "black-gold"}
                      validThru={noteItem.validThru || "09/2028"}
                      role={noteItem.role || "MAHASISWA AKTIF"}
                      onDelete={deleteNote}
                      onPrintSingle={handlePrintSingle}
                      globalPrintMode={printMode}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
