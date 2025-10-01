import React from "react";

export const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
);

export const formatMoney = (n: number | string) => `${"₹"} ${n.toLocaleString("en-IN")}`;

// Import donation-related images
import bhoomiddan1 from "../../../assets/images/bhoomidaan1.png";
import bhoomiddan2 from "../../../assets/images/image-6.webp";
import bhojandaan1 from "../../../assets/images/bhojandaan1.png";
import bhojanddan2 from "../../../assets/images/bhojanddan2.png";
import gaudaan1 from "../../../assets/images/gaudaan1.png";
import gaudaan2 from "../../../assets/images/gaudaan2.png";
import anndan1 from "../../../assets/images/anndan1.png";
import anndan2 from "../../../assets/images/anndan2.png";

// Image mapping for different donation types
export const getDaanImages = (title: string): string[] => {
  const normalizedTitle = title?.toLowerCase();

  switch (normalizedTitle) {
    case 'bhumi daan':
    case 'bhoomidaan':
      return [bhoomiddan1, bhoomiddan2];
    case 'gaudaan':
    case 'gau daan':
      return [gaudaan1, gaudaan2];
    case 'anndaan':
    case 'ann daan':
    case 'bhojan daan':
    case 'bhojandaan':
      return [bhojandaan1, bhojanddan2];
    case 'raashidaan':
    case 'raashi daan':
      return [anndan1, anndan2]; // Using anndan as fallback for raashi
    default:
      return [bhoomiddan1, bhoomiddan2]; // Default to bhoomiddan images
  }
};

// Keep the single image function for backward compatibility
export const getDaanImage = (title: string): string => {
  const images = getDaanImages(title);
  return images[0]; // Return first image
};

export const getDaanImageAlt = (title: string): string => {
  const normalizedTitle = title?.toLowerCase();

  switch (normalizedTitle) {
    case 'bhumi daan':
    case 'bhoomidaan':
      return 'Land Donation - Temple Complex';
    case 'gaudaan':
    case 'gau daan':
      return 'Cow Protection and Care';
    case 'anndaan':
    case 'ann daan':
    case 'bhojan daan':
    case 'bhojandaan':
      return 'Food Distribution Service';
    default:
      return 'Temple Donation';
  }
};
