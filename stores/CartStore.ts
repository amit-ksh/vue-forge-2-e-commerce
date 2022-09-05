import { watchDebounced } from "@vueuse/shared";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useCartStore = defineStore('CartStore', () => {
    const deskree = useDeskree();

    // STATE
    const products = ref([]);
    const loading = ref(false);
    const taxRate = 0.1

    // GETTERS
    const productCount = computed(() => products.value.length);
    const subTotal = computed(() => products.value.reduce((acc, curr) => acc + curr.fields.price * curr.amount, 0));
    const taxTotal = computed(() => subTotal.value * taxRate);
    const grandTotal = computed(() => subTotal.value + taxTotal.value);

    // ACTIONS
    function addProduct(product) {
        const existingProduct = products.value.find(i => i.sys.id === product.sys.id);
        if (existingProduct) {
            existingProduct.amount++;

        } else {
            products.value.push({ ...product, amount: 1 });
        }
    }

    function removeProducts(productIds) {
        products.value = products.value.filter(
            (p) => !productIds.includes(p.sys.id)
        );
    }


    return {
        products,
        productCount,
        subTotal,
        taxTotal,
        grandTotal,
        loading,
        removeProducts,
        addProduct,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProductStore, import.meta.hot));
}
