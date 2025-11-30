import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/common/InputField/InputField';
import Button from '../../components/common/Button/Button';
import { userLogin } from '../../Redux/Actions/loginAction';
import { setLoginDetailInSession } from '../../utils/helpers';

function LoginPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   try {
  //     await login({ email, password });
  //     navigate('/dashboard'); // Redirect to dashboard on successful login
  //   } catch (err) {
  //     setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
  //   }
  // };

  const handleSubmit = (e) => {
    const { dispatch,navigate } = props
    e.preventDefault();
    setError('');
    let loginPayload = {email: email,password: password}   
      dispatch(userLogin(loginPayload)).then((res) => {
        let userData=res?.responseData
        delete(userData?.userProfile?.password);
        setLoginDetailInSession(userData);
        navigate('/dashboard');
      }).catch((err) => {
        console.log(err);
      })
      // Redirect to dashboard on successful login

  };

  return (
    <div className="auth-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <InputField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
}

export default LoginPage;
