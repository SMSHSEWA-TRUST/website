import React, {useState} from "react";
import {useForm, Controller} from "react-hook-form";

type DonationFormProps = {
  onSubmit: (data: any) => void;
  category: string;
  onAmountChange?: (amount: number) => void;
  data: any;
};

type userProps = {
  name: string;
  phone: string;
  email: string;
};

const DonationForm: React.FC<DonationFormProps> = ({onSubmit, onAmountChange, data}) => {
  const [selectedOption, setSelectedOption] = useState(data?.daanTypes?.[0] ?? null);
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? (JSON.parse(storedUser) as userProps) : null;
  const DefaultValues = {
    donationDocId: data?.daanTypes?.[0]?._id ?? "",
    name: user?.name ?? "",
    fatherName: "",
    motherName: "",
    phoneNumber: user?.phone ?? "",
    email: user?.email ?? "",
    address: "",
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    setValue,
  } = useForm({
    defaultValues: DefaultValues,
  });
  const handleDonationSelect = (option: {_id: string; name: string; amount: number}) => {
    setSelectedOption(option);
    setValue("donationDocId", option._id);
    onAmountChange?.(option?.amount ?? 0);
  };

  return (
    <div className="space-y-6">
      {/* Donation Type Selection */}
      <div className="space-y-4">
        {data?.daanTypes?.length > 0 &&
          data?.daanTypes.map((option: {_id: string; name: string; amount: number}) => (
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
                    checked={selectedOption._id === option._id}
                    onChange={() => handleDonationSelect(option)}
                    className="w-5 h-5 text-orange-600 border-2 border-gray-300 focus:ring-orange-500"
                  />
                  {selectedOption._id === option._id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full"></div>
                    </div>
                  )}
                </div>
                <label className="text-sm font-medium text-gray-700 cursor-pointer">
                  {option.name}
                </label>
              </div>
            </div>
          ))}
      </div>

      {/* Contact Details Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-700 mb-4">Contact Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Controller
              name="name"
              control={control}
              rules={{required: "Name is required"}}
              render={({field}) => (
                <input
                  {...field}
                  placeholder="Please enter your name"
                  className="w-full px-3 py-2.5 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              )}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Father Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Father Name</label>
            <Controller
              name="fatherName"
              control={control}
              rules={{required: "Father name is required"}}
              render={({field}) => (
                <input
                  {...field}
                  placeholder="Last Name e.g John, Mary"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              )}
            />
            {errors.fatherName && (
              <p className="text-red-500 text-xs mt-1">{errors.fatherName.message}</p>
            )}
          </div>

          {/* Mother Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mother Name</label>
            <Controller
              name="motherName"
              control={control}
              rules={{required: "Mother name is required"}}
              render={({field}) => (
                <input
                  {...field}
                  placeholder="Last Name e.g John, Mary"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              )}
            />
            {errors.motherName && (
              <p className="text-red-500 text-xs mt-1">{errors.motherName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{required: "Phone number is required"}}
              render={({field}) => (
                <input
                  {...field}
                  placeholder="+91-(0000 000 0000)"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
            )}
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
              render={({field}) => (
                <input
                  {...field}
                  type="email"
                  placeholder="Your email@gmail.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              )}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <Controller
              name="address"
              control={control}
              rules={{required: "Address is required"}}
              render={({field}) => (
                <input
                  {...field}
                  placeholder="Park Avenue Street"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              )}
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
