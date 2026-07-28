
export interface ProductDetails {
  ProductID?: string;
  ProductName?: string;
  Category?: string;
  MRP?: number;
  Discount?: number;
}

export interface CreateProductArgs {
  value: ProductDetails;
}

export interface UpdateProductArgs {
  key: string | number;
  keyColumn: keyof ProductDetails;       // "ProductID" | "name" | ...
  value: Partial<ProductDetails>;
}

export interface DeleteProductArgs {
  key: string | number;
  keyColumn?: keyof ProductDetails;
}