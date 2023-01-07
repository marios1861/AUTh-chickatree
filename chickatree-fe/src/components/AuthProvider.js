import { createContext, useReducer, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return {
        token: action.token,
        user: action.user
      };
    case 'logout':
      return {
        token: null,
        user: null
      };
    default:
      throw Error('Unknown authprovider action');
  }
}

export const AuthProvider = ({ apiClient }) => {

  // this variable stores the authToken
  const navigate = useNavigate();
  const [ state, dispatch ] = useReducer(
    reducer,
    {
      user: null,
      token: null
    },
    (initArgs) => {
      let saved_state = localStorage.getItem("state");
      if (saved_state) {
        saved_state = JSON.parse(saved_state);
        apiClient.interceptors.request.use((request) => {
          request.headers.Authorization = `Token ${saved_state.token}`;
          return request;
        });
        apiClient.get(`/api/user/${saved_state.user.id}/`)
          .catch((e) => {
            if (e.response.status === 401) {
              logoutUser();
            }
          });
        return {
          token: saved_state.token,
          user: saved_state.user,
        };
      }
      else {
        return {
          token: null,
          user: null
        };
      }
    });

  // this variable stores the state of the application (loading data or not)
  const [ loading, setLoading ] = useState(false);

  // this is used to navigate to different pages

  // call this function to sign out logged in user
  const logoutUser = () => {
    // reset state and delete stored values
    dispatch({
      type: 'logout'
    });
    localStorage.removeItem("state");
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
          apiClient.interceptors.request.use((request) => {
            request.headers.Authorization = `Token ${data.token}`;
            return request;
          });
          dispatch({
            type: 'login',
            token: data.token,
            user: data.user,
          });
          localStorage.setItem("state", JSON.stringify({
            token: data.token,
            user: data.user
          }));
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

  const contextData = {
    apiClient,
    user: state.user,
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