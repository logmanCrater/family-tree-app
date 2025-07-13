"use client"

import { useEffect } from "react"
import { useAdmin } from "../contexts/AdminContext"

export default function KeystrokeDetector() {
  const { activateAdmin } = useAdmin()

  useEffect(() => {
    let keySequence = ""
    const targetSequence = "adminator"

    const handleKeyPress = (event: KeyboardEvent) => {
      keySequence += event.key.toLowerCase()

      if (keySequence.length > targetSequence.length) {
        keySequence = keySequence.slice(-targetSequence.length)
      }

      if (keySequence === targetSequence) {
        activateAdmin()
        keySequence = ""

        // Show admin activation notification
        const notification = document.createElement("div")
        notification.textContent = "Admin rejimi aktivləşdirildi!"
        notification.className =
          "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce"
        document.body.appendChild(notification)

        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [activateAdmin])

  return null
}
