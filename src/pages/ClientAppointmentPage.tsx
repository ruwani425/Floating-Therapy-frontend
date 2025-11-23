import React, { useState, useMemo } from 'react';
// Removed react-calendar imports
import { Users, Shield ,CalendarCheck, Clock, User, Mail, MessageSquare, AlertTriangle, Send, Info, Tally1, Zap, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';


// --- 1. TypeScript Interfaces & Data ---

// Mock data: A set of dates that have "booked" or "available" slots
const MOCK_DATE_STATUS: Record<string, 'booked' | 'available' | 'full'> = {
    '2025-11-21': 'available', 
    '2025-11-25': 'available',
    '2025-11-27': 'available',
    '2025-11-28': 'full', 
    '2025-12-01': 'available',
    '2025-12-05': 'available',
    '2025-12-06': 'full',
    // Dates for the screenshot's visual (using Nov 2025 as the current month)
    '2025-11-09': 'full', 
    '2025-11-10': 'available', 
    '2025-11-14': 'available', 
    '2025-11-30': 'full', 
};

// Mock slots for a specific date 
const MOCK_SLOTS: string[] = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

// 🆕 Mock Operational Hours (Day of the week 0=Sunday, 6=Saturday)
const MOCK_OPERATIONAL_HOURS: Record<number, string> = {
    0: 'CLOSED', // Sunday
    1: '09:00 - 17:00', // Monday
    2: '09:00 - 17:00', // Tuesday
    3: '09:00 - 17:00', // Wednesday
    4: '09:00 - 17:00', // Thursday
    5: '09:00 - 16:00', // Friday (Slightly shorter)
    6: '10:00 - 14:00', // Saturday (Half Day)
};

// 🔄 Updated Session Status Data Structure 
const MOCK_SESSIONS = (hours: string, dateStatus: string) => [
    { label: 'Available Sessions', value: (dateStatus === 'full' || hours === 'CLOSED' ? '0 slots' : '7 slots'), status: (dateStatus === 'full' || hours === 'CLOSED' ? 'full' : 'available') },
    { label: 'Closed Status', value: (hours === 'CLOSED' || dateStatus === 'full' ? 'Yes' : 'No'), status: (hours === 'CLOSED' || dateStatus === 'full' ? 'full' : 'open') },
    { label: 'Open and Close Time', value: hours, status: 'info' },
    { label: 'Total Session Count', value: '10 sessions', status: 'full' },
];
// ---------------------------------------------

// Palette: 94CCE7, 2DA0CC, 0873A1, 035C84
const THEME_COLORS: { [key: string]: string } = {
    '--theta-blue': '#035C84',       // Dark Blue (Main Action Button/Primary Accent)
    '--theta-blue-dark': '#0873A1',  // Medium Dark Blue (Hover State/Dark Headings)
    '--light-blue-50': '#F0F8FF',    // Very Light Blue (Background/Hover States - slightly lighter than 94CCE7)
    '--light-blue-200': '#94CCE7',   // Light Cyan Blue (Borders/Secondary Light Accent)
    '--theta-red': '#EF4444',        // Red (Error/Warning - kept) 
    '--theta-green': '#10B981',      // Green (Success - kept) 
    '--dark-blue-800': '#003F5C',    // Very Dark Blue (Text/Headings - slightly darker than 035C84 for contrast)
    '--accent-color': '#2DA0CC',     // Accent Cyan Blue (Selected Date/Time Slot selection)
};

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// --- Utility Functions (Kept Unchanged) ---
const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    const startDayOfWeek = firstDay.getDay(); 
    const prevMonth = new Date(year, month, 0);
    for (let i = startDayOfWeek; i > 0; i--) {
        days.unshift(new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i + 1));
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i));
    }

    const remainingSlots = 42 - days.length;
    const nextMonth = new Date(year, month + 1, 1);
    for (let i = 0; i < remainingSlots; i++) {
        days.push(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextMonth.getDate() + i));
    }

    return days;
};

const formatDateToKey = (date: Date): string => date.toISOString().split('T')[0];
const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return date1.toDateString() === date2.toDateString();
};
const isToday = (date: Date): boolean => isSameDay(date, new Date());


