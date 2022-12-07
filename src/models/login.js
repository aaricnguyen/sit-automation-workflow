import { login, loginTest, loginTestNoPass } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { setCurrentUser } from '@/utils/utils';
import { addUser, getUser, updateUser } from '@/services/configs';
import { getToken, setToken } from '@/utils/token';
import { notification } from 'antd';
import { history } from 'umi';

const Model = {
  namespace: 'login',
  state: {
    isAuth: !!getToken(),
  },
  effects: {
    *loginLocalNoPass({ payload }, { call, put }) {
      try {
        const response = yield call(loginTestNoPass, payload);
        if (!response) return;
        let user_id = response.user.user_id.toLowerCase();
        let userData = yield call(getUser, { user_id: user_id });
        console.log('response1: ', response);
        console.log('response2: ', userData.data);
        if (userData.data && userData.data.length === 0) {
          console.log('response3: ', userData);
          const nUser = {
            user_id: user_id,
            email: response.user.email,
            role: response.user.role,
            title: response.user.title,
            avatar: response.user.avatar ? response.user.avatar : '/avatar.jpg',
            full_name: response.user.full_name,
          };
          yield call(addUser, nUser);
          userData = yield call(getUser, { user_id: user_id });
          console.log('response4: ', userData);
        }
        userData = JSON.parse(JSON.stringify(userData)).data[0];
        console.log('response5: ', userData);
        updateUser({ user_id: user_id, visit_count: parseInt(userData.visit_count) + 1 });
        setToken(response.token);
        setAuthority(userData.role);
        setCurrentUser(userData);
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

    *loginLocal({ payload }, { call, put }) {
      try {
        const response = yield call(loginTest, payload);
        if (!response) return;
        setToken(response.token);
        setAuthority(response.user.role);
        setCurrentUser(response.user);
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
      setToken('');
      setAuthority('');
      localStorage.clear();
      // yield put({
      //   type: 'user/saveCurrentUser',
      //   payload: {
      //     currentUser: {},
      //   },
      // });
      history.push('/login');

      notification.success({
        message: 'Logout successfully.',
      });
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
