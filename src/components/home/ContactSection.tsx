import React from "react";
import {Card, CardContent} from "../ui/card";
import {Textarea} from "../ui/textarea";
import {Button} from "../ui/button";
import contactBg from "@/assets/images/image-7.webp";
import contactLine from "@/assets/images/line-4.png";
import contactMain from "@/assets/images/image-6.webp";
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Controller, useForm} from "react-hook-form";
import {useContactUSForm} from "@/api/ContactQueries";

type userProps = {
  name: string;
  phone: string;
  email: string;
};

export const ContactSection: React.FC = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? (JSON.parse(storedUser) as userProps) : null;
  const {mutate} = useContactUSForm();

  const DefaultValues = {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    message: "",
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: DefaultValues,
  });

  const hanldeSubmitForm = (data: any) => {
    mutate(data, {
      onSuccess: () => {
        reset(DefaultValues);
      },
    });
  };

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-0 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] overflow-hidden rounded-lg  ">
        {/* Left Section - Background Image with Contact Form */}
        <div
          className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 lg:p-8  rounded-lg "
          style={{backgroundImage: `url(${contactBg})`}}>
          {/* Overlay for better form visibility */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Contact Form Card */}
          <Card className="relative z-10 w-full max-w-md bg-[#ece5df] shadow-xl rounded-lg  ">
            <CardContent className="p-2 sm:p-4 md:p-6 lg:p-8">
              {/* Header Section */}
              <div className="text-center mb-8">
                <h3 className="font-primaryFont font-normal text-[rgba(255, 255, 255, 1)] textHeading mb-3">
                  Reach Out to us
                </h3>

                {/* Decorative Line */}
                <div className="flex justify-center mb-4">
                  <LazyLoadImage
                    className="w-64 h-4 object-contain"
                    alt="Decorative Line"
                    src={contactLine}
                    loading="lazy"
                  />
                </div>

                <h2 className="font-primaryFont font-normal text-[#4c291e] textHeadingLg leading-tight mb-4">
                  We will get Back to You
                </h2>

                <p className="textDescription font-secondaryFont font-normal text-[#1e1e1e]/50  leading-relaxed">
                  Your bridge to meaningful communication and personalized assistance, we're here to
                  listen and assist you
                </p>
              </div>

              {/* Contact Form */}
              <form
                className="space-y-4"
                id="contact-us-form"
                onSubmit={handleSubmit(hanldeSubmitForm)}>
                {/* Name Fields */}
                <div>
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: "Name is required",
                    }}
                    render={({field}) => (
                      <input
                        {...field}
                        placeholder="Please enter your name"
                        className="w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:border-transparent outline-none"
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{required: "Phone number is required"}}
                    render={({field}) => (
                      <input
                        {...field}
                        placeholder="Enter phone number"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none"
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
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
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Message */}
                <Controller
                  name="message"
                  control={control}
                  render={({field}) => (
                    <Textarea
                      {...field}
                      className="bg-white border-gray-200 rounded-sm focus:ring-2 focus:ring-secondaryColor focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                      placeholder="Your message goes here"
                    />
                  )}
                />

                {/* Submit Button */}
                <div className="pt-6 flex justify-center">
                  <Button
                    type="submit"
                    className="bg-[#8B0000] hover:bg-[#a32d13] text-white px-8 py-3 rounded-sm transition-colors duration-200 font-secondaryFont font-normal textDescription tracking-wide shadow-md hover:shadow-lg">
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Main Image */}
        <div className="relative h-64 sm:h-80 lg:min-h-[700px] lg:h-full">
          <LazyLoadImage
            className="w-full h-full object-cover"
            alt="Temple Architecture"
            src={contactMain}
            loading="lazy"
          />

          {/* Optional overlay for visual consistency */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  );
};
