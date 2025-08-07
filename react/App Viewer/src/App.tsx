import { BrowserRouter, Routes, Route } from "react-router-dom";
import ModelListPage from "./pages/ModelListPage";
import ModelDetailPage from "./pages/ModelDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ModelListPage />} />
        <Route path="/model/:id" element={<ModelDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
