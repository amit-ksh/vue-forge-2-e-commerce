import { defineStore, acceptHMRUpdate } from "pinia";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
        /**
         * This list of all the products present in cart.
         */
        items: [],
    }
  },
  getters: {
      itemCount: (state) => state.items.reduce((acc, curr) => acc + curr.amount, 0),
      subTotal: (state) => state.items.reduce((acc, curr) => acc + curr.fields.price * curr.amount, 0),
      taxTotal(): number {
          return this.subTotal * 0.1;
      },
      grandTotal(): number {
          return this.subTotal + this.taxTotal;
      }
  },
  actions: {
      addToCart(item) {
        const existingItem = this.items.find(i => i.sys.id === item.sys.id);
        if (existingItem) {
            existingItem.amount++;

        } else {
            this.items.push({ ...item, amount: 1 });
        }
    },
    removeProducts(productIds) {
        this.items = this.items.filter(
            (p) => !productIds.includes(p.sys.id)
        );
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
