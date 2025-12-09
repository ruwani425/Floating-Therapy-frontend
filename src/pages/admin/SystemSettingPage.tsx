"use client"
import { useState, memo, useCallback, useEffect, useMemo } from "react"
import { Save, RotateCcw, CheckCircle, AlertCircle, Settings } from "lucide-react"
import apiRequest from "../../core/axios" 

// --- THEME COLORS (UNCHANGED) ---
const THETA_COLORS = {
  primary: "#5B8DC4",
  primaryDark: "#2C4A6F",
  primaryLight: "#A8D0E8",
  lightBg: "#F0F6FB",
  white: "#FFFFFF",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray600: "#4B5563",
  text: "#1F2937",
  textLight: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
}

// --- INTERFACE DEFINITION ---
interface SystemSettingsProps {
  _id?: string; 
  defaultFloatPrice: number | string 
  cleaningBuffer: number | string
  sessionDuration: number | string 
  sessionsPerDay: number | string  
  openTime: string
  closeTime: string
  numberOfTanks: number | string 
  tankStaggerInterval: number | string 
  actualCloseTime?: string 
}

// Interface from tank.controller.ts for safe typing of the tank list response
interface TankData {
  _id: string;
  name: string;
  // ... other tank fields
}

type SettingField = keyof Omit<SystemSettingsProps, '_id'> 

// --- INPUT FIELD COMPONENT ---
interface InputFieldProps {
  label: string
  field: SettingField
  type: "number" | "time" | "text"
  value: string | number
  unit?: string
  description?: string
  onChange: (field: SettingField, value: number | string) => void
  disabled: boolean 
  readOnly?: boolean 
}

const InputField = memo(({ label, field, type, value, unit, description, onChange, disabled, readOnly = false }: InputFieldProps) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        
        if (readOnly) return; 

        if (type === "number") {
            const processedValue = rawValue === "" ? "" : Number(rawValue);
            onChange(field, processedValue);
        } else {
            onChange(field, rawValue);
        }
    };

    const inputValue = (type === 'number' && value === 0) ? '' : value; 

    const isInputDisabled = disabled || readOnly;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold" style={{ color: THETA_COLORS.text }}>
          {label}
          {/* 🛑 REMOVED: API Driven Span */}
        </label>
        <div className="relative">
          {unit && type === "number" && (
            <span
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-medium z-10"
              style={{ color: THETA_COLORS.textLight }}
            >
              {unit}
            </span>
          )}
          <input
            type={type}
            value={inputValue} 
            disabled={disabled}
            readOnly={readOnly} 
            onChange={handleChange}
            className={`w-full py-2.5 border rounded-lg focus:outline-none transition-all duration-200 
              ${unit && type === "number" ? "pl-14 pr-4" : "px-4"} 
              ${isInputDisabled ? 'opacity-80 cursor-not-allowed' : ''}`} 
            style={{
              borderColor: THETA_COLORS.gray200,
              backgroundColor: isInputDisabled ? THETA_COLORS.gray100 : THETA_COLORS.white, 
              color: THETA_COLORS.text,
            }}
            onFocus={(e) => {
              if (!isInputDisabled) {
                e.currentTarget.style.borderColor = THETA_COLORS.primary
                e.currentTarget.style.boxShadow = `0 0 0 3px ${THETA_COLORS.primary}20`
              }
            }}
            onBlur={(e) => {
              if (!isInputDisabled) {
                e.currentTarget.style.borderColor = THETA_COLORS.gray200
                e.currentTarget.style.boxShadow = "none"
              }
            }}
          />
        </div>
        {description && (
          <p className="text-xs" style={{ color: THETA_COLORS.textLight }}>
            {description}
          </p>
        )}
        </div>
    );
});

InputField.displayName = "InputField"

