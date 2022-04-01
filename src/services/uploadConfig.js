import request from '@/utils/request';

//  =============== upload ===============
export async function uploadConfig(data) {
  return request(`/api/upload`, {
    method: 'POST',
    data,
  });
}
