export function formatPrice(price: number): string {
  return `$${Math.round(price).toLocaleString("es-CO")}`;
}
