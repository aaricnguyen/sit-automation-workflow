import { uploadConfig } from '@/services/uploadConfig';
import { getCustomerCompareByIdChart, getChartData, search } from '@/services/configs';
import { notification } from 'antd';

export const initialState = {
  dataCombine: {},
  totalConfig: [],
  externalCustomerId: null,
  internalCustomerId: null,
  id: '',
  typeChart: 1,
  chartData: [],
  chartHistories: [{ typeChart: 1 }],
  dataSearch: [],
};

export default {
  namespace: 'config',
  state: initialState,
  effects: {
    *search({ payload }, { call, put }) {
      try {
        const response = yield call(search, payload);
        const { statusCode, data: dataSearch } = response;
        if (statusCode !== 200) throw response;
        const defaultCustomer = dataSearch[0];
        if (defaultCustomer) {
          yield put({
            type: 'save',
            payload: {
              dataSearch,
              externalCustomerId: defaultCustomer.cust_id,
              totalConfig: defaultCustomer.totalConfig,
              dataCombine: defaultCustomer.dataCombine,
            },
          });
        }
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },

    *uploadConfig({ payload }, { call, put }) {
      let response = {};
      try {
        response = yield call(uploadConfig, payload);
        const { statusCode, data: { externalCustomer, totalConfig = [], dataCombine = {} } = {} } =
          response;
        if (statusCode !== 200) throw response;
        response = yield call(getCustomerCompareByIdChart, {
          id: externalCustomer.cust_id,
        });
        const {
          statusCode: statusCode2,
          data: { chartData = [] },
        } = response;
        if (statusCode2 !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            externalCustomerId: externalCustomer.cust_id,
            chartData,
            typeChart: 1,
            chartHistories: [{ typeChart: 1 }],
            totalConfig,
            dataCombine,
          },
        });
        notification.success({
          message: 'Config file uploaded successfully.',
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
      return response;
    },

    *getDataChart({ payload }, { call, put }) {
      try {
        const { typeChart } = payload;
        let response = {};
        if (typeChart === 1 || !typeChart) {
          response = yield call(getCustomerCompareByIdChart, payload);
        } else {
          response = yield call(getChartData, payload);
        }
        const {
          statusCode,
          data: { chartData = [] },
        } = response;
        // yield call(delay, 100);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            chartData,
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
