import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import BoardPage from "./pages/BoardPage";
import { AuthProvider } from './contexts/AuthContext';
import RouteChangeListener from "./listeners/routes/RouteChangeListener";
import LoginPage from "./pages/LoginPage";
import { UserProvider } from "./contexts/UserContext";
import ProfilePage from "./pages/ProfilePage";
import LayoutNavbarPage from "./pages/LayoutNavbarPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <RouteChangeListener />
            <Routes>
              <Route path="/" element={<LayoutNavbarPage />}>
                <Route path="" element={<Homepage />} />
                <Route path="/board" element={<BoardPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
);
