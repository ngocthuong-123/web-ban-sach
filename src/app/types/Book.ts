// types/Book.ts
interface Discount {
  discount_id: number;
  discount_code: string;
  discount_value: string;
  discount_type: string;
  discount_description: string;
  discount_start_date: string;
  discount_end_date: string;
}
export interface Book {
    id: number;
    title: string;
    slug: string;
    sku: string;
    barcode?: string;
    category_id: number;
    author_id: number;
    publisher_id: number;
    price: number;
    pricesale: number;
    description?: string;
    thumbnail?: string;
    status: number;
    created_at: string;
    updated_at: string;
    discounts?: Discount[];
  }
  