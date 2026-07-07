interface CircularGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  unit?: string;
  color?: string;
}

export function CircularGauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = "%",
  color = "#355441" // Forest Green
}: CircularGaugeProps) {
  // Clamp value
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = ((clampedValue - min) / (max - min)) * 100;
  
  // SVG Arc calculation for a semi-circle gauge
  const radius = 60;
  const strokeWidth = 12;
  const circumference = Math.PI * radius; // Half circle
  
  // Calculate dash offset for semi-circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm flex flex-col items-center justify-center relative">
      <h3 className="text-[#78716c] font-medium text-sm w-full text-left mb-2">{label}</h3>
      
      <div className="relative w-40 h-24 overflow-hidden flex items-end justify-center mt-4">
        <svg
          viewBox="0 0 160 100"
          className="absolute top-0 w-full h-full transform"
        >
          {/* Background Arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="#f4f3ed"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Value Display inside arc */}
        <div className="flex items-baseline gap-1 mb-2 z-10">
          <span className="text-3xl font-bold text-[#1c1c1a]">{Number(clampedValue.toFixed(1))}</span>
          <span className="text-sm font-medium text-[#78716c]">{unit}</span>
        </div>
      </div>
      
      {/* Min/Max labels */}
      <div className="flex justify-between w-32 text-xs font-semibold text-zinc-400 mt-2">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
