import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import AddItem from "./components/AddItem";
import AddCollection from "./components/AddCollection";
import Settings from "./components/Settings";
import Navigation from "./components/Navigation";

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/add-collection" element={<AddCollection />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}
