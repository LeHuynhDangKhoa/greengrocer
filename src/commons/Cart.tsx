import { CartSession, Product } from "./Types";

export const addProductToCart = (
  product: Product,
  category?: string,
  quantity: number = 1
) => {
  const price =
    product.discount > 0
      ? product.price * (1 - product.discount)
      : product.price;
  if (localStorage.getItem("cart")) {
    let cart: CartSession = JSON.parse(localStorage.getItem("cart") as string);
    const index = cart.data.findIndex((item) => item.id === product.uid);
    if (index === -1) {
      cart.data.push({
        id: product.uid,
        name: product.name,
        image: product.image,
        kind: product.kind,
        price: price,
        category: category,
        quantity: quantity,
      });
    } else {
      cart = {...cart, data: cart.data.map((item, i) => ({...item, quantity: i === index ? item.quantity + quantity: item.quantity}))}
      // cart.data[index].quantity = cart.data[index].quantity + quantity;
    }
    cart.data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    cart.total_price = cart.total_price + price;
    cart.total_quantity = cart.total_quantity + quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    const cart: CartSession = {
      data: [
        {
          id: product.uid,
          name: product.name,
          image: product.image,
          kind: product.kind,
          price: price,
          category: category,
          quantity: quantity,
        },
      ],
      total_quantity: quantity,
      total_price: price,
    };
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const getCartQuantity = (): number => {
  let quantity = 0;
  if (localStorage.getItem("cart")) {
    const cart: CartSession = JSON.parse(
      localStorage.getItem("cart") as string
    );
    quantity = cart.total_quantity;
  }
  return quantity;
};

export const getCartContent = (): CartSession | undefined => {
  if (localStorage.getItem("cart")) {
    return JSON.parse(localStorage.getItem("cart") as string);
  }
  return undefined;
};
