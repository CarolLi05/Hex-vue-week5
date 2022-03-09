import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'carolli_apexc';

const app = createApp({
  data(){
    return{
      temp: [],
      cartData: {}, // 購物車列表
      products: [], // 產品列表
    }
  },
  methods:{
    getProducts(){
      axios.get(`/api/${apiPath}/products`)
        .then(res =>{
          console.log(res);
        })
        .catch(err=>{
          alert(err.data.message);
        })
    }
  },
  mounted:{
    
  }
});

app.mount('#app');