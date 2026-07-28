import { productDetails } from "./data";
import { CreateProductArgs, UpdateProductArgs, ProductDetails, DeleteProductArgs } from './types'

const resolvers = {
  Query: {
    getProducts: () => {
      const result = [...productDetails];
      const count = result.length;
      return {
        result,
        count
      };
    },
  },

  Mutation: {
    /**
     * Create a new product.
     *
     * @param _parent - Unused, kept for GraphQL resolver signature consistency.
     * @param args - Arguments containing the `value` payload for the new product.
     * @returns The newly created product object.
     */
    createProduct: (_parent: unknown, { value }: CreateProductArgs) => {
      const newProduct = value;

      /* Add to in-memory store. */
      productDetails.push(newProduct);

      /* Return the created entity. */
      return newProduct;
    },

    /**
     * Update an existing product by key.
     * @param args - Arguments containing `key`, optional `keyColumn`, and `value` (partial update).
     * @returns The updated product object.
     *
     * Behavior:
     * - Defaults `keyColumn` to "ProductID" if not provided.
     * - Finds the product using the provided key + keyColumn.
     * - Performs a shallow merge (Object.assign) to update fields.
     * 
     * Caution:
     * - `Object.assign` mutates the found object. If immutability is required,
     *   consider replacing the item in the array with a new object instead.
     */

    updateProduct: (_parent: unknown, { key, keyColumn = "ProductID", value }: UpdateProductArgs): ProductDetails => {
      /* Locate the product by dynamic key column (coerce to string for robust comparison). */
      const product = productDetails.find((p: ProductDetails) => String(p[keyColumn]) === String(key));
      if (!product) throw new Error("Product not found");

      /* Merge the incoming partial fields into the existing product. */
      Object.assign(product, value);

      return product;
    },


    /**
     * Delete an existing product by key.
     * @param args - Arguments containing `key` and optional `keyColumn`.
     * @returns The deleted product object (commonly useful for confirmations/audits).
     *
     * Behavior:
     * - Finds the index of the matching product.
     * - Removes it from the in-memory array using `splice`.
     * - Returns the removed entity.
     */
    deleteProduct: (_parent: unknown, { key, keyColumn = 'ProductID' }: DeleteProductArgs) => {
      /* Find the index by comparing the specified key column. */
      const idx = productDetails.findIndex((p: ProductDetails) => String(p[keyColumn]) === String(key));
      if (idx === -1) throw new Error('Product not found');

      /* Remove and capture the deleted product. */
      const [deleted] = productDetails.splice(idx, 1);
      return deleted;
    }

  }
};

export default resolvers;