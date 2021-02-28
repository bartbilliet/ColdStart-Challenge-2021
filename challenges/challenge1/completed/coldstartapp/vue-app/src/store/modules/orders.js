import axios from 'axios';
import API from '../config';
import { parseItem } from './action-utils';
import { ORDER } from './mutation-types';

const captains = console;

export default {
  strict: process.env.NODE_ENV !== 'production',
  namespaced: true,
  state: {
    orders: [],
  },
  mutations: {
    [ORDER](state, order) {
      state.orders.push(order);
    },
  },
  actions: {
    async placeOrderAction({ commit }, IcecreamId) {
      try {
        const response = await axios.post(`${API}/orders`, { IcecreamId });
        const order = parseItem(response, 201);
        commit(ORDER, order);
        return order;
      } catch (error) {
        captains.error(error);
        throw new Error(error);
      }
    },
  },
  getters: {
    orders: (state) => state.orders,
  },
};
