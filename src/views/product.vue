<script setup>
import axios from "axios";
import { ref } from "vue";
import productcont from "../components/productcont.vue";
import productbar from "../components/productbar.vue";
import Chart from "chart.js/auto";
import Plotly from "plotly.js/dist/plotly.js";

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
let currency = "USD"; // USD
let str_date = ref("");

let glink = ref("");

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

function formatPrice(price, currency = "USD") {
  let strPrice = price.toString();

  if (currency == "INR") {
    strPrice = strPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else if (currency == "USD") {
    strPrice = strPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return strPrice;
}

let refe = false;
let processedTags = [];

let price_anal = {
  min: 0,
  max: 0,
  avg: 0,
};

let loaded = ref(0);
async function getJson() {
  let url_product = "https://proscraper.pythonanywhere.com/api/search";
  let url_market = "https://proscraper.pythonanywhere.com/api/product";
  let url_review = "https://proscraper.pythonanywhere.com/api/reviews";

  // let url_product = "http://localhost:5000/api/search";
  // let url_market = "http://localhost:5000/api/product";
  // let url_review = "http://localhost:5000/api/reviews";

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

  try {
    // get minimum price from market
    price_anal.min = responses.value.market[0].price;
    // SOMETIMES LASTE NTRY IS LEFT FOR BLANK OR NULL, SO GET THE ONE WITH DATA
    price_anal.max =
      responses.value.market[responses.value.market.length - 1].price;

    // get avg price from market
    let sum = 0;
    let count = 0;
    responses.value.market.forEach((market) => {
      if (market.price != null) {
        sum += market.price;
        count++;
        console.log(market.price);
      }
    });
    price_anal.avg = sum / count;

    // // use chart.js to plot graph

    // plot a simple chart using chart.js with dummy values
    console.log(price_anal);

    // print avg chart price range using price_anal
    let avg_price_range = price_anal.avg - price_anal.min;
    let avg_price_range_perc = (avg_price_range / price_anal.avg) * 100;
    console.log(avg_price_range_perc);

    // zoom out the graph to show the avg price range
    let trace1 = {
      y: [price_anal.min, price_anal.avg, price_anal.max],
      type: "box",
      boxpoints: "all",
      jitter: 0.3,
      pointpos: -1.8,
      name: "Price",

      marker: {
        color: "rgb(7,40,89)",
      },
      boxmean: "sd",
    };

    let data = [trace1];

    let layout = {
      title: "Price Analysis",
      yaxis: {
        title: "Price",
        zeroline: false,
        range: [
          price_anal.min - avg_price_range,
          price_anal.max + avg_price_range,
        ],
      },

      boxmode: "group",
      showlegend: false,
    };

    Plotly.newPlot("box-plot", data, layout);
  } catch (error) {}

  let tags = responses.value.review.tags;
  processedTags = tags.map((tag) => {
    const matches = tag.match(/^(.+) \((\d+)\)$/);
    if (matches) {
      // console.log(matches);
      return {
        tag: matches[1],
        count: parseInt(matches[2]),
      };
    }
    return null;
  });

  try {
    let ctx = document.getElementById("plot2").getContext("2d");
    let myChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: processedTags.map((tag) => tag.tag),
        datasets: [
          {
            label: "# of Votes",
            data: processedTags.map((tag) => tag.count),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              // "rgba(153, 102, 255, 0.2)",
              // "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              // "rgba(153, 102, 255, 1)",
              // "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Tag Analysis",
          },
        },
      },
    });

    // bar chart displaying all the stars and prices & offer of each market, double bar chart

    let ctx2 = document.getElementById("plot3").getContext("2d");

    let myChart2 = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: responses.value.market.map((market) => market.store),
        datasets: [
          {
            label: "Price",
            data: responses.value.market.map((market) => market.price),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",

              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",

              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",

              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              // "rgba(255, 206, 86, 1)",
              // "rgba(75, 192, 192, 1)",
              // "rgba(153, 102, 255, 1)",
              // "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
          {
            label: "Offer",
            data: responses.value.market.map((market) => market.other_price),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",

              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",

              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",

              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",

              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",

              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              // "rgba(255, 206, 86, 1)",
              // "rgba(75, 192, 192, 1)",
              // "rgba(153, 102, 255, 1)",
              // "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Market Analysis",
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }

  console.log(processedTags);

  responses.value.market.sort((a, b) => {
    if (a.store == null || a.price == null) {
      return 1;
    } else if (b.store == null || b.price == null) {
      return -1;
    } else {
      return a.price - b.price;
    }
  });

  try {
    let other_l = responses.value.product.other_links;
    glink = other_l[1];
  } catch (error) {
    glink = "https://www.google.com/search?q" + responses.value.product.title;
  }
}

const hash = route.query.hash;

onMounted(() => {
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

      filt_top.style.top = "-8vw";
      //padspac.style.height = "0vw";
      //filt_2.style.display = "none";
      filt_1.style.fontSize = "1vw";

      // if (prevScrollpos > currentScrollPos) {
      //   //header_container.style.top = "0";
      //   // prod.style.marginTop = "5.5vw";
      // } else {
      //   //prod.style.marginTop = "0vw";
      filt_top.style.borderBottom = "0.1vw solid #0000001a";
      // }
      if (new_croll < old_croll) {
        header_container.style.top = "-1.4vw";
        filt_top.style.top = "-3vw";

        // header_container.style.top = "0vw";
        // filt_top.style.top = "-6vw";

        //filt_top.style.paddingTop = "9vw";

        filt_top.style.borderBottom = "0vw solid #0000001a";
      }
      old_croll = new_croll;
    } else {
      filt_top.style.borderBottom = "0vw solid #0000001a";
      header_container.style.top = "0";
      //filt_top.style.paddingTop = "9vw";

      filt_1.style.fontSize = "1.4vw";

      filt_top.style.top = "0vw";
      // prod.style.marginTop = "5.5vw";
    }
  }
  console.log(hash);

  getJson();
});

