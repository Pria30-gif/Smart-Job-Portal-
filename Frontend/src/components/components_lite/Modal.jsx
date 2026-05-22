import React from "react";

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={e => e.stopPropagation()}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          maxWidth: "400px",
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
          zIndex: 1001,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <h2 id="modal-title" style={{ margin: 0, fontSize: "1.25rem" }}>{title}</h2>
          <button onClick={onClose} style={{ fontSize: 24, background: "none", border: "none", cursor: "pointer" }} aria-label="Close Modal">&times;</button>
        </header>
        <section style={{ flexGrow: 1 }}>{children}</section>
      </div>
    </>
  );
};

export default Modal;
