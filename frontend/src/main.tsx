import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import { AuthProvider } from './contexts/AuthContext';
import RouteChangeListener from "./listeners/routes/RouteChangeListener";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <RouteChangeListener />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage/> } />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
  </React.StrictMode>
);
