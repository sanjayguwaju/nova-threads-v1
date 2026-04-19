import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = { title: 'Terms of Service | NOVA THREADS' }

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
            <span className="text-[var(--color-nt-black)] font-medium">Terms of Service</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[var(--color-nt-white)] min-h-screen">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold tracking-[-0.02em] uppercase text-[var(--color-nt-black)]">
              Terms of Service
            </h1>
            <p className="mt-3 text-[14px] text-[var(--color-nt-mid-gray)]">
              Last updated: January 1, 2024
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-[15px] sm:text-[16px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              Welcome to NOVA THREADS. These Terms of Service govern your use of our website,
              products, and services. By accessing or purchasing from our store, you agree to be
              bound by these terms. Please read them carefully before making a purchase.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              By accessing and using the NOVA THREADS website, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Service. If you do not agree with
              any part of these terms, please do not use our website or services.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting to the website. Your continued use of the site following any
              changes constitutes your acceptance of the revised terms.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              2. Account Registration
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              To access certain features of our website, you may need to create an account. You are
              responsible for maintaining the confidentiality of your account information and
              password. You agree to accept responsibility for all activities that occur under your
              account.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              You must provide accurate, current, and complete information during the registration
              process. NOVA THREADS reserves the right to suspend or terminate your account if any
              information provided proves to be inaccurate, false, or incomplete.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              3. Product Information & Pricing
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We strive to display our products and their colors as accurately as possible. However,
              we cannot guarantee that your computer monitor's display of any color will be
              accurate. Product descriptions and prices are subject to change without notice.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              All prices are listed in USD and are exclusive of applicable taxes and shipping
              charges unless otherwise stated. We reserve the right to modify prices at any time
              without prior notice.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              In the event of a pricing error, we reserve the right to cancel any orders placed at
              the incorrect price, even if the order has been confirmed and payment processed. In
              such cases, a full refund will be issued.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              4. Order Acceptance & Fulfillment
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              Your receipt of an order confirmation does not constitute our acceptance of your
              order. We reserve the right to accept or decline your order for any reason, including
              but not limited to product availability, errors in product or pricing information, or
              issues identified by our fraud prevention team.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              Once an order is placed, modifications or cancellations may not be possible. Please
              review your order carefully before submitting. For urgent changes, contact our
              customer service team immediately, though we cannot guarantee that changes can be
              made.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              5. Payment Terms
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We accept various payment methods including major credit cards (Visa, MasterCard,
              American Express), PayPal, and Apple Pay. All payments are processed securely through
              our encrypted payment gateway.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              By providing payment information, you represent and warrant that you are authorized to
              use the designated payment method. You authorize us to charge your payment method for
              the total amount of your order, including any applicable taxes and shipping fees.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              All content on this website, including but not limited to text, graphics, logos,
              images, product descriptions, and software, is the property of NOVA THREADS or its
              content suppliers and is protected by international copyright, trademark, and other
              intellectual property laws.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works from, or otherwise
              exploit any content without our express written permission. The NOVA THREADS name,
              logo, and all related names, logos, product and service names are trademarks of NOVA
              THREADS.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              7. Limitation of Liability
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              To the fullest extent permitted by law, NOVA THREADS shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages, or any loss of
              profits or revenues, whether incurred directly or indirectly, or any loss of data,
              use, goodwill, or other intangible losses resulting from your access to or use of our
              services.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-[var(--color-nt-light-gray)]">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Contact Us
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-[14px] text-[var(--color-nt-mid-gray)]">
              <p>
                <strong className="text-[var(--color-nt-black)]">Email:</strong>{' '}
                legal@novathreads.com
              </p>
              <p>
                <strong className="text-[var(--color-nt-black)]">Address:</strong> 123 Fashion
                Avenue, New York, NY 10001
              </p>
              <p>
                <strong className="text-[var(--color-nt-black)]">Phone:</strong> +1 (555) 123-4567
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
