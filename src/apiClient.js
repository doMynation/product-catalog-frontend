import * as axios from "axios";
import {API_KEY, API_URL} from "./conf";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 4000,
  headers: {'X-Api-Key': API_KEY},
});

export const setInterceptors = store => {
  apiClient.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    // Handle unauthorized responses
    if (error.response !== undefined && error.response.status === 401) {
      console.log('UNAUTHORIZED');
    }

    // Handle timeouts
    if (error.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`)
    }

    // Do something with response error
    return Promise.reject(error);
  });
};

export default apiClient;

