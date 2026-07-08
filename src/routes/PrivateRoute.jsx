import { Navigate } from 'react-router-dom';
// import useAuth from '../hooks/useAuth';
import { useAuth } from '../hooks/useAuth';
// import { Spinner } from '../components/common/Spinner';
import Spinner from '../hooks/Spinner';
import Header from '../components/layout/Header/Header';
import SideBar from '../components/layout/Header/SideBar';

export default function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  // const accessToken=localStorage.getItem('authToken')
  if (isLoading) {
    return <Spinner />;
  }
  return isAuthenticated ?

     <div className="app"> 
     <SideBar/>
        <main className="main">
         <Header/>
     {children} 
      </main>
    </div> :
   
   <Navigate to="/login" replace />;

}
