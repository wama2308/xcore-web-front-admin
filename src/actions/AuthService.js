import decode from "jwt-decode";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import { validations, clearForm } from "./../helpers/helpers";

export default class AuthService {
  login(data) {
    return new Promise((resolve, reject) => {
      clearForm("form-login");
      axios
        .post("/api/v1/auth/login", data)
        .then((res) => {
          const result = decode(res.data.token);
          this.setUserInTheLocalStorage(res.data.user);
          this.setTokenInTheLocalStorage(res.data.token);
          resolve({
            logged: true,
            ...res.data,
            ...result,
          });
        })
        .catch((error) => {
          if (error.response.status === 422) {
            let errors = error.response.data;
            validations("form-login", errors);
          }
          reject(error);
        });
    });
  }

  async verify(url, token, callback) {
    let data = {
      client_default: localStorage.getItem("client_default")
    };
    axios({
      method: "post",
      url: `/api/v1/auth`,
      data: data,
      headers: token.headers
    })
      .then((res) => {
        return callback({
          logged: true,
          ...res,
        });
      })
      .catch((res) => {
        localStorage.clear();
        callback({
          logged: false,
        });
      });
  }

  async loggedIn(callback) {
    // Checks if there is a saved token and it's still valid
    const token = await this.getToken(); // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded) {
        // Checking if token is expired. N
        return {
          result: decode,
          logged: true,
        };
      }
      return { logged: false, result: null };
    } catch (err) {
      return { logged: false, result: null };
    }
  }

  setEmail(idemail) {
    return localStorage.setItem("email", idemail);
  }

  SetUsernameInTheLocalStorage(idemail) {
    return localStorage.setItem("email", idemail);
  }

  setTokenInTheLocalStorage(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("token", idToken);
  }

  setUserInTheLocalStorage(user) {
    // Saves user token to localStorage
    for (const key in user) {
      if (user.hasOwnProperty(key)) {
        const element = user[key];
        if (key !== "_id") {
          localStorage.setItem(key, element);
        }
      }
    }
  }

  setDataInTheLocalStorage(
    username,
    name,
    surname,
    business_id,
    branch_office_id
  ) {
    // Saves user token to localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("name", name);
    localStorage.setItem("surname", surname);
    localStorage.setItem("business_id ", business_id);
    localStorage.setItem("branch_office_id", branch_office_id);
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("token");
  }

  logout(callback) {
    localStorage.clear();
    callback();
  }

  getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Setting Authorization header
    // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
    if (this.loggedIn()) {
      headers["Authorization"] = "Bearer " + this.getToken();
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this._checkStatus)
      .then((response) => response.json());
  }

  _checkStatus(response) {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      // Success status lies between 200 to 300
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
