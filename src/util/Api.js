import * as request from "superagent";
import {API_URL} from "../conf";

class Api {
  static login(username, password) {
    const url = `${API_URL}/auth`;

    return request
      .post(url)
      .withCredentials()
      .send({
        username: username,
        password: password
      })
      .set('Accept', 'application/json')
      .then(resp => resp.body);
  }
}

export default Api;
