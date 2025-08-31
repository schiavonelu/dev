import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const canUseDOM = typeof window !== "undefined" && typeof document !== "undefined";
const useIsoEffect = canUseDOM ? useLayoutEffect : useEffect;

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
  icon = null,
  destructive = false,
  size = "md",             // "sm" | "md" | "lg"
}) {
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const headerId = useRef(`m-title-${Math.random().toString(36).slice(2)}`).current;
  const bodyId   = useRef(`m-body-${Math.random().toString(36).slice(2)}`).current;

  const rootRef = useRef(null);
  const confirmBtnRef = useRef(null);
  const lastActiveEl = useRef(null);

  // Montaggio sicuro per SSR/Next
  useIsoEffect(() => { setMounted(true); }, []);

  // Salva/ripristina focus
  useEffect(() => {
    if (!show || !canUseDOM) return;
    lastActiveEl.current = document.activeElement;
    const to = setTimeout(() => {
      // prova focus su bottone principale, altrimenti sul container
      if (!confirmBtnRef.current?.focus) rootRef.current?.focus();
      else confirmBtnRef.current?.focus();
    }, 10);
    return () => {
      clearTimeout(to);
      if (lastActiveEl.current && lastActiveEl.current.focus) {
        lastActiveEl.current.focus();
      }
    };
  }, [show]);

  // Blocca scroll del body
  useEffect(() => {
    if (!show || !canUseDOM) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [show]);

  // Enter/Escape in capture per evitare submit del form sottostante
  useEffect(() => {
    if (!show || !canUseDOM) return;
    setErrorMsg("");

    function onKeyDown(e) {
      if (pending) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if (e.key === "Enter") {
        // blocca submit dei form parent
        e.preventDefault();
        if (mode === "confirm") void handleOk();
        else onClose?.();
      }
    }

    // Usa booleano per compat vecchi browser nel remove
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, pending, mode]);

  // Focus trap minimale nel container
  useEffect(() => {
    if (!show || !canUseDOM) return;
    const root = rootRef.current;
    if (!root) return;

    function onTrap(e) {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        root.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')
      ).filter(el => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");

      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !root.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !root.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    root.addEventListener("keydown", onTrap);
    return () => root.removeEventListener("keydown", onTrap);
  }, [show]);

  if (!mounted || !show) return null;

  const sizing = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  }[size] || "max-w-md";

  async function handleOk() {
    if (mode !== "confirm") return onClose?.();
    if (!onConfirm) return onClose?.();

    try {
      setPending(true);
      setErrorMsg("");
      await onConfirm(); // supporta sync/async
      onClose?.();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || String(err) || "Operazione non riuscita.";
      setErrorMsg(msg);
    } finally {
      setPending(false);
    }
  }

  const node = (
    <div className="fixed inset-0 z-[9999]" aria-hidden={!show ? "true" : "false"}>
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !pending && onClose?.()}
      />
      {/* dialog wrapper */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <div
          ref={rootRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headerId}
          aria-describedby={bodyId}
          tabIndex={-1}
          // stoppa i click per non “bucare” sullo sfondo
          onClick={(e) => e.stopPropagation()}
          className={`w-full ${sizing} rounded-2xl bg-white shadow-2xl overflow-hidden outline-none
                      transition transform duration-200 ease-out
                      opacity-100 translate-y-0 scale-100`}
        >
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--fc-border)" }}>
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
              type="button"
              className="btn btn-ghost p-1"
              onClick={() => !pending && onClose?.()}
              aria-label="Chiudi"
              disabled={pending}
            >
              <X size={18} />
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
          <div className="px-4 py-3 border-t flex items-center justify-end gap-2" style={{ borderColor: "var(--fc-border)" }}>
            {mode === "confirm" ? (
              <>
                <button type="button" className="btn" onClick={onClose} disabled={pending}>
                  {cancelText}
                </button>
                <button
                  type="button"
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
                type="button"
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

  return createPortal(node, document.body);
}





