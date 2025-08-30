import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronDown, ChevronUp } from "lucide-react";

/**
 * items: [{ to?: string, label: string, icon?: ReactNode }]
 */
export default function Breadcrumbs({ items = [] }) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  if (!items.length) return null;

  return (
    <nav className="text-sm mb-3" aria-label="breadcrumb">
      <div className="flex items-center justify-between gap-2">
        <ol className="flex flex-wrap items-center gap-1 text-gray-600">
          {items.map((it, idx) => {
            const isLast = idx === items.length - 1;
            const Wrapper = it.to && !isLast ? Link : 'span';
            const cls = isLast ? 'crumb-link crumb-active' : 'crumb-link';

            return (
              <li key={idx} className="flex items-center">
                <Wrapper
                  to={it.to}
                  className={cls}
                  title={it.label} /* utile in mobile quando il testo è nascosto */
                >
                  <span className="shrink-0 relative top-[1px]">
                    {it.icon ?? (idx === 0 && it.to === '/' ? <Home size={14}/> : null)}
                  </span>
                  <span className={`align-middle ${mobileExpanded ? 'inline' : 'hidden sm:inline'}`}>
                    {it.label}
                  </span>
                </Wrapper>

                {/* separatore ">" sempre visibile (anche in mobile collassato) */}
                {!isLast && <span className="crumb-sep" aria-hidden="true">&gt;</span>}
              </li>
            );
          })}
        </ol>

        {/* Toggle solo mobile: espande/comprime le label */}
        <button
          type="button"
          className="sm:hidden btn btn-ghost px-2 py-1 rounded-md"
          onClick={() => setMobileExpanded(v => !v)}
          aria-label={mobileExpanded ? 'Comprimi breadcrumb' : 'Espandi breadcrumb'}
          aria-expanded={mobileExpanded}
        >
          {mobileExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>
      </div>
    </nav>
  );
}



