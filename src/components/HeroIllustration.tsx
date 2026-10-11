/** Иллюстрация для hero-блока: мастер чинит стиральную машину. Палитра — из globals.css. */
export function HeroIllustration() {
  const ink = '#17212B';
  const accent = '#C2410C';
  const skin = '#F2C29E';
  return (
    <div className="hero-art" role="img" aria-label="Мастер ремонтирует стиральную машину">
      <svg viewBox="0 0 480 360" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="480" height="360" fill="#FFF1E8" />
        <rect y="292" width="480" height="68" fill="#F8DCC8" />
        {/* окно */}
        <rect x="36" y="44" width="116" height="92" rx="10" fill="#fff" stroke="#EBCDB8" strokeWidth="3" />
        <path d="M94 44v92M36 90h116" stroke="#EBCDB8" strokeWidth="3" />
        {/* ящик с инструментами */}
        <rect x="56" y="254" width="86" height="44" rx="6" fill={ink} />
        <rect x="56" y="266" width="86" height="6" fill={accent} />
        <path d="M84 254v-10h30v10" fill="none" stroke={ink} strokeWidth="5" strokeLinejoin="round" />
        {/* стиральная машина */}
        <rect x="276" y="292" width="16" height="8" rx="3" fill={ink} />
        <rect x="382" y="292" width="16" height="8" rx="3" fill={ink} />
        <rect x="262" y="128" width="150" height="168" rx="14" fill="#fff" stroke={ink} strokeWidth="3" />
        <path d="M262 160h150" stroke={ink} strokeWidth="3" />
        <circle cx="282" cy="144" r="5" fill={accent} />
        <circle cx="300" cy="144" r="5" fill="#D5DAE0" />
        <rect x="350" y="139" width="44" height="10" rx="5" fill="#D5DAE0" />
        <circle cx="337" cy="228" r="48" fill="#E8EEF6" stroke={ink} strokeWidth="3" />
        <circle cx="337" cy="228" r="34" fill="#fff" stroke="#8A949E" strokeWidth="2" />
        <path d="M304 236c11 8 22 8 33 0s22-8 33 0A34 34 0 0 1 304 236z" fill="#BFD3EA" />
        {/* мастер */}
        <rect x="172" y="250" width="18" height="46" rx="6" fill={ink} />
        <rect x="196" y="250" width="18" height="46" rx="6" fill={ink} />
        <rect x="164" y="290" width="28" height="10" rx="5" fill={ink} />
        <rect x="194" y="290" width="28" height="10" rx="5" fill={ink} />
        <path d="M170 192 160 236" stroke="#9A3412" strokeWidth="16" strokeLinecap="round" />
        <circle cx="160" cy="240" r="8" fill={skin} />
        <rect x="162" y="170" width="62" height="92" rx="22" fill={accent} />
        <rect x="180" y="200" width="26" height="20" rx="4" fill="#9A3412" />
        <circle cx="193" cy="146" r="22" fill={skin} />
        <path d="M171 142a22 22 0 0 1 44 0z" fill={ink} />
        {/* козырёк: низ на одной линии с краем кепки (y=142), левый конец спрятан под куполом */}
        <path d="M205 137H228.5a2.5 2.5 0 0 1 0 5H205z" fill={ink} />
        <circle cx="204" cy="151" r="2.2" fill={ink} />
        <path d="M214 190 252 206" stroke={accent} strokeWidth="16" strokeLinecap="round" />
        <path d="M262 204l14-8" stroke="#5B6670" strokeWidth="6" strokeLinecap="round" />
        <circle cx="280" cy="193" r="6" fill="none" stroke="#5B6670" strokeWidth="4" />
        <circle cx="256" cy="208" r="8" fill={skin} />
        {/* карточка статуса */}
        <rect x="300" y="30" width="150" height="66" rx="12" fill="#fff" stroke="#E3E6EA" strokeWidth="1.5" />
        <circle cx="320" cy="52" r="5" fill="#15803D" />
        <text x="332" y="57" fill={ink} fontSize="14" fontWeight="600">
          Мастер в пути
        </text>
        <text x="316" y="81" fill="#5B6670" fontSize="13">
          Сб · 12:00–15:00
        </text>
        <circle cx="412" cy="128" r="16" fill="#15803D" />
        <path
          d="M405 128l5 5 9-10"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
