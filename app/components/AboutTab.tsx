export default function AboutTab() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Haqqında</h2>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">🌳 Rəqəmsal Ailə Ağacı</h3>
          <p className="text-gray-700 leading-relaxed">
            Bu tətbiq ailə əlaqələrinizi rəqəmsal formada qeyd etmək və idarə etmək üçün hazırlanmışdır. Ailə
            üzvlərinizi əlavə edə, onların məlumatlarını redaktə edə və gözəl bir ağac şəklində görə bilərsiniz.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">✨ Xüsusiyyətlər</h3>
          <ul className="text-gray-700 space-y-2">
            <li>• Ailə üzvlərini əlavə etmək və redaktə etmək</li>
            <li>• Tam doğum tarixləri ilə işləmək</li>
            <li>• Nəsillərarası əlaqələri vizuallaşdırmaq</li>
            <li>• Məlumatların avtomatik saxlanması</li>
            <li>• Admin və baxış rejimləri</li>
            <li>• Tam Azərbaycan dili dəstəyi</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">🔧 Texniki Məlumatlar</h3>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Versiya:</strong> 2.0.0
            </p>
            <p>
              <strong>Framework:</strong> Next.js 15
            </p>
            <p>
              <strong>Dil:</strong> TypeScript
            </p>
            <p>
              <strong>Stil:</strong> Tailwind CSS
            </p>
            <p>
              <strong>Məlumat Saxlama:</strong> LocalStorage
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">🎯 İstifadə Qaydaları</h3>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Baxış Rejimi:</strong> Standart olaraq yalnız məlumatları görə bilərsiniz.
            </p>
            <p>
              <strong>Admin Rejimi:</strong> Xüsusi açar sözü yazaraq tam icazələr əldə edə bilərsiniz.
            </p>
            <p>
              <strong>Məlumat Saxlama:</strong> Bütün məlumatlar brauzerinizin yaddaşında saxlanır.
            </p>
          </div>
        </div>

        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-gray-600">© 2024 Rəqəmsal Ailə Ağacı - Ailənizi rəqəmsal dünyada yaşadın</p>
        </div>
      </div>
    </div>
  )
}
