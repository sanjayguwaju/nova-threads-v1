import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = { title: 'Privacy Policy | NOVA THREADS' }

export default function Page() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="bg-[var(--color-nt-white)] border-b border-[var(--color-nt-light-gray)]">
        <div className="max-w-container mx-auto px-4 sm:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-1 text-[12px] sm:text-[13px] text-[var(--color-nt-mid-gray)]">
            <Link href="/" className="hover:text-[var(--color-nt-black)] transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="text-[var(--color-nt-mid-gray)]" />
            <span className="text-[var(--color-nt-black)] font-medium">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[var(--color-nt-white)] min-h-screen">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold tracking-[-0.02em] uppercase text-[var(--color-nt-black)]">
              Privacy Policy
            </h1>
            <p className="mt-3 text-[14px] text-[var(--color-nt-mid-gray)]">
              Last updated: January 1, 2024
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-[15px] sm:text-[16px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              At NOVA THREADS, we take your privacy seriously. This Privacy Policy describes how we
              collect, use, store, and protect your personal information when you visit our website,
              make purchases, or interact with our services. By using our website, you consent to
              the practices described in this policy.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              1. Information We Collect
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4 pl-4">
              <li>
                <strong className="text-[var(--color-nt-black)]">Account Information:</strong> Name,
                email address, phone number, and password when you create an account
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Purchase Information:</strong>{' '}
                Billing and shipping addresses, payment details, and order history
              </li>
              <li>
                <strong className="var(--color-nt-black)">Communication Data:</strong> Messages,
                feedback, and customer service inquiries
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Preferences:</strong> Wishlist
                items, size preferences, and style interests
              </li>
            </ul>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              We also automatically collect certain information when you visit our website,
              including your IP address, browser type, device information, browsing patterns, and
              cookies.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              2. How We Use Your Information
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed pl-4">
              <li>Process and fulfill your orders, including payment processing and shipping</li>
              <li>
                Communicate with you about your orders, account, and customer service inquiries
              </li>
              <li>
                Send you marketing communications, promotional offers, and newsletters (with your
                consent)
              </li>
              <li>Personalize your shopping experience and recommend products</li>
              <li>Improve our website, products, and services through analytics</li>
              <li>Prevent fraud and ensure the security of our platform</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              3. Information Sharing & Disclosure
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We do not sell or rent your personal information to third parties. We may share your
              information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed pl-4">
              <li>
                <strong className="text-[var(--color-nt-black)]">Service Providers:</strong> With
                trusted partners who help us operate our business (payment processors, shipping
                carriers, marketing platforms)
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Legal Requirements:</strong> When
                required by law, court order, or government request
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Business Transfers:</strong> In
                connection with a merger, acquisition, or sale of assets
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Protection:</strong> To protect our
                rights, property, and safety, or that of our customers
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              4. Cookies & Tracking Technologies
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience,
              analyze website traffic, and understand user behavior. Cookies are small data files
              stored on your device that help us remember your preferences and improve our services.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              Types of cookies we use:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed pl-4">
              <li>
                <strong className="text-[var(--color-nt-black)]">Essential Cookies:</strong>{' '}
                Required for basic website functionality
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Analytics Cookies:</strong> Help us
                understand how visitors interact with our website
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Marketing Cookies:</strong> Used to
                deliver personalized advertisements
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Preference Cookies:</strong>{' '}
                Remember your settings and preferences
              </li>
            </ul>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              You can control cookies through your browser settings. Note that disabling certain
              cookies may affect the functionality of our website.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              5. Data Security
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect
              your personal information against unauthorized access, alteration, disclosure, or
              destruction. These measures include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed pl-4">
              <li>SSL encryption for all data transmission</li>
              <li>Secure payment processing through PCI-compliant providers</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Restricted access to personal information on a need-to-know basis</li>
              <li>Employee training on data protection and privacy practices</li>
            </ul>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mt-4">
              Despite our efforts, no method of transmission over the internet is completely secure.
              We cannot guarantee absolute security of your data.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              6. Your Rights & Choices
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal
              information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed pl-4">
              <li>
                <strong className="text-[var(--color-nt-black)]">Access:</strong> Request a copy of
                your personal data
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Correction:</strong> Update or
                correct inaccurate information
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Deletion:</strong> Request deletion
                of your personal data
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Opt-out:</strong> Unsubscribe from
                marketing communications
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Portability:</strong> Request
                transfer of your data
              </li>
              <li>
                <strong className="text-[var(--color-nt-black)]">Restriction:</strong> Limit how we
                use your data
              </li>
            </ul>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mt-4">
              To exercise these rights, please contact us using the information provided below. We
              will respond to your request within 30 days.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              7. Children's Privacy
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              Our website is not intended for children under 16 years of age. We do not knowingly
              collect personal information from children. If you are a parent or guardian and
              believe your child has provided us with personal information, please contact us
              immediately. If we discover that we have collected personal information from a child
              under 16, we will delete that information promptly.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              8. Changes to This Policy
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our
              practices, legal requirements, or for other operational reasons. We will notify you of
              any material changes by posting the updated policy on this page with a revised "Last
              updated" date. We encourage you to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-[var(--color-nt-light-gray)]">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Contact Us
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us:
            </p>
            <div className="space-y-2 text-[14px] text-[var(--color-nt-mid-gray)]">
              <p>
                <strong className="text-[var(--color-nt-black)]">Email:</strong>{' '}
                privacy@novathreads.com
              </p>
              <p>
                <strong className="text-[var(--color-nt-black)]">Address:</strong> 123 Fashion
                Avenue, New York, NY 10001
              </p>
              <p>
                <strong className="text-[var(--color-nt-black)]">Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong className="text-[var(--color-nt-black)]">Data Protection Officer:</strong>{' '}
                Jane Smith
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