// --- 2. Custom Calendar Component (Kept) ---

interface CustomCalendarProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onMonthChange: (date: Date) => void;
    selectedDate: Date | null;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ currentDate, onDateChange, onMonthChange, selectedDate }) => {
    const calendarDays = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        onMonthChange(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        onMonthChange(nextMonth);
    };

    const getTileClass = (date: Date) => {
        const dateKey = formatDateToKey(date);
        const status = MOCK_DATE_STATUS[dateKey];
        const isCurrentMonth = date.getMonth() === currentDate.getMonth();

        let baseClasses = "flex items-center justify-center h-10 w-10 text-center text-sm font-semibold rounded-full transition duration-150 cursor-pointer";

        // Check if the date is in the past
        const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));

        // Dates outside current month or past dates (non-selectable/non-clickable)
        if (!isCurrentMonth || isPastDate) {
            return `${baseClasses} text-gray-400 cursor-not-allowed`; 
        }

        const isSelected = isSameDay(date, selectedDate);
        const isFull = status === 'full';
        const isTodayMarker = isToday(date);
        
        // Check for operational hours (Day 0=Sunday, Day 6=Saturday)
        const dayOfWeek = date.getDay();
        const isClosedForDay = MOCK_OPERATIONAL_HOURS[dayOfWeek] === 'CLOSED';

        if (isSelected) {
            return `${baseClasses} bg-[var(--accent-color)] text-white shadow-lg border-2 border-white`;
        } else if (isTodayMarker) {
            return `${baseClasses} bg-[var(--theta-blue)] text-white shadow-md`;
        } else if (isFull || isClosedForDay) {
            return `${baseClasses} bg-red-500 text-white shadow-md`;
        } else {
            return `${baseClasses} text-gray-700 hover:bg-gray-100`;
        }
    };
    
    return (
        <div className="w-full">
            <div className="flex items-center justify-between px-2 pb-6 text-[var(--dark-blue-800)]">
                <button type="button" onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <ChevronLeft className="w-7 h-7 text-gray-700" />
                </button>
                <h3 className="text-2xl font-semibold">
                    {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button type="button" onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
                    <ChevronRight className="w-7 h-7 text-gray-700" />
                </button>
            </div>

            <div className="grid grid-cols-7 text-center text-gray-500 font-semibold mb-2">
                {WEEKDAYS.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-sm">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                    
                    const isClickable = isCurrentMonth && !isPastDate;

                    return (
                        <div key={index} className="flex items-center justify-center p-1">
                            <button
                                type="button"
                                className={getTileClass(date)}
                                onClick={() => isClickable && onDateChange(date)}
                                disabled={!isClickable}
                            >
                                {date.getDate()}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const EventSidebar: React.FC<{ selectedDate: Date | null }> = ({ selectedDate }) => {
    const mockDefaultDate = new Date(2025, 10, 27); 
    const displayDate = selectedDate || mockDefaultDate; 
    
    const dateKey = formatDateToKey(displayDate);
    const dateStatus = MOCK_DATE_STATUS[dateKey];

    const dateNum = displayDate.getDate().toString().padStart(2, '0');
    const month = displayDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    
    const dayOfWeek = displayDate.getDay();
    const operationalHours = MOCK_OPERATIONAL_HOURS[dayOfWeek] || '09:00 - 17:00'; 

    const isClosedOrFull = dateStatus === 'full' || operationalHours === 'CLOSED';
    
    const dateBoxColor = isClosedOrFull ? THEME_COLORS['--theta-red'] : THEME_COLORS['--accent-color'];

    const sessions = MOCK_SESSIONS(operationalHours, dateStatus || 'unavailable');

    const getStatusColor = (status: 'available' | 'open' | 'info' | 'full') => {
        switch (status) {
            case 'available':
            case 'open':
                return 'text-green-600 border-green-300 bg-green-50'; 
            case 'full':
                return 'text-red-600 border-red-300 bg-red-50';      
            case 'info':
            default:
                return 'text-gray-700'; 
        }
    };

    return (
        <div className="w-full max-w-sm ml-auto space-y-4 pt-1">
            <div className="flex justify-between items-start">
                <div 
                    className="w-20 h-20 flex flex-col items-center justify-center text-white font-bold rounded-lg shadow-xl"
                    style={{ backgroundColor: dateBoxColor }}
                >
                    <span className="text-3xl">{dateNum}</span>
                    <span className="text-sm">{month}</span>
                </div>
                
                <div className="flex items-center pt-1 text-sm">
                    <span className="text-gray-500 mr-1">View:</span>
                    <a href="#" className="font-semibold text-gray-700 hover:text-[var(--accent-color)] transition">All</a>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <p className="text-sm font-bold text-[var(--dark-blue-800)] uppercase">Session Summary</p>
                <div className="border-t border-gray-200 pt-3 space-y-3">
                    {sessions.map((session, index) => (
                        <div key={index} className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 font-medium">{session.label}</p>
                            
                            {session.label === 'Open and Close Time' ? (
                                <p className={`text-base font-semibold ${getStatusColor(session.status as any)}`}>
                                    {session.value}
                                </p>
                            ) : (
                                <p className={`text-base font-semibold px-3 py-1 rounded-lg border ${getStatusColor(session.status as any)}`}>
                                    {session.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const ConsolidatedBookingForm: React.FC = () => {
    // --- State Initialization (Preserved) ---
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 10, 1)); 
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 10, 27)); 
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');
    const [specialNote, setSpecialNote] = useState(''); 
    const [selectedTime, setSelectedTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);


    // --- Handlers (Preserved) ---
    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTime(''); 
    };

    const handleMonthNavigate = (date: Date) => {
        setCurrentMonth(date);
        setSelectedDate(null); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let isValidForBooking = true;
        
        if (selectedDate) {
            const dateKey = formatDateToKey(selectedDate);
            const status = MOCK_DATE_STATUS[dateKey];
            const dayOfWeek = selectedDate.getDay();
            const isClosed = MOCK_OPERATIONAL_HOURS[dayOfWeek] === 'CLOSED';
            
            if (status === 'full' || isClosed) {
                isValidForBooking = false;
                setMessage('The selected date is unavailable for booking. Please choose another date or time.');
            }
        } else {
            isValidForBooking = false;
        }

        if (!selectedTime || !isValidForBooking || !email || !contactNumber) {
            if (!message) { 
                 setMessage('Please select an available date, time, and provide your email and contact number.');
            }
            return;
        }

        setIsSubmitting(true);
        setMessage('Processing your appointment...');
        setSuccessMessage(null);

        await new Promise(resolve => setTimeout(resolve, 2000)); 
        
        setIsSubmitting(false);
        setSuccessMessage(`Appointment confirmed on ${selectedDate!.toLocaleDateString()} at ${selectedTime}. We will contact you at ${contactNumber}.`);
        setMessage(''); 
        
        setSelectedTime('');
        setSelectedDate(null);
    };


    const filteredSlots = useMemo(() => {
        if (!selectedDate) return []; 

        const dateKey = formatDateToKey(selectedDate);
        const status = MOCK_DATE_STATUS[dateKey];
        
        const dayOfWeek = selectedDate.getDay();
        const isClosed = MOCK_OPERATIONAL_HOURS[dayOfWeek] === 'CLOSED';

        if (status === 'full' || isClosed) return [];
        
        return MOCK_SLOTS;
    }, [selectedDate]);

    const inputClass = "input-style";
    
    const CustomStyles = `
        :root {
            --theta-blue: ${THEME_COLORS['--theta-blue']};
            --theta-red: ${THEME_COLORS['--theta-red']};
            --theta-green: ${THEME_COLORS['--theta-green']};
            --light-blue-200: ${THEME_COLORS['--light-blue-200']};
            --light-blue-50: ${THEME_COLORS['--light-blue-50']};
            --dark-blue-800: ${THEME_COLORS['--dark-blue-800']};
            --accent-color: ${THEME_COLORS['--accent-color']};
        }
        
        .input-style {
            width: 100%;
            padding: 0.75rem; 
            border: none;
            border-radius: 0.5rem;
            transition: all 0.15s ease-in-out;
        }
    `;

    return (
        <div className="bg-[var(--light-blue-50)] min-h-screen pt-0"> 
            <style dangerouslySetInnerHTML={{ __html: CustomStyles }} />
            
            <div className="w-full bg-white shadow-2xl rounded-xl py-8 lg:py-12 border border-gray-100 relative overflow-hidden mt-[72px]">
                
                {successMessage && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-10 bg-white/95 backdrop-blur-sm rounded-xl">
                        <CalendarCheck className="w-16 h-16 text-[var(--theta-blue)] mb-4 animate-bounce" />
                        <h2 className="text-4xl font-serif font-bold text-[var(--dark-blue-800)] mb-2">
                            Appointment Confirmed!
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 text-center">{successMessage}</p>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="px-6 py-3 bg-[var(--theta-blue)] text-white rounded-full font-semibold hover:bg-[var(--theta-blue-dark)] transition"
                        >
                            Close
                        </button>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="absolute top-0 right-0 p-4 space-x-4 text-sm font-semibold text-gray-600">
                        <span className="hover:text-[var(--accent-color)] transition cursor-pointer">Meetings</span>
                        <span className="hover:text-[var(--accent-color)] transition cursor-pointer">Events</span>
                        <span className="hover:text-[var(--accent-color)] transition cursor-pointer">Petitions</span>
                    </div>

                    <h1 className="text-4xl font-serif font-bold text-[var(--dark-blue-800)] mb-10 text-center">
                        Make an Appointment
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-10 mb-12 border border-gray-100 rounded-lg shadow-md p-6">
                        
                        <div className="lg:col-span-3 p-4 border-r border-gray-200">
                            <CustomCalendar
                                currentDate={currentMonth}
                                onDateChange={handleDateSelect}
                                onMonthChange={handleMonthNavigate}
                                selectedDate={selectedDate}
                            />
                        </div>

                        <div className="lg:col-span-1 pt-6 lg:pt-0">
                            <EventSidebar selectedDate={selectedDate} />
                        </div>
                    </div>


                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12 pt-8 border-t border-gray-100">
                        
                        <div className="space-y-8">
                            <label className="block text-xl font-semibold text-gray-700 mb-4">
                                Select Available Time
                            </label>

                            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 flex items-center rounded-r-lg shadow-sm">
                                <AlertTriangle className="w-5 h-5 mr-3" />
                                <span className="text-sm font-medium">
                                    All available times are listed in your selected date's time zone.
                                </span>
                            </div>

                            {filteredSlots.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {filteredSlots.map(time => (
                                        <button
                                            type="button"
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`py-2 px-1 rounded-lg text-sm font-semibold transition duration-150 border ${
                                                selectedTime === time
                                                    ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-md'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                            disabled={isSubmitting}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm text-center font-medium">
                                    {selectedDate ? (MOCK_OPERATIONAL_HOURS[selectedDate.getDay()] === 'CLOSED' ? "We are closed on this date." : "No available slots on the selected date.") : "Please select a date."}
                                </div>
                            )}

                            {message && (
                                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium shadow-sm">
                                    {message}
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            
                            <div>
                                <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
                                    Email Address
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-[var(--accent-color)] transition shadow-sm">
                                    <Mail className="w-5 h-5 ml-3 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="name@example.com"
                                        className={`${inputClass} focus:ring-0`}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="contact" className="block text-lg font-semibold text-gray-700 mb-2">
                                    Contact Number
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center border border-gray-300 rounded-lg focus-within:border-[var(--accent-color)] transition shadow-sm">
                                    <User className="w-5 h-5 ml-3 text-gray-400" />
                                    <input
                                        id="contact"
                                        type="tel"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        required
                                        placeholder="(555) 555-5555"
                                        className={`${inputClass} focus:ring-0`}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Special Note Textarea (OPTIONAL) */}
                            <div>
                                <label htmlFor="note" className="block text-lg font-semibold text-gray-700 mb-2">
                                    Special Note (Optional)
                                </label>
                                <div className="flex items-start border border-gray-300 rounded-lg focus-within:border-[var(--accent-color)] transition shadow-sm">
                                    <MessageSquare className="w-5 h-5 ml-3 mt-3 text-gray-400 flex-shrink-0" />
                                    <textarea
                                        id="note"
                                        rows={4}
                                        value={specialNote}
                                        onChange={(e) => setSpecialNote(e.target.value)}
                                        placeholder="E.g., mobility issues, prefer morning session..."
                                        className={`${inputClass} focus:ring-0 resize-none`}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            
                            {/* Submit Button (Uses --theta-blue) */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full px-10 py-3.5 text-lg font-bold rounded-xl transition duration-300 flex items-center justify-center space-x-2 shadow-xl"
                                    // Validation now correctly checks selectedTime, email, and contactNumber
                                    disabled={isSubmitting || !selectedTime || !email || !contactNumber}
                                    style={{
                                        backgroundColor: isSubmitting || !selectedTime || !email || !contactNumber ? THEME_COLORS['--light-blue-200'] : THEME_COLORS['--theta-blue'],
                                        color: isSubmitting || !selectedTime || !email || !contactNumber ? THEME_COLORS['--dark-blue-800'] : 'white',
                                    }}
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    {isSubmitting ? 'Processing...' : 'Get Appointment'}
                                </button>
                            </div>
                        </div>

                    </form>
                    
                    {/* --- Session Details Section --- */}
                    <SessionDetails />
                    
                </div> 
                
            </div>
        </div>
    );
};

const SessionDetails: React.FC = () => (
    <div className="pt-10 mt-12 border-t border-[var(--light-blue-200)] lg:col-span-2">
      <h2 className="text-3xl font-serif font-bold text-[var(--dark-blue-800)] mb-2 flex items-center">
        <CheckCircle className="w-7 h-7 mr-3 text-[var(--theta-green)]" />
        Our Commitment: Capacity, Time & Safety
      </h2>
      <p className="text-gray-600 mb-10 text-base">
        We prioritize quality, focus, and impeccable hygiene to ensure a truly restorative experience
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 pb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48 bg-gradient-to-br from-[var(--light-blue-50)] to-[var(--light-blue-200)] flex items-center justify-center overflow-hidden">
            <img
              src="/person-enjoying-relaxing-one-hour-floating-therapy.jpg"
              alt="Limited capacity floating therapy facility"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[var(--light-blue-50)] rounded-lg">
                <Users className="w-6 h-6 text-[var(--theta-blue)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--theta-blue)]">Limited Daily Capacity</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              We use only 2 specialized machines with a maximum of 20 personalized sessions per day. This ensures a
              low-traffic, serene atmosphere where you can truly relax.
            </p>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-semibold text-[var(--theta-blue)] uppercase">Max 20 Sessions Daily</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48 bg-gradient-to-br from-[var(--light-blue-50)] to-[var(--light-blue-200)] flex items-center justify-center overflow-hidden">
            <img
              src="/person-enjoying-relaxing-one-hour-floating-therapy.jpg"
              alt="Dedicated one hour therapy session"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-[var(--light-blue-50)] rounded-lg">
                <Clock className="w-6 h-6 text-[var(--theta-blue)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--theta-blue)]">Full 1-Hour Sessions</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Each confirmed appointment guarantees you a full 60 minutes of uninterrupted therapy time in your
              dedicated pod. No rushing, no distractions.
            </p>
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs font-semibold text-[var(--theta-blue)] uppercase">60 Minutes Guaranteed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-200 hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center overflow-hidden">
            <img
              src="/person-enjoying-relaxing-one-hour-floating-therapy.jpg"
              alt="Mandatory sanitization and cleaning process"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-[var(--theta-red)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--theta-red)]">Strict Sanitization</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              A mandatory 30-minute deep cleaning break is strictly scheduled after every session to meet the highest
              hygiene and safety standards.
            </p>
            <div className="pt-2 border-t border-red-200">
              <p className="text-xs font-semibold text-[var(--theta-red)] uppercase">30 Min Between Sessions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-gradient-to-r from-[var(--light-blue-50)] to-white rounded-xl border-l-4 border-[var(--theta-blue)]">
        <p className="text-gray-700 text-center font-medium">
          <span className="text-[var(--theta-blue)] font-bold">Your wellness matters.</span> Every detail in our
          facility is designed with your safety, comfort, and rejuvenation in mind.
        </p>
      </div>
    </div>
  )

export default ConsolidatedBookingForm;