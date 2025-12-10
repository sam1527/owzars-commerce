export type CartItem = {
  productId: string;
  quantity: number;
};

const CART_KEY = "owzars-commerce/cart";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is CartItem =>
          typeof item?.productId === "string" &&
          item.productId.length > 0 &&
          typeof item?.quantity === "number" &&
          Number.isFinite(item.quantity)
      );
    }
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
  }

  return [];
}

function writeCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function clearCart() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CART_KEY);
}

export function getCart(): CartItem[] {
  return readCart();
}

export function addToCart(productId: string, quantity = 1) {
  if (!productId || quantity <= 0) return;
  const cart = readCart();
  const existingIndex = cart.findIndex((item) => item.productId === productId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  writeCart(cart);
}

export function removeFromCart(productId: string) {
  if (!productId) return;
  const cart = readCart().filter((item) => item.productId !== productId);
  writeCart(cart);
}

export function updateQuantity(productId: string, quantity: number) {
  if (!productId) return;
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = readCart();
  const existingIndex = cart.findIndex((item) => item.productId === productId);

  if (existingIndex === -1) {
    cart.push({ productId, quantity });
  } else {
    cart[existingIndex].quantity = quantity;
  }

  writeCart(cart);
}
