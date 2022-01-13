/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { notification } from 'antd';
import { getDvaApp } from 'umi';
import { extend } from 'umi-request';
import { getToken } from './token';

const codeMessage = {
  200: 'The server successfully returned the requested data.',
  201: 'New or modified data is successful.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Delete data successfully.',
  400: 'The request was sent with an error.The server did not perform any operations to create or modify data.',
  401: 'The user does not have permission (token, username, password is incorrect).',
  403: 'User is authorized, but access is forbidden.',
  404: 'The request made is for a record that does not exist and the server is not operating.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will not be obtained again.',
  422: 'When creating an object, a validation error occurred.',
  500: 'The server has an error, please check the server.',
  502: 'Gateway error.',
  503: 'The service is unavailable, the server is temporarily overloaded or maintained.',
  504: 'The gateway timed out.',
};
/**
 * @zh-CN 异常处理程序
 * @en-US Exception handler
 */

const errorHandler = (response) => {
  const { status, statusText, url } = response;
  if (status === 401) {
    // eslint-disable-next-line no-underscore-dangle
    getDvaApp()._store.dispatch({
      type: 'login/logout',
    });
    return { statusCode: 401 };
  }

  if (response && response.status) {
    const errorText = codeMessage[status] || statusText;
    notification.error({
      message: `Request error ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: 'Your network is abnormal and cannot connect to the server',
      message: 'Network anomaly',
    });
  }

  return response;
};
/**
 * @en-US Configure the default parameters for request
 * @zh-CN 配置request请求时的默认参数
 */

const request = extend({
  credentials: 'include', // Does the default request bring cookies
});

request.interceptors.request.use((url, options) => {
  const token = getToken();
  let headers = {};
  if (token)
    headers = {
      Authorization: `Bearer ${token}`,
    };
  return {
    url,
    options: { ...options, interceptors: true, headers },
  };
});

// eslint-disable-next-line no-unused-vars
request.interceptors.response.use(async (response, options) => {
  const { status } = response;
  if (status !== 200) errorHandler(response);
  try {
    const res = await response.json();
    return res;
  } catch (err) {
    return {
      statusCode: response.status,
    };
  }
});

export default request;
