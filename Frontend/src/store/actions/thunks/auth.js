import { Axios } from '../../../core/axios';
import jwt_decode from "jwt-decode";
import api from '../../../core/api';

export const setLogin = async (params) => {
  try {
    const { data } = await Axios.post(`${api.baseUrl}${api.user}/login`, params, {
      params: {}
    });
    if (data.success === true) {
      //set the token to sessionStroage   
      const token = data.token;
      localStorage.setItem("jwtToken", data.token);
      const decoded = jwt_decode(token);
      console.log(decoded);
      return {
        success: true,
        data: decoded
      }
    } else {
      return {
        success: false,
        error: 'Login failed, Please try again later!'
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: (error.response && error.response.data && error.response.data.message) ? error.response.data.message : 'Login failed, Please try again later!'
    }
  }
}