import { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;


export const AuthProvider = ({ apiClient }) => {

  // this variable stores the authToken
  const [ authToken, setAuthToken ] = useState(() =>
    localStorage.getItem("authToken")
      ? JSON.parse(localStorage.getItem("authToken"))
      : null
  );

  // this variable stores the user object (properties: id, username)
  const [ user, setUser ] = useState(() =>
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // this variable stores the state of the application (loading data or not)
  const [ loading, setLoading ] = useState(false);

  // this is used to navigate to different pages
  const navigate = useNavigate();

  // call this function to sign out logged in user
  const logoutUser = () => {
    // reset state and delete stored values
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    apiClient.interceptors.request.clear();
    // navigate to login page
    navigate("/login", { replace: true });
  };

  // login user (pure function)
  const loginUser = (username, password) => {
    // start loading
    setLoading(true);
    apiClient
      .post("/api/login/", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          // save received data and update state
          setAuthToken(data.token);
          setUser(data.user);
          localStorage.setItem("authToken", JSON.stringify(data.token));
          localStorage.setItem("user", JSON.stringify(data.user));
          // stop loading
          setLoading(false);
          // navigate to main page
          navigate('/dashboard', { replace: true });
        } else {
          alert("Something went wrong!");
        }
      })
      .catch((e) => setLoading(false));

  };

  const registerUser = (username, password, email, first_name, last_name) => {
    apiClient
      .post("/api/register/", {
        username: username,
        password: password,
        email: email,
        first_name: first_name,
        last_name: last_name
      })
      .then((response) => {
        if (response.status === 201) {
          navigate("/login");
        };
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (user) {
      const validateUser = () => {
        apiClient.get(`/api/user/${user.id}/`).catch(
          (error) => {
            if (error.response.status === 401) {
              logoutUser();
            }
          });
      };

      const reqInterceptor = request => {
        request.headers.Authorization = `Token ${authToken}`;
        return request;
      };

      const interceptor = apiClient.interceptors.request.use(reqInterceptor);
      validateUser();

      return () => {
        apiClient.interceptors.request.eject(interceptor);
      };
    }
  });


  const contextData = {
    apiClient,
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
      { loading ? null : <Outlet /> }
    </AuthContext.Provider>
  );
};