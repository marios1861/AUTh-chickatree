import { createContext, useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ apiClient }) => {
    const [ authToken, setAuthToken ] = useState(() =>
        localStorage.getItem("authToken")
            ? JSON.parse(localStorage.getItem("authToken"))
            : null
    );

    const [ user, setUser ] = useState(() =>
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
        navigate("/login", {replace: true});
    }, [ navigate ]);

    useEffect(() => {
        if (authToken) {
            apiClient.interceptors.request.use((request) => {
                request.headers.Authorization = `Token ${authToken}`;
                return request;
            });
            navigate("/dashboard", {replace: true});
        }
        // eslint-disable-next-line
    }, [ authToken ]);



    useEffect(() => {
        const validateUser = () => {
            apiClient.get(`/api/user/${user.id}/`).catch((e) => {
                if (e.response.status === 401) {
                    logoutUser();
                }
            });
        };
        if (user) {
            validateUser();
        }
    });

    const loginUser = (username, password) => {
        apiClient.post("/api/login/", {
            username: username,
            password: password,
        }).then((response) => {
            if (response.status === 200) {
                const data = response.data;
                setAuthToken(data.token);
                setUser(data.user);
                localStorage.setItem("authToken", JSON.stringify(data.token));
                localStorage.setItem("username", JSON.stringify(data.user));
            } else {
                alert("Something went wrong!");
            }
        }).catch((e) => console.log(e));

    };

    const registerUser = (username, password, email, first_name, last_name) => {
        apiClient.post("/api/register/", {
            username: username,
            password: password,
            email: email,
            first_name: first_name,
            last_name: last_name
        }).then((response) => {
            console.log(response);
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
        <AuthContext.Provider value={ contextData }>
            <Outlet />
        </AuthContext.Provider>
    );
};