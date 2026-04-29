import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import {
  AbandonedCarts,
  Categories,
  Coupons,
  CustomerTiers,
  GiftCards,
  Media,
  Orders,
  Pages,
  Posts,
  Products,
  Reviews,
  Tags,
  Users,
} from './collections'
import { CODSettings, Navigation, SiteSettings, TopBar } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Products,
    Categories,
    Orders,
    Reviews,
    Coupons,
    Tags,
    Media,
    Pages,
    Posts,
    CustomerTiers,
    GiftCards,
    AbandonedCarts,
  ],
  globals: [SiteSettings, Navigation, TopBar, CODSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
})
