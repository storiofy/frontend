export default function PrivacyPolicyPage() {
    const lastUpdated = 'January 27, 2025';

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12 lg:py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-purple-100">
                        Last Updated: {lastUpdated}
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="prose prose-lg max-w-none">
                    {/* Introduction */}
                    <section className="mb-8">
                        <p className="text-gray-700 leading-relaxed">
                            At Storiofy, we are committed to protecting your privacy and the privacy of your children. 
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                            you visit our website and use our services. Please read this privacy policy carefully.
                        </p>
                        <p className="text-gray-700 leading-relaxed mt-4">
                            By using our website and services, you consent to the data practices described in this policy. 
                            If you do not agree with the practices described in this policy, please do not use our services.
                        </p>
                    </section>

                    {/* Information We Collect */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.1 Personal Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</li>
                            <li><strong>Profile Information:</strong> Avatar, preferred language, currency, country, timezone, date of birth, and marketing preferences</li>
                            <li><strong>Order Information:</strong> Shipping and billing addresses, payment information, and order history</li>
                            <li><strong>Personalization Data:</strong> Child's name, age, photos, and language preferences for personalized products</li>
                            <li><strong>Communication:</strong> Information you provide when contacting customer support or participating in surveys</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.2 Automatically Collected Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When you visit our website, we automatically collect certain information, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                            <li><strong>Usage Information:</strong> Pages visited, time spent on pages, links clicked, search queries</li>
                            <li><strong>Location Information:</strong> General location based on IP address (with your permission)</li>
                            <li><strong>Cookies and Tracking Technologies:</strong> See our Cookies section below for more details</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1.3 Children's Information</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            In compliance with the Children's Online Privacy Protection Act (COPPA), we collect limited information 
                            about children only when necessary to provide personalized products. This includes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li>Child's first name (for personalization)</li>
                            <li>Child's age (for age-appropriate product recommendations)</li>
                            <li>Child's photo (for personalization, with parental consent)</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We do not knowingly collect personal information from children under 13 without verifiable parental consent. 
                            If you believe we have collected information from a child under 13 without consent, please contact us immediately.
                        </p>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use the information we collect for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li><strong>Service Delivery:</strong> To process and fulfill your orders, create personalized products, and provide customer support</li>
                            <li><strong>Account Management:</strong> To create and manage your account, authenticate users, and maintain account security</li>
                            <li><strong>Personalization:</strong> To customize your experience, recommend products, and create personalized books and stickers</li>
                            <li><strong>Communication:</strong> To send order confirmations, shipping updates, respond to inquiries, and send marketing communications (with your consent)</li>
                            <li><strong>Improvement:</strong> To analyze usage patterns, improve our website and services, and develop new features</li>
                            <li><strong>Legal Compliance:</strong> To comply with legal obligations, enforce our terms of service, and protect our rights</li>
                            <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security threats</li>
                        </ul>
                    </section>

                    {/* Information Sharing and Disclosure */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We do not sell your personal information. We may share your information in the following circumstances:
                        </p>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.1 Service Providers</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We share information with third-party service providers who perform services on our behalf, including:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li>Payment processors for payment transactions</li>
                            <li>Shipping carriers for order fulfillment</li>
                            <li>Cloud storage providers (e.g., AWS S3) for file storage</li>
                            <li>Email service providers for communications</li>
                            <li>Analytics providers for website analytics</li>
                            <li>Face detection services (e.g., AWS Rekognition) for photo validation</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            These service providers are contractually obligated to protect your information and use it only for the purposes we specify.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.2 Legal Requirements</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may disclose your information if required by law, court order, or government regulation, or if we believe 
                            disclosure is necessary to protect our rights, protect your safety or the safety of others, or investigate fraud.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3.3 Business Transfers</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. 
                            We will notify you of any such change in ownership or control of your personal information.
                        </p>
                    </section>

                    {/* Data Security */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We implement appropriate technical and organizational measures to protect your personal information against 
                            unauthorized access, alteration, disclosure, or destruction. These measures include:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li>Encryption of sensitive data in transit and at rest</li>
                            <li>Secure password hashing using BCrypt</li>
                            <li>Regular security assessments and updates</li>
                            <li>Access controls and authentication mechanisms</li>
                            <li>Secure cloud storage with AWS S3</li>
                            <li>Regular backups and disaster recovery procedures</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
                            to protect your information, we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal information:
                        </p>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.1 Access and Portability</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You have the right to access and receive a copy of your personal information in a structured, 
                            machine-readable format.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.2 Correction</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You can update your account information at any time through your account settings. You may also 
                            request corrections to inaccurate or incomplete information.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.3 Deletion</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You can request deletion of your personal information, subject to legal and contractual obligations. 
                            We will delete your information in accordance with applicable laws and our data retention policies.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.4 Objection and Restriction</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You may object to certain processing of your information or request restriction of processing in 
                            certain circumstances.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.5 Withdraw Consent</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Where processing is based on consent, you may withdraw your consent at any time. This will not affect 
                            the lawfulness of processing before consent was withdrawn.
                        </p>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">5.6 Opt-Out of Marketing</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You can opt-out of marketing communications at any time by clicking the unsubscribe link in our emails 
                            or updating your preferences in your account settings.
                        </p>

                        <p className="text-gray-700 leading-relaxed mb-4 mt-6">
                            To exercise any of these rights, please contact us using the contact information provided below. 
                            We will respond to your request within 30 days.
                        </p>
                    </section>

                    {/* Cookies and Tracking Technologies */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking Technologies</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to collect and store information about your interactions 
                            with our website. Cookies are small text files stored on your device.
                        </p>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.1 Types of Cookies We Use</h3>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li><strong>Essential Cookies:</strong> Required for the website to function properly (e.g., authentication, security)</li>
                            <li><strong>Functional Cookies:</strong> Remember your preferences and settings (e.g., language, currency)</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website (e.g., Google Analytics)</li>
                            <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">6.2 Managing Cookies</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You can control cookies through your browser settings. However, disabling certain cookies may affect 
                            the functionality of our website. You can also opt-out of certain third-party cookies through the 
                            Digital Advertising Alliance or Network Advertising Initiative.
                        </p>
                    </section>

                    {/* Third-Party Services */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our website may contain links to third-party websites or integrate third-party services. We are not 
                            responsible for the privacy practices of these third parties. We encourage you to review their privacy 
                            policies before providing any information.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Third-party services we use include:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li><strong>AWS Services:</strong> S3 for file storage, Rekognition for face detection</li>
                            <li><strong>Payment Processors:</strong> Stripe, PayPal, or other payment gateways</li>
                            <li><strong>Analytics:</strong> Google Analytics for website analytics</li>
                            <li><strong>Email Services:</strong> For transactional and marketing emails</li>
                            <li><strong>Social Media:</strong> Social media platforms for sharing and authentication</li>
                        </ul>
                    </section>

                    {/* Data Retention */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                            Privacy Policy, unless a longer retention period is required or permitted by law. Specifically:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period after account closure</li>
                            <li><strong>Order Information:</strong> Retained for at least 7 years for tax and legal compliance</li>
                            <li><strong>Personalization Data:</strong> Retained until you request deletion or account closure</li>
                            <li><strong>Marketing Data:</strong> Retained until you opt-out or unsubscribe</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We will delete or anonymize your information when it is no longer needed, subject to legal obligations.
                        </p>
                    </section>

                    {/* International Data Transfers */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Your information may be transferred to and processed in countries other than your country of residence. 
                            These countries may have data protection laws that differ from those in your country.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            When we transfer your information internationally, we ensure appropriate safeguards are in place, 
                            such as standard contractual clauses approved by relevant data protection authorities.
                        </p>
                    </section>

                    {/* Children's Privacy */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy (COPPA Compliance)</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Our services are designed for parents and guardians to create personalized products for children. 
                            We comply with the Children's Online Privacy Protection Act (COPPA) and other applicable laws 
                            protecting children's privacy.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Parental Consent:</strong> We require verifiable parental consent before collecting, using, 
                            or disclosing personal information from children under 13. Parents can review, request deletion, 
                            or refuse further collection of their child's information at any time.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            <strong>Limited Collection:</strong> We only collect the minimum information necessary to provide 
                            personalized products. We do not collect information from children directly without parental involvement.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you are a parent and believe we have collected information from your child without consent, 
                            please contact us immediately.
                        </p>
                    </section>

                    {/* Changes to This Privacy Policy */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
                            operational, or regulatory reasons. We will notify you of any material changes by:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                            <li>Posting the updated policy on this page with a new "Last Updated" date</li>
                            <li>Sending an email notification to registered users</li>
                            <li>Displaying a prominent notice on our website</li>
                        </ul>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Your continued use of our services after the effective date of the updated policy constitutes 
                            acceptance of the changes.
                        </p>
                    </section>

                    {/* Contact Information */}
                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                            please contact us:
                        </p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-4">
                            <p className="text-gray-700 mb-2">
                                <strong>Storiofy Privacy Team</strong>
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Email:</strong>{' '}
                                <a 
                                    href="mailto:privacy@Storiofy.com" 
                                    className="text-indigo-600 hover:text-indigo-700 underline"
                                >
                                    privacy@Storiofy.com
                                </a>
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Support Email:</strong>{' '}
                                <a 
                                    href="mailto:support@Storiofy.com" 
                                    className="text-indigo-600 hover:text-indigo-700 underline"
                                >
                                    support@Storiofy.com
                                </a>
                            </p>
                            <p className="text-gray-700">
                                <strong>Address:</strong> Storiofy, Inc.<br />
                                123 Innovation Drive<br />
                                San Francisco, CA 94105<br />
                                United States
                            </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed mt-6">
                            For users in the European Economic Area (EEA), you also have the right to lodge a complaint with 
                            your local data protection authority if you believe we have violated applicable data protection laws.
                        </p>
                    </section>

                    {/* Effective Date */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            <strong>Effective Date:</strong> {lastUpdated}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            This Privacy Policy is effective as of the date listed above and applies to all information collected 
                            by Storiofy from the date of implementation forward.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}




