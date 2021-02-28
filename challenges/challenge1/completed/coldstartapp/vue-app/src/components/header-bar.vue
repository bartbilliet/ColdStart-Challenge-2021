<script>
import HeaderBarBrand from '@/components/header-bar-brand.vue';
import AuthLogin from './auth-login.vue';

export default {
  name: 'HeaderBar',
  components: {
    HeaderBarBrand,
    AuthLogin,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<template>
  <header>
    <nav class="navbar is-white" role="navigation" aria-label="main navigation">
      <HeaderBarBrand></HeaderBarBrand>
      <div class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item nav-home" to="/">Home</router-link>

          <a class="navbar-item" v-if="!user"><AuthLogin provider="GitHub" /></a>
          <a class="navbar-item" v-if="!user"><AuthLogin provider="AAD" /></a>

          <a class="navbar-item" v-if="user"><AuthLogout /></a>
        </div>
      </div>
    </nav>

    <div>
      Welcome {{ user.email }}
    </div>
  </header>
</template>
