import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import CreateQuizzPage from "./pages/CreateQuizzPage";
import CreateDeckPage from "./pages/CreateDeckPage";
import { Toaster } from "./components/ui/toaster";
import BoardPage from "./pages/BoardPage";
import { AuthProvider } from "./contexts/AuthContext";
import RouteChangeListener from "./listeners/routes/RouteChangeListener";
import { UserProvider } from "./contexts/UserContext";
import ProfilePage from "./pages/ProfilePage";
import DeckPlayPage from "./pages/DeckPlayPage";
import ResponseQuizzPage from "./pages/ResponseQuizzPage";
import LayoutNavbarPage from "./pages/LayoutNavbarPage";
import MyOrganizationsPage from "./pages/MyOrganizationsPage";
import Error404 from "./pages/errors/Error404";
import PremiumPage from "./pages/PremiumPage";
import ExplorePage from "./pages/Explorepage";
import QuizzOrganizationsPage from "./pages/BoardOrganizationsPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Toaster />
    <AuthProvider>
      <UserProvider>
        <RouteChangeListener />
        <Routes>
          <Route path="/" element={<LayoutNavbarPage />}>
            <Route path="" element={<Homepage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/create-quizz" element={<CreateQuizzPage />} />
            <Route path="/quizz/:id/edit" element={<CreateQuizzPage />} />
            <Route path="/quizz/:quizzId" element={<ResponseQuizzPage />} />
            <Route path="/create-deck" element={<CreateDeckPage />} />
            <Route path="/deck/:id/edit" element={<CreateDeckPage />} />
            <Route path="/deck/:deckId" element={<DeckPlayPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/organizations" element={<MyOrganizationsPage />} />
            <Route path="/organizations/:organizationId" element={<QuizzOrganizationsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="*" element={<Error404 />} />
          </Route>
        </Routes>
      </UserProvider>
    </AuthProvider>

  </BrowserRouter>
);
