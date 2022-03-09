import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'carolli_apexc';

const app = createApp({
  data(){
    return{
      cartData: {}, // 購物車列表
      products: [], // 產品列表
    }
  },
  methods: {
    getProducts(){
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
        .then((res) => {
          console.log(res);
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        })
    }
  },
  mounted(){
    this.getProducts();
  }
});

app.mount('#app');