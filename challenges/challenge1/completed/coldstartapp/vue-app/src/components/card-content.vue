<script>
import { mapActions } from 'vuex';
import getUserInfo from '@/assets/js/userInfo';
import ButtonFooter from '@/components/button-footer.vue';

export default {
  components: {
    ButtonFooter,
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
    orderMessage: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      errorMessage: '',
      user: undefined,
    };
  },
  async created() {
    this.user = await getUserInfo();
  },
  methods: {
    ...mapActions('orders', ['placeOrderAction']),
    async placePreOrder() {
      this.errorMessage = undefined;
      try {
        await this.placeOrderAction(this.id);
        this.orderMessage = 'Order placed succesfully!';
      } catch (error) {
        this.errorMessage = 'Unauthorized';
      }
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

    <ButtonFooter v-if="user" @clicked="placePreOrder" label="Place Order" />
    <div v-if="orderMessage">{{orderMessage}}</div>
  </div>
</template>
