import React from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container no-print" role="region" aria-label="Notifikasi">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let typeClass = "toast-success";
        if (toast.type === "error") {
          Icon = AlertCircle;
          typeClass = "toast-error";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          typeClass = "toast-warning";
        } else if (toast.type === "info") {
          Icon = Info;
          typeClass = "toast-info";
        }

        return (
          <div key={toast.id} className={`toast-card ${typeClass}`}>
            <div className="toast-icon-wrap">
              <Icon size={18} />
            </div>
            <div className="toast-body">
              {toast.title && <h4 className="toast-title">{toast.title}</h4>}
              <p className="toast-message">{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
