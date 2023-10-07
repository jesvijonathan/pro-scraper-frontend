<template>
  <div class="option_cont">
    <input class="sear" type="text" placeholder="Search" />
    <div class="fa fa-search search_ico"></div>
  </div>
  <div class="filt_area" id="filt_top">
    <div class="categ">
      <div class="filt_2" id="filt_2">
        <a href="" class="stpath">Search</a>
        /
        <a href="" class="stpath">Iphone</a>
      </div>
      <div class="filt_1" id="filt_1">
        Search Results ({{ products.length }})
      </div>
    </div>
    <div class="filcon">
      <div style="height: 3vw" id="padspac"></div>
      <div class="filt">
        <div class="filb_con" onclick='notify("Unavailable !", 3000);'>
          <div class="fa fa-filter"></div>
          <div class="filb">Filter</div>
        </div>

        <div
          class="filb_con"
          onclick='document.getElementById("sort").style.display="block";'
        >
          <div class="fa fa-sort-amount-asc"></div>
          <div class="filb">Sort By</div>
        </div>
        <div class="sort_cont" id="sort">
          <div class="sort_title_con">
            <div class="sort_title_con_1">
              <div>Sort By</div>
              <div
                class="fa fa-close close"
                style="cursor: pointer"
                onclick='document.getElementById("sort").style.display="none";'
              ></div>
            </div>
            <div class="sort_options">
              <div class="sort_opt">Featured</div>
              <div class="sort_opt">Latest</div>
              <div class="sort_opt">Best Selling</div>
              <div class="sort_opt">Price : Hight to Low</div>
              <div class="sort_opt">Price : Low to Hight</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
  detail: {
    type: Number,
    default: 0,
  },
});

console.log(props.products, props.detail);
</script>
