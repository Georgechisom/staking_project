import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Stake from "./pages/Stake";
import Withdraw from "./pages/Withdraw";
import Rewards from "./pages/Rewards";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
