import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { AddressFormModal, AddressCard, AddressModel as AddressModelType } from '@/components/address';
import toast from "react-hot-toast";

// Use AddressModel from address components
type AddressModel = AddressModelType;

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
                // backend returns profile photo in `profilePhoto` field
                avatar: userData?.profilePhoto || userData?.avatar || userData?.profilePicture || "",
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

    // keep avatar preview in sync when user changes
    useEffect(() => {
        if (profileData?.data?.user) {
            const userData = profileData.data.user;
            setAvatarPreviewUrl(userData?.profilePhoto || userData?.avatar || userData?.profilePicture || "");
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

    // Avatar upload state
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>(user.avatar || "");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberRelation, setNewMemberRelation] = useState("");
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [addMemberError, setAddMemberError] = useState("");

    // Address modal states
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AddressModel | null>(null);

    // Prevent body scroll when modals are open
    const isAnyModalOpen = isModalOpen || isAddMemberModalOpen || isAddAddressModalOpen;
    useEffect(() => {
        if (isAnyModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isAnyModalOpen]);

    // Format subscription title to remove words like 'plan' or 'plane'
    const formatSubscriptionTitle = (title?: string | null) => {
        if (!title) return "";
        // remove exact words 'plan' or common typo 'plane' (case-insensitive)
        const cleaned = title.replace(/\bpla(?:n|ne)\b/ig, "").replace(/\s+/g, ' ').trim();
        // fallback to original if cleaning produces empty string
        return cleaned || title;
    };

    // Inline messages for specific fields when clicked in edit mode
    const [fieldMessage, setFieldMessage] = useState<{ [key: string]: string }>({});

    const showFieldMessage = (field: string, message?: string) => {
        const defaultMsg = "To add or update these fields, please go to the Add Member section.";
        const msg = message || defaultMsg;
        setFieldMessage(prev => ({ ...prev, [field]: msg }));
        // clear after 5 seconds
        setTimeout(() => {
            setFieldMessage(prev => {
                const copy = { ...prev };
                delete copy[field];
                return copy;
            });
        }, 5000);
    };

    // Open modal for adding new address
    const handleOpenAddAddressModal = () => {
        setEditingAddress(null);
        setIsAddAddressModalOpen(true);
    };

    // Open modal for editing existing address
    const handleEditAddress = (address: AddressModel) => {
        setEditingAddress(address);
        setIsAddAddressModalOpen(true);
    };

    // Close address modal
    const handleCloseAddressModal = () => {
        setIsAddAddressModalOpen(false);
        setEditingAddress(null);
    };

    // Save address (add or update)
    const handleSaveAddress = async (payload: any, addressId?: string) => {
        try {
            if (addressId) {
                // Update existing address
                await updateAddressMutation.mutateAsync({
                    addressId,
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
        } catch (error: any) {
            console.error("Error saving address:", error);
            toast.error(error?.response?.data?.message || "Failed to save address. Please try again.");
            throw error;
        }
    };

    // Delete address
    const handleDeleteAddress = async (addressId: string) => {
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
            throw error;
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
        // reset selected avatar when entering edit mode
        setSelectedAvatarFile(null);
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
            // If an avatar file is selected, send as FormData
            if (selectedAvatarFile) {
                const formData = new FormData();
                // send file under field name 'img' per request
                formData.append('img', selectedAvatarFile);
                formData.append('name', editableUser.name || '');
                formData.append('email', editableUser.email || '');
                formData.append('phone', editableUser.mobile || '');
                if (editableUser.fatherName) formData.append('fatherName', editableUser.fatherName);
                if (editableUser.motherName) formData.append('motherName', editableUser.motherName);
                if (editableUser.address) formData.append('address', editableUser.address);

                await updateProfileMutation.mutateAsync(formData as any);
            } else {
                // When user didn't select a new avatar file, include the existing
                // avatar/profile url so backend keeps the image unchanged.
                const payload: any = {
                    name: editableUser.name,
                    email: editableUser.email,
                    phone: editableUser.mobile,
                    fatherName: editableUser.fatherName,
                    motherName: editableUser.motherName,
                    address: editableUser.address,
                };


                if (avatarPreviewUrl) {
                    payload.profilePhoto = avatarPreviewUrl;
                }

                await updateProfileMutation.mutateAsync(payload as any);
            }

            setIsEditMode(false);

            // Refetch profile data to get updated information
            // refetchProfile returns the react-query result; try to extract the updated user
            const refetchResult = await refetchProfile();

            // Try to pick updated user from refetch result or fallback to existing profileData
            const updatedUser = refetchResult?.data?.data?.user || profileData?.data?.user;

            // Update localStorage and notify other parts of the app (same-window listeners)
            try {
                if (updatedUser) {
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    if (updatedUser.name) localStorage.setItem('userName', updatedUser.name);

                    // Dispatch a small custom event so same-window listeners (like Header) can update
                    window.dispatchEvent(new CustomEvent('userUpdated', { detail: updatedUser }));
                }
            } catch (e) {
                // ignore storage errors
            }
        } catch (error: any) {
            console.error("Error updating profile:", error);
            toast.error(error?.response?.data?.message || "Failed to update profile. Please try again.");
        }
    };

    // Avatar file handlers
    const handleAvatarFileChange = (file?: File | null) => {
        if (!file) return;
        setSelectedAvatarFile(file);
        const url = URL.createObjectURL(file);
        setAvatarPreviewUrl(url);
    };

    const triggerAvatarFileSelect = () => {
        if (!isEditMode) return;
        const input = document.getElementById('profile-avatar-input') as HTMLInputElement | null;
        if (input) input.click();
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
                                    <div
                                        role={isEditMode ? 'button' : undefined}
                                        onClick={triggerAvatarFileSelect}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-[#D05E2D] cursor-pointer"
                                    >
                                        {avatarPreviewUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={avatarPreviewUrl} alt="avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-300"></div>
                                        )}

                                        {/* hidden file input */}
                                        <input
                                            id="profile-avatar-input"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const f = e.target.files && e.target.files[0];
                                                if (f) handleAvatarFileChange(f);
                                            }}
                                        />
                                    </div>
                                    {profileData?.data?.recentSubscription?.subscriptionName ? (
                                        <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-md flex items-center justify-center text-white shadow-md" style={{ background: 'linear-gradient(90.44deg, #8B0000 0.41%, #AD2F16 99.66%)' }}>
                                            <span className="text-xs font-semibold">{formatSubscriptionTitle(profileData?.data?.recentSubscription?.subscriptionName)}</span>
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
                                    onClick={() => { if (isEditMode) showFieldMessage('mobile', 'Number cannot be changed.'); }}
                                    className={`px-3 md:px-4 py-2 md:py-2.5 border border-gray-200 rounded text-gray-700 text-sm focus:outline-none focus:border-gray-300 ${isEditMode ? 'bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200' : 'bg-gray-50'
                                        }`}
                                    disabled={!isEditMode}
                                    readOnly={isEditMode}
                                />
                                {fieldMessage.mobile && (
                                    <p className="text-sm text-red-600 mt-1">{fieldMessage.mobile}</p>
                                )}
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
                                    readOnly={isEditMode}
                                    onClick={() => { if (isEditMode) showFieldMessage('fatherName'); }}
                                />
                                {fieldMessage.fatherName && (
                                    <p className="text-sm text-red-600 mt-1">{fieldMessage.fatherName}</p>
                                )}
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
                                    disabled={!isEditMode}
                                    readOnly={isEditMode}
                                    onClick={() => { if (isEditMode) showFieldMessage('mobile', 'Number cannot be changed.'); }}
                                />
                                {fieldMessage.mobile && (
                                    <p className="text-sm text-red-600 mt-1">{fieldMessage.mobile}</p>
                                )}
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
                                    readOnly={isEditMode}
                                    onClick={() => { if (isEditMode) showFieldMessage('motherName'); }}
                                />
                                {fieldMessage.motherName && (
                                    <p className="text-sm text-red-600 mt-1">{fieldMessage.motherName}</p>
                                )}
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
                    <div className="hidden md:flex items-center gap-10 overflow-x-auto pb-2">
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

                    <div className="px-1 md:px-4 pb-4 md:py-6">
                        {isLoadingAddresses ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AD2F16] mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading addresses...</p>
                            </div>
                        ) : addressesData?.data && addressesData.data.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
                                {addressesData.data.map((addr: AddressModel) => (
                                    <AddressCard
                                        key={addr._id}
                                        address={addr}
                                        onEdit={() => handleEditAddress(addr)}
                                        onDelete={() => handleDeleteAddress(addr._id)}
                                        showDeleteButton={true}
                                    />
                                ))}
                            </div>
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
                <AddressFormModal
                    isOpen={isAddAddressModalOpen}
                    onClose={handleCloseAddressModal}
                    editingAddress={editingAddress}
                    config={{
                        showDeleteButton: false,
                        onSubmit: handleSaveAddress,
                    }}
                    isLoading={addAddressMutation.isPending || updateAddressMutation.isPending}
                />
            </main>
        </div>
    );
};

export default ProfilePage;