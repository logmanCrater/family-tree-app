"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface AdminContextType {
  isAdmin: boolean
  activateAdmin: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  const activateAdmin = () => {
    setIsAdmin(true)
  }

  return <AdminContext.Provider value={{ isAdmin, activateAdmin }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider")
  }
  return context
}
