<template>
  <headingbar :products="products" :detail="1"></headingbar>

  <div class="search_cont">
    <div class="main-title search_title">Search Products</div>
    <form class="search_bar" onsubmit="return false;">
      <input
        class="search_inpt"
        type="text"
        placeholder="Search"
        id="search_inpt"
      />
      <button @click="searchFunc" class="fa fa-search search_ico"></button>
    </form>
  </div>

  <div class="api_type">
    <div class="searchtype">
      <label class="stypelabel" for="api_type_select">Search Type</label>
      <select class="api_type_select" id="api_type_select">
        <option value="0">Regular</option>
        <option value="1">Quick</option>
        <option value="2">Deep</option>
        <option value="3" selected>DB Cache</option>
      </select>
    </div>
  </div>
</template>

<script>
import headingbar from "../components/headingbar.vue";

import axios from "axios";

export default {
  data() {
    return {
      msg_link: "",
      msg: "",
    };
  },
  methods: {
    searchFunc() {
      let searchType = document.getElementById("api_type_select").value;
      let searchQuery = document.getElementById("search_inpt").value;

      console.log(searchType, searchQuery);
      // move to search page, but pass the search query via url
      this.$router.push({
        name: "search",
        query: { searchQuery: searchQuery, searchType: searchType },
      });
    },
  },
};
</script>

<style scoped></style>
<!-- let urls = [
"http://localhost:3050/api/search",
"http://localhost:3050/api/quick_search",
"http://localhost:3050/api/deep_search",
"http://localhost:3050/api/db_search",
];

let url = urls[searchType];

// get the search query from the url

axios
.get(`${url}?searchQuery=${searchQuery}`)
.then((response) => {
  console.log(response.data);
  this.msg = response.data.msg;
  this.msg_link = response.data.msg_link;
})
.catch((error) => {
  console.log(error);
}); -->

<!-- <script>
import axios from "axios";

export default {
  name: "Search",
  data() {
    return {
      searchQuery: "",
      products: [],
    };
  },
  methods: {
    async fetchData() {
      
      const response = await axios.get(
        `http://localhost:3000/api/search?searchQuery=${this.searchQuery}`
      );
      this.products = response.data;

      console.log(response);
    },
  },
};
</script> -->
