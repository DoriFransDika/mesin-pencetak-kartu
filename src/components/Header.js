import React from "react";
import { Printer, CreditCard, RotateCcw, Layers, Scissors, Check } from "lucide-react";

function Header({ totalCards, onPrint, onResetDemo, printMode = "both", onPrintModeChange }) {
  return (
    <header className="navbar no-print">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon-box">
            <CreditCard className="brand-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-wrap">
              <h1 className="brand-title">DC Forge</h1>
              <span className="brand-badge">PRO</span>
            </div>
            <p className="brand-subtitle">Advanced Student ID Card & Print Engine</p>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Card counter pill */}
          <div className="card-counter">
            <span className="counter-dot"></span>
            <span>{totalCards} Kartu Siap</span>
          </div>

          {/* Print Mode Selector */}
          <div className="print-mode-selector" title="Format Sisi Cetak Kartu">
            <span className="selector-label">Mode Cetak:</span>
            <select
              value={printMode}
              onChange={(e) => onPrintModeChange(e.target.value)}
              className="print-mode-select"
            >
              <option value="both">Depan & Belakang (Bolak-Balik)</option>
              <option value="front">Hanya Sisi Depan</option>
              <option value="back">Hanya Sisi Belakang</option>
              <option value="active">Sesuai Tampilan Layar</option>
            </select>
          </div>

          {/* Reset Demo button */}
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onResetDemo}
            title="Muat contoh data kartu mahasiswa"
          >
            <RotateCcw size={16} />
            <span>Contoh Data</span>
          </button>

          {/* Print button */}
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={onPrint}
            title="Cetak semua kartu dalam format standar A4"
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
