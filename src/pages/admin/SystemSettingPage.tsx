import React, { useState } from 'react';
import {
  Settings,
  DollarSign,
  Clock,
  Wrench,
  CalendarClock,
  Save,
  RotateCcw,
  Bath,
  Waves,
} from 'lucide-react';
import apiRequest from '../../core/axios';


const THETA_COLORS = {
  lightestBlue: "#92B8D9",
  lightBlue: "#92B8D9",
  mediumBlue: "#475D73",
  darkBlue: "#233547",
  white: "#FFFFFF",
  bgLight: "#F5F8FC",
  darkGray: "#1a1a1a",
};

type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface DaysOpen {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface Settings {
  float60MinPrice: number;
  float90MinPrice: number;
  packageDealPrice: number;
  addonServicePrice: number;
  maintenanceTime: number;
  cleaningBuffer: number;
  sessionsPerDay: number;
  maxConcurrentSessions: number;
  openTime: string;
  closeTime: string;
  daysOpen: DaysOpen;
}

const SystemSettings = () => {
const [settings, setSettings] = useState<Settings>({
  float60MinPrice: 0,
  float90MinPrice: 0,
  packageDealPrice: 0,
  addonServicePrice: 0,
  maintenanceTime: 0,
  cleaningBuffer: 0,
  sessionsPerDay: 0,
  maxConcurrentSessions: 0,
  openTime: "",
  closeTime: "",
  daysOpen: {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  },
});

  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (field: keyof Settings, value: number | string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setSettings(prev => ({
      ...prev,
      daysOpen: {
        ...prev.daysOpen,
        [day]: !prev.daysOpen[day]
      }
    }));
    setHasChanges(true);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    try {
      const response = await apiRequest.post("/system-settings", settings);

      console.log("Backend Response:", response);

      setSaveSuccess(true);
      setHasChanges(false);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        float60MinPrice: 6500,
        float90MinPrice: 9500,
        packageDealPrice: 25000,
        addonServicePrice: 2500,
        maintenanceTime: 30,
        cleaningBuffer: 15,
        sessionsPerDay: 8,
        maxConcurrentSessions: 3,
        openTime: '09:00',
        closeTime: '21:00',
        daysOpen: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        }
      });
      setHasChanges(false);
      setSaveSuccess(false);
    }
  };

  return (
    <div style={{ backgroundColor: THETA_COLORS.bgLight }} className="min-h-screen">
      <div className="w-full mx-auto p-6 md:p-10 max-w-6xl">
        {/* Header */}
        <header className="mb-12 relative">
          <div className="relative z-10">
            <div className="flex items-end gap-4 mb-3">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${THETA_COLORS.lightBlue}25` }}>
                <Settings className="w-8 h-8" style={{ color: THETA_COLORS.darkBlue }} />
              </div>
              <h1 className="text-5xl font-serif font-bold leading-tight" style={{ color: THETA_COLORS.darkBlue }}>
                System Settings
              </h1>
            </div>
            <p
              className="text-base font-display font-bold uppercase tracking-wider ml-16"
              style={{ color: THETA_COLORS.lightBlue }}
            >
              Configure Your Theta Lounge Operations
            </p>
          </div>
        </header>

        {/* Save Bar */}
        {hasChanges && (
          <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-800">
              You have unsaved changes
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all duration-200"
                style={{
                  borderColor: THETA_COLORS.mediumBlue,
                  color: THETA_COLORS.mediumBlue,
                  backgroundColor: 'white'
                }}
              >
                <RotateCcw className="w-4 h-4 inline mr-2" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: THETA_COLORS.darkBlue }}
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
            <p className="text-sm font-semibold text-green-800">
              ✓ Settings saved successfully!
            </p>
          </div>
        )}

        {/* Tank Pricing Section */}
        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${THETA_COLORS.lightBlue}20` }}>
              <DollarSign className="w-6 h-6" style={{ color: THETA_COLORS.darkBlue }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: THETA_COLORS.lightBlue }}>
                Pricing
              </p>
              <h2 className="text-2xl font-serif font-bold" style={{ color: THETA_COLORS.darkBlue }}>
                Tank Default Prices
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  60 Minute Float Session
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">LKR</span>
                  <input
                    type="number"
                    value={settings.float60MinPrice}
                    onChange={(e) => handleInputChange('float60MinPrice', Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                    style={{ borderColor: THETA_COLORS.lightBlue }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  90 Minute Float Session
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">LKR</span>
                  <input
                    type="number"
                    value={settings.float90MinPrice}
                    onChange={(e) => handleInputChange('float90MinPrice', Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                    style={{ borderColor: THETA_COLORS.lightBlue }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Package Deal (5 Sessions)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">LKR</span>
                  <input
                    type="number"
                    value={settings.packageDealPrice}
                    onChange={(e) => handleInputChange('packageDealPrice', Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                    style={{ borderColor: THETA_COLORS.lightBlue }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Add-on Service
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">LKR</span>
                  <input
                    type="number"
                    value={settings.addonServicePrice}
                    onChange={(e) => handleInputChange('addonServicePrice', Number(e.target.value))}
                    className="w-full pl-14 pr-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                    style={{ borderColor: THETA_COLORS.lightBlue }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Maintenance Time Section */}
        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${THETA_COLORS.lightBlue}20` }}>
              <Wrench className="w-6 h-6" style={{ color: THETA_COLORS.darkBlue }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: THETA_COLORS.lightBlue }}>
                Operations
              </p>
              <h2 className="text-2xl font-serif font-bold" style={{ color: THETA_COLORS.darkBlue }}>
                Maintenance & Cleaning
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Maintenance Time Between Sessions (minutes)
                </label>
                <input
                  type="number"
                  value={settings.maintenanceTime}
                  onChange={(e) => handleInputChange('maintenanceTime', Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                  style={{ borderColor: THETA_COLORS.lightBlue }}
                />
                <p className="text-xs mt-2 text-gray-500">Time required to clean and prepare tank</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Cleaning Buffer Time (minutes)
                </label>
                <input
                  type="number"
                  value={settings.cleaningBuffer}
                  onChange={(e) => handleInputChange('cleaningBuffer', Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                  style={{ borderColor: THETA_COLORS.lightBlue }}
                />
                <p className="text-xs mt-2 text-gray-500">Additional buffer for deep cleaning</p>
              </div>
            </div>
          </div>
        </section>

        {/* Session Settings Section */}
        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${THETA_COLORS.lightBlue}20` }}>
              <Bath className="w-6 h-6" style={{ color: THETA_COLORS.darkBlue }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: THETA_COLORS.lightBlue }}>
                Capacity
              </p>
              <h2 className="text-2xl font-serif font-bold" style={{ color: THETA_COLORS.darkBlue }}>
                Session Configuration
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Sessions Per Day (Per Tank)
                </label>
                <input
                  type="number"
                  value={settings.sessionsPerDay}
                  onChange={(e) => handleInputChange('sessionsPerDay', Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                  style={{ borderColor: THETA_COLORS.lightBlue }}
                />
                <p className="text-xs mt-2 text-gray-500">Maximum bookings per tank daily</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Max Concurrent Sessions
                </label>
                <input
                  type="number"
                  value={settings.maxConcurrentSessions}
                  onChange={(e) => handleInputChange('maxConcurrentSessions', Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                  style={{ borderColor: THETA_COLORS.lightBlue }}
                />
                <p className="text-xs mt-2 text-gray-500">Number of tanks available simultaneously</p>
              </div>
            </div>
          </div>
        </section>

        {/* Operating Hours Section */}
        <section className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${THETA_COLORS.lightBlue}20` }}>
              <Clock className="w-6 h-6" style={{ color: THETA_COLORS.darkBlue }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: THETA_COLORS.lightBlue }}>
                Schedule
              </p>
              <h2 className="text-2xl font-serif font-bold" style={{ color: THETA_COLORS.darkBlue }}>
                Operating Hours
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Opening Time
                </label>
                <input
                  type="time"
                  value={settings.openTime}
                  onChange={(e) => handleInputChange('openTime', e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                  style={{ borderColor: THETA_COLORS.lightBlue }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Closing Time
                </label>
                <input
                  type="time"
                  value={settings.closeTime}
                  onChange={(e) => handleInputChange('closeTime', e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-opacity-50 transition-colors"
                  style={{ borderColor: THETA_COLORS.lightBlue }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-4" style={{ color: THETA_COLORS.mediumBlue }}>
                Operating Days
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {(Object.keys(settings.daysOpen) as DayOfWeek[]).map((day) => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className="px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 border-2"
                    style={{
                      backgroundColor: settings.daysOpen[day] ? THETA_COLORS.darkBlue : 'white',
                      color: settings.daysOpen[day] ? 'white' : THETA_COLORS.mediumBlue,
                      borderColor: settings.daysOpen[day] ? THETA_COLORS.darkBlue : THETA_COLORS.lightBlue,
                    }}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 font-semibold rounded-lg border-2 transition-all duration-200 hover:shadow-lg"
            style={{
              borderColor: THETA_COLORS.mediumBlue,
              color: THETA_COLORS.mediumBlue,
              backgroundColor: 'white'
            }}
          >
            <RotateCcw className="w-5 h-5 inline mr-2" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 font-semibold text-white rounded-lg transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: THETA_COLORS.darkBlue }}
          >
            <Save className="w-5 h-5 inline mr-2" />
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;