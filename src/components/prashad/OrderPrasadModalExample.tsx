import React, { useState } from 'react';
import OrderPrasadModal, { OrderFormData } from './OrderPrasadModal';

/**
 * Example component showing how to use the OrderPrasadModal
 * This demonstrates how to integrate the modal into your application
 */
const OrderPrasadModalExample: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (formData: OrderFormData) => {
        console.log('Form submitted with data:', formData);

        // Here you can handle the form submission:
        // - Send data to your API
        // - Process payment
        // - Show success message
        // - Close the modal

        // Example API call (uncomment and modify as needed):
        /*
        fetch('/api/order-prasad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setIsModalOpen(false);
            // Show success message to user
        })
        .catch((error) => {
            console.error('Error:', error);
            // Show error message to user
        });
        */

        // For now, just close the modal
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* Example button to open the modal */}
            <button
                onClick={handleOpenModal}
                className="bg-[#8b0000] hover:bg-[#660000] text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg"
            >
                Order Prasad
            </button>

            {/* The modal component */}
            <OrderPrasadModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
};

export default OrderPrasadModalExample;
