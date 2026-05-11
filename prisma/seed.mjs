import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "women-embroidery-design",
    name: "Women Embroidery Design",
    description: "Premium embroidery and tailoring work with careful fitting, finishing, and durable stitching.",
    category: "Embroidery",
    pricePaise: 20000,
    imagePath: "/images/products/d1.webp"
  },
  {
    slug: "bridal-blouse-work",
    name: "Bridal Blouse Work",
    description: "Detailed blouse embroidery for special occasions, finished with clean lining and precise measurements.",
    category: "Bridal",
    pricePaise: 149900,
    imagePath: "/images/shop/slide1.jpg"
  },
  {
    slug: "custom-tailoring-service",
    name: "Custom Tailoring Service",
    description: "Made-to-measure tailoring for everyday and occasion wear with professional alterations included.",
    category: "Tailoring",
    pricePaise: 79900,
    imagePath: "/images/shop/slide3.jpg"
  },
  {
    slug: "festival-embroidery-set",
    name: "Festival Embroidery Set",
    description: "Festive embroidery patterns with bright thread work, refined edges, and comfortable finishing.",
    category: "Festive",
    pricePaise: 119900,
    imagePath: "/images/shop/slide4.webp"
  }
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
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
