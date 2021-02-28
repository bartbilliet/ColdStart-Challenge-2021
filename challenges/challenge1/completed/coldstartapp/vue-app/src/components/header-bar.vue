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

            <a class="navbar-item"><AuthLogin provider="GitHub" /></a>
            <a class="navbar-item"><AuthLogin provider="AAD" /></a>
            <a class="navbar-item"><AuthLogout /></a>
          </div>
        </div>
    </nav>
  </header>
</template>
