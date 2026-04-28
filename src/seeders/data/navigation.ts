export const navigationData = {
  mainNav: [
    {
      label: 'Home',
      link: '/',
    },
    {
      label: 'Shop',
      link: '/shop',
      megaMenu: [
        { label: 'All Products', link: '/shop' },
        { label: 'Women', link: '/shop?gender=women' },
        { label: 'Men', link: '/shop?gender=men' },
        { label: 'New Arrivals', link: '/shop?sort=newest' },
        { label: 'Sale', link: '/shop?sale=true' },
      ],
    },
    {
      label: 'Women',
      link: '/shop?gender=women',
      megaMenu: [
        { label: 'All Women', link: '/shop?gender=women' },
        { label: 'T-Shirts', link: '/shop?gender=women&category=t-shirts' },
        { label: 'Hoodies', link: '/shop?gender=women&category=hoodies' },
        { label: 'Dresses', link: '/shop?gender=women&category=dresses' },
      ],
    },
    {
      label: 'Men',
      link: '/shop?gender=men',
      megaMenu: [
        { label: 'All Men', link: '/shop?gender=men' },
        { label: 'T-Shirts', link: '/shop?gender=men&category=t-shirts' },
        { label: 'Hoodies', link: '/shop?gender=men&category=hoodies' },
        { label: 'Jackets', link: '/shop?gender=men&category=jackets' },
      ],
    },
    {
      label: 'About',
      link: '/about',
    },
  ],
  footerNav: [
    {
      heading: 'Shop',
      links: [
        { label: 'All Products', link: '/shop' },
        { label: 'Women', link: '/shop?gender=women' },
        { label: 'Men', link: '/shop?gender=men' },
        { label: 'New Arrivals', link: '/shop?sort=newest' },
        { label: 'Sale', link: '/shop?sale=true' },
      ],
    },
    {
      heading: 'Customer Service',
      links: [
        { label: 'Contact Us', link: '/contact' },
        { label: 'Shipping Info', link: '/shipping' },
        { label: 'Returns', link: '/returns' },
        { label: 'FAQ', link: '/faq' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Us', link: '/about' },
        { label: 'Careers', link: '/careers' },
        { label: 'Press', link: '/press' },
      ],
    },
    {
      heading: 'Legal',
      links: [
        { label: 'Privacy Policy', link: '/privacy' },
        { label: 'Terms of Service', link: '/terms' },
        { label: 'Cookie Policy', link: '/cookies' },
      ],
    },
  ],
}
