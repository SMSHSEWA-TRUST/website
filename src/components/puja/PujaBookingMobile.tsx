import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { getEvents, EventItem } from '@/services/events.service';
import PujaBookingReview from './PujaBookingReview';
import PoojaBookingConfirmation from './PoojaBookingConfirmation';
import { PoojaItem } from '@/services/pooja.service';

interface Props {
    onClose: () => void;
    selectedPooja?: PoojaItem | null;
}

export default function PujaBookingMobile({ onClose, selectedPooja }: Props) {
    // Steps: 1=Calendar, 2=Basic Details, 3=Contact Details, 4=Other Details, 5=Review
    const [step, setStep] = useState<number>(1);

    const [selectedPujaType, setSelectedPujaType] = useState<string>('purnima');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [sameAsAccount, setSameAsAccount] = useState<boolean>(false);
    const [showReview, setShowReview] = useState<boolean>(false);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [confirmationData, setConfirmationData] = useState<any>(null);
    const [customTime, setCustomTime] = useState<string>('');

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

    // Events for mobile view (show events for selected date/month)
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
    const [eventsError, setEventsError] = useState<string | null>(null);

    const [registeredUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        }
        return null;
    });

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
            setFormData(prev => ({
                ...prev,
                fullName: '',
                email: '',
                mobile: '',
                address: '',
            }));
        }
    }, [sameAsAccount, registeredUser]);

    // Reset form when selectedPooja changes
    useEffect(() => {
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
    }, [selectedPooja]);

    useEffect(() => {
        if (selectedPooja && selectedPooja.title) {
            setFormData(prev => ({ ...prev, pujaTypeDetails: selectedPooja.title }));
        }
    }, [selectedPooja]);

    // Fetch events (lightweight) so mobile can show events for selected date
    useEffect(() => {
        setLoadingEvents(true);
        getEvents()
            .then(res => {
                setEvents(res.data || []);
                setEventsError(null);
            })
            .catch(() => {
                setEvents([]);
                setEventsError('Failed to load events');
            })
            .finally(() => setLoadingEvents(false));
    }, []);

    // (no events fetched in mobile stepper — keep flow lightweight)

    const pujaTypes = [
        { id: 'purnima', label: 'Purnima Pooja' },
        { id: 'special', label: 'Special Pooja' },
        { id: 'verySpecial', label: 'Very Special Pooja' },
        { id: 'veryVerySpecial', label: 'Very Very Special Pooja' }
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: { day: number; isCurrentMonth: boolean; isPast: boolean }[] = [];
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDayOfWeek - 1; i >= 0; i--) days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, isPast: true });
        for (let i = 1; i <= daysInMonth; i++) {
            const thisDate = new Date(year, month, i, 23, 59, 59, 999);
            const now = new Date();
            // Only allow today or future dates
            const isPast = thisDate < new Date(now.getFullYear(), now.getMonth(), now.getDate());
            days.push({ day: i, isCurrentMonth: true, isPast });
        }
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) days.push({ day: i, isCurrentMonth: false, isPast: true });
        return days;
    };

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const handleDateClick = (day: number, isCurrentMonth: boolean, isPast: boolean) => {
        if (isCurrentMonth && !isPast) {
            const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            setSelectedDate(newDate);
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const nextStep = () => setStep(s => Math.min(4, s + 1));
    const prevStep = () => setStep(s => Math.max(1, s - 1));

    const handleSubmit = () => {
        // open review
        setShowReview(true);
    };

    const bookingData = {
        selectedPujaType,
        selectedDate,
        selectedTimeSlot: customTime,
        ...formData
    } as any;

    return (
        <div className="p-4">
            <div className="sticky top-0 bg-white z-20 flex items-center gap-3 mb-4">
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold">Puja Booking</h2>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${step === i ? 'bg-[#8B0000] text-white' : 'bg-gray-100 text-gray-500'}`}>{i}</div>
                        {i < 4 && <div className="w-8 h-[2px] bg-gray-200" />}
                    </div>
                ))}
            </div>

            {/* Step content */}
            <div>
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            {pujaTypes.map((type) => (
                                <label key={type.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                    <input type="radio" name="pujaType" value={type.id} checked={selectedPujaType === type.id} onChange={(e) => setSelectedPujaType(e.target.value)} className="sr-only" />
                                    <div className="w-3 h-3 rounded-full bg-[#8B0000]" />
                                    <div className="text-sm">{type.label}</div>
                                </label>
                            ))}
                        </div>

                        <div className="bg-[#AD2F16] rounded-xl p-3 text-white">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-semibold">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
                                <div className="flex gap-1">
                                    <button onClick={handlePrevMonth} className="p-1"><ChevronLeft className="w-4 h-4" /></button>
                                    <button onClick={handleNextMonth} className="p-1"><ChevronRight className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-0.5 mb-1 text-[10px]">
                                {weekDays.map(d => <div key={d} className="text-center">{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-0.5">
                                {getDaysInMonth(currentMonth).map((item, idx) => (
                                    <button key={idx} onClick={() => handleDateClick(item.day, item.isCurrentMonth, item.isPast)} className={`aspect-square flex items-center justify-center rounded text-[10px] ${item.isCurrentMonth ? 'text-white' : 'text-white/40'} ${isDateSelected(item.day, item.isCurrentMonth) ? 'bg-[#8B0000]' : ''} ${item.isPast ? 'opacity-40 cursor-not-allowed' : ''}`} disabled={item.isPast}>
                                        {item.day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedDate && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2"><Clock className="w-5 h-5" /> Select Time</h3>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
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
                                {customTime && <div className="mt-3 p-3 bg-white rounded-lg border">Selected Time: <span className="font-semibold">{customTime}</span></div>}

                                {/* Events on selected date */}
                                <div className="mt-3">
                                    <h4 className="text-sm font-medium mb-2">Events on this date</h4>
                                    {loadingEvents ? (
                                        <div className="text-sm text-gray-500">Loading events...</div>
                                    ) : eventsError ? (
                                        <div className="text-sm text-red-500">{eventsError}</div>
                                    ) : (
                                        (() => {
                                            const list = (Array.isArray(events) ? events : []).filter(ev => {
                                                const dateStr = (ev as any).scheduleDate || (ev as any).date;
                                                if (!dateStr) return false;
                                                const evDate = new Date(dateStr);
                                                if (isNaN(evDate.getTime())) return false;
                                                return selectedDate && evDate.toDateString() === selectedDate.toDateString();
                                            });

                                            if (list.length === 0) return <div className="text-sm text-gray-500">No events for selected date.</div>;

                                            return (
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {list.map((ev) => {
                                                        const imgSrc = (ev as any).imageUrl || (ev as any).image || '/api/placeholder/80/80';
                                                        return (
                                                            <div key={(ev as any)._id || (ev as any).id || Math.random()} className="flex items-start gap-3 p-2 bg-white rounded border">
                                                                <div className="w-12 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                    <img src={imgSrc as any} alt={(ev as any).title || (ev as any).name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-sm font-medium">{(ev as any).title || (ev as any).name}</div>
                                                                    <div className="text-xs text-gray-500">{(((ev as any).scheduleDate || (ev as any).date) ? new Date(((ev as any).scheduleDate || (ev as any).date)).toLocaleString() : '')}</div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })()
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Upcoming events for the month (mobile) - similar to modal's list */}
                        <div className="mt-3">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Upcoming Events</h3>
                            {loadingEvents ? (
                                <div className="text-sm text-gray-500">Loading events...</div>
                            ) : eventsError ? (
                                <div className="text-sm text-red-500">{eventsError}</div>
                            ) : (
                                (() => {
                                    const safeEvents = Array.isArray(events) ? events : [];
                                    const filtered = safeEvents.filter((ev: EventItem) => {
                                        const dateStr = (ev as any).scheduleDate || (ev as any).date;
                                        if (!dateStr) return false;
                                        const evDate = new Date(dateStr);
                                        if (isNaN(evDate.getTime())) return false;
                                        return evDate.getMonth() === currentMonth.getMonth() && evDate.getFullYear() === currentMonth.getFullYear();
                                    });

                                    if (filtered.length === 0) return <div className="text-sm text-gray-500">No upcoming events this month.</div>;

                                    return (
                                        <div className="space-y-3 max-h-56 overflow-y-auto">
                                            {filtered.slice(0, 6).map((ev: EventItem, idx: number) => {
                                                const dateStr = (ev as any).scheduleDate || (ev as any).date;
                                                const evDate = dateStr ? new Date(dateStr) : null;
                                                const timeStr = (ev as any).time || (ev as any).startTime || '';
                                                const img = (ev as any).imageUrl || (ev as any).image || '/api/placeholder/80/80';
                                                const title = (ev as any).title || (ev as any).name || 'Event';
                                                const desc = (ev as any).description || (ev as any).excerpt || '';

                                                return (
                                                    <div key={(ev as any)._id || (ev as any).id || idx} className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm">
                                                        <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                            {img ? (
                                                                // eslint-disable-next-line @next/next/no-img-element
                                                                <img src={img as any} alt={title as any} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Image</div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
                                                                {evDate && (
                                                                    <div className="text-xs text-gray-500">{evDate.toLocaleDateString()} {timeStr ? ` • ${timeStr}` : ''}</div>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{desc}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button onClick={nextStep} disabled={!selectedDate} className="flex-1 bg-[#8B0000] text-white py-3 rounded">Continue</button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Basic Details</h3>
                            {registeredUser && <label className="flex items-center"><input type="checkbox" checked={sameAsAccount} onChange={(e) => setSameAsAccount(e.target.checked)} className="mr-2" /> Same as this account</label>}
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm">Full Name</label>
                                <input name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm">Gotra</label>
                                <select name="gotra" value={formData.gotra} onChange={handleInputChange} className="w-full px-3 py-2 border rounded">
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
                                <label className="block text-sm">Nakshatra</label>
                                <select name="nakshatra" value={formData.nakshatra} onChange={handleInputChange} className="w-full px-3 py-2 border rounded">
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
                                <label className="block text-sm">Sankalp</label>
                                <select name="sankalp" value={formData.sankalp} onChange={handleInputChange} className="w-full px-3 py-2 border rounded">
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
                                <label className="block text-sm">No. of Members</label>
                                <input name="numberOfMembers" value={formData.numberOfMembers} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={prevStep} className="flex-1 border py-3 rounded">Back</button>
                            <button onClick={nextStep} className="flex-1 bg-[#8B0000] text-white py-3 rounded">Continue</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Contact Details</h3>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm">Email</label>
                                <input name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm">Mobile No*</label>
                                <input name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm">Alternate Mobile No.</label>
                                <input name="alternateMobile" value={formData.alternateMobile} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-sm">Address*</label>
                                <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded resize-none" />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={prevStep} className="flex-1 border py-3 rounded">Back</button>
                            <button onClick={nextStep} className="flex-1 bg-[#8B0000] text-white py-3 rounded">Continue</button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">Other Details</h3>
                        <div>
                            <label className="block text-sm mb-1">Puja Type</label>
                            <input name="pujaTypeDetails" value={formData.pujaTypeDetails} onChange={handleInputChange} readOnly className="w-full px-3 py-2 border rounded bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Special Requests</label>
                            <textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded resize-none" />
                        </div>
                        <div>
                            <p className="text-sm mb-2">Do you want the Prasadam to be delivered at your address?</p>
                            <div className="flex gap-4">
                                <label className="flex items-center"><input type="radio" name="prasadDelivery" value="yes" checked={formData.prasadDelivery === 'yes'} onChange={handleInputChange} className="mr-2" />Yes</label>
                                <label className="flex items-center"><input type="radio" name="prasadDelivery" value="no" checked={formData.prasadDelivery === 'no'} onChange={handleInputChange} className="mr-2" />No</label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Personalized Message (optional)</label>
                            <textarea name="personalizedMessage" value={formData.personalizedMessage} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border rounded resize-none" />
                        </div>

                        <div className="flex gap-2">
                            <button onClick={prevStep} className="flex-1 border py-3 rounded">Back</button>
                            <button onClick={handleSubmit} className="flex-1 bg-[#8B0000] text-white py-3 rounded">Continue</button>
                        </div>
                    </div>
                )}


            </div>

            <PujaBookingReview
                isOpen={showReview}
                onClose={() => { setShowReview(false); onClose(); }}
                onBack={() => setShowReview(false)}
                onBookingSuccess={(booking) => {
                    setConfirmationData(booking);
                    setShowConfirmation(true);
                    setShowReview(false);
                }}
                bookingData={bookingData}
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
                        pujaType: bookingData.pujaTypeDetails || selectedPooja?.title || '',
                        pujaDescription: selectedPooja?.description || '',
                        pujaImage: selectedPooja?.image || selectedPooja?.images?.[0] || '',
                        bookingId: '',
                        pujaDate: bookingData.selectedDate ? new Date(bookingData.selectedDate).toISOString().split('T')[0] : '',
                        timeSlot: bookingData.selectedTimeSlot || '',
                        numberOfPeople: parseInt(bookingData.numberOfMembers || '1') || 1,
                        includesPreshad: bookingData.prasadDelivery === 'yes',
                        userName: bookingData.fullName || '',
                        phoneNumber: bookingData.mobile || '',
                        bookingDate: new Date().toLocaleDateString(),
                        bookingTime: new Date().toLocaleTimeString(),
                    }}
                />
            )}
        </div>
    );
}