// --- UTILITY FUNCTION FOR CALCULATION ---
// (calculateStaggeredSessions function remains unchanged)
const calculateStaggeredSessions = (
    openTime: string, 
    closeTime: string, 
    duration: number, 
    buffer: number, 
    numberOfTanks: number, 
    staggerInterval: number
): { sessionsPerTank: number; actualCloseTime: string } => {
    // Helper: Time string to minutes from midnight
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        if (isNaN(hours) || isNaN(minutes)) return 0;
        return hours * 60 + minutes;
    };

    // Helper: Minutes to time string
    const minutesToTime = (minutes: number): string => {
        const hrs = Math.floor(minutes / 60) % 24;
        const mins = minutes % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };

    const openMinutes = timeToMinutes(openTime);
    let closeMinutes = timeToMinutes(closeTime);

    // Handle next-day closing
    if (closeMinutes <= openMinutes) {
        closeMinutes += 24 * 60; 
    }
    
    const sessionLength = duration + buffer;

    // Validate inputs
    if (sessionLength <= 0 || numberOfTanks <= 0 || staggerInterval < 0 || 
        isNaN(openMinutes) || isNaN(closeMinutes)) {
        return { sessionsPerTank: 0, actualCloseTime: closeTime };
    }

    let maxSessionsPerTank = 0;
    let latestEndTime = openMinutes;

    // Calculate sessions for each tank
    for (let tankIndex = 0; tankIndex < numberOfTanks; tankIndex++) {
        const tankStartMinutes = openMinutes + (tankIndex * staggerInterval);
        
        // Skip calculation if the tank's staggered start time exceeds the closing time
        if (tankStartMinutes >= closeMinutes) continue;

        // Calculate how many sessions this tank can fit
        const availableTime = closeMinutes - tankStartMinutes;
        const tankSessions = Math.floor(availableTime / sessionLength);
        
        if (tankSessions > 0) {
            // Calculate when this tank's last session ends (including cleaning)
            const tankEndTime = tankStartMinutes + (tankSessions * sessionLength);
            latestEndTime = Math.max(latestEndTime, tankEndTime);
            
            // Track minimum sessions across all tanks to determine overall max sessions per tank
            maxSessionsPerTank = maxSessionsPerTank === 0 ? tankSessions : Math.min(maxSessionsPerTank, tankSessions);

        } else {
             // If the first tank can fit 0 sessions, stop processing
             if (tankIndex === 0) {
                maxSessionsPerTank = 0;
                break;
            }
        }
    }

    const actualCloseTime = minutesToTime(latestEndTime);
    
    return { 
        sessionsPerTank: maxSessionsPerTank, 
        actualCloseTime 
    };
};


