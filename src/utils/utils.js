import { parse } from 'querystring';
import moment from 'moment';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = (path) => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // For the official demo site, it is used to turn off features that are not needed in the real development environment

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const formatDate = (date) => {
  moment.locale('en-GB');
  return moment(date).format('DDMMM');
};

export const setCurrentUser = (userInfo) => {
  localStorage.setItem('user-info', JSON.stringify(userInfo));
}

export const getCurrentUser = () => {
  let user;
  const currentUser = localStorage.getItem('user-info');
  try {
    if (currentUser) {
      user = JSON.parse(currentUser);
    }
  } catch (e) {
    user = currentUser;
  }
  return user;
}
