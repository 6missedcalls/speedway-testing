import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<PrivateRoute Component={Dashboard} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
