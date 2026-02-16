export interface Return {
  _id: string;
  sparePartId: { _id: string; name: string };
  quantityReturned: number;
  reason?: string;
  createdAt: string;
}
