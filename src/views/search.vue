<script setup>
import axios from "axios";
import { ref } from "vue";
import productcont from "../components/productcont.vue";
import HeaderBar from "../components/headingbar.vue";

const products = ref([]);

async function getJson() {
  const response = await axios.get("/src/search.json");

  products.value = response.data;
}

getJson();

// add a scroll event listener
onload = function () {
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
};
</script>

<template>
  <div class="prod-con" id="prodcon">
    <HeaderBar :products="products" />
    <div class="product_list">
      <div class="products" v-if="products.length > 2">
        <productcont
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
