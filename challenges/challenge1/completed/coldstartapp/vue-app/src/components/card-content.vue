<script>
import getUserInfo from '@/assets/js/userInfo';

export default {
  components: {
  },
  name: 'CardContent',
  props: {
    id: {
      type: String,
      default: () => '',
    },
    name: {
      type: String,
      default: () => '',
    },
    description: {
      type: String,
      default: () => '',
    },
    imageurl: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      user: undefined,
      message: '',
    };
  },
  async created() {
    this.user = await getUserInfo();
  },
  methods: {
    async placePreOrder() {
      // TODO: call API
    },
  },
};
</script>

<template>
  <div class="card-content">
    <header class="card-header">
      <p class="card-header-title">{{ name }}</p>
    </header>

    <div class="content">
      <div class="catalog-image">
        <img v-bind:src="imageurl" />
      </div>
      <p class="description">{{ description }}</p>
    </div>

    <div v-if="user">
      <a @clicked="placePreOrder">Place pre-order</a>
    </div>

  </div>
</template>
