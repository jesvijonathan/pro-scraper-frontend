<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

// import prod from "./components/productcont.vue";

import Header from "./components/header.vue";
import Footer from "./components/footer.vue";
import HeaderBar from "./components/headingbar.vue";

import sjson from "./assets/search.json";
</script>

<template>
  <div class="app">
    <Header />

    <router-view />

    <Footer />
  </div>
</template>

<style scoped></style>
