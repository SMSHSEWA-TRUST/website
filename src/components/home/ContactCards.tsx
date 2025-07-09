import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const ContactCards = (): JSX.Element => {
    return (
        <section className="w-full flex flex-col gap-6 lg:flex-row md:gap-6 mt-10 px-4 md:px-10 lg:px-20 xl:px-32">
            {/* Connect with Us */}
            <Card className="flex-1 bg-[#8b0000] rounded-lg shadow-md flex flex-col justify-between">
                <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                        <img className="w-12 h-12 mb-4" alt="Temple Icon" src="/connect.png" />
                        <h3 className="text-white text-xl md:text-2xl font-semibold mb-3 font-serif">Connect with Us</h3>
                        <p className="text-white text-base font-normal mb-6 font-serif">
                            Reach out and connect with our church community. We're here to welcome, assist, and share in your journey of faith.
                        </p>
                    </div>
                    <div className="flex items-center mt-auto">
                        <img className="w-7 h-7 mr-3" alt="Phone" src="/call.png" />
                        <span className="text-white text-lg md:text-2xl font-semibold font-serif">+91 9876543210</span>
                    </div>
                </CardContent>
            </Card>

            {/* Donate for Cause */}
            <Card className="flex-1 bg-[#ece5df] rounded-lg shadow-md flex flex-col justify-between">
                <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                        <img className="w-12 h-12 mb-4" alt="Charity Icon" src="/donate.png" />
                        <h3 className="text-[#4c291e] text-xl md:text-2xl font-semibold mb-3 font-serif">Donate for Cause</h3>
                        <p className="text-[#4c291e] text-base font-normal mb-6 font-serif">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq
                        </p>
                    </div>
                    <div className="mt-auto">
                        <Button className="w-24 h-10 bg-[#8b0000] rounded-md text-white text-base font-serif hover:bg-[#7a0000] transition-colors">
                            Donate
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Office Timings */}
            <Card className="flex-1 bg-[#d05e2d] rounded-lg shadow-md flex flex-col justify-between">
                <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex-1">
                        <img className="w-12 h-12 mb-4" alt="Time Icon" src="/time.png" />
                        <h3 className="text-white text-xl md:text-2xl font-semibold mb-6 font-serif">Office Timings</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-white text-base font-serif">
                                <span>Monday - Friday</span>
                                <span>8:00 AM - 8:00 PM</span>
                            </div>
                            <div className="flex justify-between text-white text-base font-serif">
                                <span>Saturday - Sunday</span>
                                <span>10:00 AM - 6:00 PM</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default ContactCards;