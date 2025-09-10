import React from "react";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import contactBg from "@/assets/images/image-7.webp";
import contactLine from "@/assets/images/line-4.png";
import contactMain from "@/assets/images/image-6.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Controller, useForm } from "react-hook-form";
import { useContactUSForm } from "@/api/ContactQueries";
import { useI18n } from '@/lib/i18n';

type userProps = {
  name: string;
  phone: string;
  email: string;
};

export const ContactSection: React.FC = () => {
  const { t } = useI18n();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? (JSON.parse(storedUser) as userProps) : null;
  const { mutate } = useContactUSForm();

  const DefaultValues = {
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    message: "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
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
      <div className="grid grid-cols-1 lg:grid-cols-[50%_50%] gap-0 overflow-hidden rounded-lg">
        {/* Left Section - Background Image with Contact Form */}
        <div
          className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center rounded-lg h-[638px] md:h-[700px] lg:h-[638px]"
          style={{ backgroundImage: `url(${contactBg})` }}>
          {/* Overlay for better form visibility */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Contact Form Card */}
          <Card className="relative z-10 w-full max-w-[312px] sm:max-w-[382px] lg:max-w-[450px] bg-[#FFFFFF] shadow-xl rounded-lg">
            <CardContent>
              {/* Header Section */}
              <div className="text-center mt-4">
                <h3 className="font-primaryFont text-[rgba(255, 255, 255, 1)] textHeading">
                  {t('contact.title')}
                </h3>

                {/* Decorative Line */}
                <div className="flex justify-center">
                  <LazyLoadImage
                    className="w-64 h-4 object-contain"
                    alt={t('contact.decorativeAlt') as string}
                    src={contactLine}
                    loading="lazy"
                  />
                </div>

                <h2 className="font-primaryFont font-normal text-[#4c291e] textHeading leading-tight mt-2 mb-2">
                  {t('contact.subtitle')}
                </h2>

                <p className="textDescription font-secondaryFont font-normal text-[#1e1e1e]/50 leading-relaxed mb-2">
                  {t('contact.lead')}
                </p>
              </div>

              {/* Contact Form */}
              <form className="space-y-2" id="contact-us-form" onSubmit={handleSubmit(hanldeSubmitForm)}>
                {/* Name Field */}
                <div>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: t('contact.form.nameRequired') as string }}
                    render={({ field }) => (
                      <Input {...field} placeholder={t('contact.form.namePlaceholder') as string} className="px-3 py-2" />
                    )}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: t('contact.form.phoneRequired') as string }}
                    render={({ field }) => (
                      <Input {...field} type="tel" placeholder={t('contact.form.phonePlaceholder') as string} className="px-3 py-2" />
                    )}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: t('contact.form.emailRequired') as string,
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('contact.form.emailInvalid') as string },
                    }}
                    render={({ field }) => (
                      <Input {...field} type="email" placeholder={t('contact.form.emailPlaceholder') as string} className="px-3 py-2" />
                    )}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Message */}
                <Controller
                  name="message"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="bg-white border border-gray-200 rounded-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 min-h-[100px] resize-none hover:border-black"
                      placeholder={t('contact.form.messagePlaceholder') as string}
                    />
                  )}
                />

                {/* Submit Button */}
                <div className="pt-4 flex justify-center">
                  <Button type="submit" className="bg-[#8B0000] hover:bg-black text-white px-8 py-3 rounded-sm transition-colors duration-200 font-secondaryFont font-normal textDescription tracking-wide shadow-md hover:shadow-lg">
                    {t('contact.form.submit')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Main Image */}
        <div className="relative h-[300px] md:h-[400px] lg:h-[638px]">
          <LazyLoadImage className="w-full h-full object-cover" alt={t('contact.mainImageAlt') as string} src={contactMain} loading="lazy" />

          {/* Optional overlay for visual consistency */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
        </div>
      </div>
    </section>
  );
};
