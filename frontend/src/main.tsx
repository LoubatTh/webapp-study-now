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
import { UserProvider } from "./contexts/UserContext";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "./components/ui/toaster";


ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
    <Toaster/>
      <AuthProvider>
        <UserProvider>
          <RouteChangeListener />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
);
