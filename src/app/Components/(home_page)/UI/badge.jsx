import React from "react";

// ✅ cn utility: merges class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ✅ Badge component without CVA
export function Badge({ className, variant = "default", children, ...props }) {
  let variantClasses = "";

  switch (variant) {
    case "default":
      variantClasses = "bg-blue-600 text-white border-transparent hover:bg-blue-700";
      break;
    case "secondary":
      variantClasses = "bg-gray-200 text-gray-900 border-transparent hover:bg-gray-300";
      break;
    case "destructive":
      variantClasses = "bg-red-600 text-white border-transparent hover:bg-red-700";
      break;
    case "outline":
      variantClasses = "text-gray-900 border border-gray-300";
      break;
    default:
      variantClasses = "bg-blue-600 text-white border-transparent";
      break;
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
