// Light backgrounds, dark text, dark buttons and form inputs

"use client"

import type React from "react"
import { useState, type FormEvent, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, Hash, Ruler, Clock, Info, Text, ArrowLeft, DollarSign, User } from "lucide-react"
import apiRequest from "../../core/axios"
import type { AxiosResponse } from "axios"

interface TankFormState {
  name: string
  capacity: number
  length: number
  width: number
  sessionDuration: number
  basePrice: number
  benefits: string
}

const AddTankPage: React.FC = () => {
  const [formData, setFormData] = useState<TankFormState>({
    name: "",
    capacity: 1,
    length: 2.5,
    width: 1.5,
    sessionDuration: 60,
    basePrice: 80,
    benefits: "Deep relaxation, pain relief, improved sleep.",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      console.log("Sending tank data to backend:", formData)
      const response: AxiosResponse<{ message: string; tank?: any }> = await apiRequest.post("/tanks", formData)
      console.log("Backend response:", response.data)
      alert(`Tank '${formData.name}' added successfully!`)
      navigate("/admin/tank-management")
    } catch (error: any) {
      console.error("Failed to save tank", error)
      alert("Failed to save tank. Check console for details.")
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 bg-gradient-to-br from-[#F0F8FB] via-[#E8F4F9] to-[#F5FAFC]">
      <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 md:p-10 border border-cyan-100/50 hover:border-cyan-200/70 transition-colors duration-300">
        <button
          onClick={() => navigate("/admin/tank-management")}
          className="inline-flex items-center mb-8 text-base font-semibold transition-all duration-300 hover:text-cyan-600 hover:translate-x-1 text-slate-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tank Inventory
        </button>

        <header className="mb-10 pb-8 border-b-2 border-cyan-200/60">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-100/40 border border-cyan-300/50">
              <PlusCircle className="w-8 h-8 text-cyan-700" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-800 to-blue-900 bg-clip-text text-transparent">
              Add New Floating Tank
            </h1>
          </div>
          <p className="text-lg text-slate-600 ml-11">Configure the physical and service parameters.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-2 border-b-2 border-cyan-200/60 pb-3">
                <Ruler className="w-5 h-5 text-cyan-700" />
                <h2 className="text-2xl font-bold text-slate-800">Physical Specs & Pricing</h2>
              </div>

              <FormField
                id="name"
                name="name"
                label="Tank Name"
                value={formData.name}
                onChange={handleChange}
                icon={Hash}
                placeholder="e.g., Neptune, Orion"
              />

              <FormField
                id="capacity"
                name="capacity"
                label="Max Capacity (People)"
                value={formData.capacity.toString()}
                onChange={handleChange}
                icon={User}
                type="number"
              />

              <FormField
                id="length"
                name="length"
                label="Tank Length (meters)"
                value={formData.length.toString()}
                onChange={handleChange}
                icon={Ruler}
                type="number"
                step="0.1"
              />

              <FormField
                id="sessionDuration"
                name="sessionDuration"
                label="Default Session Duration (min)"
                value={formData.sessionDuration.toString()}
                onChange={handleChange}
                icon={Clock}
                type="number"
              />

              <FormField
                id="basePrice"
                name="basePrice"
                label="Base Price (USD)"
                value={formData.basePrice.toString()}
                onChange={handleChange}
                icon={DollarSign}
                type="number"
                step="5"
              />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2 border-b-2 border-cyan-200/60 pb-3">
                <Info className="w-5 h-5 text-cyan-700" />
                <h2 className="text-2xl font-bold text-slate-800">Therapy & Media</h2>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-slate-800">
                  <Text className="w-4 h-4 mr-2 text-cyan-700" />
                  Floating Therapy Benefits
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={5}
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Describe unique relaxation and health benefits..."
                  className="w-full p-4 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 bg-blue-50/40 border-cyan-200/60 text-slate-800 placeholder-slate-400 focus:ring-cyan-400/60 focus:border-cyan-400/80 focus:shadow-lg focus:shadow-cyan-200/20"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-cyan-200/40">
            <button
              type="submit"
              className="px-8 py-4 text-white font-bold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-cyan-300/40 flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Floating Tank
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddTankPage

interface FormFieldProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  icon: React.ElementType
  type?: string
  placeholder?: string
  step?: string
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  placeholder = "",
  step,
}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="flex items-center text-sm font-semibold text-slate-800">
      <Icon className="w-4 h-4 mr-2 text-cyan-700" />
      {label}
    </label>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      step={step}
      className="w-full p-4 border rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 bg-blue-50/40 border-cyan-200/60 text-slate-800 placeholder-slate-400 focus:ring-cyan-400/60 focus:border-cyan-400/80 focus:shadow-lg focus:shadow-cyan-200/20"
    />
  </div>
)
