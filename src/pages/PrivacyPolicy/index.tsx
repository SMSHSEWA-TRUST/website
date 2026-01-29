import React, { Suspense } from 'react';
import { ComponentLoader } from '@/components/ui/LoadingComponents';
// Lazy load hero to reuse site look-and-feel
const HeroSection = React.lazy(() => import('@/components/common/HeroSection'));

export const PrivacyPage = (): JSX.Element => {
    return (
        <>
            <Suspense fallback={<ComponentLoader height="h-[40vh]" className="rounded-none" />}>
                <HeroSection pageKey="privacy" />
            </Suspense>

            <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-12 font-secondaryFont textDescription text-gray-800 leading-relaxed">
                <div className="prose prose-lg max-w-none">

                    <h1 className="font-primaryFont textHeadingLg text-[#8b0000]">Privacy Policy</h1>

                    <p>Welcome to the website of Shree Mahakaleshwar Salasar Hanuman Sewa Trust. We are committed to protecting the privacy of our devotees, visitors, and donors. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://new.smshsewatrust.com" target="_blank" rel="noopener noreferrer" className="text-secondaryColor underline">https://new.smshsewatrust.com</a> and interact with our services.</p>

                    <p>By using our website, you agree to the terms of this Privacy Policy. If you do not agree with the terms, please do not access or use our site.</p>

                    <h2><strong>1. Information We Collect</strong></h2>
                    <p>We may collect personal information from you in various ways, including when you:</p>
                    <ul>
                        <li>Make a donation</li>
                        <li>Register for events or services</li>
                        <li>Subscribe to newsletters or updates</li>
                        <li>Contact us via forms, email, or phone</li>
                        <li>Participate in surveys or feedback forms</li>
                        <li>Visit our website (via cookies and analytics)</li>
                    </ul>

                    <p>The types of personal information we may collect include:</p>
                    <ul>
                        <li><strong>Contact Information:</strong> Name, email address, postal address, phone number.</li>
                        <li><strong>Demographic Information:</strong> Date of birth, gender (optional).</li>
                        <li><strong>Donation Information:</strong> Donation amount, payment method (though actual payment details like credit card numbers are typically processed securely by third-party payment gateways and not stored by us).</li>
                        <li><strong>Pooja/Service Request Details:</strong> Specific requests related to temple services.</li>
                        <li><strong>Technical Data:</strong> IP address, browser type, operating system, referring URLs, pages viewed, and access times.</li>
                    </ul>

                    <h2><strong>2. How We Use Your Information</strong></h2>
                    <p>We use the information we collect for various purposes, including:</p>
                    <ul>
                        <li>To provide services: Fulfilling pooja requests, event registrations, and other temple-related services.</li>
                        <li>To process donations: Acknowledging contributions and issuing receipts.</li>
                        <li>To communicate with you: Sending updates, newsletters, event invitations, and responding to your inquiries.</li>
                        <li>To improve our website: Analyzing user behavior to enhance user experience and site functionality.</li>
                        <li>For internal record keeping: Maintaining databases of devotees and donors.</li>
                        <li>For legal and regulatory compliance: Meeting requirements for non-profit organizations.</li>
                        <li>To personalize your experience: Tailoring content and communications based on your interests (if applicable).</li>
                        <li>For security purposes: Protecting our website and services from fraud and abuse.</li>
                    </ul>

                    <h2><strong>3. Disclosure of Your Information</strong></h2>
                    <p>We value your privacy and do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:</p>
                    <ul>
                        <li><strong>With Service Providers:</strong> We may share data with trusted third-party service providers who assist us in operating our website, conducting our business, or serving our users, such as payment gateway providers, email service providers, and analytics providers. These third parties are obligated to keep your information confidential.</li>
                        <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
                        <li><strong>To Protect Rights and Safety:</strong> We may disclose information when we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies, suspected fraud, situations involving potential threats to the safety of any person, or as evidence in legal proceedings.</li>
                        <li><strong>With Your Consent:</strong> We may share your information with other third parties with your explicit consent.</li>
                    </ul>

                    <h2><strong>4. Data Security</strong></h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information. These include:</p>
                    <ul>
                        <li>Secure Socket Layer (SSL) technology for encrypted communication.</li>
                        <li>Restricted access to personal information to authorized personnel only.</li>
                        <li>Regular security audits and updates.</li>
                        <li>Use of reputable third-party services for payment processing and data storage.</li>
                    </ul>

                    <p>However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.</p>

                    <h2><strong>5. Third-Party Websites</strong></h2>
                    <p>Our website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</p>

                    <h2><strong>6. Cookies and Tracking Technologies</strong></h2>
                    <p>We use cookies and similar tracking technologies to track the activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>

                    <h2><strong>7. Your Rights</strong></h2>
                    <p>Depending on your jurisdiction, you may have the following rights regarding your personal information:</p>
                    <ul>
                        <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                        <li><strong>Correction:</strong> Request that we correct any inaccurate or incomplete information.</li>
                        <li><strong>Deletion:</strong> Request the deletion of your personal information, subject to legal and operational requirements.</li>
                        <li><strong>Opt-out:</strong> Opt-out of receiving marketing communications from us at any time by following the unsubscribe link in our emails.</li>
                    </ul>

                    <p>To exercise any of these rights, please contact us using the details provided below.</p>

                    <h2><strong>8. Children's Privacy</strong></h2>
                    <p>Our website is not intended for individuals under the age of 13. We do not knowingly collect personally identifiable information from anyone under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

                    <h2><strong>9. Changes to This Privacy Policy</strong></h2>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

                    <h2><strong>10. Contact Us</strong></h2>
                    <p>If you have any questions about this Privacy Policy, our data handling practices, or wish to exercise your rights, please contact us</p>
                </div>
            </section>
        </>
    );
};

export default PrivacyPage;
