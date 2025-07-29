import { Product } from "../types/Product";

const API_BASE_URL = "https://ecommerce-api-99h8.onrender.com";

export class ProductService {
  static async getAll(): Promise<Product[]> {
    return ProductService.getFromAPI();
  }

  static async getFromAPI(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      const data = await response.json();

      return data.map((item: any, index: number) => ({
        id: item.id?.toString() || `${index + 1}`,
        name: item.name,
        image: `${API_BASE_URL}${item.image}`,
        price: parseFloat(item.price),
      }));
    } catch {
      return [];
    }
  }
}
