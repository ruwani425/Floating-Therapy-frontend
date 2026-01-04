"use client";

import type React from "react";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  Calendar as CalendarDays,
  TrendingUp,
  X,
  Save,
  XCircle,
  Lock,
  AlertCircle,
  Sparkles,
  Settings,
} from "lucide-react";
import Swal from "sweetalert2";
import apiRequest from "../../core/axios";

// --- THEME COLORS ---
const COLORS = {
  primary: "#5B8DC4",
  primaryDark: "#2C4A6F",
  primaryLight: "#A8D0E8",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
  white: "#FFFFFF",
};

// --- UTILITY FUNCTIONS ---
const formatDate = (date: Date | string, format: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (format === "yyyy-MM-dd") {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  if (format === "MMMM yyyy") {
    return `${monthNames[month]} ${year}`;
  }
  if (format === "MMM dd") {
    return `${monthShort[month]} ${day}`;
  }
  if (format === "full") {
    return `${dayNames[dateObj.getDay()]}, ${monthNames[month]} ${day}, ${year}`;
  }
  return dateObj.toDateString();
};

const isSameDay = (d1: Date, d2: Date): boolean => {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + months);
  return newDate;
};

// --- TYPE DEFINITIONS ---
type DayStatus = "Bookable" | "Closed" | "Sold Out";

interface SystemSettings {
  defaultFloatPrice: number;
  cleaningBuffer: number;
  sessionDuration: number;
  sessionsPerDay: number;
  openTime: string;
  closeTime: string;
  numberOfTanks: number;
  tankStaggerInterval: number;
  actualCloseTime?: string;
}

interface Tank {
  _id: string;
  name: string;
  status: "Ready" | "Maintenance";
}

interface CalendarOverride {
  _id?: string;
  tankId: string;
  date: string;
  status: DayStatus;
  openTime: string;
  closeTime: string;
  sessionsToSell: number;
  bookedSessions: number;
}

interface DayData {
  date: string;
  status: DayStatus;
  openTime: string;
  closeTime: string;
  totalSessions: number;
  bookedSessions: number;
  availableSessions: number;
  overrides: CalendarOverride[];
}

interface SessionDetail {
  tankNumber: number;
  tankName: string;
  sessions: {
    sessionNumber: number;
    startTime: string;
    endTime: string;
    cleaningStart: string;
    cleaningEnd: string;
  }[];
}

// --- API SERVICE ---
const apiService = {
  getSystemSettings: async (): Promise<SystemSettings> => {
    try {
      const response = await apiRequest.get<SystemSettings>("/system-settings");
      return response;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Settings",
        text: "Could not fetch system settings.",
        toast: true,
        position: "top-end",
        timer: 3000,
      });
      throw error;
    }
  },
  getAllTanks: async (): Promise<Tank[]> => {
    try {
      const response = await apiRequest.get<Tank[]>("/tanks");
      return response || [];
    } catch (error) {
      return [];
    }
  },
  getCalendarOverrides: async (startDate: string, endDate: string): Promise<CalendarOverride[]> => {
    try {
      const response = await apiRequest.get<{ success: boolean; data: CalendarOverride[] }>("/calendar", {
        params: { startDate, endDate }
      });
      return response.success ? response.data : [];
    } catch (error) {
      return [];
    }
  },
  getBookingCounts: async (startDate: string, endDate: string): Promise<Record<string, number>> => {
    try {
      const response = await apiRequest.get<{ success: boolean; data: { date: string, count: number }[] }>("/appointments/counts", {
        params: { startDate, endDate }
      });
      
      if (response.success && Array.isArray(response.data)) {
        return response.data.reduce((acc, item) => {
          acc[item.date] = item.count;
          return acc;
        }, {} as Record<string, number>);
      }
      return {};
    } catch (error) {
      console.error("Failed to fetch booking counts:", error);
      return {};
    }
  },
  updateDayStatus: async (
    date: string,
    status: DayStatus,
    openTime: string,
    closeTime: string,
    sessionsToSell: number
  ): Promise<boolean> => {
    try {
      const response = await apiRequest.post<{ success: boolean }>("/calendar", {
        date,
        status,
        openTime,
        closeTime,
        sessionsToSell,
      });
      return response.success;
    } catch (error) {
      throw error;
    }
  },
};

