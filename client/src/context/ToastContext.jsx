import React, { createContext, useContext, useState, useCallback } from 'react';
import { IoCloseCircle, IoCheckmarkCircle, IoInformationCircle, IoAlertCircle } from 'react-icons/io5';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((message, duration) => showToast(message, 'success', duration), [showToast]);
  const error = useCallback((message, duration) => showToast(message, 'error', duration), [showToast]);
  const info = useCallback((message, duration) => showToast(message, 'info', duration), [showToast]);
  const warning = useCallback((message, duration) => showToast(message, 'warning', duration), [showToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle style={{ color: 'var(--success)' }} />;
      case 'error':
        return <IoCloseCircle style={{ color: 'var(--error)' }} />;
      case 'warning':
        return <IoAlertCircle style={{ color: 'var(--warning)' }} />;
      case 'info':
      default:
        return <IoInformationCircle style={{ color: 'var(--accent-blue)' }} />;
    }
  };

  return (
    <ToastContext.Provider value={{ success, error, info, warning }}>
      {children}
      {/* Toast Overlay Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-bubble glass-card ${toast.type}`}>
            <span className="toast-icon">{getIcon(toast.type)}</span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              &times;
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 9999;
          max-width: 380px;
          width: 90%;
        }

        .toast-bubble {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-left: 4px solid var(--accent-blue) !important;
          animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          background: rgba(15, 22, 38, 0.85) !important;
        }

        .toast-bubble.success {
          border-left-color: var(--success) !important;
        }

        .toast-bubble.error {
          border-left-color: var(--error) !important;
        }

        .toast-bubble.warning {
          border-left-color: var(--warning) !important;
        }

        .toast-icon {
          font-size: 1.4rem;
          display: flex;
          align-items: center;
        }

        .toast-message {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          flex: 1;
        }

        .toast-close {
          color: var(--text-muted);
          font-size: 1.2rem;
          transition: color var(--transition-fast);
        }

        .toast-close:hover {
          color: var(--text-primary);
        }

        @keyframes slideIn {
          from {
            transform: translateX(120%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
