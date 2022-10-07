import request from '@/utils/request';
import { getCurrentUser } from '@/utils/utils';

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

export async function queryCurrentTest() {
  return getCurrentUser();
}