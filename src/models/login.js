import { login } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getToken, setToken } from '@/utils/token';
import { notification } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'login',
  state: {
    isAuth: !!getToken(),
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(login, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        }); // Login successfully
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        setToken(data.token);
        setAuthority(data.user.role);
        history.replace('/dashboard');
        notification.success({
          message: 'Login successfully.',
        });
      } catch (error) {
        if (error.message)
          notification.error({
            message: error.message,
          });
      }
    },

    *logout(_, { put }) {
      // setToken('');
      // setAuthority('');
      // localStorage.clear();
      // // yield put({
      // //   type: 'user/saveCurrentUser',
      // //   payload: {
      // //     currentUser: {},
      // //   },
      // // });
      // // history.replace('/login');

      // notification.success({
      //   message: 'Logout successfully.',
      // });
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
