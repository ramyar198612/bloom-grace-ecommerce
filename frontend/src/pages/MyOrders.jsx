
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, ArrowRight, ShoppingBag } from 'lucide-react';
import api from '../services/api';

function MyOrders() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim()) {
      setError('Please enter your order number.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setOrder(null);

      const response = await api.get(
        `/orders/${encodeURIComponent(orderNumber.trim())}/`
      );

      setOrder(response.data);
    } catch {
      setError('Order not found. Please check your order number.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString('en-IN')}`;

  return (
    <main className="min-h-screen bg-[#fffaf6] px-6 py-16">
      <div className="mx-auto max-w-3xl">

        <div className="mb-10 text-center">
          <Package className="mx-auto mb-4 h-12 w-12 text-[#b98270]" />

          <h1 className="mb-3 font-serif text-4xl text-[#49352f]">
            My Orders
          </h1>

          <p className="text-sm text-[#927c73]">
            Enter your order number to view your order details.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm sm:flex-row"
        >
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number (Example: BG-XXXXXXXXXXXX)"
            className="min-w-0 flex-1 rounded-lg border border-[#eadbd3] px-4 py-3 outline-none focus:border-[#b98270]"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#49352f] px-6 py-3 text-white transition hover:bg-[#76584e] disabled:opacity-60"
          >
            <Search size={18} />
            {loading ? 'Searching...' : 'Find Order'}
          </button>
        </form>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {order && (
          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e5df] pb-5">
              <div>
                <p className="text-xs text-[#927c73]">Order Number</p>
                <h2 className="mt-1 font-semibold text-[#49352f]">
                  {order.order_number}
                </h2>
              </div>

              <span className="rounded-full bg-[#f5eee8] px-4 py-2 text-sm text-[#795b4f]">
                {order.status}
              </span>
            </div>

            <div className="mb-6 space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b border-[#f5eee8] pb-4"
                >
                  <div>
                    <p className="font-medium text-[#49352f]">
                      {item.product_name}
                    </p>
                    <p className="mt-1 text-sm text-[#927c73]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium text-[#49352f]">
                    {formatPrice(item.line_total)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#927c73]">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#927c73]">Shipping</span>
                <span>
                  {Number(order.shipping_charge) === 0
                    ? 'Free'
                    : formatPrice(order.shipping_charge)}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#eadbd3] pt-3 text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total_amount)}</span>
              </div>
            </div>

            <Link
              to={`/track-order/${encodeURIComponent(order.order_number)}`}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#49352f] px-5 py-3 text-white hover:bg-[#76584e]"
            >
              Track This Order
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {!order && !error && (
          <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-4 h-10 w-10 text-[#c5a99d]" />
            <p className="mb-5 text-sm text-[#927c73]">
              Your order details will appear here after you search.
            </p>

            <Link
              to="/shop"
              className="inline-block rounded-lg bg-[#49352f] px-6 py-3 text-white hover:bg-[#76584e]"
            >
              Continue Shopping
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}

export default MyOrders;
