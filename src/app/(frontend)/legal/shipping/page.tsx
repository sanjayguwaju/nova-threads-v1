import Link from 'next/link'
import { ChevronRight, Truck, Package, Clock, Globe } from 'lucide-react'

export const metadata = { title: 'Shipping Policy | NOVA THREADS' }

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
            <span className="text-[var(--color-nt-black)] font-medium">Shipping Policy</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[var(--color-nt-white)] min-h-screen">
        <div className="max-w-[800px] mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 lg:py-16">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold tracking-[-0.02em] uppercase text-[var(--color-nt-black)]">
              Shipping Policy
            </h1>
            <p className="mt-3 text-[14px] text-[var(--color-nt-mid-gray)]">
              Fast, reliable delivery worldwide
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-10">
            <p className="text-[15px] sm:text-[16px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              At NOVA THREADS, we strive to deliver your orders quickly and efficiently. We partner
              with trusted carriers to ensure your items arrive safely and on time. Below you'll
              find all the information you need about our shipping options, rates, and delivery
              times.
            </p>
          </section>

          {/* Shipping Options Grid */}
          <section className="mb-12">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-6">
              Shipping Methods
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-[var(--color-nt-light-gray)] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--color-nt-off-white)] flex items-center justify-center">
                    <Truck size={20} strokeWidth={1.5} className="text-[var(--color-nt-black)]" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[var(--color-nt-black)]">
                    Standard Shipping
                  </h3>
                </div>
                <p className="text-[13px] text-[var(--color-nt-mid-gray)] mb-2">
                  5-7 business days
                </p>
                <p className="text-[14px] font-medium text-[var(--color-nt-black)]">$8.00</p>
                <p className="text-[12px] text-[var(--color-nt-mid-gray)] mt-2">
                  Free on orders over $150
                </p>
              </div>

              <div className="border border-[var(--color-nt-light-gray)] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--color-nt-off-white)] flex items-center justify-center">
                    <Package size={20} strokeWidth={1.5} className="text-[var(--color-nt-black)]" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[var(--color-nt-black)]">
                    Express Shipping
                  </h3>
                </div>
                <p className="text-[13px] text-[var(--color-nt-mid-gray)] mb-2">
                  2-3 business days
                </p>
                <p className="text-[14px] font-medium text-[var(--color-nt-black)]">$15.00</p>
                <p className="text-[12px] text-[var(--color-nt-mid-gray)] mt-2">
                  Free on orders over $300
                </p>
              </div>

              <div className="border border-[var(--color-nt-light-gray)] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--color-nt-off-white)] flex items-center justify-center">
                    <Clock size={20} strokeWidth={1.5} className="text-[var(--color-nt-black)]" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[var(--color-nt-black)]">
                    Next Day Delivery
                  </h3>
                </div>
                <p className="text-[13px] text-[var(--color-nt-mid-gray)] mb-2">1 business day</p>
                <p className="text-[14px] font-medium text-[var(--color-nt-black)]">$25.00</p>
                <p className="text-[12px] text-[var(--color-nt-mid-gray)] mt-2">
                  Order before 2pm EST
                </p>
              </div>

              <div className="border border-[var(--color-nt-light-gray)] p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--color-nt-off-white)] flex items-center justify-center">
                    <Globe size={20} strokeWidth={1.5} className="text-[var(--color-nt-black)]" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-[var(--color-nt-black)]">
                    International
                  </h3>
                </div>
                <p className="text-[13px] text-[var(--color-nt-mid-gray)] mb-2">
                  7-14 business days
                </p>
                <p className="text-[14px] font-medium text-[var(--color-nt-black)]">
                  $25.00 - $50.00
                </p>
                <p className="text-[12px] text-[var(--color-nt-mid-gray)] mt-2">
                  Varies by destination
                </p>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Order Processing
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              All orders are processed within 1-2 business days (excluding weekends and holidays).
              You will receive a confirmation email with tracking information once your order has
              shipped. Please allow up to 24 hours for tracking information to become active.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              During peak seasons (holidays, sales events), processing times may be extended by 1-2
              additional business days. We appreciate your patience during these busy periods.
            </p>
          </section>

          {/* Domestic Shipping */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Domestic Shipping (USA)
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">
                  Standard (5-7 days)
                </span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$8.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">
                  Express (2-3 days)
                </span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$15.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">
                  Next Day (1 day)
                </span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$25.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">
                  Orders over $150
                </span>
                <span className="text-[14px] font-medium text-green-600">FREE Standard</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">
                  Orders over $300
                </span>
                <span className="text-[14px] font-medium text-green-600">FREE Express</span>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              International Shipping
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              We ship to over 100 countries worldwide. International orders are shipped via DHL or
              FedEx and typically arrive within 7-14 business days, depending on the destination and
              customs clearance procedures.
            </p>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">Canada & Mexico</span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$25.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">Europe (EU)</span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$35.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">UK</span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$35.00</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--color-nt-light-gray)]">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">
                  Australia & New Zealand
                </span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$40.00</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[14px] text-[var(--color-nt-mid-gray)]">Rest of World</span>
                <span className="text-[14px] font-medium text-[var(--color-nt-black)]">$50.00</span>
              </div>
            </div>
            <p className="text-[13px] text-[var(--color-nt-mid-gray)] mt-4">
              <strong className="text-[var(--color-nt-black)]">Note:</strong> International orders
              may be subject to customs duties, import taxes, and handling fees, which are the
              responsibility of the customer.
            </p>
          </section>

          {/* Customs & Duties */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Customs, Duties & Taxes
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              International orders may be subject to import duties, customs fees, and taxes levied
              by the destination country. These charges are not included in your order total and are
              the sole responsibility of the recipient.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              Customs policies vary by country. Please contact your local customs office for more
              information. We are required by law to declare the full value of the package contents
              on all international shipments and cannot mark items as "gifts" or undervalue items.
            </p>
          </section>

          {/* Tracking */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Order Tracking
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              Once your order ships, you will receive an email with your tracking number and a link
              to track your package. You can also track your order by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed pl-4">
              <li>Logging into your account and viewing your order history</li>
              <li>Clicking the tracking link in your shipping confirmation email</li>
              <li>
                Visiting our{' '}
                <Link href="/account/orders" className="underline text-[var(--color-nt-black)]">
                  Order Tracking
                </Link>{' '}
                page
              </li>
            </ul>
          </section>

          {/* Lost or Damaged */}
          <section className="mb-10">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Lost or Damaged Packages
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              If your package appears to be lost or arrives damaged, please contact our customer
              service team within 7 days of the expected delivery date. We will work with the
              carrier to locate your package or arrange a replacement.
            </p>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed">
              For damaged items, please take photos of the packaging and damaged goods, and email
              them to us at{' '}
              <a
                href="mailto:support@novathreads.com"
                className="underline text-[var(--color-nt-black)]"
              >
                support@novathreads.com
              </a>
              . We will process a replacement or refund promptly.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t border-[var(--color-nt-light-gray)]">
            <h2 className="text-[18px] sm:text-[20px] font-semibold text-[var(--color-nt-black)] uppercase tracking-wide mb-4">
              Questions About Shipping?
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[var(--color-nt-mid-gray)] leading-relaxed mb-4">
              Our customer service team is here to help with any shipping questions or concerns.
            </p>
            <div className="space-y-2 text-[14px] text-[var(--color-nt-mid-gray)]">
              <p>
                <strong className="text-[var(--color-nt-black)]">Email:</strong>{' '}
                shipping@novathreads.com
              </p>
              <p>
                <strong className="text-[var(--color-nt-black)]">Phone:</strong> +1 (555) 123-4567
              </p>
              <p>
                <strong className="text-[var(--color-nt-black)]">Hours:</strong> Monday - Friday,
                9am - 6pm EST
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
