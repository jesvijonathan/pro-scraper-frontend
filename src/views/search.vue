<script setup>
import axios from "axios";
import { ref } from "vue";
import productcont from "../components/productcont.vue";
import HeaderBar from "../components/headingbar.vue";

const products = ref([]);

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import router from "../router/index";

const route = useRoute();

const searchQuery = route.query.searchQuery;
const searchType = route.query.searchType;

import { onMounted } from "vue";

let loaded = ref(0);

async function getJson() {
  let urls = [
    "https://proscraper.pythonanywhere.com/api/search",
    "https://proscraper.pythonanywhere.com/api/quick_search",
    "https://proscraper.pythonanywhere.com/api/deep_search",
    "https://proscraper.pythonanywhere.com/api/db_search",
  ];
  let local_urls = [
    "http://localhost:5000/api/search",
    "http://localhost:5000/api/quick_search",
    "http://localhost:5000/api/deep_search",
    "http://localhost:5000/api/db_search",
  ];

  let url = urls[searchType];

  axios
    .get(`${url}?searchQuery=${searchQuery}`)
    .then((response) => {
      console.log(response.data);
      products.value = response.data;
      loaded.value = 1;
    })
    .catch((error) => {
      console.log(error);

      loaded.value = -1;
      if (searchType == 0) {
        alert(
          "No results found !\nEven after switching to Deep Search internally. \n\nChances are :\n- The server is down or\n- google is a bitch ! (Blacklisted, try again after a day)\n- maybe the search is one of the rarest product ever"
        );
      } else if (searchType == 1) {
        alert("No results found !\nTry Deep searching...");
      } else if (searchType == 2) {
        alert(
          "No results found !\n\nChances are :\n- The server is down or\n- google is a bitch ! (Blacklisted, try again after a day)\n- maybe the search is one of the rarest product ever"
        );
      } else if (searchType == 3) {
        alert(
          "No results found in db !\nTry using different/shorter keywords or do a Deep searching..."
        );
      }
    });
}

onMounted(() => {
  getJson();

  let prod = document.getElementById("prodcon");
  prod.onscroll = function () {
    scrollFunction();
  };

  let header_container = document.getElementById("header-container");
  let filt_top = document.getElementById("filt_top");
  let padspac = document.getElementById("padspac");
  let filt_2 = document.getElementById("filt_2");
  let filt_1 = document.getElementById("filt_1");

  let old_croll = 0;
  let new_croll = 0;

  function scrollFunction() {
    new_croll = prod.scrollTop;

    if (new_croll > 140) {
      //console.log(prod.scrollTop);

      header_container.style.top = "-6vw";
      filt_top.style.position = "sticky";
      //filt_top.style.padding = "1vw 0vw";

      filt_top.style.top = "-11vw";
      //padspac.style.height = "0vw";
      //filt_2.style.display = "none";
      filt_1.style.fontSize = "1vw";
      // if (prevScrollpos > currentScrollPos) {
      //   //header_container.style.top = "0";
      //   // prod.style.marginTop = "5.5vw";
      // } else {
      //   //prod.style.marginTop = "0vw";
      // }
      if (new_croll < old_croll) {
        header_container.style.top = "-1.4vw";
        filt_top.style.top = "-7vw";

        // header_container.style.top = "0vw";
        // filt_top.style.top = "-6vw";

        //filt_top.style.paddingTop = "9vw";
      }
      old_croll = new_croll;
    } else {
      header_container.style.top = "0";
      //filt_top.style.paddingTop = "9vw";

      filt_1.style.fontSize = "1.4vw";

      filt_top.style.top = "0vw";
      // prod.style.marginTop = "5.5vw";
    }
  }
});

import { onUnmounted } from "vue";

onUnmounted(() => {
  // header_container.style.top = "0 !important";
  // filt_1.style.fontSize = "1.4vw !important";
  // filt_top.style.top = "0vw !important";
});

let current_product;

let page = 0;
</script>

<template>
  <div class="prod-con" id="prodcon">
    <HeaderBar
      :products="products"
      :detail="1"
      :searchQuery="searchQuery"
      :searchType="searchType"
    />
    <div class="product_list">
      <div v-if="loaded == 0" class="loading_timer">
        <div class="laoading_text">Loading...</div>

        <div class="progress_bar_cont">
          <div class="progress_bar"></div>
        </div>
      </div>
      <div class="laoading_text paused" v-else-if="loaded == -1">
        Error Loading !
      </div>
      <div
        class="products jos"
        data-jos_stagger="zoom"
        data-jos_stagger_duration="0.5"
        data-jos_stagger_seq="0.1"
        data-jos_stagger_scrolldirection="down"
        v-if="products.length > 2"
      >
        <productcont
          v-for="product in products"
          :key="product.id"
          :product="product"
          :searchQuery="searchQuery"
          :searchType="searchType"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
