import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export function Navbar() {
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          C++ Web Editor
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/new"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                New Project
              </Link>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}