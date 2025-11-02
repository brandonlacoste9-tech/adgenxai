interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "aurora" | "minimal";
  label?: string;
}

/**
 * Reusable loading spinner component
 * Supports multiple sizes and variants for different use cases
 */
export default function LoadingSpinner({ 
  size = "md", 
  variant = "default",
  label = "Loading..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const variants = {
    default: "border-[#35E3FF] border-t-transparent",
    aurora: "border-transparent border-t-[#35E3FF] border-r-[#7C4DFF] border-b-[#FFD76A]",
    minimal: "border-gray-300 border-t-gray-600",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} rounded-full border-2 ${variants[variant]} animate-spin`}
        aria-hidden="true"
      />
      {label && (
        <span className="text-sm opacity-70 animate-pulse">
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}
