import {
  Rocket,
  Landmark,
  Star,
  Zap,
  Flame,
  Heart,
  CircleCheck,
  TriangleAlert,
  ThumbsUp,
  Gift,
  LoaderPinwheel,
  Trophy,
  Joystick,
  LockKeyhole,
  Settings,
  Lightbulb,
  FolderOpen,
  CalendarDays,
  Pizza,
} from "lucide-react" // Ajusta al importar tus iconos
import { COLOR_COMMON_BLACK } from "@/constants/colors" // Asegúrate de importar el color

const useIconMap = (isDarkMode: boolean) => {
  return {
    "🚀": <Rocket color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "🏛️": <Landmark color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "⭐": <Star color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "⚡": <Zap color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "🔥": <Flame color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "❤️": <Heart color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "✅": <CircleCheck color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "⚠️": <TriangleAlert color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "👍": <ThumbsUp color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "🎁": <Gift color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "⚽": <LoaderPinwheel color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "🏆": <Trophy color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "🎮": <Joystick color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "🔐": <LockKeyhole color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "⚙️": <Settings color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "💡": <Lightbulb color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "📂": <FolderOpen color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "📆": <CalendarDays color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
    "🍔": <Pizza color={isDarkMode ? "white" : COLOR_COMMON_BLACK} />,
  }
}

export default useIconMap
