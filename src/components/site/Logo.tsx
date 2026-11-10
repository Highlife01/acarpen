import React, { useId } from "react";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  theme?: "dark" | "light" | "auto";
  variant?: "dark" | "light" | "auto";
  showSubtitle?: boolean;
  layout?: "horizontal" | "stacked";
}

export const AcarpenMark: React.FC<{
  className?: string;
  isDarkBg?: boolean;
}> = ({ className = "h-9 w-auto", isDarkBg = false }) => {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 360 290"
      className={className}
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`apFoldTop-${uid}`}
          x1="180"
          y1="25"
          x2="245"
          y2="115"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={isDarkBg ? "#cfdbed" : "#23437a"} />
          <stop offset="55%" stopColor={isDarkBg ? "#eef4fb" : "#0d244d"} />
          <stop offset="100%" stopColor={isDarkBg ? "#ffffff" : "#05122b"} />
        </linearGradient>
        <linearGradient
          id={`apFoldBot-${uid}`}
          x1="235"
          y1="150"
          x2="295"
          y2="235"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={isDarkBg ? "#c9d7ec" : "#214075"} />
          <stop offset="40%" stopColor={isDarkBg ? "#f2f6fc" : "#0c2147"} />
          <stop offset="100%" stopColor={isDarkBg ? "#ffffff" : "#05122b"} />
        </linearGradient>
        <linearGradient
          id={`apSwoosh-${uid}`}
          x1="7"
          y1="283"
          x2="351"
          y2="122"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#007cf0" />
          <stop offset="52%" stopColor="#00a3ff" />
          <stop offset="100%" stopColor="#0dc0ff" />
        </linearGradient>
        <linearGradient
          id={`apWin-${uid}`}
          x1="190"
          y1="201"
          x2="190"
          y2="273"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#08b0ff" />
          <stop offset="100%" stopColor="#0088f0" />
        </linearGradient>
      </defs>

      {/* Upper-Right Leg of A with 3D Ribbon Fold */}
      <path
        d="M205 9 Q207.5 10.5 209 13.5 L259 111 Q229 113 201 121 L180 68 Z"
        fill={`url(#apFoldTop-${uid})`}
      />

      {/* Lower-Right Leg of A below Swoosh Cutout */}
      <path
        d="M225 165 Q251 151 276 144 L348 283 L287 283 Z"
        fill={`url(#apFoldBot-${uid})`}
      />

      {/* Left Leg & Apex of A */}
      <path
        d="M7 283 L150 15 Q154 7 164 7 L200 7 Q203.5 7 205 9 L180 68 L128 164 L48 265 Z"
        fill={isDarkBg ? "#ffffff" : "#05122b"}
      />

      {/* Sky-Blue Swoosh Arc */}
      <path
        d="M7 283 C68 192 212 88 351 130 C245 112 132 182 73 283 Z"
        fill={`url(#apSwoosh-${uid})`}
      />

      {/* 4-Pane Window Grid Inside A */}
      <g fill={`url(#apWin-${uid})`}>
        <path d="M154 211 L164 201 L185 201 L185 232 L154 232 Z" />
        <rect x="194" y="201" width="31" height="31" rx="1.5" />
        <rect x="154" y="242" width="31" height="31" rx="1.5" />
        <rect x="194" y="242" width="31" height="31" rx="1.5" />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  theme,
  variant,
  showSubtitle = false,
  layout = "horizontal",
}) => {
  const resolvedTheme = theme ?? variant ?? "auto";
  const isDarkBg = resolvedTheme === "dark";

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-[26px] sm:text-[28px]",
    lg: "text-3xl sm:text-[36px]",
    xl: "text-4xl sm:text-5xl",
  };

  const markHeightClasses = {
    sm: "h-7 w-auto",
    md: "h-9 sm:h-10 w-auto",
    lg: "h-11 sm:h-12 w-auto",
    xl: "h-14 sm:h-16 w-auto",
  };

  if (layout === "stacked") {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <AcarpenMark className={markHeightClasses[size]} isDarkBg={isDarkBg} />
        <div
          className={`mt-1.5 flex items-baseline font-extrabold lowercase leading-none ${textSizeClasses[size]}`}
          style={{
            fontFamily: "'DM Sans', 'Montserrat', system-ui, sans-serif",
            letterSpacing: "-0.035em",
          }}
        >
          <span className={isDarkBg ? "text-white" : "text-[#05122b]"}>acar</span>
          <span className="text-[#009dff]">pen</span>
        </div>
        {showSubtitle && (
          <span
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
              isDarkBg ? "text-sky-400/95" : "text-sky-700"
            }`}
          >
            Fıratpen Yetkili Üretici Bayi
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <AcarpenMark
        className={`${markHeightClasses[size]} shrink-0 transition-transform duration-200 group-hover:scale-[1.03]`}
        isDarkBg={isDarkBg}
      />

      <div className="flex flex-col justify-center">
        <div
          className={`flex items-baseline font-extrabold lowercase leading-none ${textSizeClasses[size]}`}
          style={{
            fontFamily: "'DM Sans', 'Montserrat', system-ui, sans-serif",
            letterSpacing: "-0.035em",
          }}
        >
          <span className={isDarkBg ? "text-white" : "text-[#05122b]"}>acar</span>
          <span className="text-[#009dff]">pen</span>
        </div>

        {showSubtitle && (
          <span
            className={`mt-1 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-[0.15em] leading-none ${
              isDarkBg ? "text-sky-400/95" : "text-sky-700"
            }`}
          >
            Fıratpen Yetkili Üretici Bayi
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
