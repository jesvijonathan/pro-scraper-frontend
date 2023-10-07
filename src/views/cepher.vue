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
        <option value="1">Regular</option>
        <option value="2">Quick</option>
        <option value="3">Deep</option>
        <option value="4">DB Cache</option>
      </select>
    </div>
  </div>
</template>

<script>
import headingbar from "../components/headingbar.vue";
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

      let urls = [
        "http://localhost:3000/api/search",
        "http://localhost:3000/api/quick_search",
        "http://localhost:3000/api/deep_search",
        "http://localhost:3000/api/db_search",
      ];

      let url = urls[searchType - 1];

      console.log(url);

      this.$router.push({
        name: "search",
        params: { searchQuery: searchQuery, searchType: searchType },
      });

      return false;
    },
  },
};
</script>

<style scoped></style>

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
