import { useSearchParams, useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Phone, ChevronLeft } from "lucide-react"
import { useState, useMemo } from "react"

type AppointmentStatus = "confirmed" | "pending" | "completed"

interface Appointment {
  id: string
  time: string
  clientName: string
  service: string
  duration: string
  phone: string
  location: string
  status: AppointmentStatus
}

const MOCK_APPOINTMENTS: Record<string, Appointment[]> = {
  "2025-12-15": [
    { id: "1", time: "09:00 AM", clientName: "John Smith", service: "Haircut", duration: "30 mins", phone: "+1 234-567-8900", location: "Main Branch", status: "confirmed" },
    { id: "2", time: "10:00 AM", clientName: "Sarah Johnson", service: "Hair Coloring", duration: "60 mins", phone: "+1 234-567-8901", location: "Main Branch", status: "confirmed" },
    { id: "3", time: "11:30 AM", clientName: "Mike Davis", service: "Beard Trim", duration: "20 mins", phone: "+1 234-567-8902", location: "Main Branch", status: "pending" },
    { id: "4", time: "02:00 PM", clientName: "Emily Wilson", service: "Styling", duration: "45 mins", phone: "+1 234-567-8903", location: "Main Branch", status: "confirmed" },
  ],
  "2025-12-16": [
    { id: "5", time: "09:30 AM", clientName: "Robert Brown", service: "Haircut", duration: "30 mins", phone: "+1 234-567-8904", location: "Downtown", status: "confirmed" },
    { id: "6", time: "01:00 PM", clientName: "Lisa Anderson", service: "Spa Treatment", duration: "90 mins", phone: "+1 234-567-8905", location: "Main Branch", status: "confirmed" },
  ],
}

export default function AppointmentsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dateParam: string | null = searchParams.get("date")
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)

  const appointments = useMemo(() => {
    if (!dateParam) return []
    return MOCK_APPOINTMENTS[dateParam] || []
  }, [dateParam])

  const formattedDate = useMemo(() => {
    if (!dateParam) return ""
    try {
      const date = new Date(dateParam)
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateParam
    }
  }, [dateParam])

  const getStatusColor = (status: AppointmentStatus): string => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700 border-green-300"
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "completed": return "bg-blue-100 text-blue-700 border-blue-300"
      default: return "bg-gray-100 text-gray-700 border-gray-300" 
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Appointments</h1>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">
              {formattedDate && `Viewing for ${formattedDate}`}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex w-fit items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-all active:scale-95"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            <span>Back</span>
          </button>
        </div>

        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => {
              const isSelected = selectedAppointment === appointment.id
              return (
                <div
                  key={appointment.id}
                  onClick={() => setSelectedAppointment(isSelected ? null : appointment.id)}
                  className={`rounded-lg border border-border bg-card p-4 md:p-6 cursor-pointer transition-all hover:shadow-sm ${
                    isSelected ? "ring-2 ring-primary/20" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-base md:text-lg font-bold text-foreground">{appointment.time}</span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">{appointment.clientName}</h3>
                    </div>
                    <span className={`w-fit px-3 py-1 rounded-full text-xs md:text-sm font-medium border capitalize ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm font-semibold text-muted-foreground whitespace-nowrap">Service:</span>
                      <span className="text-xs md:text-sm text-foreground truncate">{appointment.service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm font-semibold text-muted-foreground whitespace-nowrap">Duration:</span>
                      <span className="text-xs md:text-sm text-foreground">{appointment.duration}</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="border-t border-border pt-4 mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground break-all">{appointment.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm text-foreground break-words">{appointment.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-opacity-90 active:scale-[0.98] transition-all">
                          Confirm
                        </button>
                        <button className="w-full px-4 py-2.5 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted active:scale-[0.98] transition-all">
                          Reschedule
                        </button>
                        <button className="w-full px-4 py-2.5 border border-destructive text-destructive rounded-lg text-sm font-medium hover:bg-destructive/10 active:scale-[0.98] transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          ) : (
            <div className="rounded-lg border border-border bg-card p-8 md:p-12 text-center">
              <Calendar className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">No Appointments</h3>
              <p className="text-sm text-muted-foreground">
                {dateParam ? "No appointments scheduled for this date." : "Please select a date to view appointments."}
              </p>
            </div>
          )}
        </div>

        {appointments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-8">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-[10px] md:text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Total</p>
              <p className="text-xl md:text-2xl font-bold text-foreground">{appointments.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-[10px] md:text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Confirmed</p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {appointments.filter((a) => a.status === "confirmed").length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <p className="text-[10px] md:text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">Pending</p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">
                {appointments.filter((a) => a.status === "pending").length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}