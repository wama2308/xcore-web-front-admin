import axios from "axios";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import swal from "sweetalert2";
import { url } from "./../helpers/helpers";

toastr.options.closeButton = true;
toastr.options.preventDuplicates = true;

axios.defaults.baseURL = url;

// Request interceptor
axios.interceptors.request.use((request) => {
  const token = window.localStorage.getItem("token");
  if (token) {
    request.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return request;
});

/**
 * Response
 */
axios.interceptors.response.use(
  (response) => {
    switch (response.status) {
      case 200:
        if (response.data.interceptor) {
          showMsj("success", response.data);
        }
        break;
      case 201:
        if (response.data.interceptor) {
          showMsj("success", response.data);
        }
        break;
      case 202:
        if (response.data.interceptor) {
          showMsj("warning", response.data);
        }
        break;
      default:
      // console.clear()
    }
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("401 token_expired");
          // No autorizado
          if (error.response.data.interceptor) {
            showMsj("warning", error.response.data);
          }
          break;
        case 403:
          if (error.response.data.interceptor) {
            showMsj("warning", error.response.data);
          }
          break;
        case 404:
          if (error.response.data.interceptor) {
            showMsj("warning", error.response.data);
          }
          break;
        case 422:
          if (error.response.data.title && error.response.data.message) {
            showMsj("warning", error.response.data);
          } else {
            showMsj("warning", {
              plugin: "notification",
              message: "Verifique los campos del formulario",
              title: "advertencia",
            });
          }
          break;
        case 423:
          if (error.response.data.interceptor) {
            showMsj("warning", error.response.data);
          }
          break;
        case 500:
          if (error.response.data.interceptor) {
            showMsj("error", error.response.data);
          }
          break;
        default:
      }
    }

    return Promise.reject(error);
  }
);

function showMsj(type, data) {
  if (data.title && data.message) {
    switch (data.plugin) {
      case "modal":
        var config = {
          title: `${data.title}`,
          html: `${data.message}`,
          showCancelButton: false,
          confirmButtonColor: "#464D69",
          confirmButtonText: "Cerrar",
        };
        if (type === "error") {
          config.type = "error";
        }
        if (type === "warning") {
          config.type = "warning";
        }
        if (type === "success") {
          config.type = "success";
        }

        swal.fire(config);
        break;
      case "notification":
        if (type === "error") {
          toastr.error(data.message, data.title);
        }
        if (type === "warning") {
          toastr.warning(data.message, data.title);
        }
        if (type === "success") {
          toastr.success(data.message, data.title);
        }
        break;
      default:
        console.log(data.message, data.title);
        break;
    }
  }
}
