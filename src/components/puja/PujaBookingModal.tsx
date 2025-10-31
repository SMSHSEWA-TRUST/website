import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import PujaBookingMobile from './PujaBookingMobile';
import { getEvents, EventItem } from '@/services/events.service';
import PujaBookingReview from './PujaBookingReview';
import PoojaBookingConfirmation from './PoojaBookingConfirmation';
import { PoojaItem } from '@/services/pooja.service';

interface PujaBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedPooja?: PoojaItem | null;
}



export default function PujaBookingModal({ isOpen, onClose, selectedPooja }: PujaBookingModalProps) {
    const [selectedPujaType, setSelectedPujaType] = useState<string>('purnima');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); // Default to current month/year
    const [sameAsAccount, setSameAsAccount] = useState<boolean>(false);
    const [showReview, setShowReview] = useState<boolean>(false);
    const [customTime, setCustomTime] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [confirmationData, setConfirmationData] = useState<any | null>(null);

    const [formData, setFormData] = useState({
        fullName: '',
        gotra: '',
        nakshatra: '',
        sankalp: '',
        numberOfMembers: '',
        email: '',
        mobile: '',
        alternateMobile: '',
        address: '',
        pujaTypeDetails: '',
        specialRequests: '',
        prasadDelivery: 'yes',
        personalizedMessage: '',
    });

    // Get user data from localStorage - parse once and memoize
    const [registeredUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });

    // Handle "Same as account" checkbox
    useEffect(() => {
        if (sameAsAccount && registeredUser) {
            setFormData(prev => ({
                ...prev,
                fullName: registeredUser.name || '',
                email: registeredUser.email || '',
                mobile: registeredUser.phone || '',
                address: registeredUser.address || '',
            }));
        } else if (!sameAsAccount) {
            // Clear the fields when unchecked (optional - you can remove this if you want to keep the values)
            setFormData(prev => ({
                ...prev,
                fullName: '',
                email: '',
                mobile: '',
                address: '',
            }));
        }
    }, [sameAsAccount, registeredUser]);

    // Reset form when modal opens or selectedPooja changes
    useEffect(() => {
        if (isOpen) {
            setSelectedPujaType('purnima');
            setSelectedDate(null);
            setCurrentMonth(new Date());
            setSameAsAccount(false);
            setShowReview(false);
            setCustomTime('');
            setFormData({
                fullName: '',
                gotra: '',
                nakshatra: '',
                sankalp: '',
                numberOfMembers: '',
                email: '',
                mobile: '',
                alternateMobile: '',
                address: '',
                pujaTypeDetails: selectedPooja?.title || '',
                specialRequests: '',
                prasadDelivery: 'yes',
                personalizedMessage: '',
            });
        }
    }, [isOpen, selectedPooja]);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Set pooja name/title by default when selectedPooja changes
    useEffect(() => {
        if (selectedPooja && selectedPooja.title) {
            setFormData(prev => ({
                ...prev,
                pujaTypeDetails: selectedPooja.title
            }));
        }
    }, [selectedPooja]);

    // State for events fetched from API
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
    const [eventsError, setEventsError] = useState<string | null>(null);

    // Fetch events on mount
    useEffect(() => {
        setLoadingEvents(true);
        getEvents()
            .then((res) => {
                setEvents(res.data || []);
                setEventsError(null);
            })
            .catch(() => {
                setEventsError('Failed to load events');
                setEvents([]);
            })
            .finally(() => setLoadingEvents(false));
    }, []);

    const pujaTypes = [
        { id: 'purnima', label: 'Purnima Pooja', color: 'bg-[#D2691E]' },
        { id: 'special', label: 'Special Pooja', color: 'bg-[#FFA500]' },
        { id: 'verySpecial', label: 'Very Special Pooja', color: 'bg-[#4169E1]' },
        { id: 'veryVerySpecial', label: 'Very Very Special Pooja', color: 'bg-[#32CD32]' }
    ];

    // Calendar functions
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add previous month's days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, isPast: true });
        }

        // Add current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            const thisDate = new Date(year, month, i, 23, 59, 59, 999);
            const now = new Date();
            // Only allow today or future dates
            const isPast = thisDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            days.push({ day: i, isCurrentMonth: true, isPast });
        }

        // Add next month's days to complete the grid
        const remainingDays = 42 - days.length; // 6 rows * 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({ day: i, isCurrentMonth: false, isPast: true });
        }

        return days;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number, isCurrentMonth: boolean, isPast: boolean) => {
        if (isCurrentMonth && !isPast) {
            const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            setSelectedDate(newDate);
            // Reset time when date changes
            setCustomTime('');
        }
    };

    const isDateSelected = (day: number, isCurrentMonth: boolean) => {
        if (!selectedDate || !isCurrentMonth) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', {
            pujaType: selectedPujaType,
            selectedDate,
            selectedTimeSlot: customTime,
            ...formData
        });
        // Open review page
        setShowReview(true);
    };

    const handleCloseReview = () => {
        setShowReview(false);
        onClose();
    };

    const handleBackFromReview = () => {
        setShowReview(false);
    };

    if (!isOpen) return null;


    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Filter events for the current selected month using scheduleDate
    let filteredEvents: EventItem[] = [];
    if (Array.isArray(events)) {
        filteredEvents = events.filter((event: EventItem) => {
            const dateStr = (event as any).scheduleDate || event.date;
            if (!dateStr) return false;
            const eventDate = new Date(dateStr);
            if (isNaN(eventDate.getTime())) return false;
            return eventDate.getMonth() === currentMonth.getMonth() && eventDate.getFullYear() === currentMonth.getFullYear();
        });
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header (hidden on small screens - mobile component shows its own header) */}
                <div className="hidden lg:flex sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Pooja Booking</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Desktop / Tablet layout (hidden on small) */}
                <div className="hidden lg:flex flex-col lg:flex-row gap-8 p-6">
                    {/* Left Side - Calendar & Events */}
                    <div className=" space-y-6 w-[35%]">
                        {/* Pooja Type Selection - 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {pujaTypes.map((type) => (
                                <label
                                    key={type.id}
                                    className="flex items-center cursor-pointer group"
                                >
                                    <div className="relative flex items-center">
                                        <input
                                            type="radio"
                                            name="pujaType"
                                            value={type.id}
                                            checked={selectedPujaType === type.id}
                                            onChange={(e) => setSelectedPujaType(e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full ${type.color} flex items-center justify-center`}>
                                            {selectedPujaType === type.id && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                    </div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">{type.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Calendar */}
                        <div className="bg-[#AD2F16] rounded-xl p-3 text-white">
                            {/* Calendar Header */}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </h3>
                                <div className="flex gap-0.5">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-0.5 hover:bg-white/20 rounded transition-colors"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-0.5 hover:bg-white/20 rounded transition-colors"
                                    >
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Week Days */}
                            <div className="grid grid-cols-7 gap-0.5 mb-1">
                                {weekDays.map((day) => (
                                    <div key={day} className="text-center text-[10px] font-medium py-0.5">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-0.5">
                                {getDaysInMonth(currentMonth).map((item, index) => {
                                    const isSelected = isDateSelected(item.day, item.isCurrentMonth);
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleDateClick(item.day, item.isCurrentMonth, item.isPast)}
                                            className={`
                                                aspect-square flex items-center justify-center rounded text-[10px] font-medium
                                                transition-all duration-200 min-w-[24px] min-h-[24px]
                                                ${item.isCurrentMonth ? 'text-white hover:bg-[#8B0000]/30' : 'text-white/40'}
                                                ${isSelected ? 'bg-[#8B0000] text-white font-bold' : ''}
                                                ${item.isPast ? 'opacity-40 cursor-not-allowed' : ''}
                                            `}
                                            disabled={item.isPast}
                                        >
                                            {item.day}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slot Selection - Shows only when date is selected */}
                        {selectedDate && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Select Time
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter Time
                                        {selectedDate && (() => {
                                            const now = new Date();
                                            if (
                                                selectedDate.getFullYear() === now.getFullYear() &&
                                                selectedDate.getMonth() === now.getMonth() &&
                                                selectedDate.getDate() === now.getDate()
                                            ) {
                                                const pad = (n: number) => n.toString().padStart(2, '0');
                                                const currentTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
                                                return (
                                                    <span className="text-xs text-orange-600 ml-2">
                                                        (Available from {currentTime} onwards)
                                                    </span>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </label>
                                    <input
                                        type="time"
                                        value={customTime}
                                        onChange={(e) => {
                                            const selectedTime = e.target.value;
                                            if (!selectedDate) {
                                                setCustomTime(selectedTime);
                                                return;
                                            }

                                            const now = new Date();
                                            // If selected date is today, validate time is not in the past
                                            if (
                                                selectedDate.getFullYear() === now.getFullYear() &&
                                                selectedDate.getMonth() === now.getMonth() &&
                                                selectedDate.getDate() === now.getDate()
                                            ) {
                                                const [hours, minutes] = selectedTime.split(':').map(Number);
                                                const selectedDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
                                                if (selectedDateTime <= now) {
                                                    // Don't allow past times for today - clear the input
                                                    setCustomTime('');
                                                    return;
                                                }
                                            }
                                            setCustomTime(selectedTime);
                                        }}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none ${selectedDate && (() => {
                                                const now = new Date();
                                                return selectedDate.getFullYear() === now.getFullYear() &&
                                                    selectedDate.getMonth() === now.getMonth() &&
                                                    selectedDate.getDate() === now.getDate() ? 'bg-orange-50 border-orange-300' : '';
                                            })()
                                            }`}
                                        min={(() => {
                                            if (!selectedDate) return undefined;
                                            const now = new Date();
                                            // If selected date is today, restrict min time to now
                                            if (
                                                selectedDate.getFullYear() === now.getFullYear() &&
                                                selectedDate.getMonth() === now.getMonth() &&
                                                selectedDate.getDate() === now.getDate()
                                            ) {
                                                // Format as HH:MM
                                                const pad = (n: number) => n.toString().padStart(2, '0');
                                                return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
                                            }
                                            return undefined;
                                        })()}
                                        placeholder={selectedDate && (() => {
                                            const now = new Date();
                                            if (
                                                selectedDate.getFullYear() === now.getFullYear() &&
                                                selectedDate.getMonth() === now.getMonth() &&
                                                selectedDate.getDate() === now.getDate()
                                            ) {
                                                const pad = (n: number) => n.toString().padStart(2, '0');
                                                return `From ${pad(now.getHours())}:${pad(now.getMinutes())} onwards`;
                                            }
                                            return '';
                                        })()}
                                    />
                                </div>

                                {/* Display selected time */}
                                {customTime && (
                                    <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            Selected Time: <span className="font-semibold text-gray-900">
                                                {customTime}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Upcoming Events */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h3>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {loadingEvents ? (
                                    <div className="text-gray-500">Loading events...</div>
                                ) : eventsError ? (
                                    <div className="text-red-500">{eventsError}</div>
                                ) : filteredEvents.length === 0 ? (
                                    <div className="text-gray-500">No events for this month.</div>
                                ) : (
                                    filteredEvents.map((event) => {
                                        const dateStr = (event as any).scheduleDate || event.date;
                                        const eventDate = dateStr ? new Date(dateStr) : null;
                                        const formattedDate = eventDate && !isNaN(eventDate.getTime())
                                            ? eventDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : '';
                                        return (
                                            <div key={event._id || event.id} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                                <img
                                                    src={event.imageUrl || event.image || '/api/placeholder/80/80'}
                                                    alt={event.title}
                                                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 mb-1">{event.title}</h4>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{formattedDate}</span>
                                                        </div>
                                                        {event.time && (
                                                            <div className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                <span>{event.time}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="flex-1 space-y-6">
                        {/* Basic Details */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Basic Details</h3>
                                {registeredUser && (
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={sameAsAccount}
                                            onChange={(e) => setSameAsAccount(e.target.checked)}
                                            className="mr-2 w-4 h-4 text-[#8B0000] border-gray-300 rounded focus:ring-[#8B0000]"
                                        />
                                        <span className="text-sm text-gray-600">Same as this account</span>
                                    </label>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Gotra</label>
                                    <select
                                        name="gotra"
                                        value={formData.gotra}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    >
                                        <option value="">Select Gotra</option>
                                        <option value="Bharadwaj">Bharadwaj</option>
                                        <option value="Kashyap">Kashyap</option>
                                        <option value="Vashishth">Vashishth</option>
                                        <option value="Gautam">Gautam</option>
                                        <option value="Jamadagni">Jamadagni</option>
                                        <option value="Vishwamitra">Vishwamitra</option>
                                        <option value="Atri">Atri</option>
                                        <option value="Agastya">Agastya</option>
                                        <option value="Bhrigu">Bhrigu</option>
                                        <option value="Angiras">Angiras</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nakshatra</label>
                                    <select
                                        name="nakshatra"
                                        value={formData.nakshatra}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    >
                                        <option value="">Select Nakshatra</option>
                                        <option value="Ashwini">Ashwini</option>
                                        <option value="Bharani">Bharani</option>
                                        <option value="Krittika">Krittika</option>
                                        <option value="Rohini">Rohini</option>
                                        <option value="Mrigashira">Mrigashira</option>
                                        <option value="Ardra">Ardra</option>
                                        <option value="Punarvasu">Punarvasu</option>
                                        <option value="Pushya">Pushya</option>
                                        <option value="Ashlesha">Ashlesha</option>
                                        <option value="Magha">Magha</option>
                                        <option value="Purva Phalguni">Purva Phalguni</option>
                                        <option value="Uttara Phalguni">Uttara Phalguni</option>
                                        <option value="Hasta">Hasta</option>
                                        <option value="Chitra">Chitra</option>
                                        <option value="Swati">Swati</option>
                                        <option value="Vishaka">Vishaka</option>
                                        <option value="Anuradha">Anuradha</option>
                                        <option value="Jyeshtha">Jyeshtha</option>
                                        <option value="Mula">Mula</option>
                                        <option value="Purva Ashadha">Purva Ashadha</option>
                                        <option value="Uttara Ashadha">Uttara Ashadha</option>
                                        <option value="Shravana">Shravana</option>
                                        <option value="Dhanishta">Dhanishta</option>
                                        <option value="Shatabhisha">Shatabhisha</option>
                                        <option value="Purva Bhadrapada">Purva Bhadrapada</option>
                                        <option value="Uttara Bhadrapada">Uttara Bhadrapada</option>
                                        <option value="Revati">Revati</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sankalp</label>
                                    <select
                                        name="sankalp"
                                        value={formData.sankalp}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    >
                                        <option value="">Select Sankalp</option>
                                        <option value="Kamya Karma">Kamya Karma</option>
                                        <option value="Nitya Karma">Nitya Karma</option>
                                        <option value="Prayaschitta Karma">Prayaschitta Karma</option>
                                        <option value="Ishti Karma">Ishti Karma</option>
                                        <option value="Paushti Karma">Paushti Karma</option>
                                        <option value="Abhichara Karma">Abhichara Karma</option>
                                        <option value="Shanti Karma">Shanti Karma</option>
                                        <option value="Pushti Karma">Pushti Karma</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Members</label>
                                    <input
                                        type="text"
                                        name="numberOfMembers"
                                        value={formData.numberOfMembers}
                                        onChange={handleInputChange}
                                        placeholder="No. of Members"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="example@gmail.com"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No.</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="+91 9876543210"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Mobile No.</label>
                                    <input
                                        type="tel"
                                        name="alternateMobile"
                                        value={formData.alternateMobile}
                                        onChange={handleInputChange}
                                        placeholder="+91 9876543210"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address*</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Lincoln Street, Park Avenue, Bangalore"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pooja Details */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Pooja Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pooja Type</label>
                                    <input
                                        type="text"
                                        name="pujaTypeDetails"
                                        value={formData.pujaTypeDetails}
                                        onChange={handleInputChange}
                                        placeholder="Full Name"
                                        readOnly
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleInputChange}
                                        placeholder="Write Special requests here"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prasad Delivery */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Prasad Delivery</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                (for those who want to offer virtual puja, delivery charges applied extra.)
                            </p>
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-3">
                                    Do you want the Prasadam to be delivered at your address?
                                </p>
                                <div className="flex gap-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="prasadDelivery"
                                            value="yes"
                                            checked={formData.prasadDelivery === 'yes'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-[#8B0000] border-gray-300 focus:ring-[#8B0000]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Yes</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="prasadDelivery"
                                            value="no"
                                            checked={formData.prasadDelivery === 'no'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-[#8B0000] border-gray-300 focus:ring-[#8B0000]"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">No</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Personalized Message (optional)
                                </label>
                                <textarea
                                    name="personalizedMessage"
                                    value={formData.personalizedMessage}
                                    onChange={handleInputChange}
                                    placeholder="Write message here"
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none resize-none"
                                />
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-[#8B0000] hover:bg-[#6B1028] text-white py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Continue
                        </button>
                    </div>
                </div>

                {/* Mobile layout: show mobile-specific stepper component */}
                <div className="lg:hidden">
                    <PujaBookingMobile onClose={onClose} selectedPooja={selectedPooja} />
                </div>
            </div>

            {/* Review Modal */}
            <PujaBookingReview
                isOpen={showReview}
                onClose={handleCloseReview}
                onBack={handleBackFromReview}
                onBookingSuccess={(mappedBooking) => {
                    const finalBooking = {
                        ...mappedBooking,
                        pujaImage: mappedBooking.pujaImage || selectedPooja?.image || selectedPooja?.images?.[0] || '',
                        pujaDescription: mappedBooking.pujaDescription || selectedPooja?.description || ''
                    };
                    setConfirmationData(finalBooking);
                    setShowConfirmation(true);
                    setShowReview(false);
                }}
                bookingData={{
                    selectedPujaType,
                    selectedDate,
                    selectedTimeSlot: customTime,
                    ...formData
                }}
                pujaTypeId={selectedPooja?._id || ''}
                amount={selectedPooja?.price || 0}
            />

            {showConfirmation && (
                <PoojaBookingConfirmation
                    isOpen={showConfirmation}
                    onClose={() => {
                        setShowConfirmation(false);
                        onClose();
                    }}
                    bookingData={confirmationData || {
                        pujaType: formData.pujaTypeDetails || selectedPooja?.title || '',
                        pujaDescription: selectedPooja?.description || '',
                        pujaImage: selectedPooja?.image || selectedPooja?.images?.[0] || '',
                        bookingId: '',
                        pujaDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
                        timeSlot: customTime || '',
                        numberOfPeople: parseInt(formData.numberOfMembers || '1') || 1,
                        includesPreshad: formData.prasadDelivery === 'yes',
                        userName: formData.fullName || '',
                        phoneNumber: formData.mobile || '',
                        bookingDate: new Date().toLocaleDateString(),
                        bookingTime: new Date().toLocaleTimeString(),
                    }}
                />
            )}
        </div>
    );
}
