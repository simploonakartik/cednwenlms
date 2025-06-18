import "./App.css";

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import ClientMaster from "./components/ClientMaster";
import OrderPage from "./components/order/OrderPage";
import Proposals from "./components/ops/Proposals";
import Invoices from "./components/invoice/Invoices";
import Users from "./components/userExcess/Users";
import JobRole from "./components//userExcess/JobRole";
import CreateRole from "./components//userExcess/CreateRole";
import NewProposal from "./components/ops/NewProposal";
import EditProposal from "./components/ops/EditProposal";
import NewOrder from "./components/order/NewOrder";
import "react-toastify/dist/ReactToastify.css";
import Editorders from "./components/order/Editorders";
import Department from "./components/Department";
import DCR from "./components/DCR";
import EditWonData from "./components/order/EditWonData";
import Search from "./components/Search";
import NewInvoive from "./components/invoice/NewInvoive";
import EditInvoice from "./components/invoice/EditInvoice";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/orders/new-order" element={<NewOrder />} />
        <Route path="/orders/edit-order" element={<Editorders/>} />
        <Route path="/orders/edit-wondata" element={<EditWonData />} />
        <Route path="/clientmaster" element={<ClientMaster />} />
        <Route path="/ops" element={<Proposals />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/invoices/new-invoice" element={<NewInvoive />} />
        <Route path="/invoices/edit-invoice" element={<EditInvoice />} />
        <Route path="/products" element={<Products />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/roles" element={<JobRole />} />
        <Route path="/users/roles/create" element={<CreateRole />} />
        <Route path="/ops/new-Proposal" element={<NewProposal />} />
        <Route path="/ops/edit-Proposal" element={<EditProposal />} />
        <Route path="/department" element={<Department />} />
        <Route path="/dcr" element={<DCR />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
  );
}

export default App;
