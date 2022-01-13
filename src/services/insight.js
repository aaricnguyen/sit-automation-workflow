import request from '@/utils/request';

// =============== get AllInsights ===============

export async function getInsightList(data) {
  return request('/api/insights', {
    method: 'GET',
    params: data,
  });
}
