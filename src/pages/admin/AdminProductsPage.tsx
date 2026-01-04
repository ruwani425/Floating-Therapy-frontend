// src/pages/admin/AdminProductsPage.tsx

import type React from "react"
import { Package } from "lucide-react"

const AdminProductsPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
        <Package className="w-6 h-6 md:w-8 md:h-8" />
        Product Catalog
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-6">
        This is a nested protected route:{" "}
        <code className="bg-gray-200 px-2 py-1 rounded text-xs md:text-sm">/admin/products</code>
      </p>
      <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
        <p className="font-semibold text-sm md:text-base">Product Inventory Mockup:</p>
        <p className="mt-2 text-sm md:text-base text-gray-700">14 items in stock. Last updated 5 minutes ago.</p>
      </div>
    </div>
  </div>
)

export default AdminProductsPage
