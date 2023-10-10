<template>
  <div class="option_cont">
    <input class="sear" type="text" placeholder="Search" />
    <div class="fa fa-search search_ico"></div>
  </div>
  <div class="filt_area" id="filt_top">
    <div class="categ" style="margin-left: 0vw">
      <div class="filt_1" id="filt_1">
        Product Page /
        <a href="" class="prodna">{{ products }}</a>
      </div>
    </div>
    <div class="filcon">
      <div style="height: 2.2vw" id="padspac"></div>
      <div class="filt but_mami" style="gap: 1vw" @click="backFunc">
        <i class="fa fa-arrow-left" style="font-size: 1.3vw"></i>
        <div class="filb">Back</div>
      </div>
    </div>
  </div>

  <div></div>
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
    required: true,
  },
  searchQuery: {
    type: String,
    default: "",
  },
  searchType: {
    type: Number,
    default: 0,
  },
});

const searchTypeLabel = () => {
  if (props.searchType == 0) {
    return "Search";
  } else if (props.searchType == 1) {
    return "Quick Search";
  } else if (props.searchType == 2) {
    return "Deep Search";
  } else if (props.searchType == 3) {
    return "DB Cache Search";
  } else {
    return "Unknown";
  }
};

function backFunc() {
  window.history.back();
}
</script>

<style scoped>
.filcon {
  display: flex;
  flex-direction: row;
}
.filt_1 {
  display: flex;
  gap: 1vw;
  justify-content: center;
  align-items: center;
}
.prodna {
  letter-spacing: 0;
  font-size: 1.2vw;
  font-weight: 500;
}
.prodna:hover {
  text-decoration: underline;
}
</style>
