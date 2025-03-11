import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CompanyRegistration from "./pages/CompanyRegistration"; // Se estiver dentro de "pages"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CompanyRegistration />} />
      </Routes>
    </Router>
  );
}

export default App;
