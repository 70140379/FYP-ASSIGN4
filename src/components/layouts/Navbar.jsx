import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // To store the user role (admin/user)
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchUserRole(currentUser.uid); // Fetch the user role from Firestore
      } else {
        setUser(null);
        setUserRole(null);
      }
    });
    return unsubscribe;
  }, []);

  const fetchUserRole = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId)); // Fetch user data from Firestore
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role); // Store the user role (admin/user)
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
    navigate("/"); // Redirect to home page after logout
  };

  const handleShopNow = () => {
    navigate("/shop");
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-xl cursor-pointer">
            <Link to="/">FYP Finder</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-green-300">
              Home
            </Link>

            {/* Only show Supervisors and Contact for normal users */}
            {userRole !== "admin" && (
              <>
                <Link to="/supervisors" className="hover:text-green-300">
                  Supervisors
                </Link>
                <Link to="/contact" className="hover:text-green-300">
                  Contact
                </Link>
              </>
            )}

            {/* Show Dashboard link for authenticated users */}
            {user && (
              <Link to="/dashboard" className="hover:text-green-300">
                Dashboard
              </Link>
            )}

            {user ? (
              <>
                <Link to="/profile" className="hover:text-green-300">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-300">
                  Login
                </Link>
                <Link to="/signup" className="hover:text-green-300">
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-700 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            className="block px-2 py-1 hover:bg-green-500 rounded"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {/* Only show Supervisors and Contact for normal users */}
          {userRole !== "admin" && (
            <>
              <Link
                to="/supervisors"
                className="block px-2 py-1 hover:bg-green-500 rounded"
                onClick={() => setIsOpen(false)}
              >
                Supervisors
              </Link>
              <Link
                to="/contact"
                className="block px-2 py-1 hover:bg-green-500 rounded"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </>
          )}

          {/* Show Dashboard link for authenticated users */}
          {user && (
            <Link
              to="/dashboard"
              className="block px-2 py-1 hover:bg-green-500 rounded"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <>
              <Link
                to="/profile"
                className="block px-2 py-1 hover:bg-green-500 rounded"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-2 py-1 hover:bg-green-500 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-2 py-1 hover:bg-green-500 rounded"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-2 py-1 hover:bg-green-500 rounded"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
