import { LogOut, User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../actions/authActions';

export const Home = () => {
  const { user, dispatch } = useAuth();

  const handleSignOut = async () => {
    await signOut(dispatch);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 mb-6">
            You're successfully logged in to your account.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800">Email</h3>
              </div>
              <p className="text-gray-700">{user?.email}</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">User ID</h3>
              </div>
              <p className="text-gray-700 text-sm break-all">{user?.id}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-gray-800">Account Created</h3>
              </div>
              <p className="text-gray-700">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-yellow-600" />
                <h3 className="font-semibold text-gray-800">Last Sign In</h3>
              </div>
              <p className="text-gray-700">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">Getting Started</h3>
          <p className="text-blue-100 mb-4">
            Your authentication system is set up with React, TypeScript, and Supabase. The implementation includes:
          </p>
          <ul className="space-y-2 text-blue-50">
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>State management using useReducer with actions and reducers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Protected routes and authentication context</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Beautiful, responsive login and signup forms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">•</span>
              <span>Secure authentication with Supabase</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};
