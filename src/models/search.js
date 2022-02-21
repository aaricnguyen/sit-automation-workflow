import { getSearchDataDetail, getSuggestions, search } from '@/services/search';
import { notification } from 'antd';

export const initialSearchState = {
  suggestions: [],
  searchResult: [],
  searchDetail: {},
};

export default {
  namespace: 'search',
  state: initialSearchState,
  effects: {
    *getSuggestions({ payload }, { call, put }) {
      try {
        const response = yield call(getSuggestions, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            suggestions: data.map((item) => ({ value: item })),
          },
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },

    *search({ payload }, { call, put }) {
      try {
        const response = yield call(search, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            searchResult: data,
          },
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },

    *getSearchDataDetail({ payload }, { call, put }) {
      try {
        const response = yield call(getSearchDataDetail, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        const { type, result: { dataCombine } = {} } = data;
        if (type === '1' && 'dataCombine' in data.result) {
          yield put({
            type: 'config/save',
            payload: {
              internalCustomerId: dataCombine.data[0].cust_id,
              id: dataCombine.data[0].cust_id,
              chartHistories: [{ typeChart: 3, id: dataCombine.data[0].cust_id }],
            },
          });
        }
        yield put({
          type: 'save',
          payload: {
            searchDetail: data,
          },
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
