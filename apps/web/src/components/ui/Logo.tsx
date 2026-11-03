
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
    sm: "text-base font-bold tracking-tight font-display",
    md: "text-lg font-bold tracking-tight font-display",
    lg: "text-2xl font-bold tracking-tight font-display",
  };

  const isLight = variant === "light";

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      <div className={`rounded-md p-1.5 flex items-center justify-center transition-colors shrink-0 ${
        isLight ? 'bg-white/10 text-white' : 'bg-[#042f2e] text-[#2dd4bf]'
      }`}>
        <LogoIcon className={iconSizes[size]} color="currentColor" />
      </div>
      {showWordmark && (
        <span className={`${textSizes[size]} ${isLight ? 'text-white' : 'text-charcoal-900'}`}>
          Vaayu<strong className="text-teal-800 font-extrabold">Edge</strong>
        </span>
      )}
    </div>
  );
}
