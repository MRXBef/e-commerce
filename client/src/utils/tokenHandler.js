import axios from "axios";
import {jwtDecode} from 'jwt-decode'

export const axiosInterceptors = ({expire, setToken, setExpire}) => {
    const axiosJWT = axios.create();
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get(`${import.meta.env.VITE_BASEURL}/token`);
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwtDecode(response.data.accessToken);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });
    return axiosJWT
}