import React from "react";
import { Printer, Sparkles, CreditCard, RotateCcw } from "lucide-react";

function Header({ totalCards, onPrint, onResetDemo }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-box">
            <CreditCard className="brand-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">CardCraft Studio</h1>
              <span className="brand-badge">PRO</span>
            </div>
            <p className="brand-subtitle">Mesin Cetak Kartu Mahasiswa & ID Card Modern</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="card-counter">
            <span className="counter-dot"></span>
            <span>{totalCards} Kartu Tersedia</span>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onResetDemo}
            title="Muat contoh data kartu"
          >
            <RotateCcw size={16} />
            <span>Contoh Data</span>
          </button>

          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onPrint}
            title="Cetak semua kartu dalam format A4"
          >
            <Printer size={18} />
            <span>Cetak Semua</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
