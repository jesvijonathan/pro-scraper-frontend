<script setup>
import axios from "axios";
import { ref } from "vue";
import productcont from "../components/productcont.vue";
import productbar from "../components/productbar.vue";

const products = ref([]);
const templ = {
  product: {
    additional_info: "",
    hash: "",
    img: "",
    in_stock: "",
    last_scraped: "",
    link: "",
    market: null,
    price: "",
    rating: {
      reviews: null,
      score: null,
    },
    title: "",
  },
  market: [
    {
      delivery: null,
      hash: "",
      last_scraped: "",
      link: "",
      new_hash: "",
      other_price: null,
      price: "",
      returns: null,
      scraped: "",
      store: "",
    },
  ],
  review: {
    hash: "",
    last_scraped: "",
    rating: null,
    reviews: null,
    reviews_link: null,
    scraped: "",
    stars: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
    },
    tags: [],
  },
};

const responses = ref({
  product: templ.product,
  market: templ.market,
  review: templ.review,
});

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import router from "../router/index";

const route = useRoute();

import { onMounted } from "vue";
let str_price = ref("");
let str_other_price = ref("");
let currency = "INR"; // USD
let str_date = ref("");

let cur = {
  INR: {
    symbol: "₹",
    abrev: "Rs.",
    name: "Indian Rupee",
    decimal_digits: 2,
    rounding: 0,
    code: "INR",
    country_code: "IN",
    name_plural: "Indian rupees",
    format: "10,00,00,000",
  },
  USD: {
    symbol: "$",
    name: "US Dollar",
    decimal_digits: 2,
    rounding: 0,
    code: "USD",
    country_code: "US",
    name_plural: "US dollars",
    abrev: "$",
    format: "100,000,000",
  },
};
let offer;

