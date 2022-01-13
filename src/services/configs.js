import request from '@/utils/request';

// =============== chart ===============

export async function getChartData(data) {
  return request('/api/chart', {
    method: 'GET',
    params: data,
  });
}

export async function getCustomerCompareByIdChart(data) {
  return request('/api/customer-compare-by-id-chart', {
    method: 'GET',
    params: data,
  });
}

//  =============== overview ===============

export async function getOverviewList() {
  return request('/api/overview', {
    method: 'GET',
  });
}

//  =============== update data ===============
export async function updateData({ percent = 80 }) {
  return request(`/api/update?percent=${percent}`, {
    method: 'GET',
  });
}

//  =============== search ===============
export async function search(data) {
  return request(`/api/search`, {
    method: 'GET',
    params: data,
  });
}
