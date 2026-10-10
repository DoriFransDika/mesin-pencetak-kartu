import React from "react";
import { Sparkles, Printer, Shield } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer no-print">
      <div className="footer-content">
        <div className="footer-tips">
          <div className="tips-badge">
            <Printer size={14} />
            <span>Panduan Cetak</span>
          </div>
          <p className="tips-text">
            Untuk hasil terbaik, gunakan kertas <strong>Photo Paper Glossy 230gsm</strong> atau <strong>PVC ID Card Inkjet</strong>, dan aktifkan opsi <em>"Background graphics"</em> pada dialog printer.
          </p>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copy">
            © 2026 DC Forge • Developed with ❤️ by{" "}
            <a
              href="https://github.com/DoriFransDika/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Dori Frans Dika
            </a>
          </p>
          <div className="footer-status">
            <span className="live-dot"></span>
            <span>Siap Cetak Skala 1:1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
