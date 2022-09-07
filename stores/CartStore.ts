import { watchDebounced } from "@vueuse/shared";
import { defineStore, acceptHMRUpdate } from "pinia";

export const useCartStore = defineStore('CartStore', () => {
    const deskree = useDeskree();

    // STATE
    const products = ref([]);
    const loading = ref(false);
    const isFirstLoad = ref(false);
    const taxRate = 0.1

    // GETTERS
    const productCount = computed(() => products.value.length);
    const subTotal = computed(() => products.value.reduce((acc, curr) => acc + curr.fields.price * curr.amount, 0));
    const taxTotal = computed(() => subTotal.value * taxRate);
    const grandTotal = computed(() => subTotal.value + taxTotal.value);

    // ACTIONS
    function addProduct(product, amount=1) {
        const existingProduct = products.value.find(i => i.sys.id === product.sys.id);
        if (existingProduct) {
            existingProduct.amount++;

        } else {
            products.value.push({ ...product, amount });
        }
    }

    function removeProducts(productIds) {
        products.value = products.value.filter(
            (p) => !productIds.includes(p.sys.id)
        );
    }

  // TRIGGERS
  // init data
  deskree.auth.onAuthStateChange(async (user) => {  
    isFirstLoad.value = true;
    loading.value = true;
    const res = await deskree.user.getCart();
    console.log(res.products);
    res.products.forEach((product) => addProduct(product, product.count));
    loading.value = false;
    setTimeout(() => (isFirstLoad.value = false), 1000);
  });

  // update cart whenever products change
  watchDebounced(
    products,
    async () => {
      if (isFirstLoad.value && !deskree.user.get()) return;
      await deskree.user.updateCart(products.value);
    },
    {
      debounce: 500,
      deep: true,
    }
  );

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
