"use client"

import { Badge } from "../../components/ui/badge"
import { Crown, Users, TreePine, Heart } from "lucide-react"

export default function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
          <TreePine className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Family Tree
        </h1>
      </div>
      
      <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
        Explore and manage your family connections with our interactive tree visualization
      </p>
      
      <div className="flex items-center justify-center gap-8 mt-6 text-gray-500">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span className="text-sm font-medium">Family Members</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          <span className="text-sm font-medium">Connections</span>
        </div>
        <div className="w-px h-4 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <TreePine className="w-5 h-5" />
          <span className="text-sm font-medium">Tree View</span>
        </div>
      </div>
    </div>
  )
}
