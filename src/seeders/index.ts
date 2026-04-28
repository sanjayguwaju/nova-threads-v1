#!/usr/bin/env node
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import {
  categoriesData,
  tagsData,
  productsData,
  homePageData,
  navigationData,
  siteSettingsData,
  topBarData,
  usersSeedData,
  reviewsSeedData,
  couponsSeedData,
  homePageBlocksSeedData,
  ordersSeedData,
} from './data'

const payload = await getPayload({ config })

console.log('🌱 Starting database seed...\n')

// Helper to check if document exists
async function findExisting(collection: string, field: string, value: string) {
  const result = await payload.find({
    collection: collection as any,
    where: { [field]: { equals: value } },
    limit: 1,
  })
  return result.docs[0] || null
}

// Seed Categories
async function seedCategories() {
  console.log('📁 Seeding Categories...')
  const categoryMap = new Map<string, string>()

  for (const cat of categoriesData) {
    const existing = await findExisting('categories', 'name', cat.name)
    if (existing) {
      console.log(`  ✓ ${cat.name} (exists)`)
      categoryMap.set(cat.name, existing.id)
      continue
    }

    try {
      const created = await payload.create({
        collection: 'categories',
        data: {
          name: cat.name,
          description: cat.description,
          featuredOnHome: cat.featuredOnHome,
          order: cat.order,
        },
      })
      categoryMap.set(cat.name, created.id)
      console.log(`  ✓ ${cat.name}`)
    } catch (err) {
      console.error(`  ✗ ${cat.name}:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log('')
  return categoryMap
}

// Seed Tags
async function seedTags() {
  console.log('🏷️  Seeding Tags...')
  const tagMap = new Map<string, string>()

  for (const tag of tagsData) {
    const existing = await findExisting('tags', 'name', tag.name)
    if (existing) {
      console.log(`  ✓ ${tag.name} (exists)`)
      tagMap.set(tag.name, existing.id)
      continue
    }

    try {
      const created = await payload.create({
        collection: 'tags',
        data: tag,
      })
      tagMap.set(tag.name, created.id)
      console.log(`  ✓ ${tag.name}`)
    } catch (err) {
      console.error(`  ✗ ${tag.name}:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log('')
  return tagMap
}

// Seed Products
async function seedProducts(categoryMap: Map<string, string>, tagMap: Map<string, string>) {
  console.log('👕 Seeding Products...')
  const productMap = new Map<string, string>()

  for (const prod of productsData) {
    const existing = await findExisting('products', 'name', prod.name)
    if (existing) {
      console.log(`  ✓ ${prod.name} (exists)`)
      productMap.set(prod.name, existing.id)
      continue
    }

    try {
      // Get category ID
      const categoryId = categoryMap.get(prod.category)
      if (!categoryId) {
        console.warn(`  ⚠️ Category not found: ${prod.category}`)
        continue
      }

      // Get tag IDs
      const tagIds = prod.tags
        .map((t) => tagMap.get(t))
        .filter((id): id is string => !!id)

      const created = await payload.create({
        collection: 'products',
        data: {
          name: prod.name,
          slug: prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          shortDescription: prod.shortDescription,
          category: categoryId,
          brand: prod.brand,
          gender: prod.gender as any,
          status: prod.status as any,
          featured: prod.featured,
          tags: tagIds,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          variants: prod.variants.map((v: any) => ({
            sku: v.sku,
            size: v.size as any,
            color: v.color,
            colorHex: v.colorHex,
            stock: v.inventory,
            price: prod.price,
          })),
          images: undefined,
        },
      })
      productMap.set(prod.name, created.id)
      console.log(`  ✓ ${prod.name}`)
    } catch (err) {
      console.error(`  ✗ ${prod.name}:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log('')
  return productMap
}

// Seed Home Page
async function seedHomePage(categoryMap: Map<string, string>, productMap: Map<string, string>) {
  console.log('📄 Seeding Home Page...')

  const existing = await findExisting('pages', 'slug', 'home')
  if (existing) {
    console.log(`  ✓ Home page (exists)`)
    return
  }

  try {
    // Build layout with actual IDs
    const layout = homePageData.layout.map((block: any) => {
      if (block.blockType === 'featuredCategories') {
        return {
          ...block,
          categories: categoriesData
            .filter((c) => c.featuredOnHome)
            .slice(0, 4)
            .map((c) => ({
              category: categoryMap.get(c.name),
              id: crypto.randomUUID(),
            }))
            .filter((c) => c.category),
        }
      }
      if (block.blockType === 'productRail') {
        return {
          ...block,
          products: Array.from(productMap.values()).slice(0, 4),
        }
      }
      return block
    })

    await payload.create({
      collection: 'pages',
      data: {
        title: homePageData.title,
        slug: homePageData.slug,
        status: homePageData.status as any,
        layout,
        seo: homePageData.seo,
      },
    })
    console.log(`  ✓ Home page created`)
  } catch (err: any) {
    console.error(`  ✗ Home page:`, err.message)
  }

  console.log('')
}

// Seed Navigation Global
async function seedNavigation() {
  console.log('🧭 Seeding Navigation...')
  try {
    await payload.updateGlobal({
      slug: 'navigation',
      data: navigationData,
    })
    console.log('  ✓ Navigation updated')
  } catch (err) {
    console.error('  ✗ Navigation:', err instanceof Error ? err.message : String(err))
  }
  console.log('')
}

// Seed Site Settings Global
async function seedSiteSettings() {
  console.log('⚙️  Seeding Site Settings...')
  try {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: siteSettingsData,
    })
    console.log('  ✓ Site Settings updated')
  } catch (err) {
    console.error('  ✗ Site Settings:', err instanceof Error ? err.message : String(err))
  }
  console.log('')
}

// Seed Top Bar Global
async function seedTopBar() {
  console.log('📢 Seeding Top Bar...')
  try {
    await payload.updateGlobal({
      slug: 'top-bar',
      data: topBarData,
    })
    console.log('  ✓ Top Bar updated')
  } catch (err) {
    console.error('  ✗ Top Bar:', err instanceof Error ? err.message : String(err))
  }
  console.log('')
}

// Seed Users
async function seedUsers() {
  console.log('👤 Seeding Users...')
  const usersMap = new Map<string, string>()

  // Seed admin
  try {
    const existingAdmin = await findExisting('users', 'email', usersSeedData.admin.email)
    if (existingAdmin) {
      usersMap.set('admin', existingAdmin)
      console.log(`  ✓ Admin (exists)`)
    } else {
      const admin = await payload.create({
        collection: 'users',
        data: { ...usersSeedData.admin, _verified: true },
      })
      usersMap.set('admin', admin.id)
      console.log(`  ✓ Admin created`)
    }
  } catch (err) {
    console.error(`  ✗ Admin:`, err instanceof Error ? err.message : String(err))
  }

  // Seed customers
  for (const customer of usersSeedData.customers) {
    try {
      const existing = await findExisting('users', 'email', customer.email)
      if (existing) {
        usersMap.set(customer.email, existing)
        console.log(`  ✓ ${customer.firstName} ${customer.lastName} (exists)`)
        continue
      }
      const user = await payload.create({
        collection: 'users',
        data: { ...customer, _verified: true },
      })
      usersMap.set(customer.email, user.id)
      console.log(`  ✓ ${customer.firstName} ${customer.lastName}`)
    } catch (err) {
      console.error(`  ✗ ${customer.firstName} ${customer.lastName}:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log('')
  return usersMap
}

// Seed Reviews
async function seedReviews(productMap: Map<string, string>, usersMap: Map<string, string>) {
  console.log('⭐ Seeding Reviews...')

  for (const review of reviewsSeedData) {
    try {
      // Get first product for review
      const firstProductId = productMap.values().next().value
      if (!firstProductId) {
        console.log('  ✗ No products available for reviews')
        break
      }

      // Find customer by author name
      let authorId = null
      for (const [email, userId] of usersMap.entries()) {
        if (email.includes('sarah') && review.authorName.includes('Sarah')) {
          authorId = userId
          break
        }
        if (email.includes('michael') && review.authorName.includes('Michael')) {
          authorId = userId
          break
        }
      }

      const existing = await payload.find({
        collection: 'reviews',
        where: { title: { equals: review.title } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ✓ "${review.title}" (exists)`)
        continue
      }

      await payload.create({
        collection: 'reviews',
        data: {
          ...review,
          product: firstProductId,
          author: authorId,
          status: 'approved',
          helpfulCount: 0,
        },
      })
      console.log(`  ✓ "${review.title}"`)
    } catch (err) {
      console.error(`  ✗ "${review.title}":`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log('')
}

// Seed Coupons
async function seedCoupons() {
  console.log('🏷️  Seeding Coupons...')

  for (const coupon of couponsSeedData) {
    try {
      const existing = await payload.find({
        collection: 'coupons',
        where: { code: { equals: coupon.code } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ✓ ${coupon.code} (exists)`)
        continue
      }

      await payload.create({
        collection: 'coupons',
        data: coupon,
      })
      console.log(`  ✓ ${coupon.code}`)
    } catch (err) {
      console.error(`  ✗ ${coupon.code}:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log('')
}

// Seed Orders
async function seedOrders(usersMap: Map<string, string>, productMap: Map<string, string>) {
  console.log('📦 Seeding Orders...')

  for (const order of ordersSeedData) {
    try {
      // Get first customer
      let customerId = null
      for (const [email, userId] of usersMap.entries()) {
        if (email !== 'admin' && email.includes('@')) {
          customerId = userId
          break
        }
      }

      if (!customerId) {
        console.log('  ✗ No customers available for orders')
        break
      }

      // Get first product for items
      const firstProductId = productMap.values().next().value
      if (!firstProductId) {
        console.log('  ✗ No products available for orders')
        break
      }

      // Check if order already exists (by order number would be ideal, but we don't have it yet)
      // Just create new orders for seeding purposes
      const orderData = {
        ...order,
        customer: customerId,
        items: order.items.map((item: any) => ({
          ...item,
          product: firstProductId,
          variantSku: 'DEFAULT',
        })),
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US',
          phone: '555-1234',
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          line1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          country: 'US',
          phone: '555-1234',
        },
      }

      await payload.create({
        collection: 'orders',
        data: orderData,
      })
      console.log(`  ✓ Order ${order.status}`)
    } catch (err) {
      console.error(`  ✗ Order:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.log('')
}

// Main seed function
async function seed() {
  try {
    const categoryMap = await seedCategories()
    const tagMap = await seedTags()
    const productMap = await seedProducts(categoryMap, tagMap)
    await seedHomePage(categoryMap, productMap)
    
    // Seed globals
    await seedNavigation()
    await seedSiteSettings()
    await seedTopBar()

    // Seed additional collections
    const usersMap = await seedUsers()
    if (productMap.size > 0) {
      await seedReviews(productMap, usersMap)
      await seedOrders(usersMap, productMap)
    }
    await seedCoupons()

    console.log('✅ Database seed completed!')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err instanceof Error ? err.message : String(err))
    process.exit(1)
  }
}

seed()
