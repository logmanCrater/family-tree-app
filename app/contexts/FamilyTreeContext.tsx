"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface FamilyMember {
  id: number
  name: string
  birthDate: string | null
  gender: "male" | "female" | "other"
  parentId: number | null
  children: number[]
}

interface FamilyTreeContextType {
  familyMembers: FamilyMember[]
  addMember: (member: Omit<FamilyMember, "id" | "children">) => void
  updateMember: (id: number, updates: Partial<FamilyMember>) => void
  deleteMember: (id: number) => void
  saveToStorage: () => void
  loadFromStorage: () => void
}

const FamilyTreeContext = createContext<FamilyTreeContextType | undefined>(undefined)

export function FamilyTreeProvider({ children }: { children: ReactNode }) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [nextId, setNextId] = useState(1)

  useEffect(() => {
    loadFromStorage()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [familyMembers])

  const saveToStorage = () => {
    try {
      localStorage.setItem(
        "familyTreeData",
        JSON.stringify({
          members: familyMembers,
          nextId: nextId,
        }),
      )
    } catch (error) {
      console.error("Məlumatları saxlama xətası:", error)
    }
  }

  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem("familyTreeData")
      if (saved) {
        const data = JSON.parse(saved)
        setFamilyMembers(data.members || [])
        setNextId(data.nextId || 1)
      }
    } catch (error) {
      console.error("Məlumatları yükləmə xətası:", error)
    }
  }

  const addMember = (memberData: Omit<FamilyMember, "id" | "children">) => {
    const newMember: FamilyMember = {
      ...memberData,
      id: nextId,
      children: [],
    }

    setFamilyMembers((prev) => {
      const updated = [...prev, newMember]

      if (newMember.parentId) {
        const parentIndex = updated.findIndex((m) => m.id === newMember.parentId)
        if (parentIndex !== -1) {
          updated[parentIndex] = {
            ...updated[parentIndex],
            children: [...updated[parentIndex].children, newMember.id],
          }
        }
      }

      return updated
    })

    setNextId((prev) => prev + 1)
  }

  const updateMember = (id: number, updates: Partial<FamilyMember>) => {
    setFamilyMembers((prev) => prev.map((member) => (member.id === id ? { ...member, ...updates } : member)))
  }

  const deleteMember = (id: number) => {
    const deleteRecursively = (memberId: number, members: FamilyMember[]): FamilyMember[] => {
      const member = members.find((m) => m.id === memberId)
      if (!member) return members

      let updatedMembers = members.filter((m) => m.id !== memberId)

      member.children.forEach((childId) => {
        updatedMembers = deleteRecursively(childId, updatedMembers)
      })

      if (member.parentId) {
        const parentIndex = updatedMembers.findIndex((m) => m.id === member.parentId)
        if (parentIndex !== -1) {
          updatedMembers[parentIndex] = {
            ...updatedMembers[parentIndex],
            children: updatedMembers[parentIndex].children.filter((childId) => childId !== memberId),
          }
        }
      }

      return updatedMembers
    }

    setFamilyMembers((prev) => deleteRecursively(id, prev))
  }

  return (
    <FamilyTreeContext.Provider
      value={{
        familyMembers,
        addMember,
        updateMember,
        deleteMember,
        saveToStorage,
        loadFromStorage,
      }}
    >
      {children}
    </FamilyTreeContext.Provider>
  )
}

export function useFamilyTree() {
  const context = useContext(FamilyTreeContext)
  if (!context) {
    throw new Error("useFamilyTree must be used within FamilyTreeProvider")
  }
  return context
}
