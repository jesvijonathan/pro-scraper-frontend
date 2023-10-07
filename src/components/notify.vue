<template>
  <div class="notify">
    <div id="not-cont" class="notify-content">
      <a class="hno underline" target="_blank" href="#s0">{{ msg_link }}</a>
      {{ msg }} Sign in to your account
    </div>
    <div>
      <a class="notify-button" onclick="accept_cookie()">Dismiss</a>
    </div>
  </div>
</template>
