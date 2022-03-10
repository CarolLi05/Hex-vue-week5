import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'carolli_apexc';

const app = createApp({
  data(){
    return{
      cartData: {}, // 購物車列表
      products: [], // 產品列表
      productId: '', // 取得單一產品的 id
      isLoadingItem: '', // 讀取效果
    }
  },
  methods: {
    getProducts(){
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          // console.log(res);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    openProductModal(id){
      this.productId = id;
      this.$refs.productModal.openModal(); // 使用 ref 操控 modal
    },
    getCart(){
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
        .then((res) => {
          // console.log(res);
          this.cartData = res.data.data; // 記得內層 data
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    addToCart(id, qty = 1){ // 加入購物車，要記得把 id 跟 qty（數量）加入
      const data = { // 建構資料格式
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios.post(`${apiUrl}/api/${apiPath}/cart`, {data})
        .then((res) => {
          // console.log(res);
          this.getCart(); // 加入購物車後，再重新取得購物車內容
          this.isLoadingItem = ''; // 加入購物車後，把 id 清空
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    removeCartItem(id){ // 刪除特定品項，要帶上 id
      this.isLoadingItem = id; // 讀取效果
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
        .then((res) => {
          // console.log(res);
          this.getCart(); // 刪除品項後，再重新取得購物車內容
          this.isLoadingItem = ''; // 刪除品項後，把 id 清空
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    updateCartItem(item){ // 直接帶入 item
      const data = { // 建構資料格式
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {data})
        .then((res) => {
          console.log(res);
          this.getCart(); // 加入購物車後，再重新取得購物車內容
          this.isLoadingItem = ''; // 加入購物車後，把 id 清空
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
  },
  mounted(){
    this.getProducts();
    this.getCart();
  }
});

app.component('product-modal', {
  props: ['id'],
  template: '#userProductModal',
  data(){
    return{
      modal: {}, // modal 資料變數
      product: {},
      qty: 1, //購物車項目數量至少要有 1 個
    }
  },
  watch:{ // 監聽 id，如果有變動就取的該產品的資料
    id(){
      this.getProduct();
    }
  },
  methods:{
    openModal(){
      this.modal.show();
    },
    getProduct(){
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
        .then((res) => {
          // console.log(res);
          this.product = res.data.product;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    },
    addToCart(){
      // console.log(this.qty);
      this.$emit('add-cart', this.product.id, this.qty)
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  },
})

app.mount('#app');