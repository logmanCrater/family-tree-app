"use client"

import { useState } from "react"
import { useFamilyTree } from "../contexts/FamilyTreeContext"
import { useAdmin } from "../contexts/AdminContext"
import DatePicker from "./DatePicker"

export default function EditMembersTab() {
  const { familyMembers, updateMember, deleteMember } = useFamilyTree()
  const { isAdmin } = useAdmin()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    birthDate: "",
    gender: "male" as "male" | "female" | "other",
  })

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Məlum deyil"
    const date = new Date(dateStr)
    return date.toLocaleDateString("az-AZ", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "male":
        return "Kişi"
      case "female":
        return "Qadın"
      default:
        return "Digər"
    }
  }

  const startEdit = (member: any) => {
    setEditingId(member.id)
    setEditForm({
      name: member.name,
      birthDate: member.birthDate || "",
      gender: member.gender,
    })
  }

  const saveEdit = () => {
    if (!editForm.name.trim()) {
      alert("Ad boş ola bilməz")
      return
    }

    updateMember(editingId!, {
      name: editForm.name.trim(),
      birthDate: editForm.birthDate || null,
      gender: editForm.gender,
    })

    setEditingId(null)
    alert("Üzv uğurla yeniləndi!")
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleDelete = (memberId: number, memberName: string) => {
    if (confirm(`${memberName} adlı üzvü silmək istədiyinizə əminsiniz? Bu, onun bütün nəsillərini də siləcək.`)) {
      deleteMember(memberId)
      alert("Üzv uğurla silindi!")
    }
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Baxış Rejimi</h2>
        <p className="text-gray-600 mb-4">Üzvləri redaktə etmək üçün admin icazəsi lazımdır.</p>
        <p className="text-sm text-gray-500">Admin rejimini aktivləşdirmək üçün xüsusi açar sözü yazın.</p>
      </div>
    )
  }

  if (familyMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">👥</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Redaktə Ediləcək Üzv Yoxdur</h2>
        <p className="text-gray-600">Əvvəlcə ailə üzvləri əlavə edin.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Ailə Üzvlərini Redaktə Et</h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {familyMembers.map((member) => {
          const parent = member.parentId ? familyMembers.find((m) => m.id === member.parentId) : null

          return (
            <div key={member.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-sm">
              {editingId === member.id ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    placeholder="Ad"
                  />

                  <DatePicker
                    value={editForm.birthDate}
                    onChange={(date) => setEditForm({ ...editForm, birthDate: date })}
                    placeholder="Doğum tarixini seçin"
                  />

                  <select
                    value={editForm.gender}
                    onChange={(e) =>
                      setEditForm({ ...editForm, gender: e.target.value as "male" | "female" | "other" })
                    }
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="male">Kişi</option>
                    <option value="female">Qadın</option>
                    <option value="other">Digər</option>
                  </select>

                  <div className="flex gap-3">
                    <button
                      onClick={saveEdit}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Saxla
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Ləğv et
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Cins:</strong> {getGenderLabel(member.gender)}
                      </p>
                      <p>
                        <strong>Doğum tarixi:</strong> {formatDate(member.birthDate)}
                      </p>
                      <p>
                        <strong>Status:</strong> {parent ? `${parent.name} adlı şəxsin uşağı` : "Başlanğıc Üzv"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(member)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Redaktə Et
                    </button>
                    <button
                      onClick={() => handleDelete(member.id, member.name)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
