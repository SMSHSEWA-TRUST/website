import React from "react";

export const SectionTitle: React.FC<{children: React.ReactNode}> = ({children}) => (
  <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
);

export const formatMoney = (n: number | string) => `${"₹"} ${n.toLocaleString("en-IN")}`;
