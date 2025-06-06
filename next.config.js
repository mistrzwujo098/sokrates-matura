/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dla deploymentu na platformach statycznych (bez API)
  // output: 'export',
  
  // Standardowa konfiguracja dla pełnej aplikacji
  reactStrictMode: true,
  swcMinify: true,
  
  // Konfiguracja dla obrazów
  images: {
    unoptimized: true,
  },
  
  // Zmienne środowiskowe dostępne w przeglądarce
  env: {
    // Tylko publiczne zmienne!
    APP_NAME: 'SokratesMatura',
  },
}

module.exports = nextConfig
