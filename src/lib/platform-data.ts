export const platformKpis = [
  { label: "MRR", value: "Rs 8.4M", change: "+18.2%" },
  { label: "Active stores", value: "1,284", change: "+64" },
  { label: "Failed payments", value: "2.1%", change: "-0.8%" },
  { label: "AI usage", value: "1.8M", change: "credits" },
];

export const stores = [
  {
    id: "str_1001",
    name: "Al Noor Electronics",
    plan: "Scale",
    owner: "Hamza Khan",
    revenue: "Rs 1.9M",
    orders: 342,
    domain: "alnoor.pk",
    status: "Live",
  },
  {
    id: "str_1002",
    name: "Oud Reserve",
    plan: "Growth",
    owner: "Ayesha Malik",
    revenue: "Rs 812k",
    orders: 186,
    domain: "oudreserve.com",
    status: "Live",
  },
  {
    id: "str_1003",
    name: "FreshCart Grocery",
    plan: "Starter",
    owner: "Bilal Ahmed",
    revenue: "Rs 476k",
    orders: 529,
    domain: "freshcart.store",
    status: "Trial",
  },
  {
    id: "str_1004",
    name: "Metro Wholesale",
    plan: "Enterprise",
    owner: "Sana Rauf",
    revenue: "Rs 4.2M",
    orders: 914,
    domain: "metrowholesale.pk",
    status: "Review",
  },
];

export const subscriptionPlans = [
  { name: "Starter", stores: 412, price: "Rs 5,000/mo", mrr: "Rs 2.06M" },
  { name: "Growth", stores: 526, price: "Rs 12,000/mo", mrr: "Rs 6.31M" },
  { name: "Scale", stores: 294, price: "Rs 28,000/mo", mrr: "Rs 8.23M" },
  { name: "Enterprise", stores: 52, price: "Custom", mrr: "Rs 5.8M" },
];

export const featureFlags = [
  "AI campaign launcher",
  "Wholesale price lists",
  "Multi-branch inventory",
  "Raast instant checkout",
  "Courier auto-allocation",
];

export const products = [
  {
    sku: "EL-IPH-15",
    name: "iPhone 15 Pro Max",
    category: "Mobiles",
    price: "Rs 449,000",
    stock: 18,
    status: "Active",
  },
  {
    sku: "EL-SAM-S24",
    name: "Samsung Galaxy S24",
    category: "Mobiles",
    price: "Rs 289,000",
    stock: 9,
    status: "Low stock",
  },
  {
    sku: "EL-HP-840",
    name: "HP EliteBook 840 G10",
    category: "Laptops",
    price: "Rs 235,000",
    stock: 27,
    status: "Active",
  },
  {
    sku: "EL-SONY-XM5",
    name: "Sony WH-1000XM5",
    category: "Accessories",
    price: "Rs 92,000",
    stock: 4,
    status: "Low stock",
  },
];

export const merchantOrders = [
  {
    id: "#PK-1924",
    customer: "Maira Saleem",
    payment: "COD",
    fulfillment: "Ready for TCS",
    total: "Rs 14,500",
  },
  {
    id: "#PK-1925",
    customer: "Danish Ali",
    payment: "JazzCash",
    fulfillment: "Paid",
    total: "Rs 8,900",
  },
  {
    id: "#PK-1926",
    customer: "Iqra Noor",
    payment: "Raast",
    fulfillment: "Packing slip",
    total: "Rs 22,100",
  },
  {
    id: "#PK-1927",
    customer: "Zain Sheikh",
    payment: "EasyPaisa",
    fulfillment: "Courier booked",
    total: "Rs 31,400",
  },
];

export const automations = [
  { title: "Order received", steps: ["Notify customer", "Notify admin", "Reduce inventory", "Generate invoice"] },
  { title: "Cart abandonment", steps: ["WhatsApp reminder", "Email reminder", "Coupon offer"] },
  { title: "Post purchase", steps: ["Review request", "Cross-sell campaign", "Reorder reminder"] },
];

