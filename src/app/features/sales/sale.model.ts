export interface Sale {
  _id: string;
  sparePartId: { _id: string; name: string };
  quantitySold: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
}
