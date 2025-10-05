import axios from "axios";

const axiosSecure = axios.create({
    baseURL: process.env.NEXTAUTH_URL,
});

const useAxiosSecure = () => {

    axiosSecure.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => Promise.reject(error)
    );

    return axiosSecure;
};

export default useAxiosSecure;
