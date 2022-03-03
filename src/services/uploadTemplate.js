import request from '@/utils/request';

//  =============== upload ===============
export async function uploadTemplate(data) {
  return request(`/api/upload-template`, {
    method: 'POST',
    data,
  });
}

export async function updatedTemplate() {
  return request(`/api/update-template`, {
    method: 'GET',
  });
}
