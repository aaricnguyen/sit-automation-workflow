import request from '@/utils/request';

// =============== get suggestions ===============

export async function getSuggestions(data) {
  return request('/api/search-suggestions', {
    method: 'GET',
    params: data,
  });
}

// =============== get list of search result ===============
export async function search(data) {
  return request('/api/search', {
    method: 'GET',
    params: data,
  });
}

// =============== get detail of search result ===============
export async function getSearchDataDetail(data) {
  return request('/api/get-search-data-detail', {
    method: 'GET',
    params: data,
  });
}