async function refreshDet() {
  let url_refresh = "https://proscraper.pythonanywhere.com/api/refresh_product";
  // let url_refresh = "http://localhost:5000/api/refresh_product";

  loaded.value = 0;
  await axios
    .get(`${url_refresh}?searchQuery=${hash}`)
    .then((response) => {
      loaded.value = 1;
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
      loaded.value = -1;
    });

  getJson();
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
          <a :href="glink" target="_blank" class="vprod_mig_dot"></a>
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
          <div class="vrating_1">{{ responses.product.rating.score }}</div>
          <div class="vrating_2">Rating</div>
          <div class="vrating_3">({{ responses.product.rating.reviews }})</div>
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

        <!-- show market -->
        <div class="lowest_market">
          <a
            target="_blank"
            :href="responses.market[0].link"
            class="lowest low1"
            >{{ responses.product.market }}</a
          >
        </div>
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
    <div class="sec_row">
      <div>
        <div class="rating_cont">
          <div class="srtit">
            <div class="rating_tab">Rating</div>
            <div class="seperator sep2"></div>
          </div>
          <div class="act_rev_cont">
            <div
              class="main_rating"
              :title="responses.review.rating + ' out of 5'"
            >
              <div class="rat_cont_sc">
                <div class="main_rat">{{ responses.product.rating.score }}</div>
              </div>
              <div class="marin_rating_title">Rating</div>
            </div>
            <div class="rating_table">
              <div
                class="rating_stars_1"
                :title="
                  responses.review.stars[5] +
                  ' stars out of ' +
                  responses.review.reviews +
                  ' reviews\n' +
                  (
                    (responses.review.stars[5] / responses.review.reviews) *
                    100
                  ).toFixed(2) +
                  '% of total reviews'
                "
              >
                <div class="rating_star_no">5</div>
                <div class="rating_star_bar">
                  <div
                    class="rating_star_bar_perc jos"
                    data-jos_animation="rat_zero"
                    :style="`width: ${
                      (responses.review.stars[5] / responses.review.reviews) *
                      100
                    }%`"
                  ></div>
                </div>
              </div>
              <div
                class="rating_stars_1"
                :title="
                  responses.review.stars[4] +
                  ' stars out of ' +
                  responses.review.reviews +
                  ' reviews\n' +
                  (
                    (responses.review.stars[4] / responses.review.reviews) *
                    100
                  ).toFixed(2) +
                  '% of total reviews'
                "
              >
                <div class="rating_star_no">4</div>
                <div class="rating_star_bar">
                  <div
                    class="rating_star_bar_perc jos"
                    data-jos_animation="rat_zero"
                    :style="`width: ${
                      (responses.review.stars[4] / responses.review.reviews) *
                      100
                    }%`"
                  ></div>
                </div>
              </div>
              <div
                class="rating_stars_1"
                :title="
                  responses.review.stars[3] +
                  ' stars out of ' +
                  responses.review.reviews +
                  ' reviews\n' +
                  (
                    (responses.review.stars[3] / responses.review.reviews) *
                    100
                  ).toFixed(2) +
                  '% of total reviews'
                "
              >
                <div class="rating_star_no">3</div>
                <div class="rating_star_bar">
                  <div
                    class="rating_star_bar_perc jos"
                    data-jos_animation="rat_zero"
                    :style="`width: ${
                      (responses.review.stars[3] / responses.review.reviews) *
                      100
                    }%`"
                  ></div>
                </div>
              </div>
              <div
                class="rating_stars_1"
                :title="
                  responses.review.stars[2] +
                  ' stars out of ' +
                  responses.review.reviews +
                  ' reviews\n' +
                  (
                    (responses.review.stars[2] / responses.review.reviews) *
                    100
                  ).toFixed(2) +
                  '% of total reviews'
                "
              >
                <div class="rating_star_no">2</div>
                <div class="rating_star_bar">
                  <div
                    class="rating_star_bar_perc jos"
                    data-jos_animation="rat_zero"
                    :style="`width: ${
                      (responses.review.stars[2] / responses.review.reviews) *
                      100
                    }%`"
                  ></div>
                </div>
              </div>
              <div
                class="rating_stars_1"
                :title="
                  responses.review.stars[1] +
                  ' stars out of ' +
                  responses.review.reviews +
                  ' reviews\n' +
                  (
                    (responses.review.stars[1] / responses.review.reviews) *
                    100
                  ).toFixed(2) +
                  '% of total reviews'
                "
              >
                <!-- star count as title  -->
                <div class="rating_star_no">1</div>
                <div class="rating_star_bar">
                  <div
                    class="rating_star_bar_perc jos"
                    data-jos_animation="rat_zero"
                    :style="`width: ${
                      (responses.review.stars[1] / responses.review.reviews) *
                      100
                    }%`"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="rev_tags">
            <div class="srtit">
              <div class="rating_tab" style="margin-top: 1vw">Reviews</div>
              <div class="seperator sep2"></div>
            </div>
            <div class="tags_cont jos" data-jos_stagger="flip">
              <!-- <div class="rtag">Good Performance (128)</div> -->
              <!-- {{ processedTags }} -->
              <div
                class="rtag"
                v-for="tag in processedTags"
                :title="tag.count + ' reviews'"
              >
                {{ tag.tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="markets_cont">
        <div class="srtit" style="margin-bottom: 1vw">
          <div class="rating_tab">Markets</div>
          <div class="seperator sep2"></div>
        </div>

        <!-- <div class="market_bar">
            <div class="market_title">Apple</div>
            <div class="mark_price_cont">
              <div class="market_price">Rs. 1,27,999</div>
              <div class="mrp_odd">
                <div class="market_price_mrp">Rs. 1,27,999</div>
                <div class="mrp_off">2% off</div>
              </div>
            </div>
          </div>
          <div class="market_bar">
            <div class="market_title">Amazon</div>
            <div class="mark_price_cont">
              <div class="market_price">Rs. 1,21,999</div>
              <div class="mrp_odd">
                <div class="market_price_mrp"></div>
                <div class="mrp_off"></div>
              </div>
            </div>
          </div> -->
        <div
          class="act_market_cont jos"
          data-jos_stagger="zoom"
          data-jos_stagger_duration="0.4"
          data-jos_stagger_seq="0.1"
        >
          <!-- display only if store is avilable -->
          <a
            target="_blank"
            :href="market.link"
            class="market_bar"
            v-for="market in responses.market"
            :title="
              'Store : ' +
              market.store +
              '\nPrice :' +
              market.price +
              '\nDelivery :' +
              market.delivery +
              '\nReturns :' +
              market.returns +
              '\nScraped :' +
              market.scraped +
              '\nLast Scraped :' +
              market.last_scraped
            "
          >
            <div class="market_title">{{ market.store }}</div>
            <div class="mark_price_cont">
              <div class="market_price">
                {{ cur[currency].symbol }} {{ market.price }}
              </div>
              <div class="mrp_odd">
                <div class="market_price_mrp">
                  <div v-if="market.other_price">
                    {{ cur[currency].symbol }}
                  </div>
                  {{ market.other_price }}
                </div>
                <!-- calculate offer % -->
                <div class="mrp_off" v-if="market.other_price">
                  {{
                    (
                      ((market.other_price - market.price) /
                        market.other_price) *
                      100
                    ).toFixed(1)
                  }}% off
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>

    <!-- chart -->

    <div class="sec_row" style="margin-bottom: 1vw">
      <div class="">Review Analysis</div>
      <div class="seperator sep3"></div>
    </div>
    <div class="graph_sec">
      <canvas style="transform: scale(0.8)" id="plot2"></canvas>
    </div>

    <div class="sec_row" style="margin-bottom: 1vw">
      <div class="">Price Chart</div>
      <div class="seperator sep3"></div>
    </div>
    <canvas style="transform: scale(0.7)" id="plot3"></canvas>

    <div class="sec_row" style="margin-bottom: 1vw">
      <div class="">Price Analysis</div>
      <div class="seperator sep3"></div>
    </div>
    <div id="box-plot"></div>

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
