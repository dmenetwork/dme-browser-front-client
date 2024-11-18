import { Palette } from "@mui/material"

// Función para generar un color aleatorio en formato hex
export const getRandomColor = () => {
  const letters = "0123456789ABCDEF"
  let color = "#"
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Función para generar aleatoriamente un gradiente (lineal o radial)
export const getRandomGradient = (color1: string, color2: string) => {
  const gradients = [
    `linear-gradient(to right, ${color1}, ${color2})`,
    `linear-gradient(to bottom, ${color1}, ${color2})`,
    `radial-gradient(circle, ${color1}, ${color2})`,
  ]
  return gradients[Math.floor(Math.random() * gradients.length)]
}

export const getRandomBgColor = () => {
  const color1 = getRandomColor()
  const color2 = getRandomColor()
  const gradient = getRandomGradient(color1, color2)
  return gradient
}

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomWaveBg = () => {
  const generarGradiente = () => {
    const color1 = getRandomColor()
    const color2 = getRandomColor()
    const angulo = getRandomNumber(0, 360)
    const tamanio = getRandomNumber(50, 200)
    return `linear-gradient(${angulo}deg, ${color1}, ${color2} ${tamanio}%)`
  }

  const numeroCapas = getRandomNumber(3, 5)
  const capas = Array.from({ length: numeroCapas }, generarGradiente)

  return capas.join(", ")
}

export const getColorWorkspace = ({
  palette,
  color,
  light = false,
}: {
  palette: Palette
  color:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "inherit"
    | "dark"
  light?: boolean
}) => {
  let returnColor = ""
  switch (color) {
    case "primary":
      returnColor = light ? palette?.primary?.light : palette?.primary?.main
      break
    case "secondary":
      returnColor = light ? palette?.secondary?.light : palette?.secondary?.main
      break
    case "success":
      returnColor = light ? palette?.success?.light : palette?.success?.main
      break
    case "warning":
      returnColor = light ? palette?.warning?.light : palette?.warning?.main
      break
    case "error":
      returnColor = light ? palette?.error?.light : palette?.error?.main
      break
    case "info":
      returnColor = light ? palette?.info?.light : palette?.info?.main
      break
    case "inherit":
      returnColor = light ? palette?.grey?.[300] : palette?.grey?.[500]
      break
  }

  return returnColor
}
