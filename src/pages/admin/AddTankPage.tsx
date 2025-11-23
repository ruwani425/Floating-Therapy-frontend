"use client"

import type React from "react"
import { useState, type FormEvent, type ChangeEvent } from "react"
import { NavLink } from "react-router-dom"
import { PlusCircle, Hash, Ruler, Clock, Info, Text, ImageIcon, ArrowLeft, DollarSign, User } from "lucide-react"

interface TankFormState {
  name: string
  capacity: number
  length: number
  width: number
  sessionDuration: number
  basePrice: number
  benefits: string
  imagePreview: string | null
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
    imagePreview: null,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log("Adding Tank:", formData)
    alert(`Tank '${formData.name}' added successfully! (Mock submission)`)
  }

  return (
    <div
      className="min-h-screen p-6 md:p-8 lg:p-10"
      style={{
        background: "linear-gradient(135deg, #6BA3C5 0%, #475D73 50%, #0F3A52 100%)",
      }}
    >
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <NavLink
          to="/admin/tank-management"
          className="inline-flex items-center mb-8 text-base font-semibold transition-colors hover:opacity-80"
          style={{ color: "#233547" }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Tank Inventory
        </NavLink>

        <header className="mb-10 pb-6 border-b-2" style={{ borderColor: "#92B8D9" }}>
          <div className="flex items-center gap-3 mb-2">
            <PlusCircle className="w-8 h-8" style={{ color: "#0F3A52" }} />
            <h1 className="text-4xl font-bold" style={{ color: "#233547" }}>
              Add New Floating Tank
            </h1>
          </div>
          <p className="text-lg" style={{ color: "#5A7A95" }}>
            Configure the physical and service parameters.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-2 border-b-2 pb-3" style={{ borderColor: "#92B8D9" }}>
                <Ruler className="w-5 h-5" style={{ color: "#0F3A52" }} />
                <h2 className="text-2xl font-bold" style={{ color: "#0F3A52" }}>
                  Physical Specs & Pricing
                </h2>
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
              <div className="flex items-center gap-2 border-b-2 pb-3" style={{ borderColor: "#92B8D9" }}>
                <Info className="w-5 h-5" style={{ color: "#0F3A52" }} />
                <h2 className="text-2xl font-bold" style={{ color: "#0F3A52" }}>
                  Therapy & Media
                </h2>
              </div>

              {/* Benefits Textarea */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold" style={{ color: "#0F3A52" }}>
                  <Text className="w-4 h-4 mr-2" />
                  Floating Therapy Benefits
                </label>
                <textarea
                  id="benefits"
                  name="benefits"
                  rows={5}
                  value={formData.benefits}
                  onChange={handleChange}
                  placeholder="Describe unique relaxation and health benefits..."
                  className="w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
                  style={
                    {
                      borderColor: "#E0E0E0",
                      "--tw-ring-color": "#92B8D9",
                    } as React.CSSProperties
                  }
                />
                <p className="text-xs" style={{ color: "#999" }}>
                  This text will be used to generate content suggestions for clients.
                </p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold" style={{ color: "#0F3A52" }}>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Tank Image Upload
                </label>
                <div
                  className="relative p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 hover:bg-opacity-50"
                  style={{
                    borderColor: "#92B8D9",
                    backgroundColor: "#F5F9FB",
                  }}
                >
                  <input
                    id="imageFile"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8" style={{ color: "#5A7A95" }} />
                    <p style={{ color: "#0F3A52" }} className="font-semibold">
                      Drop your image here
                    </p>
                    <p style={{ color: "#999" }} className="text-sm">
                      or click to browse
                    </p>
                  </div>
                </div>

                {/* Image Preview */}
                {formData.imagePreview && (
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium mb-2" style={{ color: "#0F3A52" }}>
                      Preview:
                    </p>
                    <img
                      src={formData.imagePreview || "/placeholder.svg"}
                      alt="Tank Preview"
                      className="w-full h-auto max-h-48 object-cover rounded-md shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t" style={{ borderColor: "#E0E0E0" }}>
            <button
              type="submit"
              className="px-8 py-3 text-white font-bold rounded-lg shadow-md transition-all duration-300 hover:shadow-lg flex items-center gap-2"
              style={{ backgroundColor: "#0F3A52" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
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

// --- Helper Components ---

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
    <label htmlFor={id} className="flex items-center text-sm font-semibold" style={{ color: "#0F3A52" }}>
      <Icon className="w-4 h-4 mr-2" style={{ color: "#5A7A95" }} />
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
      className="w-full p-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2"
      style={
        {
          borderColor: "#E0E0E0",
          "--tw-ring-color": "#92B8D9",
        } as React.CSSProperties
      }
    />
  </div>
)
