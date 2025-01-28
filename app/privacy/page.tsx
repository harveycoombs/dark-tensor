import InternalPage, { PageSection } from "@/app/components/common/internal";
import Link from "next/link";

export default function Privacy() {
    return (
        <InternalPage title="Privacy Policy">
            <PageSection>
                <p>We value your privacy and are committed to protecting the personal data you share with us while using our search engine services. The following document outlines how we collect, use, store, and safeguard your information.</p>

                <p>By using our service, you agree to the practices described in this Privacy Policy. Please read it carefully to understand how your information is handled.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">1. Information We Collect</h2>
                <p>We collect various types of information to provide and improve our services, including:</p>

                <h3>a. Information You Provide:</h3>

                <p>Search Queries: When you enter search queries into the search engine, we collect this data to deliver relevant search results.</p>

                <p>Account Information: If you choose to create an account with us, we may collect personal information such as your full name, email address, and other details required for account management.</p>

                <p>Feedback and Communication: When you contact us for support or provide feedback, we may collect your communication and any associated data.</p>

                <h3>b. Information Collected Automatically:</h3>

                <p> Usage Data: We automatically collect data about how you interact with our service, including IP addresses, device types, browser types, language preferences, and the time you spend using the service.</p>

                <p>Cookies and Tracking Technologies: We use cookies and similar technologies to enhance your experience and remember your preferences. You can adjust your browser settings to block or delete cookies, but this may impact certain features of the service.</p>

                <p>c. Data from Third Parties: We may receive data from third-party partners, such as advertisers or analytics services, to improve the relevance of search results and understand usage trends.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">2. How We Use Your Information</h2>
                <p>We use the information we collect for various purposes, including:</p>

                <p>To Provide and Improve Services: Deliver accurate search results and personalize your experience.</p>

                <p>To Communicate with You: Respond to your inquiries, provide updates, and send account-related notifications.</p>

                <p>To Improve Our Search Engine: Analyze usage patterns, perform analytics, and develop new features.</p>

                <p>To Protect and Secure: Detect and prevent fraudulent activities and ensure the security of our systems.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">3. Data Sharing and Disclosure</h2>
                <p>We do not sell, trade, or rent your personal information to third parties. However, we may share information in the following circumstances:</p>

                <p>Service Providers: We may share data with trusted third-party vendors who assist in operating our service, such as hosting providers and analytics partners.</p>

                <p>Legal Compliance: If required by law or to protect our rights, we may disclose information to comply with legal processes or protect the safety of our users and services.</p>

                <p>Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">4. Data Retention</h2>
                <p>We retain your information for as long as necessary to fulfill the purposes outlined in this Privacy Policy or as required by law. If you delete your account, we will make reasonable efforts to remove your personal information from our records, subject to legal obligations.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">5. Data Security</h2>
                <p>We take reasonable precautions to protect your information from unauthorized access, alteration, or disclosure. However, no system is entirely secure, and we cannot guarantee absolute security.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">6. Your Rights and Choices</h2>
                <p>You have the following rights regarding your personal data:</p>

                <p>Access and Correction: You can access and update your personal information in your account settings or by contacting us.</p>

                <p>Deletion: You can request the deletion of your account and associated data, subject to any legal obligations we may have.</p>

                <p>Opt-Out of Cookies: You can control cookie settings through your browser settings, but this may affect certain functionality of our search engine.</p>

                <p>Opt-Out of Marketing: If you receive marketing communications, you can opt out by following the instructions in the email or by contacting us directly.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">7. International Data Transfers</h2>
                <p>If you are located outside of the United States, please note that your data may be transferred to, stored, and processed in the United States or other countries where our servers or service providers are located. By using our services, you consent to these transfers.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">8. Children's Privacy</h2>
                <p>Our search engine is not intended for users under the age of 18, and we do not knowingly collect personal data from children. If we become aware that we have inadvertently collected personal information from a child under the age of 13, we will take steps to delete that information.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">9. Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information.</p>

                <h2 className="text-xl font-semibold text-slate-600 mt-4 mb-1">10. Contact Us</h2>
                <p>If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:</p>

                <Link href="mailto:contact@collate.run">contact@collate.run</Link>

            </PageSection>
        </InternalPage>
    );
}