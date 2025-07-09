import React from 'react';

export const Contact = (): JSX.Element => {
      return (
    <div className="bg-white flex flex-row justify-center w-full min-h-screen">
      <div className="bg-white overflow-hidden w-[1440px] relative">
        <main className="px-[80px] py-[60px]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#8b0000] mb-4 [font-family:'Marcellus',Helvetica]">
              Contact Us
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 [font-family:'Tenor_Sans',Helvetica]">
              Get in touch with us for any inquiries, spiritual guidance, or to learn more about our services.
            </p>
            
            <div className="bg-[#ece5df] p-8 rounded-none max-w-lg mx-auto">
              <h3 className="text-xl font-semibold text-[#4c291e] mb-4 [font-family:'Marcellus',Helvetica]">
                Reach Out to Us
              </h3>
              <div className="space-y-4 text-left">
                <div>
                  <strong className="text-[#4c291e]">Phone:</strong>
                  <p className="text-gray-700">+91 9876543210</p>
                </div>
                <div>
                  <strong className="text-[#4c291e]">Email:</strong>
                  <p className="text-gray-700">info@support.com</p>
                </div>
                <div>
                  <strong className="text-[#4c291e]">Address:</strong>
                  <p className="text-gray-700">1080 Brickell Ave, Miami (Florida)<br />United States</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <a 
                href="/"
                className="bg-[#8b0000] text-white px-6 py-3 rounded-none hover:bg-[#660000] transition-colors [font-family:'Tenor_Sans',Helvetica]"
              >
                Back to Home
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Contact; 