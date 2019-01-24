import sessionClient from "../sessionClient";

class Api {
  static login(username, password) {
    return sessionClient
      .post('/auth', {
        username: username,
        password: password
      });
  }

  static validatePasswordResetToken(token) {
    return sessionClient
      .get(`/password/${token}`);
  }

  static changePassword(token, password, passwordConfirmation) {
    return sessionClient
      .patch('/password', {
        token: token,
        password: password,
        passwordConfirmation: passwordConfirmation
      });
  }

  static resetPassword(email) {
    return sessionClient
      .put(`/password/reset`, {
        email: email
      });
  }
}

export default Api;
