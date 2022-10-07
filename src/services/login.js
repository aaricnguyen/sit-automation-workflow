import { notification } from 'antd';
import request from '@/utils/request';
import data from '@/data/users.json';

export async function login(params) {
  return request(
    '/api/auth/login',
    {
      method: 'POST',
      data: params,
    },
    true,
  );
}

export async function loginTest(params) {
  let index = data.users.length && data.users.findIndex(user => user.email === params.username && user.password === params.password);
  if (index !== -1) {
    return {user: data.users[index], token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXhBZ2UiOjI1OTIwMDAwMDAsInBheWxvYWQiOiI2NTI3MDhiOS0xMThiLTRiOTgtOWRmNC0xNTJmMjNkZGI4OTUiLCJpYXQiOjE2NTMyMjgyMTR9.kidOBVe5uOglf_Yd-4YFKfI8w31x8yid9VlJMiVtJu8"};
  }
  notification.error({
    message: 'Login failed.'
  });
  return;
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
