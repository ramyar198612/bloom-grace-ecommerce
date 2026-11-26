
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { WebsiteProvider } from './context/WebsiteContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import TrackOrder from './pages/TrackOrder';

function App() {
  return (
    <WebsiteProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#fffaf6] text-[#49352f]">
            <Navbar />

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/track-order/:orderId" element={<TrackOrder />} />
            </Routes>

            <Footer />

            {/* AI Shopping Assistant */}
            <Chatbot />
          </div>
        </BrowserRouter>
      </CartProvider>
    </WebsiteProvider>
  );
}

export default App;
