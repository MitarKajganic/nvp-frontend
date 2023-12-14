import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080',
});

instance.interceptors.request.use(config => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        config.headers['Authorization'] = `Bearer ${jwt}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default instance;
