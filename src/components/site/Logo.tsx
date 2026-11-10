import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "dark" | "light" | "auto";
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  variant = "auto",
  showSubtitle = false,
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl",
  };

  const dividerHeight = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
    xl: "h-10",
  };

  const isLightTheme = variant === "light" || variant === "auto";

  return (
    <div className={`inline-flex flex-col ${className}`}>
      <div className="flex items-center tracking-tight select-none">
        {/* Brand Icon / PVC Window Profile Mark */}
        <div className="relative mr-2 flex items-center justify-center">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#0B4F9C] via-[#0284C7] to-[#E11D48] p-[1.5px] shadow-sm">
            <div
              className={`h-full w-full ${
                isLightTheme ? "bg-white" : "bg-slate-950"
              } rounded-[6px] flex items-center justify-center`}
            >
              <div className="h-3.5 w-3.5 rounded-[3px] border-2 border-[#0284C7] grid grid-cols-2 gap-[1px] p-[1px] bg-sky-500/10">
                <div className="bg-[#0B4F9C] rounded-[1px]" />
                <div className="bg-[#E11D48] rounded-[1px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Text Part 1: "acar" in bold brand blue */}
        <span
          className={`font-sans font-black lowercase tracking-tight ${sizeClasses[size]} ${
            isLightTheme
              ? "text-[#0B4F9C]"
              : "text-[#38BDF8] drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]"
          }`}
          style={{ fontFamily: "'Outfit', 'DM Sans', 'Montserrat', sans-serif", letterSpacing: "-0.04em" }}
        >
          acar
        </span>

        {/* Sleek Vertical Divider */}
        <span
          className={`mx-1.5 w-[1.5px] ${dividerHeight[size]} ${
            isLightTheme ? "bg-slate-300" : "bg-white/30"
          }`}
        />

        {/* Text Part 2: "pen" in accent crimson/precision grey */}
        <span
          className={`font-sans font-bold lowercase tracking-tight ${sizeClasses[size]} ${
            isLightTheme ? "text-[#E11D48]" : "text-rose-400"
          }`}
          style={{ fontFamily: "'Outfit', 'DM Sans', 'Montserrat', sans-serif", letterSpacing: "-0.03em" }}
        >
          pen
        </span>
      </div>

      {showSubtitle && (
        <span
          className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
            isLightTheme ? "text-sky-700 font-extrabold" : "text-cyan-400/90"
          } mt-0.5 pl-9`}
        >
          Fıratpen Yetkili Üretici Bayi
        </span>
      )}
    </div>
  );
};

export default Logo;
