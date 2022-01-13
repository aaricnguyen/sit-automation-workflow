import { getInsightList } from '@/services/insight';
import { notification } from 'antd';

export const initialInsightState = {
  insightList: [],
};

const InsightModel = {
  namespace: 'insight',
  state: initialInsightState,
  effects: {
    *getInsightList(_, { call, put }) {
      try {
        const response = yield call(getInsightList);
        const { statusCode, data } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            insightList: data,
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
export default InsightModel;
