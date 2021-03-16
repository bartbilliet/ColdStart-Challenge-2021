<script>
import { mapActions, mapGetters } from 'vuex';
import ListHeader from '@/components/list-header.vue';
import Modal from '@/components/modal.vue';
import CatalogList from './catalog-list.vue';

const captains = console;

export default {
  name: 'Catalog',
  data() {
    return {
      errorMessage: '',
      message: '',
      routePath: '/catalog',
      showModal: false,
      title: 'Our Ice Creams',
      recommendedTitle: 'Our recommended Ice Creams',
    };
  },
  components: {
    ListHeader,
    CatalogList,
    Modal,
  },
  async created() {
    await this.getCatalog();
    await this.getRecommendationAction();
  },
  computed: {
    ...mapGetters('catalog', { catalog: 'catalog', recommendation: 'recommendation' }),
    recommendedResults() {
      return this.catalog.filter(
        (x) => (
          this.recommendation.some((y) => (y.Id === x.Id))
        ),
      );
    },
  },
  methods: {
    ...mapActions('icecreams', ['buyIcecreamAction']),
    ...mapActions('catalog', ['getCatalogAction', 'getRecommendationAction']),
    askToBuy(icecream) {
      this.icecreamToBuy = icecream;
      this.showModal = true;
      if (this.icecreamToBuy.Name) {
        this.message = `Would you like to buy ${this.icecreamToBuy.Name}?`;
        captains.log(this.message);
      }
    },
    closeModal() {
      this.showModal = false;
    },
    buyIcecream(shippingAddress) {
      this.closeModal();
      if (this.icecreamToBuy) {
        captains.log(`You said you want to buy ${this.icecreamToBuy.Name}`);

        // Add shipping address
        captains.log(`Address: ${shippingAddress}`);
        this.icecreamToBuy.ShippingAddress = shippingAddress;

        // Add the recommendation results
        // (we need the eventId & IceCreamId later to give the reward)
        this.icecreamToBuy.recommendedResults = this.recommendation;

        this.buyIcecreamAction(this.icecreamToBuy);
      }
    },
    async getCatalog() {
      this.errorMessage = undefined;
      try {
        await this.getCatalogAction();
      } catch (error) {
        this.errorMessage = 'Unauthorized';
      }
    },
    async getRecommendation() {
      this.errorMessage = undefined;
      try {
        await this.getRecommendationAction();
      } catch (error) {
        this.errorMessage = 'Unauthorized';
      }
    },
  },
};
</script>

<template>
  <div class="content-container">
    <ListHeader
      :title="recommendedTitle"
      @refresh="getRecommendation"
      :routePath="routePath">
    </ListHeader>
    <CatalogList
      :icecreams="recommendedResults"
      :errorMessage="errorMessage"
      @bought="askToBuy($event)" />
    <ListHeader :title="title" @refresh="getCatalog" :routePath="routePath"></ListHeader>
    <div class="columns is-multiline is-variable">
      <div class="column" v-if="catalog">
        <CatalogList
          :icecreams="catalog"
          :errorMessage="errorMessage"
          @bought="askToBuy($event)"
        ></CatalogList>
      </div>
    </div>

    <Modal
      class="modal-product"
      :message="message"
      :isOpen="showModal"
      @handleNo="closeModal"
      @handleYes="buyIcecream($event)"
    ></Modal>
  </div>
</template>
