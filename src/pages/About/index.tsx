import React from 'react';

export const About = (): JSX.Element => {
    return (
        <div className="bg-white flex flex-row justify-center w-full min-h-screen">
            <div className="bg-white overflow-hidden w-[1440px] relative">
                <main className="px-[80px] py-[60px]">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold text-[#8b0000] mb-8 [font-family:'Marcellus',Helvetica]">
                            About Shree Mahakaleshwar Salasar Hanuman Sewa Trust
                        </h1>

                        <div className="prose prose-lg">
                            <p className="text-gray-700 mb-6 [font-family:'Tenor_Sans',Helvetica]">
                                Welcome to our sacred space dedicated to the divine worship of Lord Hanuman and
                                Mahakaleshwar. Our trust has been serving the community with devotion and dedication
                                for many years.
                            </p>

                            <p className="text-gray-700 mb-6 [font-family:'Tenor_Sans',Helvetica]">
                                We believe in spreading the message of faith, devotion, and service to humanity.
                                Our temple serves as a beacon of hope and spiritual guidance for all devotees who
                                seek divine blessings.
                            </p>

                            <h2 className="text-2xl font-semibold text-[#8b0000] mt-8 mb-4 [font-family:'Marcellus',Helvetica]">
                                Our Mission
                            </h2>

                            <p className="text-gray-700 mb-6 [font-family:'Tenor_Sans',Helvetica]">
                                To provide a sacred space where devotees can connect with the divine, participate in
                                spiritual activities, and contribute to community welfare through various charitable
                                initiatives.
                            </p>

                            <div className="mt-8">
                                <a
                                    href="/"
                                    className="bg-[#8b0000] text-white px-6 py-3 rounded-none hover:bg-[#660000] transition-colors [font-family:'Tenor_Sans',Helvetica]"
                                >
                                    Back to Home
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default About; 