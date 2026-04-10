import { useEffect, useState } from "react";
import { Fragment } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import "./App.css";

//components
import RecipeList from "./components/RecipeList";

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔄 keep user logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  // 🔐 Not logged in
  if (!user) {
    return (
      <Fragment>
        <div>
          <h2>Login</h2>

          <input
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <input
            placeholder="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          <button onClick={login}>Login</button>
          <button onClick={signUp}>Sign up</button>
        </div>
      </Fragment>
    );
  }

  // ✅ Logged in
  return (
    <Fragment>
      <div className="app-header">
        <h1>Menoo</h1>


        <button onClick={logout}>Logout</button>
      </div>
      <RecipeList />
    </Fragment>
  );
}