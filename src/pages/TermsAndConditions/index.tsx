import React, { Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/LoadingComponents';
// Lazy load hero to reuse site look-and-feel
const HeroSection = React.lazy(() => import('@/components/common/HeroSection'));

export const TermsPage = (): JSX.Element => {
    return (
        <>
            <Suspense fallback={<ComponentLoader height="h-[40vh]" className="rounded-none" />}>
                <HeroSection pageKey="terms" />
            </Suspense>

            <section className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12 font-secondaryFont textDescription text-gray-800 leading-relaxed">
                <div className="prose prose-lg max-w-none">

                    <h1 className="font-primaryFont textHeadingLg text-[#8b0000]">Terms and Conditions</h1>

                    <p>Welcome to the official website of Shree Mahakaleshwar Salasar Hanuman Sewa Trust. These Terms and Conditions ("Terms") govern your use of our website <a href="https://new.smshsewatrust.com" target="_blank" rel="noopener noreferrer" className="text-secondaryColor underline">https://new.smshsewatrust.com</a> and the services, content, and products offered through it.</p>

                    <p>By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the website.</p>

                    <h2><strong>1. Acceptance of Terms</strong></h2>
                    <p>Your access to and use of the Shree Mahakaleshwar Salasar Hanuman Sewa Trust website is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the website.</p>

                    <h2><strong>2. Services Offered</strong></h2>
                    <p>Shree Mahakaleshwar Salasar Hanuman Sewa Trust provides various services through its website, which may include:</p>
                    <ul>
                        <li>Information about the temple, its history, and activities.</li>
                        <li>Donation facilities for various causes and initiatives.</li>
                        <li>Online booking for pujas, sevas, and other religious services.</li>
                        <li>Registration for events, discourses, and spiritual programs.</li>
                        <li>Access to spiritual content, articles, and media.</li>
                    </ul>

                    <h2><strong>3. Donations</strong></h2>
                    <p><strong>Voluntary Contributions:</strong> All donations made through this website are voluntary contributions to Shree Mahakaleshwar Salasar Hanuman Sewa Trust.</p>
                    <p><strong>Use of Funds:</strong> Donations are utilized for the maintenance and development of the temple, charitable activities, community services, religious programs, and other objectives aligned with the Trust's mission.</p>
                    <p><strong>Payment Gateway:</strong> Donations are processed through secure third-party payment gateways. We do not store your credit card or bank details. All transactions are subject to the terms and conditions of the respective payment gateway providers.</p>
                    <p><strong>Receipts:</strong> Upon successful completion of a donation, a digital receipt will typically be generated and sent to your registered email address.</p>
                    <p><strong>Refund Policy for Donations:</strong> Donations are generally non-refundable. However, in cases of technical error, duplicate transaction, or unauthorized transaction, you may contact us within [Number] days of the transaction for assistance. Any refund decisions will be at the sole discretion of the Trust.</p>

                    <h2><strong>4. Online Booking for Pujas/Sevas/Events</strong></h2>
                    <p><strong>Booking Confirmation:</strong> Bookings for pujas, sevas, or events made through the website are subject to availability and confirmation by the Trust. A confirmation will be sent to your registered email address.</p>
                    <p><strong>Accuracy of Information:</strong> You are responsible for providing accurate and complete information during the booking process.</p>
                    <p><strong>Cancellation/Modification:</strong> Cancellation or modification of booked services or event registrations may be subject to specific terms and conditions outlined at the time of booking, or as per the Trust's policies. Please contact us for further details.</p>
                    <p><strong>Refund Policy for Services/Events:</strong> Refunds for cancelled bookings or event registrations will be processed as per the specific policy communicated at the time of booking or event registration.</p>
                    <p><strong>Trust's Discretion:</strong> The Trust reserves the right to cancel or postpone any puja, seva, or event due to unforeseen circumstances without prior notice. In such cases, appropriate refunds or alternative arrangements will be offered.</p>

                    <h2><strong>5. User Accounts</strong></h2>
                    <p>Some features of the website may require you to create an account. You are responsible for maintaining the confidentiality of your account password and for all activities that occur under your account.</p>
                    <p>You agree to notify us immediately of any unauthorized use of your account.</p>
                    <p>The Trust reserves the right to suspend or terminate your account at its sole discretion, without notice, for any breach of these Terms.</p>

                    <h2><strong>6. Intellectual Property</strong></h2>
                    <p>All content on this website, including text, graphics, logos, images, audio clips, digital downloads, and data compilations, is the property of Shree Mahakaleshwar Salasar Hanuman Sewa Trust or its content suppliers and is protected by applicable copyright, trademark, and other intellectual property laws.</p>
                    <p>You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of the website without express written permission from the Trust.</p>

                    <h2><strong>7. Prohibited Uses</strong></h2>
                    <p>You agree not to use the website:</p>
                    <ul>
                        <li>In any way that violates any applicable national or international law or regulation.</li>
                        <li>To transmit, or procure the sending of, any unsolicited or unauthorized advertising or promotional material.</li>
                        <li>To impersonate or attempt to impersonate the Trust, a Trust employee, another user, or any other person or entity.</li>
                        <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the website, or which, as determined by us, may harm the Trust or users of the website.</li>
                        <li>To introduce any viruses, Trojan horses, worms, logic bombs, or other material that is malicious or technologically harmful.</li>
                    </ul>

                    <h2><strong>8. Disclaimer of Warranties</strong></h2>
                    <p>The website is provided on an "AS IS" and "AS AVAILABLE" basis. Shree Mahakaleshwar Salasar Hanuman Sewa Trust makes no representations or warranties of any kind, express or implied, as to the operation of the website or the information, content, materials, or products included on the website. You expressly agree that your use of the website is at your sole risk.</p>

                    <h2><strong>9. Limitation of Liability</strong></h2>
                    <p>In no event shall Shree Mahakaleshwar Salasar Hanuman Sewa Trust, its trustees, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the website; (ii) any conduct or content of any third party on the website; (iii) any content obtained from the website; and (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.</p>

                    <h2><strong>10. Indemnification</strong></h2>
                    <p>You agree to defend, indemnify, and hold harmless Shree Mahakaleshwar Salasar Hanuman Sewa Trust, its trustees, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of your use and access of the website, or your breach of these Terms.</p>

                    <h2><strong>11. Governing Law & Jurisdiction</strong></h2>
                    <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or relating to these Terms or your use of the website shall be subject to the exclusive jurisdiction of the courts located in Surat, Gujarat, India.</p>

                    <h2><strong>12. Changes to Terms and Conditions</strong></h2>
                    <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least [Number] days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our website after those revisions become effective, you agree to be bound by the revised terms.</p>
                </div>
            </section>
        </>
    );
};

export default TermsPage;
