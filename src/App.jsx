import { Route, Routes } from "react-router";
import MainPage from "./pages/MainPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./сomponents/ProtectedRoute";
import FavoritesPage from "./pages/FavoritesPage";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route index path="/" element={<MainPage />} />
          <Route index path="/favorites" element={<FavoritesPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
