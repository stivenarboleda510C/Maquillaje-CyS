export type Sale = {
  id: number;
  product_id: number | null;
  product_name: string;
  quantity: number;
  unit_price: number;
  sold_at: string;
  created_at: string;
};
