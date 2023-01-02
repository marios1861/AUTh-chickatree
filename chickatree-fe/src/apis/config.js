import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000/",
    withCredentials: true,
    xsrfHeaderName: "X-CSRFTOKEN",
    xsrfCookieName: "csrftoken",
    // adding a custom language header   
});

export default api;