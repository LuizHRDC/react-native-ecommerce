export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export type ProductInCart = Product & {
  quantity: number;
};
