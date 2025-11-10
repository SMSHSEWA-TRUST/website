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
  const [landContacts, setLandContacts] = useState<Record<string, any>>({});
  const [sameDetailsForAll, setSameDetailsForAll] = useState(initialSameDetailsForAll);
  const [expandedPlots, setExpandedPlots] = useState<Record<string, boolean>>(initialExpandedPlots);
  const [plotFieldErrors, setPlotFieldErrors] = useState<Record<string, Record<string, string>>>({});
  const [notEditableMsgs, setNotEditableMsgs] = useState<Record<string, string>>({});

  // Read stored registered user (if any) to prefill and lock contact fields
  const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const registeredUser = storedUser ? JSON.parse(storedUser) : null;

  // If user is registered and there are selected plots, prefill the first plot's contact
  useEffect(() => {
    if (!registeredUser) return;
    const firstId = selectedPlots?.[0]?._id;
    if (!firstId) return;
    setLandContacts(prev => {
      const next = { ...prev };
      // try to read father/mother from nested familyDetails.members array (if present)
      const familyMembers = registeredUser.familyDetails?.members || [];
      const fatherFromFamily = familyMembers.find((m: any) => String(m.relation || '').toLowerCase() === 'father')?.name;
      const motherFromFamily = familyMembers.find((m: any) => String(m.relation || '').toLowerCase() === 'mother')?.name;

      next[firstId] = {
        ...(next[firstId] || {}),
        // prefer existing values, fall back to registered user values (including nested family members)
        name: next[firstId]?.name || registeredUser.name || next[firstId]?.name || "",
        fatherName: next[firstId]?.fatherName || fatherFromFamily || registeredUser.fatherName || next[firstId]?.fatherName || "",
        motherName: next[firstId]?.motherName || motherFromFamily || registeredUser.motherName || next[firstId]?.motherName || "",
        phoneNumber: next[firstId]?.phoneNumber || registeredUser.phone || next[firstId]?.phoneNumber || "",
        email: next[firstId]?.email || registeredUser.email || next[firstId]?.email || "",
        address: next[firstId]?.address || registeredUser.address || next[firstId]?.address || "",
      };
      return next;
    });
  }, [registeredUser, selectedPlots]);

  // If user is registered, prefill top-level form fields so Controllers show stored values
  useEffect(() => {
    if (!registeredUser) return;
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
        setValue(f as string, val);
      });

      // set father/mother using familyDetails members as primary source, fallback to top-level keys
      const fatherVal = fatherFromFamily ?? registeredUser.fatherName ?? '';
      const motherVal = motherFromFamily ?? registeredUser.motherName ?? '';
      setValue('fatherName', fatherVal);
      setValue('motherName', motherVal);
    } catch (e) {
      // ignore if setValue not available or fails
      // console.warn('Failed to prefill form values from registered user', e);
    }
  }, [registeredUser, setValue]);

  // Initialize form data from initialFormData for retention on back navigation
  useEffect(() => {
    if (!initialFormData || !data?.daanTypes) return;
    // Set selected donation option
    if (initialFormData.donationDocId) {
      const option = data.daanTypes.find((o: any) => o._id === initialFormData.donationDocId);
      if (option) {
        setSelectedOption(option);
        onAmountChange?.(option.amount);
      }
    }
    // Set form field values
    const fields = ['name', 'fatherName', 'motherName', 'phoneNumber', 'email', 'address'];
    fields.forEach(field => {
      if (initialFormData[field] !== undefined) {
        setValue(field, initialFormData[field]);
      }
    });
  }, [initialFormData, data?.daanTypes, setValue, onAmountChange]);

  const handleDonationSelect = (option: { _id: string; name: string; amount: number }) => {
    setSelectedOption(option);
    setValue("donationDocId", option._id);
    setValue("daanType", option.name); // Set daanType field with the selected donation type name (text)
    onAmountChange?.(option?.amount ?? 0);
  };

  useEffect(() => {
    setLandContacts(prev => {
      const next: Record<string, any> = { ...prev };
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
        }
      });
      Object.keys(next).forEach(key => {
        if (!selectedPlots.some(p => p._id === key)) delete next[key];
      });
      return next;
    });

    setExpandedPlots(prev => {
      const next: Record<string, boolean> = { ...prev };
      if (selectedPlots.length > 0) {
        const firstId = selectedPlots[0]._id;
        if (!next[firstId]) next[firstId] = true;
        selectedPlots.forEach(p => {
          if (!next.hasOwnProperty(p._id)) next[p._id] = p._id === firstId;
        });
        Object.keys(next).forEach(k => {
          if (!selectedPlots.some(p => p._id === k)) delete next[k];
        });
      } else {
        return {};
      }
      return next;
    });
  }, [selectedPlots]);

  // Initialize landContacts from parent-provided initial contacts when available
  useEffect(() => {
    if (!initialPlotContacts) return;
    // only initialize if we don't already have contacts (avoid overwriting in-progress edits)
    if (Object.keys(landContacts).length === 0) {
      setLandContacts(initialPlotContacts);
    }
  }, [initialPlotContacts]);

  useEffect(() => {
    if (!sameDetailsForAll) return;
    const firstId = selectedPlots?.[0]?._id;
    if (!firstId) return;
    setLandContacts(prev => {
      const base = prev[firstId] || {};
      const copy: Record<string, any> = {};
      selectedPlots.forEach(p => {
        copy[p._id] = { ...base };
      });
      return copy;
    });
  }, [sameDetailsForAll, selectedPlots]);

  // Ensure when sameDetailsForAll is turned OFF we clear other plots' contact info
  useEffect(() => {
    if (sameDetailsForAll) return;
    // If unchecked, keep the first plot's details (if any) and clear others
    const firstId = selectedPlots?.[0]?._id;
    if (!firstId) return;
    setLandContacts(prev => {
      const next: Record<string, any> = {};
      // preserve first plot if it exists in prev
      if (prev[firstId]) next[firstId] = { ...prev[firstId] };
      // ensure other selected plots exist but are empty
      selectedPlots.forEach(p => {
        if (p._id === firstId) return;
        next[p._id] = {
          name: "",
          fatherName: "",
          motherName: "",
          phoneNumber: "",
          email: "",
          address: "",
        };
      });
      return next;
    });
  }, [sameDetailsForAll, selectedPlots]);

  // If less than 2 plots are selected, disable sameDetailsForAll and ensure other contacts cleared
  useEffect(() => {
    if (selectedPlots.length >= 2) return;
    // if there is only one or zero plots selected, we shouldn't have the "same for all" enabled
    setSameDetailsForAll(false);
    if (selectedPlots.length === 1) {
      const firstId = selectedPlots[0]._id;
      setLandContacts(prev => {
        const next: Record<string, any> = {};
        if (prev[firstId]) next[firstId] = { ...prev[firstId] };
        return next;
      });
    } else {
      // no plots selected -> clear landContacts
      setLandContacts({});
    }
  }, [selectedPlots]);

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
      const next = { ...prev };
      if (next[plotId] && next[plotId][field]) {
        const remaining = { ...next[plotId] };
        delete remaining[field];
        if (Object.keys(remaining).length === 0) delete next[plotId];
        else next[plotId] = remaining;
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
        <BhumiDaanPlotSection onAmountChange={onAmountChange} plots={data?.plots ?? []} onPlotsChange={setSelectedPlots} initialSelectedPlots={initialSelectedPlots} />
      )}

      <form
        onSubmit={handleSubmit((formData: any) => {
          // Ensure daanType is included in the form data with the selected donation type name (text)
          if (selectedOption?.name) {
            formData.daanType = selectedOption.name;
            setValue("daanType", selectedOption.name);
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
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder={t("donationPage.form.namePlaceholder")}
                    className="w-full px-3 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder={t("donationPage.form.fatherNamePlaceholder")}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder={t("donationPage.form.motherNamePlaceholder")}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      placeholder={t("donationPage.form.phoneNumberPlaceholder")}
                      readOnly={Boolean(registeredUser)}
                      onClick={() => { if (registeredUser) showNotEditableMessage('globalPhone'); }}
                      onFocus={() => { if (registeredUser) showNotEditableMessage('globalPhone'); }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
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
                render={({ field }) => (
                  <>
                    <input
                      {...field}
                      type="email"
                      placeholder={t("donationPage.form.emailPlaceholder")}
                      readOnly={Boolean(registeredUser)}
                      onClick={() => { if (registeredUser) showNotEditableMessage('globalEmail'); }}
                      onFocus={() => { if (registeredUser) showNotEditableMessage('globalEmail'); }}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
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
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder={t("donationPage.form.addressPlaceholder")}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
