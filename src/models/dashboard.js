import { getOverviewList, getChartData, updateData, getScaleDataChart } from '@/services/configs';
import { notification } from 'antd';

const delay = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export const defaultState = {
  overviewList: {
    totalRecords: 0,
    internalRecords: 0,
    externalRecords: 0,
    totalConfigs: 0,
  },
  typeChart: 1,
  typeChartScale: 1,
  id: '',
  idScale: '',
  chartData: [],
  chartScaleData: [],
  pagination: {
    _page: 1,
    _total: 1,
  },
  chartHistories: [{ typeChart: 1 }],
  chartScaleHistories: [{ typeChartScale: 1 }],
};

const GlobalModel = {
  namespace: 'dashboard',
  state: defaultState,
  effects: {
    *getOverviewList(_, { call, put }) {
      try {
        const response = yield call(getOverviewList);
        const {
          statusCode,
          data: overviewList = {
            totalRecords: 0,
            internalRecords: 0,
            externalRecords: 0,
            totalConfigs: 0,
          },
        } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            overviewList,
          },
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },
    *getDataChart({ payload }, { call, put }) {
      try {
        const response = yield call(getChartData, payload);
        const {
          statusCode,
          data: { chartData = [], pagination = {}, ScaleData = [] },
        } = response;
        yield call(delay, 100);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            chartData: Array.isArray(chartData)
              ? chartData.filter((item) => item.cust_id !== 'others')
              : chartData,
            pagination,
            chartScaleData: ScaleData,
          },
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },

    *getScaleDataChart({ payload }, { call, put }) {
      try {
        const response = yield call(getScaleDataChart, payload);
        const { statusCode, data } = response;
        yield call(delay, 100);
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            chartScaleData: data,
          },
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },

    *updateData({ payload: percent = 80 }, { call, put }) {
      try {
        const response = yield call(updateData, percent);
        const { statusCode } = response;
        if (statusCode !== 200) throw response;
        yield call(delay, 100);
        yield put({
          type: 'getOverviewList',
        });
        yield put({
          type: 'save',
          payload: {
            typeChart: 1,
            id: '',
            chartHistories: [{ typeChart: 1 }],
          },
        });
        return statusCode;
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
        return error;
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
export default GlobalModel;
