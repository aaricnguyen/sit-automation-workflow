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

export function generateToken(n) {
  let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

export async function loginTestNoPass(params) {
  let user = {
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    full_name: 'Test',
    title: '',
    role: 'default',
    avatar: '/avatar.jpg',
  };
  if (params.username.includes('@') && params.username.split('@')[1] === 'cisco.com') {
    user.user_id = params.username.split('@')[0];
    user.full_name = params.username.split('@')[0];
    user.email = params.username;
    return { user: user, token: generateToken(32) };
  }
  notification.error({
    message: 'Login failed.',
  });
  return;
}

export async function checkAndUpdateUser(username) {}

export async function loginTest(params) {
  let index =
    data.users.length &&
    data.users.findIndex(
      (user) => user.email === params.username && user.password === params.password,
    );
  if (index !== -1) {
    return {
      user: data.users[index],
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYXhBZ2UiOjI1OTIwMDAwMDAsInBheWxvYWQiOiI2NTI3MDhiOS0xMThiLTRiOTgtOWRmNC0xNTJmMjNkZGI4OTUiLCJpYXQiOjE2NTMyMjgyMTR9.kidOBVe5uOglf_Yd-4YFKfI8w31x8yid9VlJMiVtJu8',
    };
  }
  notification.error({
    message: 'Login failed.',
  });
  return;
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
