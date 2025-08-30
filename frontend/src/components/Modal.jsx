// src/components/Modal.jsx
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function Modal({
  show,
  onClose,
  title,
  subtitle,
  children,
  mode = "alert",          // "alert" | "confirm"
  onConfirm,               // se async, la modale attende e chiude a successo
  confirmText = "OK",
  cancelText = "Annulla",
  icon = null,             // opzionale: <Icon/>
  destructive = false,     // stile rosso per azioni distruttive
  size = "md",             // "sm" | "md" | "lg"
}) {
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const confirmBtnRef = useRef(null);
  const headerId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;
  const bodyId   = useRef(`modal-body-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => {
    if (!show) return;
    setErrorMsg("");
    // focus al bottone conferma quando si apre
    const t = setTimeout(() => confirmBtnRef.current?.focus(), 10);
    function onKey(e){
      if (e.key === "Escape") {
        if (!pending) onClose?.();
      }
      if (e.key === "Enter" && mode === "confirm" && !pending) {
        handleOk();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, pending, mode]);

  if (!show) return null;

  const sizing = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  }[size] || "max-w-md";

  async function handleOk() {
    if (mode !== "confirm") {
      onClose?.();
      return;
    }
    if (!onConfirm) {
      onClose?.();
      return;
    }
    try {
      setPending(true);
      setErrorMsg("");
      // supporta funzioni sync/async
      await onConfirm();
      onClose?.();
    } catch (err) {
      // mostra errore senza chiudere
      const msg = err?.response?.data?.error || err?.message || String(err) || "Operazione non riuscita.";
      setErrorMsg(msg);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* background */}
      <div className="absolute inset-0 bg-black/40" onClick={() => !pending && onClose?.()} />

      {/* dialog */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={headerId}
          aria-describedby={bodyId}
          className={`w-full ${sizing} rounded-2xl bg-white shadow-2xl overflow-hidden outline-none animate-[modalIn_.18s_ease-out]`}
          style={{
            // piccola animazione d’ingresso
            // (aggiungi in CSS globale se preferisci keyframes separati)
            ["@keyframes modalIn"]: "from{opacity:.3;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}"
          }}
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:"var(--fc-border)"}}>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {icon ? <span className="shrink-0">{icon}</span> : null}
                <h3 id={headerId} className="font-extrabold text-lg leading-snug truncate">
                  {title}
                </h3>
              </div>
              {subtitle ? (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{subtitle}</p>
              ) : null}
            </div>
            <button
              className="btn btn-ghost p-1"
              onClick={() => !pending && onClose?.()}
              aria-label="Chiudi"
              disabled={pending}
            >
              <X size={18}/>
            </button>
          </div>

          {/* body */}
          <div id={bodyId} className="p-4">
            <div className="text-[15px] leading-6 text-gray-800">
              {typeof children === "string" ? <p className="whitespace-pre-wrap">{children}</p> : children}
            </div>

            {errorMsg ? (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMsg}
              </div>
            ) : null}
          </div>

          {/* footer */}
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2" style={{borderColor:"var(--fc-border)"}}>
            {mode === "confirm" ? (
              <>
                <button className="btn" onClick={onClose} disabled={pending}>
                  {cancelText}
                </button>
                <button
                  ref={confirmBtnRef}
                  className={`btn ${destructive ? "btn-danger" : "btn-primary"} inline-flex items-center gap-2`}
                  onClick={handleOk}
                  disabled={pending}
                >
                  {pending && (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-current" />
                  )}
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                ref={confirmBtnRef}
                className="btn btn-primary"
                onClick={onClose}
                disabled={pending}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



