import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage";
import EmailAuthPage from "./pages/EmailAuthPage";

import { listAdapters, detailAdapters } from "./types/appAdapters";

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/">
              <Route index element={<ListPage adapters={listAdapters} />} />
              <Route path="model/:id" element={<DetailPage adapters={detailAdapters} />} />
            </Route>
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="auth" element={<EmailAuthPage />} />
          </Route>

          <Route path="*" element={<div />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
