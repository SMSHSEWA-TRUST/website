import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shouldShowFamilyDetails, getUserFromStorage } from '../../api/FamilyQueries';

interface FamilyDetailsGuardProps {
    children: React.ReactNode;
    // Optional: skip the check for specific routes
    skipFamilyCheck?: boolean;
}

export const FamilyDetailsGuard: React.FC<FamilyDetailsGuardProps> = ({
    children,
    skipFamilyCheck = false
}) => {
    const navigate = useNavigate();

    useEffect(() => {
        // Skip the family details check if specified
        if (skipFamilyCheck) return;

        // Check if user is logged in
        const authToken = localStorage.getItem('authToken');
        if (!authToken) return; // Not logged in, no need to check

        // Get user data and check if they need to add family details
        const userData = getUserFromStorage();

        if (userData && shouldShowFamilyDetails(userData)) {
            // User is logged in but hasn't added family details
            // Redirect to family details page
            navigate('/family-details', { replace: true });
        }
    }, [navigate, skipFamilyCheck]);

    return <>{children}</>;
};

// Higher-order component version for easier usage
export const withFamilyDetailsGuard = <P extends object>(
    Component: React.ComponentType<P>,
    skipFamilyCheck = false
) => {
    return (props: P) => (
        <FamilyDetailsGuard skipFamilyCheck={skipFamilyCheck}>
            <Component {...props} />
        </FamilyDetailsGuard>
    );
};

export default FamilyDetailsGuard;