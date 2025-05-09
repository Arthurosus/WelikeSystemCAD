import React from "react";
import "../styles/DetailModal.css";

/* ─────── componente recursivo ────────────────────────────────── */
function RenderValue({ value, level = 0 }) {
    if (value === null) return <span className="dv-null">null</span>;
    if (Array.isArray(value))
        return (
            <div className="dv-obj" style={{ marginLeft: level * 18 }}>
                {value.length === 0 && <em className="dv-empty">[] vazio</em>}
                {value.map((v, i) => (
                    <div key={i} className="dv-row">
                        <span className="dv-key">[{i}]</span>
                        <RenderValue value={v} level={level + 1} />
                    </div>
                ))}
            </div>
        );

    if (typeof value === "object")
        return (
            <div className="dv-obj" style={{ marginLeft: level * 18 }}>
                {Object.keys(value).length === 0 && (
                    <em className="dv-empty">{{}}</em>
                )}
                {Object.entries(value).map(([k, v]) => (
                    <div key={k} className="dv-row">
                        <span className="dv-key">{k}</span>
                        <RenderValue value={v} level={level + 1} />
                    </div>
                ))}
            </div>
        );

    /* primitivos */
    return (
        <span className="dv-prim">
      {typeof value === "boolean" ? (value ? "✔️ true" : "❌ false") : String(value)}
    </span>
    );
}

/* ─────── modal principal ─────────────────────────────────────── */
export default function DetailModal({ title, item, onClose }) {
    if (!item) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h3 className="modal-title">{title}</h3>

                <div className="detail-grid">
                    {Object.entries(item).map(([key, value]) => (
                        <React.Fragment key={key}>
                            <div className="detail-key">{key}</div>
                            <div className="detail-val">
                                <RenderValue value={value} />
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                <div className="modal-actions center">
                    <button className="btn back" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
