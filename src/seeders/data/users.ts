export const usersSeedData = {
  admin: {
    email: 'admin@novathreads.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin' as const,
  },
  customers: [
    {
      email: 'sarah@email.com',
      password: 'customer123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'customer' as const,
    },
    {
      email: 'michael@email.com',
      password: 'customer123',
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'customer' as const,
    },
  ],
}

export const reviewsSeedData = [
  {
    rating: 5,
    title: 'Amazing quality!',
    content: 'The fabric is incredibly soft and the fit is perfect.',
    authorName: 'Sarah Johnson',
    verified: true,
  },
  {
    rating: 4,
    title: 'Great product',
    content: 'Love the minimalist design. Shipping was fast too.',
    authorName: 'Michael Chen',
    verified: true,
  },
]

export const couponsSeedData = [
  {
    code: 'WELCOME10',
    type: 'percentage' as const,
    value: 10,
    description: '10% off your first order',
    minOrderAmount: 0,
    maxUses: 1000,
    isActive: true,
    startDate: new Date().toISOString(),
    endDate: null,
  },
  {
    code: 'SAVE20',
    type: 'percentage' as const,
    value: 20,
    description: '20% off orders over $100',
    minOrderAmount: 100,
    maxUses: 500,
    isActive: true,
    startDate: new Date().toISOString(),
    endDate: null,
  },
]

export const homePageBlocksSeedData = {
  hero: {
    blockType: 'hero',
    slides: [
      {
        headline: 'Summer Collection 2024',
        subheadline: 'Discover breathable fabrics designed for warm days',
        cta: 'Shop Collection',
        link: '/shop?collection=summer',
      },
      {
        headline: 'New Arrivals',
        subheadline: 'Fresh styles added every week',
        cta: 'Explore Now',
        link: '/shop?sort=newest',
      },
    ],
    autoplay: true,
    autoplayDelay: 6000,
  },
  featuredCategories: {
    blockType: 'featuredCategories',
    title: 'Shop by Category',
    subtitle: 'Explore our curated collections',
    categories: [],
    showViewAll: true,
    viewAllText: 'View All Categories',
    viewAllLink: '/shop',
  },
  productRail: {
    blockType: 'productRail',
    title: 'Featured Products',
    products: [],
    showGenderFilter: true,
    showViewAll: true,
    viewAllText: 'View All',
    viewAllLink: '/shop',
  },
  brandStory: {
    blockType: 'brandStory',
    sectionLabel: 'Our Philosophy',
    headline: 'Fewer, finer things — designed to be lived in, loved for years',
    description:
      'NOVA THREADS is a studio making considered clothes from natural materials, with transparent pricing and fair production.',
    stats: [
      { value: '100%', label: 'Natural materials' },
      { value: 'Fair', label: 'Production' },
      { value: 'Timeless', label: 'Design' },
    ],
    ctaText: 'Our Story',
    ctaLink: '/about',
    imagePosition: 'left',
  },
  testimonials: {
    blockType: 'testimonials',
    title: 'What customers say',
    testimonials: [
      {
        author: 'Sarah M.',
        location: 'New York, NY',
        body: "The quality is exceptional. I've washed my hoodie dozens of times and it still looks brand new.",
        rating: 5,
        verified: true,
        date: '2 weeks ago',
      },
      {
        author: 'James K.',
        location: 'Los Angeles, CA',
        body: 'Finally, a brand that delivers on its promises. The fit is perfect and the fabric feels amazing.',
        rating: 5,
        verified: true,
        date: '1 month ago',
      },
    ],
    autoplay: true,
    autoplayDelay: 6000,
  },
  newsletter: {
    blockType: 'newsletter',
    sectionLabel: 'Newsletter',
    headline: 'Join The Studio',
    subheadline:
      'Subscribe for exclusive previews, essays on mindful style, and 10% off your first order.',
    placeholder: 'Enter your email address',
    buttonText: 'Join Now',
    mobileButtonText: 'Subscribe',
    privacyText: 'By subscribing, you agree to receive marketing emails. Unsubscribe anytime.',
    successHeadline: 'Welcome to the Studio',
    successMessage: 'Check your inbox for 10% off your first order.',
    trustBadges: [
      { text: 'No spam, ever' },
      { text: 'Unsubscribe anytime' },
      { text: '10% off first order' },
    ],
  },
}

// Orders seed data template
export const ordersSeedData = [
  {
    status: 'delivered' as const,
    paymentStatus: 'paid' as const,
    subtotal: 156.0,
    shippingCost: 10.0,
    tax: 12.48,
    discount: 0,
    total: 178.48,
    currency: 'USD',
    shippingMethod: 'Standard Shipping',
    trackingNumber: 'TRK123456789',
    notes: 'Please leave at front door',
    couponCode: null,
    items: [{ quantity: 2, price: 78.0, total: 156.0 }],
  },
  {
    status: 'processing' as const,
    paymentStatus: 'paid' as const,
    subtotal: 245.0,
    shippingCost: 0,
    tax: 19.6,
    discount: 24.5,
    total: 240.1,
    currency: 'USD',
    shippingMethod: 'Express Shipping',
    trackingNumber: null,
    notes: null,
    couponCode: 'SAVE20',
    items: [
      { quantity: 1, price: 189.0, total: 189.0 },
      { quantity: 1, price: 56.0, total: 56.0 },
    ],
  },
]

export default {
  users: usersSeedData,
  reviews: reviewsSeedData,
  coupons: couponsSeedData,
  homePageBlocks: homePageBlocksSeedData,
  orders: ordersSeedData,
}
