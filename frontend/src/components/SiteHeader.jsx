// src/components/SiteHeader.jsx
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import BrandMark from "./BrandMark";

const NavItem = ({ to, children, onClick, variant = "default" }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `nav-link ${variant === "inverted" ? "nav-link-inverted" : ""} ${isActive ? "nav-link-active" : ""}`}
  >
    {children}
  </NavLink>
);

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header sticky top-0 z-50 border-b border-white/10 ${open ? "shadow-lg" : "shadow"}`}>
      <div className="container-gz flex h-16 items-center justify-between text-white">
        <Link to="/" className="flex items-center gap-2 font-black group" onClick={() => setOpen(false)}>
          <BrandMark size={32} className="transition group-hover:scale-105" />
          <span className="hidden sm:block drop-shadow-sm">Carogna League</span>
          <span className="sm:hidden drop-shadow-sm">CL</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/" variant="inverted">Home</NavItem>
          <NavItem to="/competizioni" variant="inverted">Competizioni</NavItem>
          <NavItem to="/classifica" variant="inverted">Classifica</NavItem>
          <NavItem to="/articoli" variant="inverted">Articoli</NavItem>
          <NavItem to="/storia" variant="inverted">Storia</NavItem>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          {/* solo mobile: hamburger -> X */}
          <div className="md:hidden">
            <button
              className="btn btn-ghost p-2 rounded-xl text-white hover:bg-white/15"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER: sinistra -> destra */}
      <div className={`fixed inset-0 z-[60] md:hidden ${open ? "" : "pointer-events-none"}`}>
        {/* overlay (chiude al click) */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        {/* pannello (3/4 larghezza) */}
        <aside
          className={`absolute left-0 top-0 h-full w-3/4 max-w-sm bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* testata con background "di prima": bianco + micro fascia brand */}
          <div className="border-b border-black/5 dark:border-white/10">
            <div
              className="h-1 w-full"
              style={{ background: "linear-gradient(90deg, var(--fc-primary), var(--fc-accent))" }}
            />
            <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2 font-black">
                <BrandMark size={28} /> Menu
              </div>
            </div>
          </div>

          {/* voci menu */}
          <nav className="p-2 flex flex-col gap-1">
            <NavItem to="/" onClick={() => setOpen(false)}>
              Home
            </NavItem>
            <NavItem to="/competizioni" onClick={() => setOpen(false)}>
              Competizioni
            </NavItem>
            <NavItem to="/classifica" onClick={() => setOpen(false)}>
              Classifica
            </NavItem>
            <NavItem to="/articoli" onClick={() => setOpen(false)}>
              Articoli
            </NavItem>
            <NavItem to="/storia" onClick={() => setOpen(false)}>
              Storia
            </NavItem>
          </nav>
        </aside>
      </div>
    </header>
  );
}