export const storefrontProducts = [
  {
    name: "Oud Reserve Noir",
    price: "Rs 8,900",
    tag: "Best seller",
    description: "Smoky oud, amber, saffron, and soft musk.",
  },
  {
    name: "Amber Silk Attar",
    price: "Rs 5,400",
    tag: "New",
    description: "Warm amber oil with a clean everyday finish.",
  },
  {
    name: "Rose Musk Gift Set",
    price: "Rs 12,500",
    tag: "Gift ready",
    description: "Three-piece boxed fragrance set with premium wrapping.",
  },
];

export const techStack = [
  "Next.js App Router",
  "TypeScript",
  "TailwindCSS",
  "Prisma",
  "PostgreSQL",
  "Redis",
  "Cloudflare R2",
  "Vercel",
  "PostHog",
  "Sentry",
];

export const domainQueue = [
  { host: "alnoor.pk", store: "Al Noor Electronics", status: "Verified", ssl: "Active" },
  { host: "oudreserve.com", store: "Oud Reserve", status: "Verified", ssl: "Active" },
  { host: "freshcart.store", store: "FreshCart Grocery", status: "DNS pending", ssl: "Waiting" },
  { host: "metrowholesale.pk", store: "Metro Wholesale", status: "Review", ssl: "Queued" },
];

export const themes = [
  { name: "Modern Retail", category: "Retail", installs: 318, premium: false },
  { name: "Grocery Express", category: "Grocery", installs: 204, premium: true },
  { name: "Electro Pro", category: "Electronics", installs: 188, premium: true },
  { name: "Oud Luxury", category: "Perfume", installs: 91, premium: true },
  { name: "Fashion Grid", category: "Fashion", installs: 144, premium: false },
  { name: "Wholesale Ledger", category: "B2B", installs: 77, premium: true },
];

export const seoAudits = [
  { page: "/products/oud-reserve-noir", score: 94, issue: "Add FAQ schema" },
  { page: "/collections/gifts", score: 82, issue: "Meta description too short" },
  { page: "/blogs/eid-gift-guide", score: 76, issue: "Missing internal links" },
  { page: "/products/amber-silk-attar", score: 89, issue: "Add review schema" },
];

export const aiJobs = [
  { job: "Product descriptions", status: "Completed", credits: 42 },
  { job: "Meta title refresh", status: "Queued", credits: 18 },
  { job: "WhatsApp reply drafts", status: "Running", credits: 26 },
  { job: "Inventory forecast", status: "Beta", credits: 64 },
];

export const paymentProviders = [
  { provider: "COD", market: "Pakistan", status: "Live", fee: "Flat rules" },
  { provider: "EasyPaisa", market: "Pakistan", status: "Sandbox", fee: "Gateway" },
  { provider: "JazzCash", market: "Pakistan", status: "Live", fee: "Gateway" },
  { provider: "Raast", market: "Pakistan", status: "Planned", fee: "Low cost" },
  { provider: "Stripe", market: "International", status: "Live", fee: "Gateway" },
];

export const courierProviders = [
  { courier: "Leopards", service: "Domestic", status: "Live", sla: "24-72h" },
  { courier: "TCS", service: "Domestic", status: "Live", sla: "24-72h" },
  { courier: "Call Courier", service: "Domestic", status: "Sandbox", sla: "24-96h" },
  { courier: "Trax", service: "Domestic", status: "Planned", sla: "24-96h" },
];

export const supportTickets = [
  { id: "SUP-1042", store: "FreshCart Grocery", priority: "High", topic: "Payment webhook failed" },
  { id: "SUP-1043", store: "Metro Wholesale", priority: "Medium", topic: "Bulk import mapping" },
  { id: "SUP-1044", store: "Oud Reserve", priority: "Low", topic: "Theme typography request" },
];

export const marketplaceApps = [
  { name: "WhatsApp Automations", type: "Marketing", price: "Rs 3,000/mo" },
  { name: "Advanced SEO Audit", type: "SEO", price: "Rs 5,000/mo" },
  { name: "B2B Price Lists", type: "Wholesale", price: "Rs 8,000/mo" },
  { name: "AI Content Credits", type: "AI", price: "Usage based" },
];
