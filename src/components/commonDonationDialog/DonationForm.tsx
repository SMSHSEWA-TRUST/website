import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { DialogTypesForDonation } from ".";
import BhumiDaanPlotSection from "./components/LandDonationSelector";

type DonationFormProps = {
  onSubmit: (data: any) => void;
  category: string;
  onAmountChange?: (amount: number) => void;
  data: any;
  handleSubmit: any;
  setValue: any;
  control: any;
  errors: any;
};

const DonationForm: React.FC<DonationFormProps> = ({
  onSubmit,
  onAmountChange,
  data,
  handleSubmit,
  setValue,
  control,
  errors,
}) => {
  const [selectedOption, setSelectedOption] = useState(data?.daanTypes?.[0] ?? null);
  const [selectedPlots, setSelectedPlots] = useState<any[]>([]);
  const [landContacts, setLandContacts] = useState<Record<string, any>>({});
  const [sameDetailsForAll, setSameDetailsForAll] = useState(false);
  const [expandedPlots, setExpandedPlots] = useState<Record<string, boolean>>({});

  const handleDonationSelect = (option: { _id: string; name: string; amount: number }) => {
    setSelectedOption(option);
    setValue("donationDocId", option._id);
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
        <BhumiDaanPlotSection onAmountChange={onAmountChange} plots={data?.plots ?? []} onPlotsChange={setSelectedPlots} />
      )}

      <form
        onSubmit={handleSubmit((formData: any) => {
          if (selectedPlots.length > 0) {
            if (data?.title === DialogTypesForDonation.BHUDAAN) {
              // For BhumiDaan flow send only an array of plot IDs
              formData.plotIds = selectedPlots.map(p => p._id);
            } else {
              // For other flows send detailed plot objects including contact
              formData.plotIds = selectedPlots.map(p => ({
                plotId: p._id,
                plotNumber: p.plotNumber,
                contact: landContacts[p._id] || {},
              }));
            }
            setValue("plotIds", formData.plotIds);


            if (data?.title === DialogTypesForDonation.BHUDAAN) {
              const firstId = selectedPlots[0]._id;
              const primary = landContacts[firstId] || {};
              const keys: Array<keyof typeof primary> = [
                "name",
                "fatherName",
                "motherName",
                "phoneNumber",
                "email",
                "address",
              ];
              keys.forEach(k => {
                const val = primary[k as string];
                if (val !== undefined && val !== null && val !== "") {
                  formData[k as string] = val;
                  try {
                    setValue(k as string, val);
                  } catch (e) {
                    console.warn("Failed to set value for key:", k, e);
                  }
                }
              });
            }
          }
          onSubmit(formData);
        })}
        className="space-y-4"
        id="donationForm">

        {(data?.title !== DialogTypesForDonation.BHUDAAN || selectedPlots.length > 0) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-700 mb-4">Contact Details</h3>
          </div>
        )}

        {data?.title !== DialogTypesForDonation.BHUDAAN && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Please enter your name"
                    className="w-full px-3 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                )}
              />
              {errors?.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Father Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father Name</label>
              <Controller
                name="fatherName"
                control={control}
                rules={{ required: "Father name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Last Name e.g John, Mary"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                )}
              />
              {errors?.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>}
            </div>

            {/* Mother Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother Name</label>
              <Controller
                name="motherName"
                control={control}
                rules={{ required: "Mother name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Last Name e.g John, Mary"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                )}
              />
              {errors?.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="+91-(0000 000 0000)"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                )}
              />
              {errors?.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="Your email@gmail.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                )}
              />
              {errors?.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <Controller
                name="address"
                control={control}
                rules={{ required: "Address is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="Park Avenue Street"
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
            <h3 className="text-lg font-semibold text-red-700 mb-2">Contact Information</h3>
            {selectedPlots.map((plot, idx) => (
              <div key={plot._id} className="p-4 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-md font-bold">Land {plot.plotNumber} Details</h4>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        value={landContacts[plot._id]?.name || ""}
                        onChange={e => handleLandContactChange(plot._id, "name", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Father Name</label>
                      <input
                        value={landContacts[plot._id]?.fatherName || ""}
                        onChange={e => handleLandContactChange(plot._id, "fatherName", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mother Name</label>
                      <input
                        value={landContacts[plot._id]?.motherName || ""}
                        onChange={e => handleLandContactChange(plot._id, "motherName", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        value={landContacts[plot._id]?.phoneNumber || ""}
                        onChange={e => handleLandContactChange(plot._id, "phoneNumber", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        value={landContacts[plot._id]?.email || ""}
                        onChange={e => handleLandContactChange(plot._id, "email", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        value={landContacts[plot._id]?.address || ""}
                        onChange={e => handleLandContactChange(plot._id, "address", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none"
                      />
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
                      <span>Same Details for other Lands</span>
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
