import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import PujaBookingMobile from '@/components/puja/PujaBookingMobile';
import { getEvents, EventItem } from '@/services/events.service';
import { PoojaItem } from '@/services/pooja.service';

interface PujaBookingPageProps {
    selectedPooja?: PoojaItem | null;
}

export default function PujaBookingPage({ selectedPooja: propSelectedPooja }: PujaBookingPageProps = {}) {
    const navigate = useNavigate();
    const location = useLocation();

    // derive user name for header (same logic as in PujaBookingsHistory)
    let userName = 'Guest';
    try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed.name === 'string' && parsed.name.trim().length > 0) userName = parsed.name;
        }
    } catch (e) {
        // ignore
    }

    // Get selectedPooja from location state or props
    const selectedPooja = (location.state as any)?.selectedPooja || propSelectedPooja;

    // State to hold restored booking data
    const [restoredBookingData, setRestoredBookingData] = useState<any>(null);

    // Restore booking data from location state if available
    useEffect(() => {
        const state = location.state as any;
        if (state?.bookingData) {
            const bookingData = state.bookingData;
            setSelectedPujaType(bookingData.selectedPujaType || 'purnima');
            // bookingData.selectedDate may be a Date or an ISO string depending on navigation serialization
            const restoredDate = bookingData.selectedDate
                ? (bookingData.selectedDate instanceof Date ? bookingData.selectedDate : new Date(bookingData.selectedDate))
                : null;
            setSelectedDate(restoredDate);
            setCustomTime(bookingData.selectedTimeSlot || '');
            setFormData({
                fullName: bookingData.fullName || '',
                gotra: bookingData.gotra || '',
                nakshatra: bookingData.nakshatra || '',
                sankalp: bookingData.sankalp || '',
                numberOfMembers: bookingData.numberOfMembers || '',
                email: bookingData.email || '',
                mobile: bookingData.mobile || '',
                alternateMobile: bookingData.alternateMobile || '',
                address: bookingData.address || '',
                pujaTypeDetails: bookingData.pujaTypeDetails || selectedPooja?.title || '',
                specialRequests: bookingData.specialRequests || '',
                prasadDelivery: bookingData.prasadDelivery || 'yes',
                personalizedMessage: bookingData.personalizedMessage || '',
            });
            setRestoredBookingData(bookingData);
        } else {
            setRestoredBookingData(null);
        }
    }, [location.state, selectedPooja]);

    const [selectedPujaType, setSelectedPujaType] = useState<string>('purnima');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); // Default to current month/year
    const [sameAsAccount, setSameAsAccount] = useState<boolean>(false);
    const [customTime, setCustomTime] = useState<string>('');
    const [timeError, setTimeError] = useState<boolean>(false);

    // Validation states
    const [validationErrors, setValidationErrors] = useState({
        selectedDate: '',
        customTime: '',
        fullName: '',
        mobile: '',
        address: '',
        numberOfMembers: ''
    });

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
    // When checked, populate the form from registered user. When unchecked, do NOT automatically clear the fields
    // because that would overwrite restored booking data when navigating back from Review.
    useEffect(() => {
        if (sameAsAccount && registeredUser) {
            setFormData(prev => ({
                ...prev,
                fullName: registeredUser.name || '',
                email: registeredUser.email || '',
                mobile: registeredUser.phone || '',
                address: registeredUser.address || '',
            }));
        }
    }, [sameAsAccount, registeredUser]);

    // Reset form on mount or when selectedPooja changes (only if not restoring from review)
    useEffect(() => {
        const state = location.state as any;
        if (!state?.bookingData) {
            setSelectedPujaType('purnima');
            setSelectedDate(null);
            setCurrentMonth(new Date());
            setSameAsAccount(false);
            setCustomTime('');
            setTimeError(false);
            setValidationErrors({
                selectedDate: '',
                customTime: '',
                fullName: '',
                mobile: '',
                address: '',
                numberOfMembers: ''
            });
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
    }, [selectedPooja, location.state]);

    // Set pooja name/title by default when selectedPooja changes (only if not restoring)
    useEffect(() => {
        const state = location.state as any;
        if (selectedPooja && selectedPooja.title && !state?.bookingData) {
            setFormData(prev => ({
                ...prev,
                pujaTypeDetails: selectedPooja.title
            }));
        }
    }, [selectedPooja, location.state]);

    // Validation functions
    const validateMandatoryFields = () => {
        const errors = {
            selectedDate: '',
            customTime: '',
            fullName: '',
            mobile: '',
            address: '',
            numberOfMembers: ''
        };

        if (!selectedDate) {
            errors.selectedDate = 'Please select a date';
        }

        if (!customTime) {
            errors.customTime = 'Please select a time';
        }

        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
            errors.fullName = 'Name should only contain letters and spaces';
        }

        if (!formData.mobile.trim()) {
            errors.mobile = 'Mobile number is required';
        } else {
            const cleanMobile = formData.mobile.replace(/\s/g, '');
            if (!/^[0-9]{10}$/.test(cleanMobile)) {
                errors.mobile = 'Mobile number must be exactly 10 digits';
            } else if (cleanMobile.startsWith('0')) {
                errors.mobile = 'Mobile number cannot start with 0';
            }
        }

        if (!formData.address.trim()) {
            errors.address = 'Address is required';
        }

        if (!formData.numberOfMembers.trim()) {
            errors.numberOfMembers = 'Number of members is required';
        } else if (!/^[0-9]+$/.test(formData.numberOfMembers.trim())) {
            errors.numberOfMembers = 'Please enter a valid number';
        } else if (parseInt(formData.numberOfMembers) < 1) {
            errors.numberOfMembers = 'Number of members must be at least 1';
        }

        setValidationErrors(errors);
        return Object.values(errors).every(error => error === '');
    };

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
            setTimeError(false);
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
        const { name, value } = e.target;

        // Restrict name field to only letters and spaces
        if (name === 'fullName') {
            const filteredValue = value.replace(/[^a-zA-Z\s]/g, '');
            setFormData({
                ...formData,
                [name]: filteredValue
            });
            return;
        }

        // Restrict mobile fields to only numbers
        if (name === 'mobile' || name === 'alternateMobile') {
            const filteredValue = value.replace(/[^0-9]/g, '');
            // Limit to 10 digits
            if (filteredValue.length <= 10) {
                setFormData({
                    ...formData,
                    [name]: filteredValue
                });
            }
            return;
        }

        // Restrict numberOfMembers to only numbers
        if (name === 'numberOfMembers') {
            const filteredValue = value.replace(/[^0-9]/g, '');
            setFormData({
                ...formData,
                [name]: filteredValue
            });
            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        // Validate all mandatory fields before proceeding
        if (validateMandatoryFields()) {
            console.log('Form submitted:', {
                pujaType: selectedPujaType,
                selectedDate,
                selectedTimeSlot: customTime,
                ...formData
            });
            // Navigate to review page
            handleNavigateToReview();
        }
    };

    const handleNavigateToReview = () => {
        navigate('/puja-booking-review', {
            state: {
                bookingData: {
                    selectedPujaType,
                    selectedDate,
                    selectedTimeSlot: customTime,
                    ...formData
                },
                pujaTypeId: selectedPooja?._id || '',
                amount: selectedPooja?.price || 0
            }
        });
    };

    const handleGoBack = () => {
        navigate('/puja');
    };

    // Helper function for mobile close
    const handleMobileClose = () => {
        navigate('/puja');
    };

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
        <div className="min-h-screen bg-gray-50">
            {/* Page Container */}
            <div className="bg-white min-h-screen px-4 md:px-16  py-4 lg:py-5">
                {/* Header (hidden on small screens - mobile component shows its own header) */}
                <div className='hidden lg:flex flex-col gap-2 mt-2 mb-2'>
                    <header className=" lg:flex sticky top-0 bg-[#FFFFFF]   items-center justify-between border-b md:border-0 ">
                        <div className="flex items-center gap-2 md:gap-4">
                            <button onClick={handleGoBack} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-label="Go back">
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-sm md:text-lg font-medium text-gray-900">Welcome, {userName}</h1>
                                <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </header>

                    <section className="bg-white rounded-lg shadow-sm  overflow-hidden">
                        <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                            <h2 className="text-white text-sm md:text-base font-normal">Pooja Booking</h2>
                        </div>
                    </section>
                </div>


                {/* Desktop / Tablet layout (hidden on small) */}
                <div className="hidden lg:flex flex-col lg:flex-row gap-8 ">
                    {/* Left Side - Calendar & Events */}
                    <div className="space-y-6 w-[35%]">
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
                                        {selectedDate && timeError && (() => {
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
                                                setTimeError(false);
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
                                                    setTimeError(true);
                                                    return;
                                                } else {
                                                    setTimeError(false);
                                                }
                                            } else {
                                                setTimeError(false);
                                            }
                                            setCustomTime(selectedTime);
                                        }}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none ${timeError ? 'bg-orange-50 border-orange-300' : ''}`}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none ${validationErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    />
                                    {validationErrors.fullName && (
                                        <p className="text-red-600 text-xs mt-1">{validationErrors.fullName}</p>
                                    )}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Members *</label>
                                    <input
                                        type="number"
                                        name="numberOfMembers"
                                        value={formData.numberOfMembers}
                                        onChange={handleInputChange}
                                        placeholder="Enter number of members"
                                        min="1"
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none ${validationErrors.numberOfMembers ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    />
                                    {validationErrors.numberOfMembers && (
                                        <p className="text-red-600 text-xs mt-1">{validationErrors.numberOfMembers}</p>
                                    )}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No. *</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="9876543210"
                                        maxLength={10}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none ${validationErrors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    />
                                    {validationErrors.mobile && (
                                        <p className="text-red-600 text-xs mt-1">{validationErrors.mobile}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Mobile No.</label>
                                    <input
                                        type="tel"
                                        name="alternateMobile"
                                        value={formData.alternateMobile}
                                        onChange={handleInputChange}
                                        placeholder="9876543210"
                                        maxLength={10}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Enter your complete address"
                                        rows={3}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-none resize-none ${validationErrors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                    />
                                    {validationErrors.address && (
                                        <p className="text-red-600 text-xs mt-1">{validationErrors.address}</p>
                                    )}
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

                        {/* Validation errors summary */}
                        {(validationErrors.selectedDate || validationErrors.customTime || validationErrors.fullName || validationErrors.mobile || validationErrors.address || validationErrors.numberOfMembers) && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <h4 className="text-red-800 font-semibold mb-2">Please fix the following errors:</h4>
                                <ul className="space-y-1 text-red-600 text-sm">
                                    {validationErrors.selectedDate && <li>• {validationErrors.selectedDate}</li>}
                                    {validationErrors.customTime && <li>• {validationErrors.customTime}</li>}
                                    {validationErrors.fullName && <li>• {validationErrors.fullName}</li>}
                                    {validationErrors.mobile && <li>• {validationErrors.mobile}</li>}
                                    {validationErrors.address && <li>• {validationErrors.address}</li>}
                                    {validationErrors.numberOfMembers && <li>• {validationErrors.numberOfMembers}</li>}
                                </ul>
                            </div>
                        )}

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
                    <PujaBookingMobile onClose={handleMobileClose} selectedPooja={selectedPooja} initialBookingData={restoredBookingData} />
                </div>
            </div>


        </div>
    );
}
