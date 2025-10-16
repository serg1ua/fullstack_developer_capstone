import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/djangoapp/login" element={<Login />} />
      <Route path="/djangoapp/register" element={<Register />} />
    </Routes>
  );
}
export default App;
