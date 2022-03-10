// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

import productModal from './productModal.js';

const app = Vue.createApp({
  data(){
    return{
      cartData: {}, // 購物車列表
      products: [], // 產品列表
      productId: '', // 取得單一產品的 id
      isLoadingItem: '', // 讀取效果
    }
  },
  components:{
    productModal,
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
      this.$refs.productModal.openModal(); // 使用 ref 開啟 modal
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
          this.$refs.productModal.closeModal(); // 使用 ref 關閉 modal
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

app.mount('#app');