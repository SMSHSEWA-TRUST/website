import React from "react";

const Card: React.FC<{className?: string; children: React.ReactNode}> = ({
  className = "",
  children,
}) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

export default Card;
