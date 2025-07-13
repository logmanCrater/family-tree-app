"use client"

import { useFamilyTree } from "../contexts/FamilyTreeContext"
import type { JSX } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TreePine, Users, GitBranch, UserCheck, Calendar, User } from "lucide-react"
import { format } from "date-fns"
import { az } from "date-fns/locale"

export default function ViewTreeTab() {
  const { familyMembers } = useFamilyTree()

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Məlum deyil"
    const date = new Date(dateStr)
    return format(date, "dd MMMM yyyy", { locale: az })
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

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return "👨"
      case "female":
        return "👩"
      default:
        return "👤"
    }
  }

  const rootMembers = familyMembers.filter((m) => m.parentId === null)
  const maxGeneration = Math.max(...familyMembers.map((m) => getGeneration(m.id)), 0)

  function getGeneration(memberId: number): number {
    const member = familyMembers.find((m) => m.id === memberId)
    if (!member || !member.parentId) return 0
    return 1 + getGeneration(member.parentId)
  }

  function renderMemberTree(member: any, generation: number): JSX.Element {
    const children = familyMembers.filter((m) => m.parentId === member.id)

    const generationColors = [
      "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950",
      "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
      "border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950",
      "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950",
      "border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950 dark:to-rose-950",
    ]

    return (
      <div key={member.id} className="mb-6">
        <Card className={`${generationColors[generation % generationColors.length]} border-2 shadow-lg`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getGenderIcon(member.gender)}</span>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    {getGenderLabel(member.gender)}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white/80 dark:bg-slate-800/80">
                Nəsil {generation + 1}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(member.birthDate)}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <GitBranch className="w-4 h-4" />
                <span>{children.length} uşaq</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {children.length > 0 && (
          <div className="ml-8 mt-4 border-l-2 border-slate-200 dark:border-slate-700 pl-6">
            {children.map((child) => renderMemberTree(child, generation + 1))}
          </div>
        )}
      </div>
    )
  }

  if (familyMembers.length === 0) {
    return (
      <div className="text-center py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <TreePine className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Ailə Ağacı Boşdur</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Hələ heç bir ailə üzvü əlavə edilməyib.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Ailə ağacınızı qurmağa başlamaq üçün "Üzv Əlavə Et" bölməsinə keçin!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full">
            <TreePine className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
          Ailə Ağacı
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Ailənizin bütün üzvlərini və əlaqələrini görüntüləyin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <div className="text-3xl font-bold">{familyMembers.length}</div>
            <div className="text-blue-100">Ümumi Üzvlər</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <GitBranch className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <div className="text-3xl font-bold">{maxGeneration + 1}</div>
            <div className="text-green-100">Nəsillər</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-6 text-center">
            <UserCheck className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <div className="text-3xl font-bold">{rootMembers.length}</div>
            <div className="text-purple-100">Başlanğıc Üzvlər</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ailə Ağacı Strukturu</CardTitle>
          <CardDescription>
            Ailənizin üzvlərini nəsil sırası ilə görüntüləyin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            {rootMembers.map((root) => renderMemberTree(root, 0))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
