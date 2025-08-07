
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import contactBg from '@/assets/images/image-7.webp';
import contactLine from '@/assets/images/line-4.png';
import contactMain from '@/assets/images/image-6.webp';
import { LazyLoadImage } from 'react-lazy-load-image-component';

export const ContactSection: React.FC = () => {
    return (
        <section className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-0 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] overflow-hidden rounded-lg lg:rounded-none shadow-lg lg:shadow-none">

                {/* Left Section - Background Image with Contact Form */}
                <div className="relative bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 lg:p-8"
                    style={{ backgroundImage: `url(${contactBg})` }}>

                    {/* Overlay for better form visibility */}
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Contact Form Card */}
                    <Card className="relative z-10 w-full max-w-md bg-[#ece5df] shadow-xl rounded-lg lg:rounded-none border-0">
                        <CardContent className="p-2 sm:p-4 md:p-6 lg:p-8">

                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <h3 className="font-marcellus font-normal text-[rgba(255, 255, 255, 1)] text-lg sm:text-xl mb-3">
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

                                <h2 className="font-['Marcellus',serif] font-normal text-[#4c291e] text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4">
                                    We will get Back to You
                                </h2>

                                <p className="font-['Tenor_Sans',sans-serif] font-normal text-[#1e1e1e]/50 text-sm leading-relaxed">
                                    Your bridge to meaningful communication and personalized assistance, we're here to listen and assist you
                                </p>
                            </div>

                            {/* Contact Form */}
                            <form className="space-y-4">
                                {/* Name Fields */}
                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                    <Input
                                        className="bg-white border-gray-200 rounded-sm focus:ring-2 focus:ring-[#8b0000] focus:border-transparent transition-all duration-200"
                                        placeholder="First Name"
                                        type="text"
                                    />
                                    <Input
                                        className="bg-white border-gray-200 rounded-sm focus:ring-2 focus:ring-[#8b0000] focus:border-transparent transition-all duration-200"
                                        placeholder="Last Name"
                                        type="text"
                                    />
                                </div>

                                {/* Mobile Number */}
                                <Input
                                    className="bg-white border-gray-200 rounded-sm focus:ring-2 focus:ring-[#8b0000] focus:border-transparent transition-all duration-200"
                                    placeholder="Mobile Number"
                                    type="tel"
                                />

                                {/* Email */}
                                <Input
                                    className="bg-white border-gray-200 rounded-sm focus:ring-2 focus:ring-[#8b0000] focus:border-transparent transition-all duration-200"
                                    placeholder="Email ID"
                                    type="email"
                                />

                                {/* Message */}
                                <Textarea
                                    className="bg-white border-gray-200 rounded-sm focus:ring-2 focus:ring-[#8b0000] focus:border-transparent transition-all duration-200 min-h-[100px] resize-none"
                                    placeholder="Message"
                                />

                                {/* Submit Button */}
                                <div className="pt-6 flex justify-center">
                                    <Button
                                        type="submit"
                                        className="bg-[#8b0000] hover:bg-[#a32d13] text-white px-8 py-3 rounded-sm transition-colors duration-200 font-['Tenor_Sans',sans-serif] font-normal text-sm tracking-wide shadow-md hover:shadow-lg"
                                    >
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