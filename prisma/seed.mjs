import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is required to seed. Set it in .env first.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DEMO_PASSWORD = "password123";

async function main() {
  // --- Roles (names must match RoleName in src/lib/auth.ts) ---
  const roleNames = ["SUPER_ADMIN", "STORE_OWNER", "STORE_STAFF", "SUPPORT"];
  const roles = {};
  for (const name of roleNames) {
    roles[name] = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  // --- Store ---
  const store = await prisma.store.upsert({
    where: { slug: "oud-reserve" },
    update: {},
    create: {
      name: "Oud Reserve",
      slug: "oud-reserve",
      status: "LIVE",
      domains: {
        create: { host: "oudreserve.localhost", primary: true, verified: true },
      },
      subscription: { create: { plan: "Growth", status: "active" } },
      warehouses: { create: { name: "Lahore Main Warehouse", city: "Lahore" } },
    },
    include: { warehouses: true },
  });

  // --- Users + membership (login: owner@oudreserve.com / password123) ---
  const owner = await prisma.user.upsert({
    where: { email: "owner@oudreserve.com" },
    update: { passwordHash },
    create: { email: "owner@oudreserve.com", name: "Ayesha Malik", passwordHash },
  });

  await prisma.storeMember.upsert({
    where: { storeId_userId: { storeId: store.id, userId: owner.id } },
    update: { roleId: roles.STORE_OWNER.id },
    create: { storeId: store.id, userId: owner.id, roleId: roles.STORE_OWNER.id },
  });

  // Platform super admin (login: admin@bazaaros.pk / password123) — owner-only.
  await prisma.user.upsert({
    where: { email: "admin@bazaaros.pk" },
    update: { passwordHash, isSuperAdmin: true },
    create: {
      email: "admin@bazaaros.pk",
      name: "Platform Admin",
      passwordHash,
      isSuperAdmin: true,
    },
  });

  // --- Category ---
  const category = await prisma.category.upsert({
    where: { storeId_slug: { storeId: store.id, slug: "perfumes" } },
    update: {},
    create: { storeId: store.id, name: "Perfumes", slug: "perfumes" },
  });

  // --- Product + variant + image ---
  const product = await prisma.product.upsert({
    where: { storeId_slug: { storeId: store.id, slug: "oud-reserve-noir" } },
    update: {},
    create: {
      storeId: store.id,
      categoryId: category.id,
      title: "Oud Reserve Noir",
      slug: "oud-reserve-noir",
      description: "Smoky oud, amber, saffron, and soft musk.",
      status: "active",
      seoTitle: "Oud Reserve Noir Perfume",
      seoDescription:
        "Premium oud perfume with Pakistan payment and courier checkout.",
      variants: {
        create: {
          sku: "OUD-NOIR-50",
          title: "50ml",
          price: new Prisma.Decimal("8900"),
        },
      },
      images: {
        create: {
          url: "https://example.com/oud-reserve-noir.jpg",
          alt: "Oud Reserve Noir perfume bottle",
        },
      },
    },
    include: { variants: true },
  });

  // --- Inventory for the variant in the main warehouse ---
  const variant = product.variants[0];
  const warehouse = store.warehouses[0];
  await prisma.inventoryItem.upsert({
    where: {
      variantId_warehouseId: {
        variantId: variant.id,
        warehouseId: warehouse.id,
      },
    },
    update: {},
    create: {
      variantId: variant.id,
      warehouseId: warehouse.id,
      quantity: 24,
    },
  });

  // --- Coupon ---
  await prisma.coupon.upsert({
    where: { storeId_code: { storeId: store.id, code: "SUMMER10" } },
    update: {},
    create: {
      storeId: store.id,
      code: "SUMMER10",
      type: "percent",
      value: new Prisma.Decimal("10"),
    },
  });

  // --- Customer ---
  const customer = await prisma.customer.upsert({
    where: { id: `seed-customer-${store.id}` },
    update: {},
    create: {
      id: `seed-customer-${store.id}`,
      storeId: store.id,
      name: "Maira Saleem",
      phone: "+923001234567",
      email: "maira@example.com",
      tags: ["vip", "repeat-buyer"],
    },
  });

  // --- One sample order (idempotent: only if the store has none) ---
  const existingOrders = await prisma.order.count({ where: { storeId: store.id } });
  if (existingOrders === 0) {
    await prisma.order.create({
      data: {
        storeId: store.id,
        customerId: customer.id,
        status: "PAID",
        subtotal: new Prisma.Decimal("8900"),
        shippingFee: new Prisma.Decimal("300"),
        total: new Prisma.Decimal("9200"),
        items: {
          create: {
            variantId: variant.id,
            quantity: 1,
            price: new Prisma.Decimal("8900"),
          },
        },
        payment: {
          create: {
            provider: "JAZZCASH",
            status: "paid",
            amount: new Prisma.Decimal("9200"),
            reference: "JC-DEMO-001",
          },
        },
        shipment: {
          create: {
            courier: "TCS",
            status: "booked",
            trackingNo: "TCS-DEMO-001",
          },
        },
      },
    });
  }

  console.log(`Seeded ${store.name} (${store.id})`);
  console.log("Login: owner@oudreserve.com / password123 (STORE_OWNER)");
  console.log("Login: admin@bazaaros.pk / password123 (platform admin)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
