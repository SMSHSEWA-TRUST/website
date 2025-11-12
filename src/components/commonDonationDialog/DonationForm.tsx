import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { DialogTypesForDonation } from ".";
import BhumiDaanPlotSection from "./components/LandDonationSelector";
import { useI18n } from "@/lib/i18n";

type DonationFormProps = {
  onSubmit: (data: any) => void;
  category: string;
  onAmountChange?: (amount: number) => void;
  data: any;
  handleSubmit: any;
  setValue: any;
  control: any;
  errors: any;
  initialPlotContacts?: Record<string, any> | null;
  initialSelectedPlots?: any[];
  initialSameDetailsForAll?: boolean;
  initialExpandedPlots?: Record<string, boolean>;
  initialFormData?: any;
};

// Validation helpers
const NAME_REGEX = /^[a-zA-Z\s.'-]{2,}$/; // letters, space, apostrophe, dot, hyphen
const PHONE_REGEX = /^(?:\+91[-\s])?[6-9]\d{9}$/; // Indian mobile with optional +91 or leading 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DonationForm: React.FC<DonationFormProps> = ({
  onSubmit,
  onAmountChange,
  data,
  handleSubmit,
  setValue,
  control,
  errors,
  initialPlotContacts,
  initialSelectedPlots = [],
  initialSameDetailsForAll = false,
  initialExpandedPlots = {},
  initialFormData,
}) => {
  const { t } = useI18n();
  const [selectedOption, setSelectedOption] = useState(data?.daanTypes?.[0] ?? null);
  const [selectedPlots, setSelectedPlots] = useState<any[]>(initialSelectedPlots);
  const [landContacts, setLandContacts] = useState<Record<string, any>>(initialPlotContacts ?? {});
  const [sameDetailsForAll, setSameDetailsForAll] = useState(initialSameDetailsForAll);
  const [expandedPlots, setExpandedPlots] = useState<Record<string, boolean>>(initialExpandedPlots);
  const [plotFieldErrors, setPlotFieldErrors] = useState<Record<string, Record<string, string>>>({});
  const [notEditableMsgs, setNotEditableMsgs] = useState<Record<string, string>>({});
  const [plotSelectionError, setPlotSelectionError] = useState<string>("");

  // Read stored registered user (if any) to prefill and lock contact fields
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const registeredUser = storedUser ? JSON.parse(storedUser) : null;

  // Note: selectedPlots, sameDetailsForAll, and expandedPlots are all initialized 
  // with their initial values via useState, so no sync effects needed.
  // The LandDonationSelector will handle its own plot initialization.

  // If user is registered and there are selected plots, prefill the first plot's contact
  useEffect(() => {
    if (!registeredUser) return;
    const firstId = selectedPlots?.[0]?._id;
    if (!firstId) return;

    setLandContacts(prev => {
      // Check if we already have contact data for the first plot to avoid unnecessary updates
      const existingContact = prev[firstId];
      // Only prefill if the contact is completely empty
      const hasExistingData = existingContact && (
        existingContact.name ||
        existingContact.phoneNumber ||
        existingContact.email
      );

      if (hasExistingData) {
        return prev; // Don't overwrite existing data
      }

      const next = { ...prev };
      // try to read father/mother from nested familyDetails.members array (if present)
      const familyMembers = registeredUser.familyDetails?.members || [];
      const fatherFromFamily = familyMembers.find((m: any) => String(m.relation || '').toLowerCase() === 'father')?.name;
      const motherFromFamily = familyMembers.find((m: any) => String(m.relation || '').toLowerCase() === 'mother')?.name;

      next[firstId] = {
        name: registeredUser.name || "",
        fatherName: fatherFromFamily || registeredUser.fatherName || "",
        motherName: motherFromFamily || registeredUser.motherName || "",
        phoneNumber: registeredUser.phone || "",
        email: registeredUser.email || "",
        address: registeredUser.address || "",
      };
      return next;
    });
  }, [registeredUser, selectedPlots?.[0]?._id]);

  // If user is registered, prefill top-level form fields so Controllers show stored values
  // Only run once on mount to avoid overwriting user edits
  useEffect(() => {
    if (!registeredUser || initialFormData) return; // Skip if we have initialFormData from saved state
    try {
      // set common form values if available on registeredUser
      const fields = ['name', 'phoneNumber', 'email', 'address'];
      // extract father/mother from familyDetails.members if present
      const familyMembers = registeredUser.familyDetails?.members || [];
      const fatherFromFamily = familyMembers.find((m: any) => String(m.relation || '').toLowerCase() === 'father')?.name;
      const motherFromFamily = familyMembers.find((m: any) => String(m.relation || '').toLowerCase() === 'mother')?.name;

      // set simple fields
      fields.forEach(f => {
        const val = registeredUser[f] ?? (f === 'phoneNumber' ? registeredUser.phone : undefined) ?? '';
        setValue(f as string, val, { shouldValidate: false });
      });

      // set father/mother using familyDetails members as primary source, fallback to top-level keys
      const fatherVal = fatherFromFamily ?? registeredUser.fatherName ?? '';
      const motherVal = motherFromFamily ?? registeredUser.motherName ?? '';
      setValue('fatherName', fatherVal, { shouldValidate: false });
      setValue('motherName', motherVal, { shouldValidate: false });
    } catch (e) {
      // ignore if setValue not available or fails
      // console.warn('Failed to prefill form values from registered user', e);
    }
  }, []); // Empty deps - run only once on mount

  // Initialize form data from initialFormData for retention on back navigation
  useEffect(() => {
    if (!initialFormData) return;

    // Set selected donation option
    if (initialFormData.donationDocId && data?.daanTypes) {
      const option = data.daanTypes.find((o: any) => o._id === initialFormData.donationDocId);
      if (option) {
        setSelectedOption(option);
        onAmountChange?.(option.amount);
      }
    }

    // Set form field values - use shouldValidate: false to avoid validation on mount
    const fields = ['name', 'fatherName', 'motherName', 'phoneNumber', 'email', 'address'];
    fields.forEach(field => {
      if (initialFormData[field] !== undefined && initialFormData[field] !== null) {
        setValue(field, initialFormData[field], { shouldValidate: false, shouldDirty: false });
      }
    });

    // Set amount if available
    if (initialFormData.amount !== undefined) {
      setValue('amount', initialFormData.amount, { shouldValidate: false, shouldDirty: false });
    }
  }, []); // Run only once on mount to restore initial data

  const handleDonationSelect = (option: { _id: string; name: string; amount: number }) => {
    setSelectedOption(option);
    setValue("donationDocId", option._id);
    setValue("daanType", option.name); // Set daanType field with the selected donation type name (text)
    onAmountChange?.(option?.amount ?? 0);
  };

  useEffect(() => {
    setLandContacts(prev => {
      const next: Record<string, any> = { ...prev };
      let hasChanges = false;

      selectedPlots.forEach(plot => {
        if (!next[plot._id]) {
          next[plot._id] = {
            name: "",
            fatherName: "",
            motherName: "",
            phoneNumber: "",
            email: "",
            address: "",
          };
          hasChanges = true;
        }
      });

      Object.keys(next).forEach(key => {
        if (!selectedPlots.some(p => p._id === key)) {
          delete next[key];
          hasChanges = true;
        }
      });

      return hasChanges ? next : prev;
    });

    setExpandedPlots(prev => {
      if (selectedPlots.length === 0) {
        return Object.keys(prev).length > 0 ? {} : prev;
      }

      const next: Record<string, boolean> = { ...prev };
      let hasChanges = false;
      const firstId = selectedPlots[0]._id;

      if (!next[firstId]) {
        next[firstId] = true;
        hasChanges = true;
      }

      selectedPlots.forEach(p => {
        if (!next.hasOwnProperty(p._id)) {
          next[p._id] = p._id === firstId;
          hasChanges = true;
        }
      });

      Object.keys(next).forEach(k => {
        if (!selectedPlots.some(p => p._id === k)) {
          delete next[k];
          hasChanges = true;
        }
      });

      return hasChanges ? next : prev;
    });
  }, [selectedPlots.map(p => p._id).join(','), selectedPlots.length]);

  // Initialize landContacts from parent-provided initial contacts when available
  useEffect(() => {
    if (!initialPlotContacts || Object.keys(initialPlotContacts).length === 0) return;

    // Restore contacts from saved state (this happens when coming back from payment page)
    setLandContacts(prev => {
      // Only restore if we don't already have the same contacts
      const prevKeys = Object.keys(prev).sort().join(',');
      const initialKeys = Object.keys(initialPlotContacts).sort().join(',');

      // If the keys are different or prev is empty, restore from initial
      if (prevKeys !== initialKeys || Object.keys(prev).length === 0) {
        return initialPlotContacts;
      }

      return prev;
    });
  }, [initialPlotContacts]);

  useEffect(() => {
    if (!sameDetailsForAll) return;
    const firstId = selectedPlots?.[0]?._id;
    if (!firstId) return;

    setLandContacts(prev => {
      const base = prev[firstId] || {};
      const copy: Record<string, any> = { ...prev };

      // Only update if there are actual changes
      let hasChanges = false;
      selectedPlots.forEach(p => {
        if (p._id !== firstId) {
          const currentContact = prev[p._id] || {};
          const newContact = { ...base };

          // Check if the contact is actually different
          const isDifferent = Object.keys(newContact).some(key =>
            (currentContact as any)[key] !== (newContact as any)[key]
          );

          if (isDifferent) {
            copy[p._id] = newContact;
            hasChanges = true;
          }
        }
      });

      return hasChanges ? copy : prev;
    });
  }, [sameDetailsForAll, selectedPlots?.[0]?._id]);

  // Ensure when sameDetailsForAll is turned OFF we clear other plots' contact info
  useEffect(() => {
    if (sameDetailsForAll) return;
    // If unchecked, keep the first plot's details (if any) and clear others
    const firstId = selectedPlots?.[0]?._id;
    if (!firstId) return;

    setLandContacts(prev => {
      const next: Record<string, any> = { ...prev };
      let hasChanges = false;

      // preserve first plot if it exists in prev
      if (prev[firstId] && !next[firstId]) {
        next[firstId] = { ...prev[firstId] };
        hasChanges = true;
      }

      // ensure other selected plots exist but are empty
      selectedPlots.forEach(p => {
        if (p._id === firstId) return;

        const emptyContact = {
          name: "",
          fatherName: "",
          motherName: "",
          phoneNumber: "",
          email: "",
          address: "",
        };

        const currentContact = prev[p._id] || {};
        const isDifferent = Object.keys(emptyContact).some(key =>
          (currentContact as any)[key] !== (emptyContact as any)[key]
        );

        if (isDifferent) {
          next[p._id] = emptyContact;
          hasChanges = true;
        }
      });

      return hasChanges ? next : prev;
    });
  }, [sameDetailsForAll, selectedPlots?.[0]?._id, selectedPlots?.length]);

  // If less than 2 plots are selected, disable sameDetailsForAll and ensure other contacts cleared
  useEffect(() => {
    if (selectedPlots.length >= 2) return;

    // if there is only one or zero plots selected, we shouldn't have the "same for all" enabled
    setSameDetailsForAll(prev => prev ? false : prev);

    if (selectedPlots.length === 1) {
      const firstId = selectedPlots[0]._id;
      setLandContacts(prev => {
        // Only update if we have more than one contact or if the single contact isn't for the first plot
        const prevKeys = Object.keys(prev);
        if (prevKeys.length === 1 && prevKeys[0] === firstId) {
          return prev; // No change needed
        }

        const next: Record<string, any> = {};
        if (prev[firstId]) next[firstId] = { ...prev[firstId] };
        return next;
      });
    } else if (selectedPlots.length === 0) {
      // no plots selected -> clear landContacts
      setLandContacts(prev => Object.keys(prev).length > 0 ? {} : prev);
    }
  }, [selectedPlots.length]);

  // Clear plot selection error when user selects plots
  useEffect(() => {
    if (data?.title === DialogTypesForDonation.BHUDAAN && selectedPlots.length > 0 && plotSelectionError) {
      setPlotSelectionError("");
    }
  }, [selectedPlots.length, data?.title, plotSelectionError]);

  const handleLandContactChange = (plotId: string, field: string, value: any) => {
    setLandContacts(prev => {
      const next = { ...prev };
      next[plotId] = { ...(next[plotId] || {}), [field]: value };
      if (sameDetailsForAll && selectedPlots?.[0]?._id === plotId) {
        selectedPlots.forEach(p => {
          if (p._id !== plotId) next[p._id] = { ...next[plotId] };
        });
      }
      return next;
    });

    // clear the field-level error for this plot when user edits
    setPlotFieldErrors(prev => {
      if (!prev[plotId] || !prev[plotId][field]) return prev;
      const next = { ...prev };
      const remaining = { ...next[plotId] };
      delete remaining[field];
      if (Object.keys(remaining).length === 0) {
        delete next[plotId];
      } else {
        next[plotId] = remaining;
      }
      return next;
    });
  };

  const showNotEditableMessage = (key: string) => {
    setNotEditableMsgs(prev => ({ ...prev, [key]: t("donationPage.form.notEditableMessage") }));
    // hide after 2 seconds
    setTimeout(() => {
      setNotEditableMsgs(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }, 2000);
  };

  const toggleExpand = (plotId: string) => setExpandedPlots(prev => ({ ...prev, [plotId]: !prev[plotId] }));

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data?.daanTypes?.length > 0 &&
          data?.daanTypes.map((option: { _id: string; name: string; amount: number }) => (
            <div
              key={option._id}
              className="flex items-center justify-between p-3 rounded-lg border hover:border-orange-300 transition-colors cursor-pointer"
              onClick={() => handleDonationSelect(option)}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="radio"
                    name="donationType"
                    value={option._id}
                    checked={selectedOption?._id === option._id}
                    onChange={() => handleDonationSelect(option)}
                    className="w-5 h-5 text-orange-600 border-2 border-gray-300 focus:ring-orange-500"
                  />
                </div>
                <label className="text-sm font-medium text-gray-700 cursor-pointer">{option.name}</label>
              </div>
            </div>
          ))}
      </div>

      {data?.title === DialogTypesForDonation.BHUDAAN && (
        <div>
          <BhumiDaanPlotSection onAmountChange={onAmountChange} plots={data?.plots ?? []} onPlotsChange={setSelectedPlots} initialSelectedPlots={initialSelectedPlots} />
          {plotSelectionError && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{plotSelectionError}</p>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit((formData: any) => {
          // Ensure daanType is included in the form data with the selected donation type name (text)
          if (selectedOption?.name) {
            formData.daanType = selectedOption.name;
            setValue("daanType", selectedOption.name);
          }

          // Validation for BHUDAAN: Ensure at least one plot is selected
          if (data?.title === DialogTypesForDonation.BHUDAAN && selectedPlots.length === 0) {
            setPlotSelectionError(t("donationPage.form.plotSelectionRequired") || "Please select at least one land plot to proceed.");
            return;
          }

          // Clear plot selection error if we have plots selected
          if (data?.title === DialogTypesForDonation.BHUDAAN && selectedPlots.length > 0) {
            setPlotSelectionError("");
          }

          if (selectedPlots.length > 0) {
            if (data?.title === DialogTypesForDonation.BHUDAAN) {
              // Validate BhumiDaan contact details for ALL selected plots before proceeding
              const requiredKeys = [
                "name",
                "fatherName",
                "motherName",
                "phoneNumber",
                "email",
                "address",
              ];

              const allPlotErrors: Record<string, Record<string, string>> = {};
              let hasAnyErrors = false;

              selectedPlots.forEach(plot => {
                const plotContact = landContacts[plot._id] || {};
                const plotErrors: Record<string, string> = {};

                requiredKeys.forEach(k => {
                  const val = plotContact[k];
                  if (val === undefined || val === null || String(val).trim() === "") {
                    plotErrors[k] = `${k === 'phoneNumber' ? 'Phone number' : k.charAt(0).toUpperCase() + k.slice(1)} is required`;
                    return;
                  }

                  // field-specific validation
                  if (k === 'name' || k === 'fatherName' || k === 'motherName') {
                    if (!NAME_REGEX.test(String(val))) plotErrors[k] = 'Please enter a valid name (letters and spaces only)';
                  }

                  if (k === 'phoneNumber') {
                    if (!PHONE_REGEX.test(String(val))) plotErrors[k] = 'Please enter a valid 10 digit phone number';
                  }

                  if (k === 'email') {
                    if (!EMAIL_REGEX.test(String(val))) plotErrors[k] = 'Please enter a valid email address';
                  }

                  if (k === 'address') {
                    if (String(val).trim().length < 5) plotErrors[k] = 'Address must be at least 5 characters';
                  }
                });

                if (Object.keys(plotErrors).length > 0) {
                  allPlotErrors[plot._id] = plotErrors;
                  hasAnyErrors = true;
                }
              });

              if (hasAnyErrors) {
                // set errors for all plots that have issues and expand them
                setPlotFieldErrors(prev => ({ ...prev, ...allPlotErrors }));
                setExpandedPlots(prev => {
                  const newExpanded = { ...prev };
                  Object.keys(allPlotErrors).forEach(plotId => {
                    newExpanded[plotId] = true;
                  });
                  return newExpanded;
                });
                // prevent submission to payment selection
                return;
              }

              // For BhumiDaan flow send only an array of plot IDs
              formData.plotIds = selectedPlots.map(p => p._id);
              // also include the plot contacts so parent can persist and repopulate them
              formData.plotContacts = landContacts;
              // include the full selected plots info for re-selection on back navigation
              formData.selectedPlots = selectedPlots;
              // include checkbox state for persistence
              formData.sameDetailsForAll = sameDetailsForAll;
              // include expanded plots state for persistence
              formData.expandedPlots = expandedPlots;
              // copy validated primary (first plot) contact fields into the form data and react-hook-form values
              const primaryContact = landContacts[selectedPlots[0]._id] || {};
              requiredKeys.forEach(k => {
                const val = primaryContact[k];
                if (val !== undefined && val !== null) {
                  formData[k] = val;
                  try {
                    setValue(k as string, val);
                  } catch (e) {
                    console.warn("Failed to set value for key:", k, e);
                  }
                }
              });
            } else {
              // For other flows send detailed plot objects including contact
              formData.plotIds = selectedPlots.map(p => ({
                plotId: p._id,
                plotNumber: p.plotNumber,
                contact: landContacts[p._id] || {},
              }));
            }
            setValue("plotIds", formData.plotIds);
          }
          onSubmit(formData);
        })}
        className="space-y-4"
        id="donationForm">

        {(data?.title !== DialogTypesForDonation.BHUDAAN || selectedPlots.length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-700 mb-4">{t("donationPage.form.contactDetails")}</h3>
          </div>
        )}

        {data?.title !== DialogTypesForDonation.BHUDAAN && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.name")}</label>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: t("donationPage.form.nameRequired"),
                  pattern: { value: NAME_REGEX, message: t("donationPage.form.nameInvalid") },
                  minLength: { value: 2, message: t("donationPage.form.nameInvalid") }
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <input
                    ref={ref}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={t("donationPage.form.namePlaceholder")}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors?.name ? 'border-red-500' : 'border-orange-300'}`}
                  />
                )}
              />
              {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.fatherName")}</label>
              <Controller
                name="fatherName"
                control={control}
                rules={{
                  required: t("donationPage.form.fatherNameRequired"),
                  pattern: { value: NAME_REGEX, message: t("donationPage.form.fatherNameInvalid") },
                  minLength: { value: 2, message: t("donationPage.form.fatherNameInvalid") }
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <input
                    ref={ref}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={t("donationPage.form.fatherNamePlaceholder")}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors?.fatherName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors?.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>}
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.motherName")}</label>
              <Controller
                name="motherName"
                control={control}
                rules={{
                  required: t("donationPage.form.motherNameRequired"),
                  pattern: { value: NAME_REGEX, message: t("donationPage.form.motherNameInvalid") },
                  minLength: { value: 2, message: t("donationPage.form.motherNameInvalid") }
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <input
                    ref={ref}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={t("donationPage.form.motherNamePlaceholder")}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors?.motherName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors?.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.phoneNumber")}</label>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  required: t("donationPage.form.phoneNumberRequired"),
                  pattern: { value: PHONE_REGEX, message: t("donationPage.form.phoneNumberInvalid") }
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <>
                    <input
                      ref={ref}
                      value={value ?? ''}
                      onChange={onChange}
                      onBlur={onBlur}
                      placeholder={t("donationPage.form.phoneNumberPlaceholder")}
                      readOnly={Boolean(registeredUser)}
                      onClick={() => { if (registeredUser) showNotEditableMessage('globalPhone'); }}
                      onFocus={() => { if (registeredUser) showNotEditableMessage('globalPhone'); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white ${errors?.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {notEditableMsgs['globalPhone'] && <p className="text-gray-500 text-xs mt-1">{notEditableMsgs['globalPhone']}</p>}
                  </>
                )}
              />
              {errors?.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.email")}</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: t("donationPage.form.emailRequired"),
                  pattern: {
                    value: EMAIL_REGEX,
                    message: t("donationPage.form.emailInvalid"),
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <>
                    <input
                      ref={ref}
                      value={value ?? ''}
                      onChange={onChange}
                      onBlur={onBlur}
                      type="email"
                      placeholder={t("donationPage.form.emailPlaceholder")}
                      readOnly={Boolean(registeredUser)}
                      onClick={() => { if (registeredUser) showNotEditableMessage('globalEmail'); }}
                      onFocus={() => { if (registeredUser) showNotEditableMessage('globalEmail'); }}
                      className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white ${errors?.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {notEditableMsgs['globalEmail'] && <p className="text-gray-500 text-xs mt-1">{notEditableMsgs['globalEmail']}</p>}
                  </>
                )}
              />
              {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.address")}</label>
              <Controller
                name="address"
                control={control}
                rules={{ required: t("donationPage.form.addressRequired"), minLength: { value: 5, message: t("donationPage.form.addressInvalid") } }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <input
                    ref={ref}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={t("donationPage.form.addressPlaceholder")}
                    className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${errors?.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors?.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
          </div>
        )}

        {selectedPlots.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-red-700 mb-2">{t("donationPage.form.contactInformation")}</h3>
            {selectedPlots.map((plot, idx) => (
              <div key={plot._id} className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-bold">{t("donationPage.form.landDetailsTitle").replace("{{plotNumber}}", plot.plotNumber)}</h4>
                  <button
                    type="button"
                    onClick={() => toggleExpand(plot._id)}
                    aria-label={expandedPlots[plot._id] ? "Collapse" : "Expand"}
                    className="text-orange-600 p-1 rounded-full hover:bg-orange-50 focus:outline-none"
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-200 ${expandedPlots[plot._id] ? 'rotate-180' : 'rotate-0'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {expandedPlots[plot._id] && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.name")}</label>
                      {(() => {
                        const err = plotFieldErrors[plot._id]?.name;
                        return (
                          <>
                            <input
                              value={landContacts[plot._id]?.name || ""}
                              onChange={e => handleLandContactChange(plot._id, "name", e.target.value)}
                              className={`w-full px-3 py-2.5 rounded-lg outline-none ${err ? 'border border-red-500' : 'border border-gray-300'}`}
                            />
                            {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
                          </>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.fatherName")}</label>
                      {(() => {
                        const err = plotFieldErrors[plot._id]?.fatherName;
                        return (
                          <>
                            <input
                              value={landContacts[plot._id]?.fatherName || ""}
                              onChange={e => handleLandContactChange(plot._id, "fatherName", e.target.value)}
                              className={`w-full px-3 py-2.5 rounded-lg outline-none ${err ? 'border border-red-500' : 'border border-gray-300'}`}
                            />
                            {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
                          </>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.motherName")}</label>
                      {(() => {
                        const err = plotFieldErrors[plot._id]?.motherName;
                        return (
                          <>
                            <input
                              value={landContacts[plot._id]?.motherName || ""}
                              onChange={e => handleLandContactChange(plot._id, "motherName", e.target.value)}
                              className={`w-full px-3 py-2.5 rounded-lg outline-none ${err ? 'border border-red-500' : 'border border-gray-300'}`}
                            />
                            {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
                          </>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.phoneNumber")}</label>
                      {(() => {
                        const err = plotFieldErrors[plot._id]?.phoneNumber;
                        return (
                          <>
                            <input
                              value={landContacts[plot._id]?.phoneNumber || ""}
                              onChange={e => handleLandContactChange(plot._id, "phoneNumber", e.target.value)}
                              readOnly={Boolean(registeredUser) && selectedPlots?.[0]?._id === plot._id}
                              onClick={() => { if (registeredUser && selectedPlots?.[0]?._id === plot._id) showNotEditableMessage(`${plot._id}-phone`); }}
                              onFocus={() => { if (registeredUser && selectedPlots?.[0]?._id === plot._id) showNotEditableMessage(`${plot._id}-phone`); }}
                              className={`w-full px-3 py-2.5 rounded-lg outline-none ${err ? 'border border-red-500' : 'border border-gray-300'}`}
                            />
                            {notEditableMsgs[`${plot._id}-phone`] && <p className="text-gray-500 text-xs mt-1">{notEditableMsgs[`${plot._id}-phone`]}</p>}
                            {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
                          </>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.email")}</label>
                      {(() => {
                        const err = plotFieldErrors[plot._id]?.email;
                        return (
                          <>
                            <input
                              value={landContacts[plot._id]?.email || ""}
                              onChange={e => handleLandContactChange(plot._id, "email", e.target.value)}
                              readOnly={Boolean(registeredUser) && selectedPlots?.[0]?._id === plot._id}
                              onClick={() => { if (registeredUser && selectedPlots?.[0]?._id === plot._id) showNotEditableMessage(`${plot._id}-email`); }}
                              onFocus={() => { if (registeredUser && selectedPlots?.[0]?._id === plot._id) showNotEditableMessage(`${plot._id}-email`); }}
                              className={`w-full px-3 py-2.5 rounded-lg outline-none ${err ? 'border border-red-500' : 'border border-gray-300'}`}
                            />
                            {notEditableMsgs[`${plot._id}-email`] && <p className="text-gray-500 text-xs mt-1">{notEditableMsgs[`${plot._id}-email`]}</p>}
                            {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
                          </>
                        );
                      })()}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t("donationPage.form.address")}</label>
                      {(() => {
                        const err = plotFieldErrors[plot._id]?.address;
                        return (
                          <>
                            <input
                              value={landContacts[plot._id]?.address || ""}
                              onChange={e => handleLandContactChange(plot._id, "address", e.target.value)}
                              className={`w-full px-3 py-2.5 rounded-lg outline-none ${err ? 'border border-red-500' : 'border border-gray-300'}`}
                            />
                            {err && <p className="text-red-500 text-xs mt-1">{err}</p>}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {idx === 0 && selectedPlots.length >= 2 && (
                  <div className="mt-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={sameDetailsForAll}
                        onChange={e => setSameDetailsForAll(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span>{t("donationPage.form.sameDetailsForAll")}</span>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}


      </form>
    </div>
  );
};

export default DonationForm;
