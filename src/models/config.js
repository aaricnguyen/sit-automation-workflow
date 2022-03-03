import {
  getChartData,
  getCustomerCompareByIdChart,
  getInternalCustomers,
  search,
} from '@/services/configs';
import { uploadConfig } from '@/services/uploadConfig';
import { uploadTemplate, updatedTemplate } from '@/services/uploadTemplate';
import { notification } from 'antd';

export const initialState = {
  dataCombine: {},
  totalConfig: [],
  externalCustomerId: null,
  internalCustomerId: null,
  id: '',
  typeChart: 3,
  chartData: [],
  chartHistories: [],
  dataSearch: [],
  internalCustomerList: [],
  matchPercent: 0,
  dataUniq: [],
  dataInsight: '',
  statusUpload: true,
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
        const {
          statusCode,
          data: { externalCustomer, totalConfig = [], dataCombine = {}, dataUniq = [] } = {},
        } = response;
        if (statusCode !== 200) throw response;
        // response = yield call(getCustomerCompareByIdChart, {
        //   id: externalCustomer.cust_id,
        // });
        // const {
        //   statusCode: statusCode2,
        //   data: { chartData = [] },
        // } = response;
        // if (statusCode2 !== 200) throw response;

        yield put({
          type: 'save',
          payload: {
            externalCustomerId: externalCustomer.cust_id,
            // chartData,
            typeChart: 3,
            internalCustomerId: dataCombine.data[0].cust_id,
            id: dataCombine.data[0].cust_id,
            chartHistories: [{ typeChart: 3, id: dataCombine.data[0].cust_id }],
            totalConfig,
            dataCombine,
            dataUniq,
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
    *uploadTemplate({ payload }, { call, put }) {
      let response = {};
      let data = '';
      let statusUpload = true;
      try {
        response = yield call(uploadTemplate, payload);
        const { statusCode } = response;
        data = response.data;
        console.log(statusCode);
        if (statusCode === 200) {
          statusUpload = false;
        } else {
          data = 'faile';
        }
        console.log(data);

        if (statusCode !== 200) {
          throw response;
        }
        yield put({
          type: 'save',
          payload: {
            dataInsight: data,
            statusUpload,
          },
        });
        notification.success({
          message: 'Template file uploaded successfully.',
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
      return response;
    },
    *updatedTemplate({}, { call, put }) {
      let response = {};
      try {
        response = yield call(updatedTemplate);
        const { statusCode, message } = response;
        if (statusCode !== 200) throw response;
        notification.success({
          message: 'Template file updated successfully.',
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
          data: { chartData = [], matchPercent },
        } = response;
        // yield call(delay, 100);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            chartData,
            matchPercent,
          },
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },

    *getInternalCustomerList({ payload }, { call, put }) {
      try {
        const response = yield call(getInternalCustomers, payload);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            internalCustomerList: [
              {
                cust_id: 'none',
                cust_segment: 0,
              },
              ...data,
            ],
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
