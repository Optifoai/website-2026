import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/auth'; // API calls
import { userLogin, userSignup } from '../Redux/Actions/loginAction';
import { notify, setLoginDetailInSession } from '../utils/helpers';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { setLoginDetailInSession } from '../utils/helpers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch()
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd validate the token with your backend
      // For simplicity, we'll assume a token means authenticated
      // You might also fetch user details here
      setIsAuthenticated(true);
      // Example: setUser({ username: 'testuser' });
    }
    setIsLoading(false);
  }, []);

  const loginOld = async (credentials) => {
    try {
      setIsLoading(true);
      const data = await authService.login(credentials); // Call your backend API
      delete(data?.responseData?.userProfile?.password);
      localStorage.setItem('authToken', JSON.stringify(data?.responseData?.accessToken));
      localStorage.setItem('userData', JSON.stringify(data?.responseData?.userProfile));      
      setIsAuthenticated(true);
      setUser(data.user); // Store user data
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      throw error;
    }
  };

  const login = (credentials) => {  
      setIsLoading(true);
      dispatch(userLogin(credentials)).then((res) => {
        console.log('res',res)
        if(res?.statusCode=='1'){
          let userData = res?.responseData
          delete (userData?.userProfile?.password);
          setLoginDetailInSession(userData);
          setIsAuthenticated(true);
          setUser(userData); // Store user data
          setIsLoading(false);  
          return true                
        }else{
          notify('error',res?.error?.responseMessage ? res?.error?.responseMessage :'Something went wrong!')
          return false     
        }        
               
      }).catch((err) => {
          console.log(err);
          setIsAuthenticated(false);
          setLoginDetailInSession({});
          setUser(null);
          setIsLoading(false);
          notify('error',err?.message ? err?.message :'Something went wrong!')
          return false     
      })
     
      // Redirect to dashboard on successful login
  
    };
    const signup = async (userData) => {
      
    try {
      setIsLoading(true);
      // const data = await authService.signup(userData); // Call your backend API
      dispatch(userSignup(userData)).then((res) => {
        console.log('res',res)
        if(res?.statusCode=='1'){
            let userData = res?.responseData
            delete (userData?.userProfile?.password);
            setLoginDetailInSession(userData);
            setIsAuthenticated(true);
            setUser(data.user);
            setIsLoading(false);
            notify('success', res.response?.data?.message ? res.response?.data?.message : 'Signup Successful.')
            navigate('/verify');
            return true;
        }else{    console.log('res 3',res,res?.error?.responseMessage)       
          setIsAuthenticated(false);
          setIsLoading(false);
          notify('error',res?.error?.responseMessage ? res?.error?.responseMessage :'Something went wrong!')
          return false;
        }
      }).catch((err) => {
          setIsAuthenticated(false);
          setLoginDetailInSession({});
          setUser(null);
          setIsLoading(false);
          notify('error',err?.message ? err?.message :'Something went wrong!')
          return false     
      });

     
    } catch (error) {
      console.error('Signup failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      throw error;
    }
  };

  const signupOld = async (userData) => {
    try {
      setIsLoading(true);
      const data = await authService.signup(userData); // Call your backend API
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      setUser(data.user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
     let res= await authService.forgotPassword(email); // Call your backend API
     setIsLoading(false);
      if(res?.statusCode=='1'){
        notify('success','Forgot password request sent successfully')
        return true;
      }else{
        notify('error',res?.error?.responseMessage ? res?.error?.responseMessage :'Forgot password request failed')
        return false;
      }
      
    } catch (error) {
      console.error('Forgot password request failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
