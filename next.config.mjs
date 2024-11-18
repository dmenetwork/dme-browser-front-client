// Importar dotenv para leer las variables de entorno
import { config } from "dotenv"

// Cargar las variables de entorno según el entorno actual
config({ path: `.env.${process.env.NODE_ENV}` })

/** @type {import('next').NextConfig} */

const nextConfig = {
  output: "export",
  distDir: "out",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

export default nextConfig
