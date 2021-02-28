<script>
import HeaderBarBrand from '@/components/header-bar-brand.vue';
import AuthLogout from '@/components/auth-logout.vue';
import AuthLogin from './auth-login.vue';
import getUserInfo from '../assets/js/userInfo';

export default {
  name: 'HeaderBar',
  components: {
    HeaderBarBrand,
    AuthLogin,
    AuthLogout,
  },
  data() {
    return {
      user: undefined,
    };
  },
  async created() {
    this.user = await getUserInfo();
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

          <div v-if="user">
            Welcome {{ user.email }}
            <a class="navbar-item"><AuthLogout /></a>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>
