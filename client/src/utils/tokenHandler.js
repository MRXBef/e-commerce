import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const axiosInterceptors = ({ expire, token, setToken, setExpire }) => {
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
        const response = await axios.get(
          `${import.meta.env.VITE_BASEURL}/token`
        );
        if(!response.data.isPublicUser){
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwtDecode(response.data.accessToken);
          setExpire(decoded.exp);
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return axiosJWT;
};

export const refreshToken = async ({ setAuthorized, setCheckAuthorized, setExpire, setToken, setIsPublicUser }) => {
  //kode ini bertujuan untuk mengetahui yang mengakses web itu public user atau verifyd user
  try {
    const response = await axios.get(`${import.meta.env.VITE_BASEURL}/token`);
    if (response.data.isPublicUser) {
      setAuthorized(false);
      setCheckAuthorized(false);
      setIsPublicUser(true)
    } else {
      setExpire(jwtDecode(response.data.accessToken).exp);
      setAuthorized(true);
      setToken(response.data.accessToken);
      setCheckAuthorized(false);
    }
  } catch (error) {
    console.log(error.response);
    setCheckAuthorized(true);
  }
};

export const decodeToken = (token) => {
    if(token) {
        return jwtDecode(token)
    }
    return null
}
