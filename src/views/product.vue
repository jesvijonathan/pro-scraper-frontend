<script setup>
import axios from "axios";
import { ref } from "vue";
import productcont from "../components/productcont.vue";
import productbar from "../components/productbar.vue";

const products = ref([]);

const responses = ref({
  product: {
    additional_info: "",
    hash: "",
    img: "",
    in_stock: "",
    last_scraped: "",
    link: "",
    market: "",
    price: "",
    rating: {
      reviews: "",
      score: "",
    },
    title: "",
  },
  market: [
    {
      delivery: "",
      hash: "",
      last_scraped: "",
      link: "",
      new_hash: "",
      other_price: "",
      price: "",
      returns: "",
      scraped: "",
      store: "",
    },
  ],
  review: {
    hash: "",
    last_scraped: "",
    rating: "",
    reviews: "",
    reviews_link: "",
    scraped: "",
    stars: {
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
    },
    tags: [],
  },
});

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import router from "../router/index";

const route = useRoute();

import { onMounted } from "vue";
let str_price = ref("");
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

onMounted(() => {
  const hash = route.query.hash;

  console.log(hash);

  async function getJson() {
    let url_product = "http://localhost:3050/api/search";
    let url_market = "http://localhost:3050/api/product";
    let url_review = "http://localhost:3050/api/reviews";

    /*
    h": "a2aa408032e96021384c0bab78defb5a", "img": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRldM4jGcy9pRHbNUCjzYO3EIuEJeWIcswN_8ZUuvBYwJ-nL6iOm4JBFdkQbMh8pwLk89KAWvJ0bFNmkJ4vF15l3cLzPogKzDdYzPht9wscTifgrBjiU7CU&usqp=CAE", "in_stock": "", "last_scraped": "Mon, 09 Oct 2023 18:00:51 GMT", "link": "https://www.google.com/url?url=https://www.apple.com/in/shop/go/product/MTP43%3Fcid%3Daos-in-seo-pla-iphone&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQguUECLgN&usg=AOvVaw1Wp9OXv3O5N_acfr6I5x4q", "market": "Apple", "other_links": [ "https://www.google.com/url?url=https://www.apple.com/in/shop/go/product/MTP43%3Fcid%3Daos-in-seo-pla-iphone&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQguUECLgN&usg=AOvVaw1Wp9OXv3O5N_acfr6I5x4q", "https://www.google.com/shopping/product/12768653927672354796?q=iphone&prds=eto:7639568978206819139_0,pid:17290598997503985147,rsk:PC_6601648695432433635&sa=X&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQ8gIIsA0oAA", "https://www.google.com/shopping/product/12768653927672354796/offers?q=iphone&prds=eto:7639568978206819139_0,pid:17290598997503985147,rsk:PC_6601648695432433635&sa=X&ved=0ahUKEwimkcGM_OiBAxVGpJUCHexYCZUQ3q4ECLsN" ], "other_price": null, "price": "79900.00", "price_description": "", "rating": { "reviews": 131, "score": "4.2" }, "scraped": "Mon, 09 Oct 2023 18:00:51 GMT", "shipping": "Free delivery", "tags": [ "Apple", "iPhone", "15", "128", "GB", "Blue" ], "title": "Apple iPhone 15 - 128 GB - Blue", "verified": 0 } ]
    */

    responses.value.product = await axios.get(
      `${url_product}?searchQuery=${hash}`
    );

    responses.value.market = await axios.get(
      `${url_market}?searchQuery=${hash}`
    );

    responses.value.review = await axios.get(
      `${url_review}?searchQuery=${hash}`
    );

    responses.value.market = responses.value.market.data;
    responses.value.review = responses.value.review.data;
    responses.value.product = responses.value.product.data[0];

    str_price = responses.value.product.price.toString();

    if (currency == "INR") {
      str_price = str_price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else if (currency == "USD") {
      str_price = str_price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (responses.value.product.title == "" || !responses.value.product.title) {
      responses.value.product.title = responses.value.product.hash;
    }

    try {
      offer = (
        ((responses.value.market.other_price - responses.value.market.price) /
          responses.value.market.other_price) *
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

  getJson();
});

import { onUnmounted } from "vue";

onUnmounted(() => {});
</script>

<template>
  <div class="prod-con" id="prodcon">
    <productbar :products="responses.product.title" :detail="1" />

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
          <div class="mrp_price" v-if="responses.market.other_price">
            <div class="price_symbol">{{ cur[currency].symbol }}</div>
            <div class="price_value">{{ str_price }}</div>
          </div>

          <div class="mrp_price" v-if="responses.market.other_price">
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
            <div class="xtra_tx" v-if="responses.market.length > 0">
              ({{ responses.market.length }}) Store Avaibale
            </div>
            <div class="xtra_tx" v-if="responses.review">
              Analytics Avaibale
            </div>
          </div>
        </div>
        <div class="seperator"></div>
        <div class="use_but">
          <button class="use_butt ub">Refresh</button>

          <button class="use_butt fa fa-bookmark fa-1x"></button>
        </div>
      </div>
    </div>

    {{ responses.product }}
    <br /><br /><br /><br />
    {{ responses.market }}
    <br /><br /><br /><br />
    {{ responses.review }}
  </div>
</template>

<style scoped></style>
