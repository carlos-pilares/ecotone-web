/** SVG territory map — mismo contenido que `ecotone-routes_2.html` (sin CMS). */
export function RoutesTerritoryMap() {
  return (
    <svg width="100%" viewBox="0 0 960 240" className="routes-territory-svg" aria-hidden>
      <path d="M0 70 Q240 48 480 62 Q720 76 960 55" fill="none" stroke="rgba(40,80,20,.14)" strokeWidth="1.5" />
      <path d="M0 100 Q240 78 480 92 Q720 106 960 85" fill="none" stroke="rgba(40,80,20,.11)" strokeWidth="1" />
      <path d="M0 130 Q240 108 480 122 Q720 136 960 115" fill="none" stroke="rgba(40,80,20,.09)" strokeWidth="1" />
      <path d="M0 160 Q240 138 480 152 Q720 166 960 145" fill="none" stroke="rgba(40,80,20,.07)" strokeWidth="1" />
      <path d="M0 190 Q240 168 480 182 Q720 196 960 175" fill="none" stroke="rgba(40,80,20,.06)" strokeWidth="1" />

      <circle cx="100" cy="95" r="8" fill="#906730" />
      <text x="116" y="93" fontSize="13" fill="#2C1D07" fontFamily="var(--f)" fontWeight="700">
        Cusco
      </text>
      <text x="116" y="107" fontSize="10" fill="#563B12" fontFamily="var(--f)">
        3,400 m · departure point
      </text>

      <path d="M100 95 Q220 84 330 98" fill="none" stroke="#906730" strokeWidth="3" strokeDasharray="10 5" opacity="0.85" />
      <circle cx="330" cy="98" r="10" fill="#906730" />
      <circle cx="330" cy="98" r="18" fill="none" stroke="#906730" strokeWidth="1.5" opacity="0.3" />
      <text x="350" y="96" fontSize="13" fill="#2C1D07" fontFamily="var(--f)" fontWeight="700">
        Camanti
      </text>
      <text x="350" y="110" fontSize="10" fill="#563B12" fontFamily="var(--f)">
        1,200 m · ~2.5h · Cloud forest
      </text>

      <path d="M100 95 Q280 120 490 148" fill="none" stroke="#906730" strokeWidth="2.5" strokeDasharray="10 5" opacity="0.65" />
      <circle cx="490" cy="148" r="9" fill="#906730" opacity="0.85" />
      <circle cx="490" cy="148" r="16" fill="none" stroke="#906730" strokeWidth="1.5" opacity="0.22" />
      <text x="512" y="146" fontSize="13" fill="#2C1D07" fontFamily="var(--f)" fontWeight="700">
        Manu Road
      </text>
      <text x="512" y="160" fontSize="10" fill="#563B12" fontFamily="var(--f)">
        800–3,000 m · ~5h · Gradient
      </text>

      <path d="M100 95 Q340 155 690 196" fill="none" stroke="#906730" strokeWidth="2" strokeDasharray="10 5" opacity="0.5" />
      <circle cx="690" cy="196" r="8" fill="#906730" opacity="0.75" />
      <circle cx="690" cy="196" r="14" fill="none" stroke="#906730" strokeWidth="1.5" opacity="0.18" />
      <text x="712" y="194" fontSize="13" fill="#2C1D07" fontFamily="var(--f)" fontWeight="700">
        Manu Core
      </text>
      <text x="712" y="208" fontSize="10" fill="#563B12" fontFamily="var(--f)">
        300–500 m · ~8h · Deep Amazon
      </text>

      <text x="16" y="222" fontSize="10" fill="rgba(44,29,7,.45)" fontFamily="var(--f)">
        ← altitude decreases · distance from Cusco increases →
      </text>
    </svg>
  )
}
