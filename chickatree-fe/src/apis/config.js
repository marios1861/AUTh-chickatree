import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
    xsrfHeaderName: "X-CSRFTOKEN",
    xsrfCookieName: "csrftoken",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;