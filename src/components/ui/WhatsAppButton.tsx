import React from 'react';

const PHONE_NUMBER = '9027997165';

const normalizePhone = (raw: string) => {
    if (!raw) return '';
    // Keep only digits
    let digits = String(raw).replace(/\D/g, '');

    // If number has exactly 10 digits, assume it's a local Indian number and prepend country code 91
    if (digits.length === 10) {
        digits = '91' + digits;
    }

    // If number starts with leading zeros, remove them
    digits = digits.replace(/^0+/, '');

    return digits;
};

const WhatsAppButton: React.FC = () => {
    const normalized = normalizePhone(PHONE_NUMBER);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!normalized || !/^\d{8,15}$/.test(normalized)) {
            // invalid number - open WhatsApp homepage to avoid broken deeplink
            window.open('https://www.whatsapp.com/', '_blank', 'noreferrer');
            console.warn('WhatsApp: invalid phone number configured:', PHONE_NUMBER);
            return;
        }

        const href = `https://wa.me/${normalized}`;
        // open in new tab/window
        window.open(href, '_blank', 'noopener,noreferrer');
    };

    return (
        <button
            onClick={handleClick}
            aria-label="Chat on WhatsApp"
            className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-30 focus:outline-none"
            title="Chat on WhatsApp"
        >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6 md:w-7 md:h-7">
                    <path d="M20.52 3.48A11.9 11.9 0 0012 0C5.373 0 .01 5.373 0 12c0 2.116.553 4.18 1.6 6.027L0 24l6.205-1.592A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12 0-3.206-1.246-6.217-3.48-8.52zM12 22c-1.76 0-3.487-.45-5.02-1.305l-.36-.21-3.688.947.986-3.597-.234-.366A9.969 9.969 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10S17.514 22 12 22z" />
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.198.297-.768.967-.942 1.166-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.672-1.62-.921-2.219-.242-.583-.487-.504-.672-.513l-.573-.01c-.198 0-.52.074-.794.372s-1.04 1.016-1.04 2.479 1.064 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487 3.01 1.29 3.01.861 3.554.808.143-.05.297-.148.428-.297.134-.149.472-.568.538-1.116.066-.548-.066-1.03-.364-1.179z" />
                </svg>
            </div>
        </button>
    );
};

export default WhatsAppButton;
