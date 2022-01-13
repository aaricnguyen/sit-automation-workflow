import request from '@/utils/request';

export async function queryCurrent() {
  return request('/api/users/get-current-user', {
    method: 'GET',
  });
}
export async function getListTbAdmin() {
  return request('/api/users/get-list-tb-admin', {
    method: 'GET',
  });
}
