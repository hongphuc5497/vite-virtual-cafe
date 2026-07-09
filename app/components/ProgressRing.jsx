export function ProgressRing({ radius, circumference, strokeDashoffset, size, trackColor, progressColor, strokeWidth = 6, progressStrokeWidth, transitionStyle, children }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={progressStrokeWidth ?? strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={transitionStyle ? { transition: transitionStyle } : undefined}
        />
      </svg>
      {children}
    </div>
  );
}
