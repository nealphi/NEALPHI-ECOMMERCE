import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import AuthPage from "./pages/auth";
import ShopPage from "./pages/shop";
import CheckoutPage from "./pages/checkout";
import { ShopContextProvider } from "./context/shop-contex";
import NealphiPage from "./pages/nealphi";
import AccountPage from "./pages/account";
import Footer from "./components/Footer";

function App() {

  return (
    <div className="App">
      <Router>
        <ShopContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<NealphiPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account"  element={<AccountPage/>} />
          </Routes>
          <Footer/>
        </ShopContextProvider>
      </Router>
    </div>
  );
}

export default App;
