import { queryCurrent, getListTbAdmin, queryCurrentTest } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { setToken } from '@/utils/token';
import { notification } from 'antd';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    /* Important. Don't remove*/
    // currentUser: {
    //   fullname: 'John Nguyen',
    //   title: 'Tester',
    //   avatar: '/avatar.jpg',
    // },
    /* Important. Don't remove*/
    listTbAdmin: [],
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      try {
        /* Important. Don't remove */
        // const response = yield call(queryCurrent);
        /* Important. Don't remove */

        const response = yield call(queryCurrentTest);

        /* Important. Don't remove */
        // const { statusCode, data = {} } = response;
        // if (statusCode !== 200) throw response;
        // yield put({
        //   type: 'saveCurrentUser',
        //   payload: data.user,
        // });
        /* Important. Don't remove */
        
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        })
      } catch (error) {
        if (error.message) {
          setToken('');
          setAuthority('');
          localStorage.clear();
          notification.error({
            message: error.message,
          });
        }
      }
    },
    *fetchListTbAdmin(_, { call, put }) {
      try {
        const response = yield call(getListTbAdmin);
        const { statusCode, data = {} } = response;
        if (statusCode !== 200) throw response;
        yield put({
          type: 'save',
          payload: {
            listTbAdmin: data.users,
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
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
