import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3000/",
});
axios.interceptors.response.use(
  function (response) {
    // Optional: Do something with response data
    return response;
  },
  function (error) {
    // Do whatever you want with the response error here:

    // But, be SURE to return the rejected promise, so the caller still has
    // the option of additional specialized handling at the call-site:
    console.log(error, "произошла ошибка");
    return Promise.reject(error);
  }
);
