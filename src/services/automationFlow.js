import request from '@/utils/request';
import axios from 'axios';

export async function automationFlow(data) {
  // return request(`/api/features`, {
  //   method: 'POST',
  //   data
  // })
  return axios({
    url: 'http://10.78.96.78:5010/api/features',
    method: 'POST',
    data,
  });
}

export async function checkRunStatus(id) {
  return axios({
    url: 'http://10.78.96.78:5010/api/health_status?run_id=' + id,
    method: 'GET',
    redirect: 'follow',
  });
}
