import request from '@/utils/request';

//  =============== upload ===============
export async function uploadTemplate(data) {
  return request(`/api/upload-template`, {
    method: 'POST',
    data,
  });
}
