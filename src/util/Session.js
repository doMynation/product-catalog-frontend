import * as _ from "lodash";

class Session {
  static isAuthenticated() {
    return !_.isEmpty(this.getUser());
  }

  static getUser() {
    const data = localStorage.getItem(this.LS_KEY);

    return data === null ? null : JSON.parse(data);
  }

  static signIn(user) {
    localStorage.setItem(this.LS_KEY, JSON.stringify(user));
  }

  static signOut() {
    localStorage.removeItem(this.LS_KEY);
  }
}

Session.LS_KEY = "SESSION_USER";

export default Session;
