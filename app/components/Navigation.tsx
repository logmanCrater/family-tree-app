"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, TreePine, Edit3, Info } from "lucide-react"

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const tabs = [
    { 
      id: "add", 
      label: "Üzv Əlavə Et", 
      icon: Users,
      description: "Yeni ailə üzvü əlavə edin"
    },
    { 
      id: "tree", 
      label: "Ağacı Gör", 
      icon: TreePine,
      description: "Ailə ağacını görüntüləyin"
    },
    { 
      id: "edit", 
      label: "Üzvləri Redaktə Et", 
      icon: Edit3,
      description: "Mövcud üzvləri redaktə edin"
    },
    { 
      id: "about", 
      label: "Haqqında", 
      icon: Info,
      description: "Tətbiq haqqında məlumat"
    },
  ]

  return (
    <div className="mb-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-2 p-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
              >
                <Icon className="w-5 h-5" />
                <div className="text-center">
                  <div className="font-medium text-sm">{tab.label}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 hidden sm:block">
                    {tab.description}
                  </div>
                </div>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}