// --- MAIN COMPONENT ---
const SystemSettings = () => {
  // 1. Define the default state for a brand new, unsaved document
  const defaultState: SystemSettingsProps = {
    defaultFloatPrice: 0,
    cleaningBuffer: 30,
    sessionDuration: 60,
    sessionsPerDay: 0,
    openTime: "08:00",
    closeTime: "22:00",
    numberOfTanks: 0, 
    tankStaggerInterval: 30, 
    actualCloseTime: "22:00",
  };

  const [settings, setSettings] = useState<SystemSettingsProps>(defaultState)
  const [initialSettings, setInitialSettings] = useState<SystemSettingsProps>(defaultState) 
  const [hasChanges, setHasChanges] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false) 
  const [isLoadingTanks, setIsLoadingTanks] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // --- API CALL TO FETCH TANK COUNT (UNCHANGED) ---
  const fetchTankCount = useCallback(async () => {
    setIsLoadingTanks(true);
    try {
      const response: TankData[] = await apiRequest.get("/tanks"); 
      const tankCount = response.length;
      
      setSettings(prev => {
        if (prev.numberOfTanks !== tankCount) {
          return { ...prev, numberOfTanks: tankCount };
        }
        return prev;
      });

      setInitialSettings(prev => ({ ...prev, numberOfTanks: tankCount }));

    } catch (error) {
      console.error("Failed to fetch tank count:", error);
      setSettings(prev => ({ ...prev, numberOfTanks: 0 }));
      setInitialSettings(prev => ({ ...prev, numberOfTanks: 0 }));
      setFetchError(prev => prev ? prev : "Failed to load tank count from API.");
    } finally {
      setIsLoadingTanks(false);
    }
  }, [])


  // --- CALCULATED VALUE (UNCHANGED) ---
  const { calculatedSessionCount, calculatedCloseTime } = useMemo(() => {
    const duration = Number(settings.sessionDuration) || 0;
    const buffer = Number(settings.cleaningBuffer) || 0;
    const tanks = Number(settings.numberOfTanks) || 0; 
    const stagger = Number(settings.tankStaggerInterval) || 0;
    
    const openTime = settings.openTime;
    const closeTime = settings.closeTime;

    const result = calculateStaggeredSessions(openTime, closeTime, duration, buffer, tanks, stagger);
    
    return {
      calculatedSessionCount: result.sessionsPerTank,
      calculatedCloseTime: result.actualCloseTime
    };
  }, [settings.openTime, settings.closeTime, settings.sessionDuration, settings.cleaningBuffer, settings.numberOfTanks, settings.tankStaggerInterval]);

  // --- EFFECT TO UPDATE CALCULATED FIELDS IN STATE (UNCHANGED) ---
  useEffect(() => {
    setSettings(prev => {
      const needsUpdate = prev.sessionsPerDay !== calculatedSessionCount || prev.actualCloseTime !== calculatedCloseTime;
      if (needsUpdate) {
        return { 
          ...prev, 
          sessionsPerDay: calculatedSessionCount,
          actualCloseTime: calculatedCloseTime 
        };
      }
      return prev;
    });
  }, [calculatedSessionCount, calculatedCloseTime]);


  // --- DATA FETCHING (UNCHANGED) ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true) 
        setFetchError(null)

        const response = await apiRequest.get<SystemSettingsProps | null>("/system-settings")

        if (response) {
          const dataToUse: SystemSettingsProps = response as SystemSettingsProps;
          setSettings(prev => ({ ...dataToUse, numberOfTanks: prev.numberOfTanks }));
          setInitialSettings(prev => ({ ...dataToUse, numberOfTanks: prev.numberOfTanks }));
        } else {
          setSettings(defaultState)
          setInitialSettings(defaultState)
        }
        
        setHasChanges(false);

      } catch (error) {
        console.error("Failed to fetch system settings:", error)
        setFetchError("Failed to load settings. Please ensure the API is running correctly.")
      } finally {
        setIsLoading(false) 
      }
    }

    fetchTankCount(); 
    fetchSettings(); 
  }, [fetchTankCount]) 

  // --- HANDLERS (UNCHANGED) ---
  const handleInputChange = useCallback((field: SettingField, value: number | string) => {
    setSettings((prev) => {
      const newSettings = { ...prev, [field]: value } as SystemSettingsProps;
      
      const hasChanged = (Object.keys(defaultState) as Array<keyof SystemSettingsProps>)
        .filter(key => key !== 'sessionsPerDay' && key !== 'actualCloseTime' && key !== 'numberOfTanks')
        .some(key => newSettings[key] !== initialSettings[key]);

      setHasChanges(hasChanged);
      setSaveSuccess(false);
      return newSettings;
    });
  }, [initialSettings])

  const handleSave = async () => {
    if (!hasChanges || isSaving || isLoading || isLoadingTanks) return; 
    
    const finalSettings: SystemSettingsProps = { ...settings };
    (Object.keys(finalSettings) as Array<keyof SystemSettingsProps>).forEach(key => {
        if (typeof finalSettings[key] === 'string' && 
            (key === 'defaultFloatPrice' || key === 'cleaningBuffer' || key === 'sessionDuration' || 
             key === 'tankStaggerInterval')) { 
            finalSettings[key] = (finalSettings[key] === "" ? 0 : Number(finalSettings[key])) as number;
        }
    });
    finalSettings.sessionsPerDay = calculatedSessionCount; 
    finalSettings.actualCloseTime = calculatedCloseTime;
    finalSettings.numberOfTanks = Number(settings.numberOfTanks) || 0; 

    try {
      setIsSaving(true);
      
      let savedResponse: any;
      
      if (finalSettings._id) {
        const updateEndpoint = `/system-settings/${finalSettings._id}`;
        savedResponse = await apiRequest.put<SystemSettingsProps>(updateEndpoint, finalSettings);
      } else {
        savedResponse = await apiRequest.post<SystemSettingsProps>("/system-settings", finalSettings);
      }

      const updatedSettings = savedResponse.data || savedResponse;
      setInitialSettings(prev => ({ ...updatedSettings, numberOfTanks: prev.numberOfTanks })); 
      setSettings(prev => ({ ...updatedSettings, numberOfTanks: prev.numberOfTanks })); 

      setSaveSuccess(true);
      setHasChanges(false);
      setTimeout(() => { setSaveSuccess(false); }, 4000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Check console for details.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleReset = () => {
    if (window.confirm("Are you sure you want to revert all changes to the last saved values?")) {
      setSettings(initialSettings) 
      setHasChanges(false)
      setSaveSuccess(false)
    }
  }
    
  // Consolidated Loading Check for disabling UI elements
  const isAnyLoading = isLoading || isLoadingTanks;

  // --- CONDITIONAL RENDERING (UNCHANGED) ---
  if (fetchError && !isLoadingTanks) { 
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: THETA_COLORS.lightBg }}>
        <div
          className="p-6 rounded-lg border flex items-start gap-3"
          style={{ backgroundColor: `${THETA_COLORS.error}15`, borderColor: THETA_COLORS.error }}
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: THETA_COLORS.error }} />
          <div>
            <p className="text-lg font-semibold" style={{ color: THETA_COLORS.error }}>Data Fetch Error</p>
            <p className="text-sm mt-1" style={{ color: THETA_COLORS.error }}>{fetchError}</p>
          </div>
        </div>
        </div>
    )
  }

  // --- MAIN RENDER ---
  return (
    <div style={{ backgroundColor: THETA_COLORS.lightBg }} className="min-h-screen py-8">
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: THETA_COLORS.primary }}>
              <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
              <h1 className="text-3xl font-bold" style={{ color: THETA_COLORS.primaryDark }}>
                System Settings
              </h1>
              <p className="text-sm mt-1" style={{ color: THETA_COLORS.textLight }}>
                Manage your operations and tank configuration
              </p>
            </div>
          </div>
        </div>
        
        {/* Check if data exists or is new */}
        {!settings._id && !hasChanges && !isAnyLoading && (
            <div className="mb-6 p-4 rounded-lg border border-opacity-20 flex items-start gap-3" 
                style={{ backgroundColor: `${THETA_COLORS.warning}15`, borderColor: THETA_COLORS.warning }}>
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: THETA_COLORS.warning }} />
                <p className="text-sm" style={{ color: THETA_COLORS.warning }}>
                    **No system settings found in the database.** Enter the default values and click "Save Changes" to create the initial document.
                </p>
            </div>
        )}

        {/* Status Messages */}
        {saveSuccess && (
          <div
            className="mb-6 p-4 rounded-lg border border-opacity-20 flex items-start gap-3"
            style={{
              backgroundColor: `${THETA_COLORS.success}15`,
              borderColor: THETA_COLORS.success,
            }}
          >
            <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: THETA_COLORS.success }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: THETA_COLORS.success }}>
                Settings saved successfully
              </p>
            </div>
          </div>
        )}

        {hasChanges && (
          <div
            className="mb-6 p-4 rounded-lg border border-opacity-20 flex items-start gap-3"
            style={{
              backgroundColor: `${THETA_COLORS.warning}15`,
              borderColor: THETA_COLORS.warning,
            }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: THETA_COLORS.warning }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: THETA_COLORS.warning }}>
                You have unsaved changes
              </p>
            </div>
          </div>
        )}

        {/* Daily Capacity Summary Card */}
        {Number(settings.numberOfTanks) > 0 && Number(settings.sessionDuration) > 0 && (
          <div className="mb-8 rounded-lg p-6 border-2" style={{ 
            backgroundColor: `${THETA_COLORS.primary}05`, 
            borderColor: THETA_COLORS.primary 
          }}>
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-wide mb-2" style={{ color: THETA_COLORS.textLight }}>
                Total Sessions Per Day
              </p>
              <p className="text-6xl font-bold mb-3" style={{ color: THETA_COLORS.primary }}>
                {Number(settings.numberOfTanks) * calculatedSessionCount}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm" style={{ color: THETA_COLORS.text }}>
                <div>
                  <span className="font-semibold">{calculatedSessionCount}</span> sessions per tank
                </div>
                <span style={{ color: THETA_COLORS.gray300 }}>×</span>
                <div>
                  <span className="font-semibold">{Number(settings.numberOfTanks || 0)}</span> tanks
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tank Schedule Preview - Hour by Hour */}
        {Number(settings.numberOfTanks) > 0 && Number(settings.sessionDuration) > 0 && calculatedSessionCount > 0 && (
          <div className="mb-8 rounded-lg p-6 border" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.gray200 }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: THETA_COLORS.primaryDark }}>
              Daily Schedule - All Sessions
            </h2>
            <div className="space-y-6">
              {Array.from({ length: Number(settings.numberOfTanks) || 0 }, (_, tankIndex) => {
                const formatTime = (mins: number) => {
                  const hrs = Math.floor(mins / 60) % 24;
                  const min = mins % 60;
                  return `${String(hrs).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
                };
                
                // Calculate initial tank start time
                const [openHours, openMinutes] = settings.openTime.split(':').map(Number);
                const tankStartMinutes = openHours * 60 + openMinutes + (tankIndex * Number(settings.tankStaggerInterval));
                
                const sessionDuration = Number(settings.sessionDuration);
                const cleaningBuffer = Number(settings.cleaningBuffer);
                const sessionLength = sessionDuration + cleaningBuffer;
                
                // Generate all sessions for this tank
                const sessions = [];
                for (let sessionNum = 0; sessionNum < calculatedSessionCount; sessionNum++) {
                  const sessionStartMinutes = tankStartMinutes + (sessionNum * sessionLength);
                  const sessionEndMinutes = sessionStartMinutes + sessionDuration;
                  const cleaningEndMinutes = sessionEndMinutes + cleaningBuffer;
                  
                  sessions.push({
                    number: sessionNum + 1,
                    sessionStart: formatTime(sessionStartMinutes),
                    sessionEnd: formatTime(sessionEndMinutes),
                    cleaningEnd: formatTime(cleaningEndMinutes)
                  });
                }
                
                return (
                  <div key={tankIndex} className="p-5 rounded-lg border" style={{ backgroundColor: THETA_COLORS.lightBg, borderColor: THETA_COLORS.gray200 }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: THETA_COLORS.primary }}>
                          {tankIndex + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-lg" style={{ color: THETA_COLORS.primaryDark }}>
                            Tank {tankIndex + 1}
                          </span>
                          <p className="text-xs" style={{ color: THETA_COLORS.textLight }}>
                            Starts at {formatTime(tankStartMinutes)}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ 
                        backgroundColor: THETA_COLORS.success, 
                        color: THETA_COLORS.white 
                      }}>
                        {calculatedSessionCount} sessions
                      </span>
                    </div>
                    
                    {/* All Sessions for this tank */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sessions.map((session) => (
                        <div 
                          key={session.number} 
                          className="p-3 rounded-lg border" 
                          style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.gray200 }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ 
                              backgroundColor: THETA_COLORS.primaryLight, 
                              color: THETA_COLORS.primaryDark 
                            }}>
                              Session {session.number}
                            </span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold" style={{ color: THETA_COLORS.primary }}>
                                {session.sessionStart} - {session.sessionEnd}
                              </span>
                            </div>
                            <div className className="text-xs" style={{ color: THETA_COLORS.textLight }}>
                              Cleaning: {session.sessionEnd} - {session.cleaningEnd}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pricing Section */}
          <div className="rounded-lg p-6 border" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.gray200 }}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold" style={{ color: THETA_COLORS.primaryDark }}>Pricing</h2>
            </div>
            <InputField
              label="Default Float Session Price"
              field="defaultFloatPrice"
              type="number"
              value={settings.defaultFloatPrice}
              unit="LKR"
              description="Standard base price applied to all tank sessions"
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>

          {/* Tank Configuration Section */}
          <div className="rounded-lg p-6 border" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.gray200 }}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold" style={{ color: THETA_COLORS.primaryDark }}>Tank Configuration</h2>
            </div>
            {/* Number of Tanks (API Driven - Read Only) */}
            <InputField
              label="Number of Floating Tanks"
              field="numberOfTanks"
              type="number"
              // Display loading state if needed
              value={isAnyLoading ? 'Loading...' : settings.numberOfTanks} 
              description="This number is automatically retrieved from your active tanks in the database."
              onChange={handleInputChange}
              disabled={isSaving || isAnyLoading}
              readOnly={true} 
            />
            {/* Tank Stagger Interval */}
            <div className="mt-6">
              <InputField
                label="Tank Start Time Gap"
                field="tankStaggerInterval"
                type="number"
                value={settings.tankStaggerInterval}
                unit="min"
                description="Time gap between each tank's first session (e.g., Tank 1: 8:00, Tank 2: 8:30)"
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Capacity Section */}
          <div className="rounded-lg p-6 border" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.gray200 }}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold" style={{ color: THETA_COLORS.primaryDark }}>Session Capacity</h2>
            </div>
            {/* Session Duration (Editable Field) */}
            <InputField
              label="Float Session Duration"
              field="sessionDuration"
              type="number"
              value={settings.sessionDuration}
              unit="min"
              description="The duration of a single floating session"
              onChange={handleInputChange}
              disabled={isSaving}
            />
            {/* Max Sessions Per Day (Per Tank) */}
            <div className="mt-6">
              <InputField
                label="Max Sessions Per Day (Per Tank)"
                field="sessionsPerDay"
                type="number"
                value={calculatedSessionCount}
                description="Calculated sessions per tank with staggered start times"
                onChange={() => {}}
                disabled={isSaving}
                readOnly={true}
              />
            </div>
            {/* Total Sessions Per Day (All Tanks) */}
            <div className="mt-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${THETA_COLORS.primary}10`, borderLeft: `4px solid ${THETA_COLORS.primary}` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: THETA_COLORS.textLight }}>
                      Total Daily Capacity (All Tanks)
                    </p>
                    <p className="text-3xl font-bold mt-1" style={{ color: THETA_COLORS.primary }}>
                      {calculatedSessionCount * Number(settings.numberOfTanks || 0)} Sessions
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm" style={{ color: THETA_COLORS.textLight }}>
                      {calculatedSessionCount} sessions × {Number(settings.numberOfTanks || 0)} tanks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours Section */}
          <div className="md:col-span-2 rounded-lg p-6 border" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.gray200 }}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold" style={{ color: THETA_COLORS.primaryDark }}>Operating Hours</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InputField
                label="Opening Time (First Tank)"
                field="openTime"
                type="time"
                value={settings.openTime}
                description="When the first tank starts"
                onChange={handleInputChange}
                disabled={isSaving}
              />
              <InputField
                label="Target Closing Time"
                field="closeTime"
                type="time"
                value={settings.closeTime}
                description="Latest time for last session"
                onChange={handleInputChange}
                disabled={isSaving}
              />
              
              {/* 🛑 FIX: Customized block to remove 'API Driven' badge and fix alignment */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold" style={{ color: THETA_COLORS.text }}>
                  Actual Closing Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={calculatedCloseTime}
                    readOnly={true}
                    disabled={isSaving || isAnyLoading}
                    className="w-full py-2.5 border rounded-lg focus:outline-none px-4 opacity-80 cursor-not-allowed"
                    style={{
                      borderColor: THETA_COLORS.gray200,
                      backgroundColor: THETA_COLORS.gray100, 
                      color: THETA_COLORS.text,
                    }}
                  />
                </div>
                <p className="text-xs" style={{ color: THETA_COLORS.textLight }}>
                  When all tanks complete (incl. cleaning)
                </p>
              </div>

              <InputField
                label="Cleaning Buffer"
                field="cleaningBuffer"
                type="number"
                value={settings.cleaningBuffer}
                unit="min"
                description="Time between sessions for cleaning"
                onChange={handleInputChange}
                disabled={isSaving}
              />
            </div>
            
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleReset}
            disabled={isSaving || !hasChanges}
            className="px-6 py-2.5 font-semibold rounded-lg border-2 transition-all duration-200 hover:bg-opacity-50 flex items-center gap-2"
            style={{
              borderColor: THETA_COLORS.gray300,
              color: THETA_COLORS.text,
              backgroundColor: THETA_COLORS.white,
              opacity: hasChanges ? 1 : 0.6,
              cursor: hasChanges ? "pointer" : "not-allowed",
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Revert Changes
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving || isAnyLoading} 
            className="px-8 py-2.5 font-semibold text-white rounded-lg transition-all duration-200 flex items-center gap-2"
            style={{
              backgroundColor: hasChanges && !isSaving && !isAnyLoading ? THETA_COLORS.primary : THETA_COLORS.gray300,
              cursor: hasChanges && !isSaving && !isAnyLoading ? "pointer" : "not-allowed",
              opacity: hasChanges && !isSaving && !isAnyLoading ? 1 : 0.6,
            }}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
      
    </div>
  )
}

export default SystemSettings