function formatPrice(price, currency = "INR") {
  let strPrice = price.toString();

  if (currency == "INR") {
    strPrice = strPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (currency == "USD") {
    strPrice = strPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return strPrice;
}

let loaded = ref(0);
async function getJson() {
  // let url_product = "http://localhost:5000/api/search";
  // let url_market = "http://localhost:5000/api/product";
  // let url_review = "http://localhost:5000/api/reviews";

  let url_product = "https://proscraper.pythonanywhere.com/api/search";
  let url_market = "https://proscraper.pythonanywhere.com/api/product";
  let url_review = "https://proscraper.pythonanywhere.com/api/reviews";

  /*
    h": "a2aa408032e96021384c0bab78defb5a", "img": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRldM4jGcy9pRHbNUCjzYO3EIuEJeWIcswN_8ZUuvBYwJ-nL6iOm4JBFdkQbMh8pwLk89KAWvJ0bFNmkJ4vF15l3cLzPogKzDdYzPht9wscTifgrBjiU7CU&usqp=CAE", "in_stock": "", "last_scraped": "Mon, 09 Oct 2023 18:00:51 GMT", "link": "https://www.google.com/url?url=https://www.apple.com/in/shop/go/product/MTP43%3Fcid%3Daos-in-seo-pla-iphone&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQguUECLgN&usg=AOvVaw1Wp9OXv3O5N_acfr6I5x4q", "market": "Apple", "other_links": [ "https://www.google.com/url?url=https://www.apple.com/in/shop/go/product/MTP43%3Fcid%3Daos-in-seo-pla-iphone&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQguUECLgN&usg=AOvVaw1Wp9OXv3O5N_acfr6I5x4q", "https://www.google.com/shopping/product/12768653927672354796?q=iphone&prds=eto:7639568978206819139_0,pid:17290598997503985147,rsk:PC_6601648695432433635&sa=X&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQ8gIIsA0oAA", "https://www.google.com/shopping/product/12768653927672354796/offers?q=iphone&prds=eto:7639568978206819139_0,pid:17290598997503985147,rsk:PC_6601648695432433635&sa=X&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQ3q4ECLsN" ], "other_price": null, "price": "79900.00", "price_description": "", "rating": { "reviews": 131, "score": "4.2" }, "scraped": "Mon, 09 Oct 2023 18:00:51 GMT", "shipping": "Free delivery", "tags": [ "Apple", "iPhone", "15", "128", "GB", "Blue" ], "title": "Apple iPhone 15 - 128 GB - Blue", "verified": 0 } ]
    */

  responses.value.product = await axios
    .get(`${url_product}?searchQuery=${hash}`)
    .then((response) => {
      loaded.value = 1;
      return response;
    })
    .catch((error) => {
      console.log(error);
      loaded.value = -1;
    });

  // sometimes the response is sent in an array, so we need to check &  extract the first element
  if (Array.isArray(responses.value.product.data)) {
    responses.value.product = responses.value.product.data[0];
  } else {
    responses.value.product = responses.value.product.data;
  }

  responses.value.market = await axios
    .get(`${url_market}?searchQuery=${hash}`)
    .catch((error) => {
      console.log(error);
      responses.value.market = templ.market;
    });

  responses.value.review = await axios
    .get(`${url_review}?searchQuery=${hash}`)
    .catch((error) => {
      console.log(error);
      responses.value.review = templ.review;
    });

  try {
    responses.value.market = responses.value.market.data;
  } catch (error) {
    responses.value.market = templ.market;
  }

  try {
    responses.value.review = responses.value.review.data;
  } catch (error) {
    responses.value.review = templ.review;
  }

  str_price = formatPrice(responses.value.product.price);

  try {
    str_other_price = formatPrice(responses.value.product.other_price);
  } catch (error) {
    str_other_price = null;
  }

  if (responses.value.product.title == "" || !responses.value.product.title) {
    responses.value.product.title = responses.value.product.hash;
  }

  try {
    offer = (
      ((responses.value.product.other_price - responses.value.product.price) /
        responses.value.product.other_price) *
      100
    ).toFixed(2);
  } catch (error) {}

  let date = new Date(responses.value.product.last_scraped);
  let options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  str_date = date.toLocaleDateString(
    "en-" + cur[currency].country_code,
    options
  );
}

const hash = route.query.hash;
onMounted(() => {
  console.log(hash);

  getJson();
});

function refreshDet() {
  // get all the data again
  getJson();

  alert("refreshed");
}

import { onUnmounted } from "vue";

onUnmounted(() => {});
</script>

<template>
  <div class="prod-con" id="prodcon">
    <productbar :products="responses.product.title" :detail="1" />

    <div v-if="loaded == 0" class="loading_timer">
      <div class="laoading_text">Loading...</div>

      <div class="progress_bar_cont">
        <div class="progress_bar"></div>
      </div>
    </div>
    <div class="laoading_text paused" v-else-if="loaded == -1">
      Error Loading !
    </div>

    <div class="prod_first_view">
      <div class="vprod_img">
        <img :src="responses.product.img" />
        <div class="vprod_mig_dots_con">
          <div class="vprod_mig_dot mig_dot_active"></div>
          <div class="vprod_mig_dot"></div>
          <div class="vprod_mig_dot"></div>
          <div class="vprod_mig_dot"></div>
        </div>
      </div>
      <div class="vprod_content">
        <div class="vprod_title">
          {{ responses.product.title }}
        </div>
        <div class="seperator"></div>
        <div class="tags">
          <div class="tagg" v-for="tag in responses.product.tags">
            {{ tag }}
          </div>
        </div>
        <div class="vrating">
          <div class="vrating_1">4.6</div>
          <div class="vrating_2">Rating</div>
          <div class="vrating_3">(153200)</div>
        </div>

        <div class="seperator"></div>
        <div class="prodprice">
          <div class="act_price">
            <div class="price_symbol">{{ cur[currency].symbol }}</div>
            <div class="price_value">{{ str_price }}</div>
          </div>
          <div class="mrp_price" v-if="responses.product.other_price">
            <div class="price_symbol">{{ cur[currency].symbol }}</div>
            <div class="price_value">{{ str_other_price }}</div>
          </div>

          <div class="mrp_price" v-if="responses.product.other_price">
            <div class="offer_value">{{ offer }}% off</div>
          </div>
        </div>

        <div class="lowest">Lowest Price</div>
        <div class="last_updated">
          ({{ str_date }}
          <div class="verif" v-if="!responses.product.verified">, Verified</div>
          )
        </div>

        <div class="seperator"></div>
        <div class="xtra_info">
          <div class="xtra_text">
            <!-- sometimes market is not available & checking lenght will cause error -->
            <!-- product.vue:283 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'length') -->
            <div class="xtra_tx" v-if="responses.market">
              ({{ responses.market.length }}) Store Avaibale
            </div>
            <div class="xtra_tx" v-if="responses.review">
              Analytics Avaibale
            </div>
          </div>
        </div>
        <div class="seperator"></div>
        <div class="use_but">
          <button @click="refreshDet()" class="use_butt ub">Refresh</button>

          <button class="use_butt fa fa-bookmark"></button>
          <!-- :href="responses.product.link"
             -->
          <a
            :href="responses.product.link"
            target="_blank"
            class="use_butt use_butta fa fa-external-link-square"
          ></a>
        </div>
      </div>
    </div>

    <div style="color: white; margin-top: 14vw">
      {{ responses.product }}
      <br /><br /><br /><br />
      {{ responses.market }}
      <br /><br /><br /><br />
      {{ responses.review }}
    </div>
  </div>
</template>

<style scoped></style>
