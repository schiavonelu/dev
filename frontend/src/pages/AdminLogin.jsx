import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { api } from "../api/client";

function prettyAuthError(code = "", fallback = "Errore autenticazione") {
  const k = String(code).toLowerCase();
  if (k.includes("invalid-credential") || k.includes("wrong-password")) return "Credenziali non valide.";
  if (k.includes("user-not-found")) return "Utente non trovato.";
  if (k.includes("email-already-in-use")) return "Email già registrata.";
  if (k.includes("weak-password")) return "Password troppo debole (min 6).";
  if (k.includes("too-many-requests")) return "Troppi tentativi: riprova tra poco.";
  if (k.includes("network-request-failed")) return "Problema di rete: controlla la connessione.";
  return fallback;
}

export default function AdminLogin() {
  const nav = useNavigate();
  const loc = useLocation();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Se già loggato: controlla se admin -> /admin, altrimenti -> /
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      try {
        const r = await api.get('/api/_auth/me');
        if (r.data?.isAdmin) {
          nav("/admin", { replace: true });
        } else {
          nav("/", { replace: true });
        }
      } catch {
        nav("/", { replace: true });
      }
    });
    return () => unsub();
  }, [nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      // appena loggato, chiedi al backend se è admin
      try {
        const me = await api.get('/api/_auth/me');
        const next = new URLSearchParams(loc.search).get('next');
        if (me.data?.isAdmin) {
          nav(next || "/admin", { replace: true });
        } else {
          nav(next || "/", { replace: true });
        }
      } catch {
        nav("/", { replace: true });
      }
    } catch (e) {
      setErr(prettyAuthError(e.code, e.message));
    } finally {
      setLoading(false);
    }
  }

  async function onRecover() {
    const em = email.trim();
    setErr("");
    if (!em) { setErr("Inserisci l'email per ricevere il link di recupero."); return; }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, em);
      setErr("Ti abbiamo inviato un'email con il link di recupero.");
    } catch (e) {
      setErr(prettyAuthError(e.code, e.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex relative overflow-hidden">
        <div className="absolute inset-0 -z-10"
             style={{background:`linear-gradient(135deg, var(--fc-primary) 0%, var(--fc-primary-600) 50%, var(--fc-accent) 100%)`}} />
        <div className="relative z-10 text-white p-10 flex flex-col justify-end w-full">
          <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">F</span>
            <span className="font-black tracking-tight text-xl">Fantalcio</span>
          </Link>
          <div className="mt-auto">
            <h1 className="text-3xl font-black leading-tight">Area Amministrazione</h1>
            <p className="mt-2 text-white/80 max-w-md">Gestisci articoli, risultati e formazioni della Lega.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-6 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-600">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-white"
                    style={{background:'var(--fc-primary)'}}>F</span>
              <span className="font-black tracking-tight text-xl">Fantalcio</span>
            </Link>
            <Link to="/" className="text-sm text-gray-500 hover:text-[color:var(--fc-primary)]">← Torna al sito</Link>
          </div>

          <div className="card p-6">
            <div className="flex gap-2 mb-4">
              <button type="button" onClick={() => setMode("login")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode==='login' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                style={mode==='login' ? {background:'var(--fc-primary)'} : {}}>Accedi</button>
              <button type="button" onClick={() => setMode("signup")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${mode==='signup' ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                style={mode==='signup' ? {background:'var(--fc-primary)'} : {}}>Registrati</button>
            </div>

            <h2 className="text-xl font-black">{mode === "login" ? "Admin Login" : "Crea account (test)"}</h2>
            <p className="text-sm text-gray-500 mb-4">
              Per accedere alla dashboard devi essere admin (claim o whitelist).
            </p>

            {err ? <div className="mb-3 rounded-xl bg-red-50 text-red-700 text-sm px-3 py-2">{err}</div> : null}

            <form className="space-y-3" onSubmit={onSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" className="input mt-1" placeholder="es. admin@lega.it"
                       value={email} onChange={(e)=>setEmail(e.target.value)} autoComplete="email" required />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <input id="password" type={showPwd ? "text" : "password"} className="input pr-10"
                         placeholder="La tua password" value={password} onChange={(e)=>setPassword(e.target.value)}
                         autoComplete={mode==="signup"?"new-password":"current-password"} required minLength={6}/>
                  <button type="button" onClick={()=>setShowPwd(s=>!s)}
                          className="absolute inset-y-0 right-2 my-auto text-gray-500 hover:text-gray-700"
                          aria-label={showPwd ? "Nascondi password" : "Mostra password"}>
                    {showPwd ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button type="button" className="text-sm" style={{color:'var(--fc-primary)'}}
                        onClick={onRecover} disabled={loading}>
                  Password dimenticata?
                </button>
              </div>

              <button className="btn btn-primary w-full" disabled={loading}>
                {loading ? (mode === "login" ? "Accesso in corso…" : "Creazione in corso…") : (mode === "login" ? "Entra" : "Crea e accedi")}
              </button>
            </form>

            <div className="mt-4 text-xs text-gray-500">
              In Firebase → Authentication abilita <strong>Email/Password</strong> e autorizza <strong>localhost</strong>.
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Problemi? <a href="https://firebase.google.com/docs/auth" target="_blank" rel="noreferrer"
                         className="hover:underline" style={{color:'var(--fc-primary)'}}>Guida Firebase Auth</a>
          </div>
        </div>
      </div>
    </div>
  );
}


