import axios from 'axios';
import API from '../config';
import { parseList } from './action-utils';
import {
  GET_CATALOG, GET_RECOMMENDATION,
} from './mutation-types';

const captains = console;

export default {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    catalog: [],
    recommendation: [],
  },
  mutations: {
    [GET_CATALOG](state, catalog) {
      state.catalog = catalog;
    },
    [GET_RECOMMENDATION](state, recommendation) {
      state.recommendation = recommendation;
    },
  },
  actions: {
    async getCatalogAction({ commit }) {
      try {
        const response = await axios.get(`${API}/catalog`);
        const catalog = parseList(response);
        commit(GET_CATALOG, catalog);
        return catalog;
      } catch (error) {
        captains.error(error);
        throw new Error(error);
      }
    },
    async getRecommendationAction({ commit }) {
      try {
        const response = await axios.get(`${API}/recommendations`);
        const recommendation = parseList(response);
        commit(GET_RECOMMENDATION, recommendation);
        return recommendation;
      } catch (error) {
        captains.error(error);
        throw new Error(error);
      }
    },
  },
  getters: {
    catalog: (state) => state.catalog,
    recommendation: (state) => state.recommendation,
  },
};
