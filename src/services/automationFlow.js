import request from '@/utils/request';

export async function automationFlow(data) {
  return request(`/api/feature`, {
    method: 'POST',
    data
  })
}