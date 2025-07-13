"use client"

import type React from "react"
import { useState } from "react"
import { useFamilyTree } from "../contexts/FamilyTreeContext"
import { useAdmin } from "../contexts/AdminContext"
import DatePicker from "./DatePicker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Lock, UserPlus, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddMemberTab() {
  const { familyMembers, addMember } = useFamilyTree()
  const { isAdmin } = useAdmin()
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "male" as "male" | "female" | "other",
    relationshipType: "starter" as "starter" | "child",
    parentId: null as number | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Zəhmət olmasa ad daxil edin")
      return
    }

    if (formData.relationshipType === "child" && !formData.parentId) {
      alert("Zəhmət olmasa valideyn seçin")
      return
    }

    addMember({
      name: formData.name.trim(),
      birthDate: formData.birthDate || null,
      gender: formData.gender,
      parentId: formData.relationshipType === "child" ? formData.parentId : null,
    })

    setFormData({
      name: "",
      birthDate: "",
      gender: "male",
      relationshipType: "starter",
      parentId: null,
    })

    alert("Üzv uğurla əlavə edildi!")
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Lock className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Baxış Rejimi</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Üzv əlavə etmək üçün admin icazəsi lazımdır.
            </p>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Admin rejimini aktivləşdirmək üçün xüsusi açar sözü yazın.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Yeni Ailə Üzvü Əlavə Et
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Ailənizə yeni üzv əlavə etmək üçün məlumatları doldurun
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Üzv Məlumatları</CardTitle>
          <CardDescription>
            Yeni ailə üzvünün əsas məlumatlarını daxil edin
          </CardDescription>
        </CardHeader>
        <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tam Ad</Label>
              <Input
                id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tam adı daxil edin"
            required
          />
        </div>

            <div className="space-y-2">
              <Label>Doğum Tarixi</Label>
          <DatePicker
            value={formData.birthDate}
            onChange={(date) => setFormData({ ...formData, birthDate: date })}
            placeholder="Doğum tarixini seçin"
          />
        </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Cins</Label>
              <Select
            value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" | "other" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Cins seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Kişi</SelectItem>
                  <SelectItem value="female">Qadın</SelectItem>
                  <SelectItem value="other">Digər</SelectItem>
                </SelectContent>
              </Select>
        </div>

            <div className="space-y-2">
              <Label htmlFor="relationshipType">Əlaqə Növü</Label>
              <Select
            value={formData.relationshipType}
                onValueChange={(value) =>
                  setFormData({ ...formData, relationshipType: value as "starter" | "child", parentId: null })
            }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Əlaqə növünü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Başlanğıc Üzv (Ailə Qurucusu)</SelectItem>
                  <SelectItem value="child">Uşaq</SelectItem>
                </SelectContent>
              </Select>
        </div>

        {formData.relationshipType === "child" && (
              <div className="space-y-2">
                <Label htmlFor="parentId">Valideyn Seçin</Label>
                <Select
                  value={formData.parentId?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, parentId: value ? Number.parseInt(value) : null })
              }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Valideyn seçin..." />
                  </SelectTrigger>
                  <SelectContent>
              {familyMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                  {member.name} ({member.gender === "male" ? "Kişi" : member.gender === "female" ? "Qadın" : "Digər"})
                      </SelectItem>
              ))}
                  </SelectContent>
                </Select>
          </div>
        )}

            <Button type="submit" className="w-full" size="lg">
              <UserPlus className="w-4 h-4 mr-2" />
          Üzv Əlavə Et
            </Button>
      </form>
        </CardContent>
      </Card>
    </div>
  )
}
