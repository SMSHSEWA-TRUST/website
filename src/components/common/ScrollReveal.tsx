import React, { useState, useEffect, useRef, ReactNode } from 'react';

// Define strict types for the props
interface ScrollRevealProps {
    children: ReactNode;
    delay?: string; // e.g., "delay-300"
    direction?: 'up' | 'down' | 'left' | 'right';
    threshold?: number;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
    children,
    delay = "",
    direction = "up",
    threshold = 0.1
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    const directions: Record<string, string> = {
        up: "translate-y-20",
        down: "-translate-y-20",
        left: "-translate-x-20",
        right: "translate-x-20",
    };

    const initialTransform = directions[direction] || "translate-y-20";

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Uncommnet if you want to stop at once animated
                // setIsVisible(true)
                // if (ref.current) observer.unobserve(ref.current);
                setIsVisible(entry.isIntersecting);
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.disconnect();
        };
    }, [threshold]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out transform ${delay} ${isVisible
                ? "opacity-100 translate-x-0 translate-y-0"
                : `opacity-0 ${initialTransform}`
                }`}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;