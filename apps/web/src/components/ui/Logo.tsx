
interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function LogoIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Vaayu (Sanskrit for wind/airflow) represented as directional, converging aerodynamic airfoils conveying velocity, precision, and low-compute intelligence */}
      <path
        d="M6 9.5C11.5 9.5 15.5 14 19 22.5"
        stroke={color}
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      <path
        d="M13 9.5C17.5 9.5 21 13 26 22.5"
        stroke={color}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />
      <path
        d="M20 9.5C22.5 9.5 24.5 11.5 27 15"
        stroke={color}
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
    </svg>
  );
}

export default function Logo({
  className = "",
  showWordmark = true,
  size = "md",
  variant = "dark"
}: LogoProps) {
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  };

  const textSizes = {
    sm: "text-base font-semibold",
    md: "text-lg font-bold tracking-tight",
    lg: "text-2xl font-bold tracking-tight",
  };

  const isLight = variant === "light";

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className={`rounded-lg p-1.5 flex items-center justify-center transition-colors ${
        isLight ? 'bg-white/10 text-white' : 'bg-teal-950 text-teal-400 border border-teal-800/40 shadow-sm'
      }`}>
        <LogoIcon className={iconSizes[size]} color="currentColor" />
      </div>
      {showWordmark && (
        <span className={`${textSizes[size]} ${isLight ? 'text-white' : 'text-slate-900'}`}>
          Vaayu<span className="text-teal-600 font-extrabold">Edge</span>
        </span>
      )}
    </div>
  );
}
