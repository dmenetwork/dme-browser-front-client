"use client"
import { useEffect } from "react"

interface ShortcutAction {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  callback: (event: KeyboardEvent) => void
}

export const useKeyboardShortcut = (shortcuts: ShortcutAction[]) => {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      shortcuts.forEach((shortcut) => {
        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          (!shortcut.ctrlKey || event.ctrlKey) &&
          (!shortcut.shiftKey || event.shiftKey)
        ) {
          event.preventDefault() // Evitar el comportamiento por defecto del navegador
          shortcut.callback(event)
        }
      })
    }

    window.addEventListener("keydown", handleKeydown)

    return () => {
      window.removeEventListener("keydown", handleKeydown)
    }
  }, [shortcuts])
}
