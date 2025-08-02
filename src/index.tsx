import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Preload critical resources
const criticalResources = [
  '/temp-logo.png',
  '/om.png',
  '/bg-shiv.webp'
];

criticalResources.forEach(resource => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = resource;
  link.as = resource.endsWith('.png') || resource.endsWith('.webp') ? 'image' : 'fetch';
  document.head.appendChild(link);
});

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
