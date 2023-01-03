import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../apis/config'

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() =>
        localStorage.getItem("authToken")
            ? JSON.parse(localStorage.getItem("authToken"))
            : null
    );

    const [user, setUser] = useState(() =>
        localStorage.getItem("username")
            ? JSON.parse(localStorage.getItem("username"))
            : null
    );

    const navigate = useNavigate();

    // call this function to sign out logged in user
    const logoutUser = useCallback(() => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/login");
    }, [navigate]);

    const validateUser = useCallback(() => {
        axios.get(`/api/user/${user.id}/`).then((response) => {
        }).catch((e) => {
            if (e.response.status === 401) {
                logoutUser()
            }
        })
    }, [user, logoutUser]);


    useEffect(() => {
        if (authToken) {
            axios.interceptors.request.use((request) => {
                request.headers.Authorization = `Token ${authToken}`
                return request;
            });
        }
    }, [authToken]);



    useEffect(() => {
        if (user) {
            validateUser()
        }
    }, [validateUser, user]);

    const loginUser = (username, password) => {
        axios.post("/api/login/", {
            method: "POST",
            username: username,
            password: password,
        }).then((response) => {
            if (response.status === 200) {
                const data = response.data
                setAuthToken(data.token);
                setUser(data.user);
                localStorage.setItem("authToken", JSON.stringify(data.token));
                localStorage.setItem("username", JSON.stringify(data.user))
                navigate("/dashboard");
            } else {
                alert("Something went wrong!");
            }
        }).catch((e) => console.log(e));

    };

    const registerUser = (username, password, email, first_name, last_name) => {
        axios.post("/api/register/", {
            method: "POST",
            username: username,
            password: password,
            email: email,
            first_name: first_name,
            last_name: last_name
        }).then((response) => {
            console.log(response)
            if (response.status === 201) {
                navigate("/login");
            };
        }).catch((e) => console.log(e));
    };

    const contextData = {
        user,
        setUser,
        authToken,
        setAuthToken,
        registerUser,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
};