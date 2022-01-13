import request from '@/utils/request';

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
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
