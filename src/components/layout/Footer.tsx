import Link from 'next/link'

interface Props {
  nav?: { footerNav?: Array<{ heading?: string; links?: Array<{ label?: string; link?: string }> }> }
}

const DEFAULT_COLUMNS = [
  {
    heading: 'Shop',
    links: [
      { label: 'New In', link: '/shop?sort=newest' },
      { label: 'Women', link: '/shop?gender=women' },
      { label: 'Men', link: '/shop?gender=men' },
      { label: 'Sale', link: '/shop?sale=true' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'Shipping', link: '/legal/shipping' },
      { label: 'Returns', link: '/legal/returns' },
      { label: 'Size Guide', link: '/legal/shipping' },
      { label: 'Contact', link: '/legal/shipping' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', link: '/legal/terms' },
      { label: 'Journal', link: '/legal/terms' },
      { label: 'Stores', link: '/legal/terms' },
      { label: 'Careers', link: '/legal/terms' },
    ],
  },
]

export function Footer({ nav }: Props) {
  const columns = nav?.footerNav?.length ? nav.footerNav : DEFAULT_COLUMNS

  return (
    <footer className="bg-noir text-paper mt-64">
      <div className="max-w-container mx-auto px-24 py-64">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-32">
          <div className="col-span-2">
            <div className="font-display text-[32px] mb-16">NOVA THREADS</div>
            <p className="text-stone text-[14px] max-w-[320px]">
              Quiet, considered clothing. Made to last, made with care.
            </p>
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <div className="font-mono text-[11px] uppercase tracking-widest mb-16">{col.heading}</div>
              <ul className="space-y-8">
                {col.links?.map((l, j) => (
                  <li key={j}>
                    <Link href={l.link || '#'} className="text-stone hover:text-paper text-[14px] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-64 pt-32 border-t border-stone/30 flex flex-col sm:flex-row justify-between gap-16 text-stone text-[12px]">
          <div>© {new Date().getFullYear()} NOVA THREADS. All rights reserved.</div>
          <div className="flex gap-20">
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