// --- SESSION CALCULATION ---
const calculateStaggeredSessions = (
  openTime: string,
  closeTime: string,
  duration: number,
  buffer: number,
  numberOfTanks: number,
  staggerInterval: number
): { sessionsPerTank: number; actualCloseTime: string } => {
  if (!openTime || !closeTime || !duration || !buffer || numberOfTanks <= 0) {
    return { sessionsPerTank: 0, actualCloseTime: closeTime || "00:00" };
  }

  const timeToMinutes = (time: string): number => {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 0;
      return hours * 60 + minutes;
    } catch {
      return 0;
    }
  };

  const minutesToTime = (minutes: number): string => {
    if (isNaN(minutes)) return "00:00";
    const hrs = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const openMinutes = timeToMinutes(openTime);
  let closeMinutes = timeToMinutes(closeTime);
  if (closeMinutes <= openMinutes) closeMinutes += 24 * 60;

  const sessionLength = Number(duration) + Number(buffer);
  if (sessionLength <= 0 || isNaN(sessionLength)) {
    return { sessionsPerTank: 0, actualCloseTime: closeTime };
  }

  let maxSessionsPerTank = 0;
  let latestEndTime = openMinutes;

  for (let tankIndex = 0; tankIndex < numberOfTanks; tankIndex++) {
    const tankStartMinutes = openMinutes + (tankIndex * Number(staggerInterval || 0));
    const availableTime = closeMinutes - tankStartMinutes;
    const tankSessions = Math.floor(availableTime / sessionLength);
    
    if (tankSessions > 0) {
      const tankEndTime = tankStartMinutes + (tankSessions * sessionLength);
      latestEndTime = Math.max(latestEndTime, tankEndTime);
      maxSessionsPerTank = Math.max(maxSessionsPerTank, tankSessions);
    }
  }

  return {
    sessionsPerTank: maxSessionsPerTank || 0,
    actualCloseTime: minutesToTime(latestEndTime)
  };
};

const generateSessionDetails = (
  settings: SystemSettings,
  tanks: Tank[]
): SessionDetail[] => {
  const readyTanks = tanks.filter(t => t.status === "Ready");
  const sessionDetails: SessionDetail[] = [];

  const timeToMinutes = (time: string): number => {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return 0;
      return hours * 60 + minutes;
    } catch {
      return 0;
    }
  };

  const minutesToTime = (minutes: number): string => {
    if (isNaN(minutes)) return "00:00";
    const hrs = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const openMinutes = timeToMinutes(settings.openTime);
  const sessionDuration = Number(settings.sessionDuration) || 0;
  const cleaningBuffer = Number(settings.cleaningBuffer) || 0;
  const staggerInterval = Number(settings.tankStaggerInterval) || 0;
  const sessionLength = sessionDuration + cleaningBuffer;

  if (sessionLength <= 0) return [];

  const result = calculateStaggeredSessions(
    settings.openTime,
    settings.closeTime,
    sessionDuration,
    cleaningBuffer,
    readyTanks.length,
    staggerInterval
  );

  readyTanks.forEach((tank, tankIndex) => {
    const tankStartMinutes = openMinutes + (tankIndex * staggerInterval);
    const sessions = [];

    for (let i = 0; i < result.sessionsPerTank; i++) {
      const sessionStartMinutes = tankStartMinutes + (i * sessionLength);
      const sessionEndMinutes = sessionStartMinutes + sessionDuration;
      const cleaningEndMinutes = sessionEndMinutes + cleaningBuffer;

      sessions.push({
        sessionNumber: i + 1,
        startTime: minutesToTime(sessionStartMinutes),
        endTime: minutesToTime(sessionEndMinutes),
        cleaningStart: minutesToTime(sessionEndMinutes),
        cleaningEnd: minutesToTime(cleaningEndMinutes),
      });
    }

    sessionDetails.push({
      tankNumber: tankIndex + 1,
      tankName: tank.name,
      sessions,
    });
  });

  return sessionDetails;
};

