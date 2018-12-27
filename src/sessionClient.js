import * as axios from "axios";
import {API_URL} from "./conf";
import {expireSession} from "./shared/index";

const sessionClient = axios.create({
  baseURL: API_URL,
  timeout: 4000,
  withCredentials: true,
});

export const setInterceptors = store => {
  sessionClient.interceptors.response.use(function (response) {
    return response.data;
  }, function (error) {
    // Handle unauthorized responses
    if (error.response !== undefined && error.response.status === 401) {
      store.dispatch(expireSession());
    }

    // Handle timeouts
    if (error.code === 'ECONNABORTED') {
      console.log(`A timeout happend on url ${error.config.url}`)
    }

    // Do something with response error
    return Promise.reject(error);
  });
};

export default sessionClient;
