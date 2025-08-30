import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css";
import Spinner from "./components/Spinner";

import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminGate from "./components/AdminGate.jsx";
import { ThemeProvider } from "./theme/ThemeProvider";

import ScrollToTopOnRoute from "./components/ScrollToTopOnRoute";
import BackToTop from "./components/BackToTop";

import EditorialDetail from "./pages/EditorialDetail.jsx";

import { lazy, Suspense } from "react";
const Home = lazy(()=>import("./pages/Home.jsx"));
const Standings = lazy(()=>import("./pages/Standings.jsx"));
const Competizioni = lazy(()=>import("./pages/Competizioni.jsx"));
const Rose = lazy(()=>import("./pages/Rose.jsx"));
const Regolamento = lazy(()=>import("./pages/Regolamento.jsx"));
const Calendario = lazy(()=>import("./pages/Calendario.jsx"));
const AlboDoro = lazy(()=>import("./pages/AlboDoro.jsx"));
const AlboSeason = lazy(()=>import("./pages/AlboSeason.jsx"));
const Storia = lazy(()=>import("./pages/Storia.jsx"));
const Articles = lazy(()=>import("./pages/Articles.jsx"));
const Article = lazy(()=>import("./pages/Article.jsx"));

function AppRoutes(){
  const location = useLocation();
  return (
    <Suspense fallback={<Spinner/>}>
      {/* key sul Routes per forzare remount quando cambia pathname */}
      <Routes key={location.pathname}>
        {/* Pubblico */}
        <Route path="/" element={<Home/>} />
        <Route path="/articoli" element={<Articles/>} />
        <Route path="/articoli/:slug" element={<Article/>} />
        <Route path="/competizioni" element={<Competizioni/>} />
        <Route path="/rose" element={<Rose/>} />
        <Route path="/classifica" element={<Standings/>} />
        <Route path="/regolamento" element={<Regolamento/>} />
        <Route path="/calendario" element={<Calendario/>} />
        <Route path="/albo-d-oro" element={<AlboDoro/>} />
        <Route path="/albo-d-oro/:season" element={<AlboSeason/>} />
        <Route path="/storia" element={<Storia/>} />

        {/* Editorial detail */}
        <Route path="/editoriali/:idOrSlug" element={<EditorialDetail/>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin/>} />
        <Route path="/login" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin" element={<AdminGate><AdminDashboard/></AdminGate>} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App(){
  return (
    <BrowserRouter>
      <ScrollToTopOnRoute/>
      <AppRoutes/>
      <BackToTop/>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(
  <ThemeProvider><App/></ThemeProvider>
);











