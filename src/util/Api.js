import sessionClient from "../sessionClient";

class Api {
  static login(username, password) {
    return sessionClient
      .post('/auth', {
        username: username,
        password: password
      });
  }
}

export default Api;
