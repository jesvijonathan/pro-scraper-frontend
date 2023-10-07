<template>
  <!-- @click="window.open(product.link, '_blank')" -->
  <a
    :href="product.link"
    target="_blank"
    class="product_container"
    :title="
      'Rating : ' +
      product.rating.score +
      ' (' +
      product.rating.reviews +
      ')' +
      '\nPrice : ' +
      product.price +
      '\nShipping : ' +
      product.shipping +
      '\nLast Updated : ' +
      product.last_scraped +
      '\n'
    "
  >
    <div class="prod_cont">
      <div class="prod_img_con">
        <img class="prod_img" :src="product.img" />
      </div>

      <div class="prod_desc">
        <div class="prod_name">
          <p class="truncate-text">{{ product.title }}</p>
        </div>
        <div class="prod_cat">
          {{ product.market }}
          <div class="prod_cat reviews">({{ product.rating.reviews }})</div>
        </div>

        <div></div>
      </div>
      <div class="prod_price">
        <div class="price">
          <div class="prod_mrp">₹{{ product.price }}</div>
        </div>
        <div class="prod_buy">
          <div class="fa fa-heart press pink"></div>
          <div class="fa fa-cart-plus press"></div>
        </div>
      </div>
    </div>

    <a :href="product.link" class="prod_get">Buy Now</a>
  </a>

  <!-- data recieved  
  
  
          {
    "additional_info": "Smartphone  Dual SIM  5G",
    "hash": "21eaf50ccc7fdb2dd1537d05f7081cf8",
    "img": "Croma",
    "in_stock": "",
    "last_scraped": "Sun, 01 Oct 2023 22:23:11 GMT",
    "link": "http://www.google.com/url?url=/shopping/product/10864203085039380343%3Fprds%3Doid:18352768763050786534,pid:7634124128593707086%26sts%3D9%26hl%3Den%26lsf%3Dseller:10736904,store:6640197833599652149,s:h&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjnsaj1ptWBAxUZ1jgGHQOGDoYQ_uQECL4M&usg=AOvVaw3msByWgNInepnir7-OjV-W",
    "market": "Free delivery by 8 Oct and free 5-day returns",
    "other_links": [
      "https://www.google.com/url?url=https://www.reliancedigital.in/apple-iphone-13-128-gb-midnight-black-/p/491997699%3Fsrsltid%3DAfmBOooBuxQ-Kxc3FWVRuLUMO2GsB2P6mLIay5PApP3-7GwopvwzZp3aO_E&rct=j&q=&esrc=s&opi=95576897&sa=U&ved=0ahUKEwjq_ajvp9WBAxV_wzgGHYQEBzsQguUECPUL&usg=AOvVaw1jhCAVqswqpqAFhASq3gmf",
      "https://www.google.com/shopping/product/10864203085039380343?q=iphone+13&prds=eto:10603666471394521545_0,pid:7634124128593707086,rsk:PC_4079606304177687932&sa=X&ved=0ahUKEwjq_ajvp9WBAxV_wzgGHYQEBzsQ8gII7QsoAA",
      "https://www.google.com/shopping/product/10864203085039380343/offers?q=iphone+13&prds=eto:10603666471394521545_0,pid:7634124128593707086,rsk:PC_4079606304177687932&sa=X&ved=0ahUKEwjq_ajvp9WBAxV_wzgGHYQEBzsQ3q4ECPgL"
    ],
    "other_price": null,
    "price": "56900.00",
    "price_description": "",
    "rating": {
      "reviews": 8404,
      "score": "4.6"
    },
    "scraped": "Sun, 01 Oct 2023 22:18:55 GMT",
    "shipping": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSdbMcu_sYPXLZcOuSnCAAleUSFoclkU1qgAQmPdw_fDIGB7gFF4bHInfXkp9pt6e5l3lxuK2RVAQjVI2G3ji5KRMBR1XMJLfCUjeuQDB__&usqp=CAE",
    "tags": [
      "Apple",
      "iPhone",
      "13"
    ],
    "title": "Apple iPhone 13 (128GB, Midnight)",
    "verified": 0
  },  
  -->
</template>

<script setup>
const { product } = defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
