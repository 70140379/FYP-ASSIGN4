import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase/firebaseConfig";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null); // For file upload
  const [profilePicUrl, setProfilePicUrl] = useState(""); // For URL input
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload profile picture if selected via URL or File upload
      let photoURL = "";

      // If user provided a URL for the profile picture
      if (profilePicUrl) {
        photoURL = profilePicUrl;
      }

      // If user uploaded a file
      if (profilePicFile) {
        const storageRef = ref(storage, `profilePics/${user.uid}`);
        await uploadBytes(storageRef, profilePicFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Check if user profile already exists in Firestore by email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingUserDoc = querySnapshot.docs[0];
        const existingData = existingUserDoc.data();

        // Save Firestore doc with existing data but update uid, photoURL, name, createdAt
        await setDoc(doc(db, "users", user.uid), {
          ...existingData,
          uid: user.uid,
          email: email,
          name: name.trim(),
          photoURL,
          createdAt: new Date(),
        });

        if (existingUserDoc.id !== user.uid) {
          await deleteDoc(doc(db, "users", existingUserDoc.id));
        }
      } else {
        // No existing user, create new user doc with default role "student"
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: email,
          role: "student",
          name: name.trim(),
          photoURL,
          createdAt: new Date(),
        });
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl mb-4 font-semibold">Sign Up</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />

        <label className="flex flex-col mt-4">
        Profile Picture URL:
          <input
            type="url"
            placeholder="Paste image URL here"
            value={profilePicUrl}
            onChange={(e) => setProfilePicUrl(e.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

      {/* Login prompt below form */}
      <p className="mt-4 text-center text-gray-700">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
  