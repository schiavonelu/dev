import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop(){
  const [show, setShow] = useState(false);
  useEffect(()=>{
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  if (!show) return null;

  return (
    <button
      onClick={()=>window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[70] rounded-full shadow-lg px-3 py-3 text-white"
      style={{ background: 'var(--fc-primary)'}}
      aria-label="Torna su"
      title="Torna su"
    >
      <ArrowUp size={18}/>
    </button>
  );
}
