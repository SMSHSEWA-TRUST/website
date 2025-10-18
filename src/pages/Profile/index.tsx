import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import statesData from "../../data/states-and-districts.json";
import {
    useGetUserProfile,
    useUpdateUserProfile,
    useGetUserAddresses,
    useAddUserAddress,
    useUpdateUserAddress,
    useDeleteUserAddress
} from "../../api/ProfileQueries";
import {
    useDeleteFamilyMember,
    useUpdateFamilyDetails
} from "../../api/FamilyQueries";
import { AddressModel, AddressPayload, AddressType } from "../../services/profile.service";
import toast from "react-hot-toast";

const ProfilePage = () => {
    const navigate = useNavigate();

    // Fetch user profile from API
    const { data: profileData, isLoading: isLoadingProfile, refetch: refetchProfile } = useGetUserProfile();
    const updateProfileMutation = useUpdateUserProfile();

    // Address hooks - no longer need userId parameter
    const { data: addressesData, isLoading: isLoadingAddresses, refetch: refetchAddresses } = useGetUserAddresses();
    const addAddressMutation = useAddUserAddress();
    const updateAddressMutation = useUpdateUserAddress();
    const deleteAddressMutation = useDeleteUserAddress();

    // Family member hooks
    const deleteFamilyMemberMutation = useDeleteFamilyMember();
    const updateFamilyDetailsMutation = useUpdateFamilyDetails();

    // User state - will be populated from API only
    const [user, setUser] = useState({
        name: "",
        memberId: "#N/A",
        email: "",
        mobile: "",
        fatherName: "",
        motherName: "",
        avatar: "",
        address: "",
    });

    // Family members state - will be populated from API only
    const [familyMembersState, setFamilyMembersState] = useState<any[]>([]);

    // Update user state when profile data changes
    useEffect(() => {
        if (profileData?.data?.user) {
            const userData = profileData.data.user;
            const members = userData?.familyDetails?.members || [];
            const father = members.find((m: any) => String(m.relation || '').toLowerCase() === 'father')?.name || '';
            const mother = members.find((m: any) => String(m.relation || '').toLowerCase() === 'mother')?.name || '';

            setUser({
                name: userData?.name || "",
                memberId: userData?.memberId || userData?._id || "#N/A",
                email: userData?.email || "",
                mobile: userData?.phone || "",
                fatherName: father,
                motherName: mother,
                avatar: userData?.avatar || userData?.profilePicture || "",
                address: userData?.address || "",
            });

            setFamilyMembersState(members.map((member: any, index: number) => ({
                id: member._id || member.id || index + 1,
                _id: member._id || member.id,
                name: member.name || "",
                relation: member.relation || "",
                avatar: "",
            })));
        }
    }, [profileData]);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editableUser, setEditableUser] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        fatherName: user.fatherName,
        motherName: user.motherName,
        address: user.address,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberRelation, setNewMemberRelation] = useState("");
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [addMemberError, setAddMemberError] = useState("");

    // Address modal states
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);
    const [addressForm, setAddressForm] = useState({
        name: "",
        email: "",
        mobile: "",
        addressLine1: "",
        addressLine2: "",
        state: "",
        district: "",
        pincode: "",
        saveAs: "Home" as AddressType
    });
    const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
    // Validation errors for address form
    const [addressErrors, setAddressErrors] = useState<{ [key: string]: string }>({});

    // Simple email regex for validation
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Update districts when state changes
    useEffect(() => {
        if (addressForm.state) {
            const selectedState = statesData.states.find(s => s.state === addressForm.state);
            setAvailableDistricts(selectedState?.districts || []);
        } else {
            setAvailableDistricts([]);
        }
    }, [addressForm.state]);

    const handleAddressFormChange = (field: string, value: string) => {
        // Sanitise numeric inputs
        if (field === 'mobile') {
            // Keep only digits, trim leading zeros, limit to 10 digits
            let digits = String(value || '').replace(/\D/g, '');
            // remove leading zeros
            digits = digits.replace(/^0+/, '');
            if (digits.length > 10) digits = digits.slice(0, 10);

            setAddressForm(prev => ({ ...prev, mobile: digits }));
            setAddressErrors(prev => ({ ...prev, mobile: '' }));
            return;
        }

        if (field === 'pincode') {
            // Keep only digits and limit to 6
            let digits = String(value || '').replace(/\D/g, '');
            if (digits.length > 6) digits = digits.slice(0, 6);
            setAddressForm(prev => ({ ...prev, pincode: digits }));
            setAddressErrors(prev => ({ ...prev, pincode: '' }));
            return;
        }

        // For state change reset district
        setAddressForm(prev => ({
            ...prev,
            [field]: value,
            ...(field === 'state' ? { district: '' } : {})
        }));
        setAddressErrors(prev => ({ ...prev, [field]: '' }));
    };

    const resetAddressForm = () => {
        setAddressForm({
            name: "",
            email: "",
            mobile: "",
            addressLine1: "",
            addressLine2: "",
            state: "",
            district: "",
            pincode: "",
            saveAs: "Home"
        });
        setEditingAddress(null);
    };

    // Parse address string to form fields
    const parseAddressToForm = (address: AddressModel) => {
        const addressParts = address.address.split(', ');

        let addressLine1 = '';
        let addressLine2 = '';
        let district = '';
        let state = '';
        let pincode = '';

        if (addressParts.length === 4) {
            // Format: addressLine1, district, state, pincode
            addressLine1 = addressParts[0] || '';
            district = addressParts[1] || '';
            state = addressParts[2] || '';
            pincode = addressParts[3] || '';
        } else if (addressParts.length >= 5) {
            // Format: addressLine1, addressLine2, district, state, pincode
            addressLine1 = addressParts[0] || '';
            addressLine2 = addressParts[1] || '';
            district = addressParts[2] || '';
            state = addressParts[3] || '';
            pincode = addressParts[4] || '';
        }

        setAddressForm({
            name: address.name || '',
            email: address.email || '',
            mobile: address.phoneNumber || '',
            addressLine1,
            addressLine2,
            state,
            district,
            pincode,
            saveAs: address.type || 'Home'
        });

        // Set districts for the state
        if (state) {
            const selectedState = statesData.states.find(s => s.state === state);
            setAvailableDistricts(selectedState?.districts || []);
        }
    };

    // Open modal for adding new address
    const handleOpenAddAddressModal = () => {
        resetAddressForm();
        setIsAddAddressModalOpen(true);
    };

    // Open modal for editing existing address
    const handleEditAddress = (address: AddressModel) => {
        setEditingAddress(address);
        parseAddressToForm(address);
        setIsAddAddressModalOpen(true);
    };

    // Close address modal
    const handleCloseAddressModal = () => {
        setIsAddAddressModalOpen(false);
        resetAddressForm();
    };

    // Save address (add or update)
    const handleSaveAddress = async () => {
        try {
            // Validation
            const errors: { [k: string]: string } = {};

            if (!addressForm.name.trim()) {
                errors.name = "Please enter name";
            } else if (addressForm.name.trim().length < 2) {
                errors.name = "Name must be at least 2 characters";
            }

            // Mobile: must be 10 digits, cannot start with 0
            const mobile = String(addressForm.mobile || '');
            if (!mobile) {
                errors.mobile = "Please enter mobile number";
            } else if (!/^\d{10}$/.test(mobile)) {
                errors.mobile = "Mobile number must be exactly 10 digits";
            } else if (/^0/.test(mobile)) {
                errors.mobile = "Mobile number cannot start with 0";
            }

            // Email check
            if (!addressForm.email.trim()) {
                errors.email = "Please enter email";
            } else if (!EMAIL_REGEX.test(addressForm.email.trim())) {
                errors.email = "Please enter a valid email";
            }

            if (!addressForm.addressLine1.trim()) {
                errors.addressLine1 = "Please enter address line 1";
            }

            if (!addressForm.state) {
                errors.state = "Please select state";
            }

            if (!addressForm.district) {
                errors.district = "Please select district";
            }

            const pincode = String(addressForm.pincode || '');
            if (!pincode) {
                errors.pincode = "Please enter pincode";
            } else if (!/^\d{6}$/.test(pincode)) {
                errors.pincode = "Pincode must be exactly 6 digits";
            }

            if (Object.keys(errors).length > 0) {
                setAddressErrors(errors);
                // Show first error as toast as well for visibility
                const firstError = errors[Object.keys(errors)[0]];
                toast.error(firstError);
                return;
            }

            // Construct address string
            const addressParts = [
                addressForm.addressLine1.trim(),
                addressForm.addressLine2.trim() ? addressForm.addressLine2.trim() : null,
                addressForm.district,
                addressForm.state,
                addressForm.pincode
            ].filter(Boolean);

            const addressString = addressParts.join(', ');

            const payload: AddressPayload = {
                name: addressForm.name.trim(),
                phoneNumber: addressForm.mobile.trim(),
                email: addressForm.email.trim(),
                address: addressString,
                type: addressForm.saveAs,
                isActive: true,
                isPreferred: false
            };

            if (editingAddress) {
                // Update existing address
                await updateAddressMutation.mutateAsync({
                    addressId: editingAddress._id,
                    payload
                });
                toast.success("Address updated successfully!");
            } else {
                // Add new address
                await addAddressMutation.mutateAsync(payload);
                toast.success("Address added successfully!");
            }

            // Refetch addresses
            await refetchAddresses();

            // Close modal and reset form
            handleCloseAddressModal();

        } catch (error: any) {
            console.error("Error saving address:", error);
            toast.error(error?.response?.data?.message || "Failed to save address. Please try again.");
        }
    };

    // Delete address
    const _handleDeleteAddress = async (addressId: string) => {
        if (!window.confirm("Are you sure you want to delete this address?")) {
            return;
        }

        try {
            await deleteAddressMutation.mutateAsync(addressId);

            toast.success("Address deleted successfully!");
            await refetchAddresses();

        } catch (error: any) {
            console.error("Error deleting address:", error);
            toast.error(error?.response?.data?.message || "Failed to delete address. Please try again.");
        }
    };

    const handleEditClick = () => {
        setIsEditMode(true);
        setEditableUser({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            fatherName: user.fatherName,
            motherName: user.motherName,
            address: user.address,
        });
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditableUser({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            fatherName: user.fatherName,
            motherName: user.motherName,
            address: user.address,
        });
    };

    const handleSaveEdit = async () => {
        try {
            // Call the update profile API with only the payload
            await updateProfileMutation.mutateAsync({
                name: editableUser.name,
                email: editableUser.email,
                phone: editableUser.mobile,
                fatherName: editableUser.fatherName,
                motherName: editableUser.motherName,
                address: editableUser.address,
            });

            setIsEditMode(false);

            // Refetch profile data to get updated information
            await refetchProfile();

            // Reload to reflect all changes
            window.location.reload();
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setEditableUser(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddFamilyMember = async () => {
        // Reset error
        setAddMemberError("");

        // Validation
        if (!newMemberName.trim()) {
            setAddMemberError("Please enter a name");
            return;
        }

        if (!newMemberRelation || newMemberRelation === "") {
            setAddMemberError("Please select a relation");
            return;
        }

        setIsAddingMember(true);

        try {
            // Get user data from API
            const currentUserData = profileData?.data?.user;
            const userId = currentUserData?.id || currentUserData?._id;

            if (!userId) {
                throw new Error("User ID not found. Please login again.");
            }

            // Build payload in the requested shape (only familyDetails.members)
            const payload = {
                familyDetails: {
                    members: [
                        {
                            action: 'add',
                            name: newMemberName.trim(),
                            relation: newMemberRelation
                        }
                    ]
                }
            };


            // Call mutation to update family details with the members array (action: 'add')
            await updateFamilyDetailsMutation.mutateAsync({ userId, payload });

            // Close modal and reset form
            setIsAddMemberModalOpen(false);
            setNewMemberName("");
            setNewMemberRelation("");

            // Show success message
            toast.success("Family member added successfully!");

        } catch (err: any) {
            console.error("Error adding family member:", err);
            setAddMemberError(err?.response?.data?.message || err?.message || "Failed to add family member. Please try again.");
        } finally {
            setIsAddingMember(false);
        }
    };

    // Delete family member
    const handleDeleteFamilyMember = async (memberId: string, memberName: string) => {
        if (!window.confirm(`Are you sure you want to remove ${memberName} from family members?`)) {
            return;
        }

        try {
            // Get user data from API
            const currentUserData = profileData?.data?.user;
            const userId = currentUserData?.id || currentUserData?._id;

            if (!userId) {
                toast.error("User ID not found. Please login again.");
                return;
            }

            // Call API to delete family member with action: 'delete'
            await deleteFamilyMemberMutation.mutateAsync({
                userId,
                memberId
            });

            // Refetch profile to get updated data
            await refetchProfile();

            // Show success message
            toast.success("Family member removed successfully!");

        } catch (error: any) {
            console.error("Error deleting family member:", error);
            toast.error(error?.response?.data?.message || "Failed to remove family member. Please try again.");
        }
    };

    // Show loading state while fetching profile
    if (isLoadingProfile) {
        return (
            <div className="min-h-screen bg-[#FFFFFF] lg:max-w-[1400px] mx-auto flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AD2F16] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] lg:max-w-[1400px] mx-auto">
            {/* Header */}
            <header className="bg-[#FFFFFF] px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b md:border-0">
                <div className="flex items-center gap-2 md:gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        aria-label="Go back"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-sm md:text-lg font-medium text-gray-900">Welcome, {user.name || 'User'}</h1>
                        <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>

                {/* <div className="hidden md:flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-100 rounded-full" aria-label="Notifications">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-blue-600"></div>
                    </div>
                </div> */}
            </header>

            {/* Main Content */}
            <main className="px-4 md:px-6 py-4 md:py-6">
                {/* Profile Details Section */}
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 overflow-hidden">
                    {/* Red Header */}
                    <div className="bg-gradient-to-r from-[#AD2F16] to-[#8B0000] px-4 md:px-6 py-3 md:py-4">
                        <h2 className="text-white text-sm md:text-base font-normal">Profile Details</h2>
                    </div>

                    {/* Profile Content */}
                    <div className="px-4 md:px-6 py-6 md:py-8">
                        {/* Avatar and Name with Edit Button */}
                        <div className="flex flex-col md:flex-row items-start md:justify-between mb-6 md:mb-8 gap-4">
                            <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                                <div className="relative">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-[#D05E2D]">
                                        <div className="w-full h-full bg-gray-300"></div>
                                    </div>
                                    {profileData?.data?.user?.recentSubscription ? (
                                        <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-md flex items-center justify-center text-white shadow-md" style={{ background: 'linear-gradient(90.44deg, #8B0000 0.41%, #AD2F16 99.66%)' }}>
                                            <span className="text-xs font-semibold">Pro</span>
                                        </div>
                                    ) : null}
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-medium text-gray-900">{user.name}</h3>
                                    <p className="text-xs md:text-sm text-gray-400">Member ID: {user.memberId}</p>
                                </div>
                            </div>
                            {!isEditMode ? (
                                <button
                                    onClick={handleEditClick}
                                    className="hidden md:block bg-[#AD2F16] hover:bg-[#a03333] text-white px-8 py-2 rounded text-sm transition-colors"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="hidden md:flex gap-3">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded text-sm transition-colors"
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="bg-[#AD2F16] hover:bg-[#a03333] text-white px-6 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        {updateProfileMutation.isPending ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : (
                                            'Save'
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-5">
                            {/* Full Name */}
                            <div className="flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={isEditMode ? editableUser.name : user.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Full Name"
                                    className={`px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-gray-300 ${isEditMode ? 'bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50'
                                        }`}
                                    disabled={!isEditMode}
                                />
                            </div>

                            {/* Mobile No. */}
                            <div className="flex flex-col md:hidden">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Mobile No.
                                </label>
                                <input
                                    type="tel"
                                    value={isEditMode ? editableUser.mobile : user.mobile}
                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                    className={`px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-gray-300 ${isEditMode ? 'bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50'
                                        }`}
                                    disabled={true}
                                />
                            </div>

                            {/* Email ID */}
                            <div className="flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Email ID
                                </label>
                                <input
                                    type="email"
                                    value={isEditMode ? editableUser.email : user.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    placeholder="Email ID"
                                    className={`px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-gray-300 ${isEditMode ? 'bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50'
                                        }`}
                                    disabled={!isEditMode}
                                />
                            </div>

                            {/* Father's Name */}
                            <div className="flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Father's Name
                                </label>
                                <input
                                    type="text"
                                    value={isEditMode ? editableUser.fatherName : user.fatherName}
                                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                                    placeholder="Father's name"
                                    className={`px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-gray-300 ${isEditMode ? 'bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50'
                                        }`}
                                    disabled={!isEditMode}
                                />
                            </div>

                            {/* Mobile No. - Desktop only */}
                            <div className="hidden md:flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Mobile No.
                                </label>
                                <input
                                    type="tel"
                                    value={isEditMode ? editableUser.mobile : user.mobile}
                                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                                    className={`px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-gray-300 ${isEditMode ? 'bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50'
                                        }`}
                                    disabled={true}
                                />
                            </div>

                            {/* Mother's Name (full width) */}
                            <div className="md:col-span-2 flex flex-col">
                                <label className="text-xs md:text-sm text-gray-700 mb-2">
                                    Mother's Name
                                </label>
                                <input
                                    type="text"
                                    value={isEditMode ? editableUser.motherName : user.motherName}
                                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                                    placeholder="Mother's Name"
                                    className={`px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-gray-300 ${isEditMode ? 'bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50'
                                        }`}
                                    disabled={!isEditMode}
                                />
                            </div>
                        </div>

                        {/* Mobile Edit/Save/Cancel Buttons */}
                        {!isEditMode ? (
                            <button
                                onClick={handleEditClick}
                                className="md:hidden w-full mt-6 bg-[#AD2F16] hover:bg-[#a03333] text-white py-2.5 rounded text-sm transition-colors"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="md:hidden flex gap-3 mt-6">
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2.5 rounded text-sm transition-colors"
                                    disabled={updateProfileMutation.isPending}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 bg-[#AD2F16] hover:bg-[#a03333] text-white py-2.5 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={updateProfileMutation.isPending}
                                >
                                    {updateProfileMutation.isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : (
                                        'Save'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Family Details Section */}
                <section className="bg-white rounded-lg shadow-sm mb-4 md:mb-6 px-4 md:px-6 py-4 md:py-6">
                    <div className="flex items-center justify-between mb-4 md:mb-5">
                        <h2 className="text-sm md:text-base font-medium text-gray-900">Family Details</h2>
                        <button
                            onClick={() => setIsAddMemberModalOpen(true)}
                            className="bg-red-50 text-[#b93a3a] text-xs md:text-sm font-medium px-2.5 md:px-3 py-1.5 rounded-md hover:bg-red-100"
                        >
                            +Add Members
                        </button>
                    </div>

                    {/* Mobile/Tablet: Vertical list of members */}
                    <div className="md:hidden space-y-3">
                        {familyMembersState.slice(0, 3).map((member: any) => (
                            <div key={member.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-3 py-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                    <span className="text-base font-medium">{member.name[0]}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                                            <p className="text-xs text-gray-400">{member.relation}</p>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteFamilyMember(member._id, member.name)}
                                            aria-label={`Remove ${member.name}`}
                                            className="w-5 h-5 flex items-center justify-center border border-gray-200 rounded-sm text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 flex-shrink-0 transition-colors"
                                        >
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* View All button - Mobile */}
                        {familyMembersState.length > 3 && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full text-center py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                View All
                            </button>
                        )}
                    </div>

                    {/* Desktop: Horizontal pill list - Show only first 3 members */}
                    <div className="hidden md:flex items-center justify-between overflow-x-auto pb-2">
                        {familyMembersState.slice(0, 4).map((member: any) => (
                            <div key={member.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 min-w-[220px]">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                    <span className="text-base font-medium">{member.name[0]}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                                            <p className="text-xs text-gray-400">{member.relation}</p>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteFamilyMember(member._id, member.name)}
                                            aria-label={`Remove ${member.name}`}
                                            className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded-sm text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 flex-shrink-0 transition-colors"
                                        >
                                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* View All pill - Desktop - Only show if more than 3 members */}
                        {familyMembersState.length > 3 && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center border border-gray-200 rounded-lg px-4 py-2 min-w-[110px] bg-white text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                View All
                            </button>
                        )}
                    </div>
                </section>

                {/* Family Members Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">All Family Members</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {familyMembersState.map((member: any) => (
                                        <div key={member.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3 hover:shadow-sm transition-shadow">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                                                <span className="text-lg font-medium">{member.name[0]}</span>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-900 truncate">{member.name}</h4>
                                                        <p className="text-xs text-gray-400">{member.relation}</p>
                                                    </div>

                                                    <button
                                                        onClick={() => handleDeleteFamilyMember(member._id, member.name)}
                                                        aria-label={`Remove ${member.name}`}
                                                        className="w-6 h-6 flex items-center justify-center border border-gray-200 rounded-sm text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 flex-shrink-0 transition-colors"
                                                    >
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* My Address Section */}
                <section className="bg-white rounded-lg md:rounded-none shadow-sm md:shadow-none">
                    <div className="px-4 md:px-6 py-4 md:py-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm md:text-lg font-semibold text-gray-900">My Address</h2>
                            <button
                                onClick={handleOpenAddAddressModal}
                                className="bg-red-50 text-red-600 text-xs md:text-sm font-medium px-3 md:px-4 py-1.5 md:py-2 rounded-md hover:bg-red-100 transition-colors"
                            >
                                +Add New Address
                            </button>
                        </div>
                    </div>

                    <div className="px-1 md:px-4 pb-4 md:py-6 space-y-3 max-w-[550px]">
                        {isLoadingAddresses ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AD2F16] mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading addresses...</p>
                            </div>
                        ) : addressesData?.data && addressesData.data.length > 0 ? (
                            addressesData.data.map((addr: AddressModel) => (
                                <div key={addr._id} className="border border-gray-200 rounded-2xl p-1 lg:p-4 bg-white hover:shadow-sm transition-shadow">
                                    {/* Main flex container */}
                                    <div className="flex gap-3">
                                        {/* Location Icon */}
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <circle cx="12" cy="10" r="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="flex-1 min-w-0">
                                            {/* Delivery address label */}
                                            <div className="mb-1">
                                                <span className="text-sm text-gray-500 font-normal">Delivery address</span>
                                            </div>

                                            {/* Address */}
                                            <p className="text-base text-gray-900 font-semibold mb-3 leading-relaxed">
                                                {addr.address}
                                            </p>

                                            {/* Name and Phone */}
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-900 font-semibold">{addr.name}</span>
                                                <span className="text-gray-400">+{addr.phoneNumber}</span>
                                            </div>
                                        </div>

                                        {/* Right column: Type badge at top, Delete + Arrow buttons at bottom */}
                                        <div className="flex flex-col justify-between items-end flex-shrink-0">
                                            {/* Type badge at top */}
                                            <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                                                {addr.type}
                                            </span>

                                            {/* Buttons at bottom: Delete (left) and Edit (right) */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => _handleDeleteAddress(addr._id)}
                                                    aria-label={`Delete address`}
                                                    className="w-7 h-7 flex items-center justify-center flex-shrink-0 text-red-600 hover:bg-red-50 rounded-md"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
                                                        <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" strokeLinejoin="round" />
                                                        <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => handleEditAddress(addr)}
                                                    className="w-6 h-6 flex items-center justify-center flex-shrink-0"
                                                    aria-label="Edit address"
                                                >
                                                    <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No addresses found. Add your first address!</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Add Member Modal */}
                {isAddMemberModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-xl w-full">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                                <h3 className="text-2xl font-semibold text-gray-900">Add new member</h3>
                                <button
                                    onClick={() => {
                                        setIsAddMemberModalOpen(false);
                                        setNewMemberName("");
                                        setNewMemberRelation("");
                                        setAddMemberError("");
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-6 h-6 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-6 py-6">
                                {/* Error Message */}
                                {addMemberError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-600">{addMemberError}</p>
                                    </div>
                                )}

                                {/* Full Name Field */}
                                <div className="mb-6">
                                    <label className="block text-sm font-normal text-gray-900 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={newMemberName}
                                        onChange={(e) => setNewMemberName(e.target.value)}
                                        disabled={isAddingMember}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>

                                {/* Relation Field */}
                                <div className="mb-8">
                                    <label className="block text-sm font-normal text-gray-900 mb-2">
                                        Relation <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={newMemberRelation}
                                            onChange={(e) => setNewMemberRelation(e.target.value)}
                                            disabled={isAddingMember}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm appearance-none focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">Select relation</option>
                                            <option value="Father">Father</option>
                                            <option value="Mother">Mother</option>
                                            <option value="Brother">Brother</option>
                                            <option value="Sister">Sister</option>
                                            <option value="Son">Son</option>
                                            <option value="Daughter">Daughter</option>
                                            <option value="Spouse">Spouse</option>
                                            <option value="Grandfather">Grandfather</option>
                                            <option value="Grandmother">Grandmother</option>
                                            <option value="Uncle">Uncle</option>
                                            <option value="Aunt">Aunt</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Add Member Button */}
                                <button
                                    onClick={handleAddFamilyMember}
                                    disabled={isAddingMember}
                                    className="w-full bg-[#AD2F16] hover:bg-[#8B0000] text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#AD2F16]"
                                >
                                    {isAddingMember ? "Adding Member..." : "Add Member"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add New Address Modal */}
                {isAddAddressModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                                <h3 className="text-base sm:text-xl font-semibold text-gray-900">
                                    {editingAddress ? 'Edit Address' : 'Add New Address'}
                                </h3>
                                <button
                                    onClick={handleCloseAddressModal}
                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
                                    aria-label="Close modal"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="px-4 sm:px-6 py-4 sm:py-6">
                                {/* Name and Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Name"
                                            value={addressForm.name}
                                            onChange={(e) => handleAddressFormChange('name', e.target.value)}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                        />
                                        {addressErrors.name && (
                                            <p className="text-red-500 text-xs mt-1">{addressErrors.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="example@gmail.com"
                                            value={addressForm.email}
                                            onChange={(e) => handleAddressFormChange('email', e.target.value)}
                                            className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                        />
                                        {addressErrors.email && (
                                            <p className="text-red-500 text-xs mt-1">{addressErrors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile Number */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Mobile No <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="Enter Mobile Number"
                                        value={addressForm.mobile}
                                        onChange={(e) => handleAddressFormChange('mobile', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                        maxLength={10}
                                    />
                                    {addressErrors.mobile && (
                                        <p className="text-red-500 text-xs mt-1">{addressErrors.mobile}</p>
                                    )}
                                </div>

                                {/* Address Line 1 */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Write address here"
                                        value={addressForm.addressLine1}
                                        onChange={(e) => handleAddressFormChange('addressLine1', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    />
                                    {addressErrors.addressLine1 && (
                                        <p className="text-red-500 text-xs mt-1">{addressErrors.addressLine1}</p>
                                    )}
                                </div>

                                {/* Address Line 2 */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Write address here"
                                        value={addressForm.addressLine2}
                                        onChange={(e) => handleAddressFormChange('addressLine2', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                    />
                                </div>

                                {/* State and District Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            State
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={addressForm.state}
                                                onChange={(e) => handleAddressFormChange('state', e.target.value)}
                                                className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-500 text-xs sm:text-sm appearance-none focus:outline-none focus:border-gray-300 focus:bg-white transition-colors cursor-pointer"
                                            >
                                                <option value="">Select State</option>
                                                {statesData.states.map((state) => (
                                                    <option key={state.state} value={state.state}>
                                                        {state.state}
                                                    </option>
                                                ))}
                                            </select>
                                            {addressErrors.state && (
                                                <p className="text-red-500 text-xs mt-1">{addressErrors.state}</p>
                                            )}
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                            District
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={addressForm.district}
                                                onChange={(e) => handleAddressFormChange('district', e.target.value)}
                                                disabled={!addressForm.state}
                                                className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-500 text-xs sm:text-sm appearance-none focus:outline-none focus:border-gray-300 focus:bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Select District</option>
                                                {availableDistricts.map((district) => (
                                                    <option key={district} value={district}>
                                                        {district}
                                                    </option>
                                                ))}
                                            </select>
                                            {addressErrors.district && (
                                                <p className="text-red-500 text-xs mt-1">{addressErrors.district}</p>
                                            )}
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pincode */}
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-1.5 sm:mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Pincode"
                                        value={addressForm.pincode}
                                        onChange={(e) => handleAddressFormChange('pincode', e.target.value)}
                                        className="w-full px-3 py-2 sm:py-2.5 border border-gray-200 rounded bg-gray-50 text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
                                        maxLength={6}
                                    />
                                    {addressErrors.pincode && (
                                        <p className="text-red-500 text-xs mt-1">{addressErrors.pincode}</p>
                                    )}
                                </div>

                                {/* Save As */}
                                <div className="mb-5 sm:mb-6">
                                    <label className="block text-xs sm:text-sm font-normal text-gray-900 mb-2 sm:mb-3">
                                        Save as
                                    </label>
                                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="saveAs"
                                                value="Home"
                                                checked={addressForm.saveAs === "Home"}
                                                onChange={(e) => handleAddressFormChange('saveAs', e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-700">Home</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="saveAs"
                                                value="Office"
                                                checked={addressForm.saveAs === "Office"}
                                                onChange={(e) => handleAddressFormChange('saveAs', e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-700">Office</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="saveAs"
                                                value="Other"
                                                checked={addressForm.saveAs === "Other"}
                                                onChange={(e) => handleAddressFormChange('saveAs', e.target.value)}
                                                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-gray-700">Other</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Add/Update/Delete Buttons */}
                                {editingAddress ? (
                                    <div className="space-y-3">
                                        {/* Update Button */}
                                        <button
                                            onClick={handleSaveAddress}
                                            disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                                            className="w-full bg-[#AD2F16] hover:bg-[#8B0000] text-white font-medium py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {updateAddressMutation.isPending ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Updating...
                                                </span>
                                            ) : (
                                                'Edit'
                                            )}
                                        </button>


                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSaveAddress}
                                        disabled={addAddressMutation.isPending}
                                        className="w-full bg-[#AD2F16] hover:bg-[#8B0000] text-white font-medium py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addAddressMutation.isPending ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Adding...
                                            </span>
                                        ) : (
                                            'Add New Address'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ProfilePage;