import request from '@/utils/request';
import axios from 'axios';

// =============== chart ===============

export async function getChartData(data) {
  return request('/api/chart', {
    method: 'GET',
    params: data,
  });
}
export async function getScaleDataChart(data) {
  return request('/api/scale-chart', {
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

//  =============== internal customer list ===============
export async function getInternalCustomers(data) {
  return request(`/api/internal-customers`, {
    method: 'GET',
    params: data,
  });
}

export async function getDataChartTopFeature() {
  return axios({
    url: 'http://10.78.96.78:5010/api/custom_features?custom_segment=4',
    method: 'GET',
    redirect: 'follow',
  });
}