// --- DAY CONFIGURATION MODAL ---
interface DayConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DayData | null;
  settings: SystemSettings;
  readyTankCount: number;
  onSave: () => void;
}

const DayConfigModal: React.FC<DayConfigModalProps> = ({
  isOpen,
  onClose,
  dayData,
  settings,
  readyTankCount,
  onSave,
}) => {
  const [status, setStatus] = useState<DayStatus>("Bookable");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dayData) {
      setStatus(dayData.status);
      setOpenTime(dayData.openTime || settings.openTime);
      setCloseTime(dayData.closeTime || settings.closeTime);
    }
  }, [dayData, settings]);

  const calculatedSessions = useMemo(() => {
    if (status !== "Bookable" || !openTime || !closeTime) return 0;
    
    const result = calculateStaggeredSessions(
      openTime,
      closeTime,
      settings.sessionDuration,
      settings.cleaningBuffer,
      readyTankCount,
      settings.tankStaggerInterval
    );
    
    const total = result.sessionsPerTank * readyTankCount;
    return isNaN(total) ? 0 : total;
  }, [openTime, closeTime, status, settings, readyTankCount]);

  const handleSave = async () => {
    if (!dayData) return;

    if (status === "Bookable" && (!openTime || !closeTime)) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please set operating hours for bookable days." });
      return;
    }

    setIsSaving(true);
    try {
      const sessionsToSell = status === "Bookable" ? calculatedSessions : 0;
      const success = await apiService.updateDayStatus(
        dayData.date,
        status,
        openTime || settings.openTime,
        closeTime || settings.closeTime,
        sessionsToSell
      );

      if (success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Day settings updated successfully!",
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
        onSave();
        onClose();
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to update day settings." });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !dayData) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-md shadow-2xl z-[70] overflow-y-auto transform transition-transform duration-300 ease-in-out" style={{ backgroundColor: COLORS.white }}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: COLORS.gray200 }}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS.primary}15` }}>
                <CalendarDays className="w-5 h-5" style={{ color: COLORS.primary }} />
              </div>
              <h2 className="text-xl font-bold" style={{ color: COLORS.gray800 }}>Configure Day</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" style={{ color: COLORS.gray600 }} />
            </button>
          </div>

          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: COLORS.gray50 }}>
            <p className="text-xs font-semibold mb-1" style={{ color: COLORS.gray600 }}>SELECTED DATE</p>
            <p className="text-lg font-bold" style={{ color: COLORS.gray800 }}>
              {dayData.date && formatDate(dayData.date, "full")}
            </p>
          </div>

          {dayData.bookedSessions > 0 && (
            <div className="mb-6 p-4 rounded-xl border-2" style={{ backgroundColor: `${COLORS.warning}10`, borderColor: COLORS.warning }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.warning }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: COLORS.warning }}>Active Bookings</p>
                  <p className="text-xs mt-1" style={{ color: COLORS.gray700 }}>
                    This day has <strong>{dayData.bookedSessions}</strong> confirmed booking{dayData.bookedSessions !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-bold mb-3" style={{ color: COLORS.gray800 }}>Day Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus("Bookable")}
                className={`p-4 rounded-xl border-2 transition-all ${status === "Bookable" ? "shadow-lg scale-[1.02]" : "hover:shadow-md"}`}
                style={{
                  borderColor: status === "Bookable" ? COLORS.success : COLORS.gray200,
                  backgroundColor: status === "Bookable" ? `${COLORS.success}15` : COLORS.white,
                }}
              >
                <CheckCircle2 className={`w-8 h-8 mx-auto mb-2 ${status === "Bookable" ? "" : "opacity-40"}`} style={{ color: COLORS.success }} />
                <p className={`text-sm font-bold ${status === "Bookable" ? "" : "opacity-60"}`} style={{ color: status === "Bookable" ? COLORS.success : COLORS.gray600 }}>Open</p>
              </button>
              <button
                type="button"
                onClick={() => setStatus("Closed")}
                className={`p-4 rounded-xl border-2 transition-all ${status === "Closed" ? "shadow-lg scale-[1.02]" : "hover:shadow-md"}`}
                style={{
                  borderColor: status === "Closed" ? COLORS.error : COLORS.gray200,
                  backgroundColor: status === "Closed" ? `${COLORS.error}15` : COLORS.white,
                }}
              >
                <XCircle className={`w-8 h-8 mx-auto mb-2 ${status === "Closed" ? "" : "opacity-40"}`} style={{ color: COLORS.error }} />
                <p className={`text-sm font-bold ${status === "Closed" ? "" : "opacity-60"}`} style={{ color: status === "Closed" ? COLORS.error : COLORS.gray600 }}>Closed</p>
              </button>
            </div>
          </div>

          {status === "Bookable" && (
            <div className="mb-6">
              <label className="block text-sm font-bold mb-3" style={{ color: COLORS.gray800 }}>
                <Clock className="w-4 h-4 inline mr-2" /> Operating Hours
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: COLORS.gray600 }}>OPEN TIME</label>
                  <input
                    type="time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                    className="w-full px-3 py-3 border-2 rounded-lg focus:ring-2 transition-all font-semibold outline-none"
                    style={{ borderColor: COLORS.gray300, color: COLORS.gray800 }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: COLORS.gray600 }}>CLOSE TIME</label>
                  <input
                    type="time"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                    className="w-full px-3 py-3 border-2 rounded-lg focus:ring-2 transition-all font-semibold outline-none"
                    style={{ borderColor: COLORS.gray300, color: COLORS.gray800 }}
                  />
                </div>
              </div>
            </div>
          )}

          {status === "Bookable" && (
            <div className="mb-6 p-5 rounded-xl border-2" style={{ backgroundColor: `${COLORS.primary}08`, borderColor: COLORS.primary }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" style={{ color: COLORS.primary }} />
                <p className="text-xs font-bold" style={{ color: COLORS.gray600 }}>CALCULATED SESSIONS</p>
              </div>
              <p className="text-4xl font-bold mb-2" style={{ color: COLORS.primary }}>{calculatedSessions}</p>
              <p className="text-xs font-medium" style={{ color: COLORS.gray600 }}>Based on {readyTankCount} ready tank{readyTankCount !== 1 ? 's' : ''}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border-2 font-bold transition-all hover:bg-gray-50 order-2 sm:order-1"
              style={{ borderColor: COLORS.gray300, color: COLORS.gray700 }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
              style={{ backgroundColor: COLORS.primary }}
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- MAIN COMPONENT ---
const CalendarManage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarData, setCalendarData] = useState<Map<string, DayData>>(new Map());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const readyTankCount = useMemo(() => tanks.filter(t => t.status === "Ready").length, [tanks]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const firstDayKey = formatDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), "yyyy-MM-dd");
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      const lastDayKey = formatDate(lastDay, "yyyy-MM-dd");

      const [fetchedSettings, fetchedTanks, overrides, bookedCountsMap] = await Promise.all([
        apiService.getSystemSettings(),
        apiService.getAllTanks(),
        apiService.getCalendarOverrides(firstDayKey, lastDayKey),
        apiService.getBookingCounts(firstDayKey, lastDayKey),
      ]);
      
      setSettings(fetchedSettings);
      setTanks(fetchedTanks);
      
      const dataMap = new Map<string, DayData>();
      const readyTanks = fetchedTanks.filter(t => t.status === "Ready");
      
      const defaultResult = calculateStaggeredSessions(
        fetchedSettings.openTime,
        fetchedSettings.closeTime,
        fetchedSettings.sessionDuration,
        fetchedSettings.cleaningBuffer,
        readyTanks.length,
        fetchedSettings.tankStaggerInterval
      );
      const defaultSessions = (defaultResult.sessionsPerTank * readyTanks.length) || 0;

      const overridesByDate = new Map<string, CalendarOverride[]>();
      overrides.forEach(override => {
        if (!overridesByDate.has(override.date)) overridesByDate.set(override.date, []);
        overridesByDate.get(override.date)!.push(override);
      });

      for (let d = 1; d <= lastDay.getDate(); d++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
        const dateKey = formatDate(date, "yyyy-MM-dd");
        const dayOverrides = overridesByDate.get(dateKey) || [];
        const actualBookedCount = bookedCountsMap[dateKey] || 0; 
        
        if (dayOverrides.length > 0) {
          const totalSessions = dayOverrides.reduce((sum, o) => sum + (Number(o.sessionsToSell) || 0), 0);
          const available = Math.max(0, totalSessions - actualBookedCount);
          const firstOverride = dayOverrides[0];
          
          let status: DayStatus = firstOverride.status;
          if (status === "Bookable" && actualBookedCount >= totalSessions && totalSessions > 0) status = "Sold Out";

          dataMap.set(dateKey, {
            date: dateKey,
            status,
            openTime: firstOverride.openTime || fetchedSettings.openTime,
            closeTime: firstOverride.closeTime || fetchedSettings.closeTime,
            totalSessions: totalSessions || 0,
            bookedSessions: actualBookedCount,
            availableSessions: available,
            overrides: dayOverrides,
          });
        } else {
          const available = Math.max(0, defaultSessions - actualBookedCount);
          let status: DayStatus = "Bookable";
          if (defaultSessions > 0 && available === 0) status = "Sold Out";

          dataMap.set(dateKey, {
            date: dateKey,
            status: status,
            openTime: fetchedSettings.openTime,
            closeTime: fetchedSettings.closeTime,
            totalSessions: defaultSessions,
            bookedSessions: actualBookedCount,
            availableSessions: available,
            overrides: [],
          });
        }
      }
      setCalendarData(dataMap);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  }, [currentMonth]);

  const stats = useMemo(() => {
    if (!settings || !tanks.length) return null;
    const result = calculateStaggeredSessions(settings.openTime, settings.closeTime, settings.sessionDuration, settings.cleaningBuffer, readyTankCount, settings.tankStaggerInterval);
    let totalBookings = 0;
    let totalAvailable = 0;
    calendarData.forEach(day => {
      if (day.status !== "Closed") {
        totalBookings += Number(day.bookedSessions) || 0;
        totalAvailable += Number(day.totalSessions) || 0;
      }
    });
    const dailySessions = (result.sessionsPerTank * readyTankCount) || 0;
    return {
      totalDailySessions: isNaN(dailySessions) ? 0 : dailySessions,
      sessionsPerTank: result.sessionsPerTank || 0,
      readyTanks: readyTankCount,
      actualCloseTime: result.actualCloseTime,
      monthlyBookings: isNaN(totalBookings) ? 0 : totalBookings,
      monthlyCapacity: isNaN(totalAvailable) ? 0 : totalAvailable,
    };
  }, [settings, tanks, readyTankCount, calendarData]);

  const sessionDetails = useMemo(() => {
    if (!selectedDate || !settings || !tanks.length) return [];
    const dateKey = formatDate(selectedDate, "yyyy-MM-dd");
    const dayData = calendarData.get(dateKey);
    if (!dayData || dayData.status === "Closed") return [];
    const daySpecificSettings = { ...settings, openTime: dayData.openTime, closeTime: dayData.closeTime };
    return generateSessionDetails(daySpecificSettings, tanks);
  }, [selectedDate, settings, tanks, calendarData]);

  const handleDateClick = (date: Date) => setSelectedDate(date);
  const handleMonthChange = (direction: number) => {
    setCurrentMonth(addMonths(currentMonth, direction));
    setSelectedDate(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.gray50 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p className="text-lg font-semibold" style={{ color: COLORS.gray600 }}>Loading calendar...</p>
        </div>
      </div>
    );
  }

  const selectedDayData = selectedDate ? calendarData.get(formatDate(selectedDate, "yyyy-MM-dd")) : null;
  const today = new Date();

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b shadow-sm" style={{ backgroundColor: COLORS.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3" style={{ color: COLORS.gray800 }}>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${COLORS.primary}20` }}>
                  <CalendarIcon className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: COLORS.primary }} />
                </div>
                Calendar
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-medium" style={{ color: COLORS.gray600 }}>View and manage booking schedule</p>
            </div>
          </div>

          {/* Stats Cards - Responsive Grid */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'DAILY CAP.', val: stats.totalDailySessions, icon: CalendarDays, color: COLORS.primary },
                { label: 'MONTHLY', val: stats.monthlyBookings, icon: TrendingUp, color: COLORS.success },
                { label: 'TANKS', val: stats.readyTanks, icon: Users, color: COLORS.warning },
                { label: 'HOURS', val: `${settings?.openTime}-${settings?.closeTime}`, icon: Clock, color: COLORS.error, smallText: true }
              ].map((stat, i) => (
                <div key={i} className="p-3 sm:p-4 rounded-xl border-2 shadow-sm bg-white" style={{ borderColor: COLORS.gray200 }}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 rounded-lg hidden sm:block" style={{ backgroundColor: `${stat.color}15` }}>
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold" style={{ color: COLORS.gray600 }}>{stat.label}</p>
                      <p className={`${stat.smallText ? 'text-sm sm:text-lg' : 'text-xl sm:text-2xl'} font-extrabold truncate`} style={{ color: stat.color }}>{stat.val}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2 rounded-xl border p-3 sm:p-4 shadow-md bg-white" style={{ borderColor: COLORS.gray200 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: COLORS.gray800 }}>{formatDate(currentMonth, "MMMM yyyy")}</h2>
              <div className="flex gap-1 sm:gap-2">
                <button onClick={() => handleMonthChange(-1)} className="p-2 rounded-lg border bg-white hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(null); }} className="px-2 sm:px-3 py-2 rounded-lg border text-xs font-bold" style={{ borderColor: COLORS.primary, backgroundColor: `${COLORS.primary}10`, color: COLORS.primary }}>Today</button>
                <button onClick={() => handleMonthChange(1)} className="p-2 rounded-lg border bg-white hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Legend - Scrollable on mobile */}
            <div className="flex items-center gap-3 mb-4 p-2 rounded-lg text-[10px] sm:text-xs overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ backgroundColor: COLORS.gray50 }}>
              {[{ c: `${COLORS.success}40`, t: 'Available' }, { c: `${COLORS.warning}40`, t: 'Partial' }, { c: `${COLORS.error}40`, t: 'Full' }, { c: `${COLORS.error}80`, t: 'Closed' }].map((l, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded" style={{ backgroundColor: l.c }} />
                  <span className="font-semibold" style={{ color: COLORS.gray700 }}>{l.t}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {["S", "M", "T", "W", "T", "F", "S"].map(d => <div key={d} className="text-center py-1 text-[10px] sm:text-xs font-bold text-gray-500">{d}</div>)}
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`e-${idx}`} className="aspect-square" />;
                const dateKey = formatDate(day, "yyyy-MM-dd");
                const dayData = calendarData.get(dateKey);
                const isToday = isSameDay(day, today);
                const isPast = day < today && !isToday;
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                let bg = COLORS.white;
                let bc = COLORS.gray200;
                let icon = null;

                if (dayData) {
                  if (dayData.status === "Closed") { bg = `${COLORS.error}90`; bc = COLORS.error; icon = <Lock className="w-2 h-2 text-white" />; }
                  else if (dayData.status === "Sold Out" || (dayData.availableSessions === 0 && dayData.totalSessions > 0)) { bg = `${COLORS.error}40`; bc = COLORS.error; }
                  else if (dayData.bookedSessions > 0) { 
                    const ratio = dayData.bookedSessions / dayData.totalSessions;
                    bg = ratio >= 0.7 ? `${COLORS.warning}25` : `${COLORS.success}20`;
                    bc = ratio >= 0.7 ? COLORS.warning : COLORS.success;
                  } else { bg = `${COLORS.success}15`; bc = COLORS.success; }
                }

                if (isSelected || isToday) bc = COLORS.primary;

                return (
                  <button
                    key={idx}
                    onClick={() => !isPast && handleDateClick(day)}
                    disabled={isPast}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all relative p-0.5 sm:p-1 border ${isPast ? 'opacity-40 grayscale cursor-not-allowed' : 'hover:shadow-sm'}`}
                    style={{ backgroundColor: bg, borderColor: bc, borderWidth: (isSelected || isToday) ? '2px' : '1px' }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs sm:text-sm font-bold" style={{ color: dayData?.status === "Closed" ? 'white' : 'inherit' }}>{day.getDate()}</span>
                      {icon}
                    </div>
                    {dayData && !isPast && dayData.status !== "Closed" && (
                      <span className="text-[8px] sm:text-[10px] font-bold mt-auto" style={{ color: COLORS.primary }}>{dayData.availableSessions}/{dayData.totalSessions}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="rounded-xl border p-4 shadow-md bg-white h-fit" style={{ borderColor: COLORS.gray200 }}>
            {selectedDate && selectedDayData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">Day Details</h3>
                  <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Selected</p>
                  <p className="text-sm font-bold">{formatDate(selectedDate, "MMM dd, yyyy")}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-gray-50 border">
                    <p className="text-[10px] font-bold text-gray-500">BOOKED</p>
                    <p className="text-lg font-bold" style={{ color: COLORS.primary }}>{selectedDayData.bookedSessions}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border">
                    <p className="text-[10px] font-bold text-gray-500">FREE</p>
                    <p className="text-lg font-bold" style={{ color: COLORS.success }}>{selectedDayData.availableSessions}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-2.5 rounded-lg font-bold text-white shadow hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  <Settings className="w-4 h-4" /> Configure
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">Select a date to view</p>
              </div>
            )}
          </div>
        </div>

        {/* Sessions Section */}
        {selectedDate && selectedDayData && selectedDayData.status !== "Closed" && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="rounded-xl border p-4 sm:p-6 shadow-lg bg-white" style={{ borderColor: COLORS.gray200 }}>
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-bold">Schedule: {formatDate(selectedDate, "MMM dd")}</h3>
                <p className="text-xs text-gray-500">Based on {selectedDayData.openTime} - {selectedDayData.closeTime}</p>
              </div>

              <div className="space-y-6">
                {sessionDetails.map((tank) => (
                  <div key={tank.tankNumber} className="border rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold">{tank.tankNumber}</div>
                        <h4 className="font-bold text-sm sm:text-base">{tank.tankName}</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md">READY</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {tank.sessions.map((s) => (
                        <div key={s.sessionNumber} className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#{s.sessionNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                            <Clock className="w-3 h-3 text-blue-500" /> {s.startTime} - {s.endTime}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Clean: {s.cleaningStart}-{s.cleaningEnd}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {settings && selectedDayData && (
        <DayConfigModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          dayData={selectedDayData}
          settings={settings}
          readyTankCount={readyTankCount}
          onSave={() => { fetchData(); setIsModalOpen(false); }}
        />
      )}
    </div>
  );
};

export default CalendarManage;