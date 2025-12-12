import { IProduct } from "@/models/Product";

export const sampleProducts: Array<Omit<IProduct, "_id">> = [
  {
    title: "Aurora Noise-Cancelling Headphones",
    description:
      "Wireless over-ear headphones with adaptive ANC, 32-hour battery life, and memory-foam comfort for everyday focus.",
    price: 249,
    images: [
      "https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Audio",
    inventory: 24,
  },
  {
    title: "Nebula Smart Lamp",
    description:
      "A dimmable bedside lamp with touch controls, sunrise alarm, and Wi-Fi connectivity for hands-free automations.",
    price: 129,
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Home",
    inventory: 42,
  },
  {
    title: "Summit Daypack 24L",
    description:
      "Weather-resistant backpack with quick-access laptop sleeve, breathable straps, and modular pockets for travel days.",
    price: 179,
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Outdoors",
    inventory: 18,
  },
  {
    title: "Atlas Ceramic Mug Set",
    description:
      "Hand-glazed 12oz ceramic mugs with heat-retaining walls and stackable silhouettes for compact storage.",
    price: 48,
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Kitchen",
    inventory: 64,
  },
  {
    title: "Drift Mechanical Keyboard",
    description:
      "Hot-swappable 75% keyboard with RGB underglow, gasket mounting, and pre-lubed switches for a premium feel.",
    price: 219,
    images: [
      "https://images.unsplash.com/photo-1558050074-8550fc40f7fc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Workspace",
    inventory: 15,
  },
  {
    title: "Horizon Fitness Tracker",
    description:
      "Lightweight wearable with AMOLED display, all-day heart-rate tracking, GPS, and 10-day battery life.",
    price: 149,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Wearables",
    inventory: 30,
  },
];
