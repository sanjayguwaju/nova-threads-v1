export const topBarData = {
  enabled: true,
  followUsText: 'Follow Us',
  socialLinks: [
    {
      platform: 'instagram' as const,
      url: 'https://instagram.com/novathreads',
      label: 'Instagram',
    },
    {
      platform: 'tiktok' as const,
      url: 'https://tiktok.com/@novathreads',
      label: 'TikTok',
    },
    {
      platform: 'facebook' as const,
      url: 'https://facebook.com/novathreads',
      label: 'Facebook',
    },
  ],
  offers: [
    {
      text: 'Free shipping on orders over $100',
      link: '/shipping',
    },
    {
      text: 'New arrivals every week',
      link: '/shop?sort=newest',
    },
    {
      text: 'Sign up for 10% off',
      link: '/newsletter',
    },
  ],
  showContactLink: true,
  contactLinkText: 'Contact Us',
  contactLinkUrl: '/contact',
}
