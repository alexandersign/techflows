import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPage from "@/pages/AdminPage";
import HomePage from "@/pages/HomePage";
import QuotePage from "@/pages/QuotePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/q/:token" element={<QuotePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}
