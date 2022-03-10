// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

import productModal from './productModal.js';

// 宣告要使用的東西
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n; //多國語系

// defineRule() 是 vee-validate 提供的函式，用來定義規則
// 第一個參數是規則命名，第二個是 VeeValidateRules 提供的規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);
// 限制 8-10 碼

loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
  generateMessage: localize('zh_TW'), //啟用 locale
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const app = Vue.createApp({
  data(){
    return{
      cartData: {
        carts: [], // 清空購物車時需要
      }, // 購物車列表
      products: [], // 產品列表
      productId: '', // 取得單一產品的 id
      isLoadingItem: '', // 讀取效果
      form:{
        user: {
          email: '',
          name: '',
          address: '',
          phone: ''
        },
        message: '',
      },
    }
  },
  components:{
    productModal,
    // 表單標籤註冊成區域元件
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
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
    delAllCart(){
      this.isLoadingItem = 1;
      axios.delete(`${apiUrl}/api/${apiPath}/carts`)
        .then((res)=>{
          // console.log(res);
          this.isLoadingItem = 0;
          this.getCart();
            alert(res.data.message);
        })
        .catch((err)=>{
          alert(err.data.message);
        })
    },
    createOrder(){
      const order = this.form;
      axios.post(`${apiUrl}/api/${apiPath}/order`, {data: order})
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm(); // 表單清空
          this.form.message = '';
          this.getCart();
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
  },
  mounted(){
    this.getProducts();
    this.getCart();
  }
});

app.mount('#app');