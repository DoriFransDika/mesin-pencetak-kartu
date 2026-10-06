import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { IdCard, Search, PlusCircle, AlertCircle, Layers } from "lucide-react";

const INITIAL_DEMO_CARDS = [
  {
    Nama: "Raden Aditya Pratama",
    Nim: "22081010045",
    Jurusan: "Teknik Informatika & AI",
    Kampus: "INSTITUT TEKNOLOGI BANDUNG",
    Foto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80",
    theme: "black-gold",
    validThru: "09/2028",
    role: "MAHASISWA AKTIF"
  },
  {
    Nama: "Clarissa Aurelia Putri",
    Nim: "22040120018",
    Jurusan: "Desain Komunikasi Visual",
    Kampus: "UNIVERSITAS INDONESIA",
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

  const [searchQuery, setSearchQuery] = useState("");
  const [printSingleId, setPrintSingleId] = useState(null);

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

  function deleteNote(idToDelete) {
    setNotes((prevNotes) => prevNotes.filter((_, index) => index !== idToDelete));
  }

  function resetDemoCards() {
    if (window.confirm("Muat ulang contoh data kartu awal? Data saat ini akan diganti dengan contoh.")) {
      setNotes(INITIAL_DEMO_CARDS);
    }
  }

  function handlePrintAll() {
    setPrintSingleId(null);
    setTimeout(() => {
      window.print();
    }, 150);
  }

  function handlePrintSingle(id) {
    setPrintSingleId(id);
    setTimeout(() => {
      window.print();
      // Reset single filter after print dialog closes
      setTimeout(() => setPrintSingleId(null), 1000);
    }, 150);
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
      <Header 
        totalCards={notes.length} 
        onPrint={handlePrintAll} 
        onResetDemo={resetDemoCards} 
      />

      <main className="main-layout">
        {/* LEFT COLUMN: Creator Form */}
        <section className="sidebar-section no-print">
          <CreateArea onAdd={addNote} />
        </section>

        {/* RIGHT COLUMN: Cards Gallery */}
        <section className="gallery-section">
          {/* Gallery Header Toolbar */}
          <div className="gallery-toolbar no-print">
            <div className="gallery-title-box">
              <Layers size={20} className="text-amber-400" />
              <h2 className="gallery-title">Antrean Kartu Cetak ({notes.length})</h2>
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
                  onClick={() => setNotes(INITIAL_DEMO_CARDS)}
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
