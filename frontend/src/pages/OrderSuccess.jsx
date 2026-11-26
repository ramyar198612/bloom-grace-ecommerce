
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  ShoppingBag,
  ArrowRight,
  Copy,
  Truck,
} from 'lucide-react';

import api from '../services/api';

function OrderSuccess() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(
          `/orders/${encodeURIComponent(orderId)}/`
        );
        setOrder(response.data);
      } catch (err) {
        console.error('Order fetch failed:', err);
        setError('Unable to load your order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCopyOrderNumber = async () => {
    if (!order?.order_number) return;

    try {
      await navigator.clipboard.writeText(order.order_number);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch {
      setError('Unable to copy order number. Please copy it manually.');
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf7]">
        <p className="text-[#806b63]">Loading your order...</p>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#fffaf7] px-6 py-24 text-center">
        <Package size={50} className="mx-auto text-[#a66b65]" />

        <h1 className="mt-5 font-serif text-3xl text-[#49352f]">
          Order Details Unavailable
        </h1>

        <p className="mt-3 text-sm text-[#806b63]">
          {error || 'Order not found.'}
        </p>

        <Link
          to="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#a66b65] px-7 py-3 text-sm text-white"
        >
          Continue Shopping
          <ArrowRight size={16} />
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf7] px-5 py-16">
      <section className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-[#f0e5df] bg-white p-7 text-center shadow-sm md:p-12">

          <CheckCircle
            size={75}
            className="mx-auto text-green-600"
          />

          <p className="mt-6 text-xs tracking-[0.3em] text-[#a66b65]">
            BLOOM & GRACE
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#49352f]">
            Thank You!
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#806b63]">
            Your order has been placed successfully.
            We appreciate your purchase!
          </p>

          {/* Order Number */}
          <div className="mt-8 rounded-xl bg-[#f8efeb] p-6">
            <p className="text-xs tracking-wider text-[#927d73]">
              YOUR ORDER NUMBER
            </p>

            <h2 className="mt-3 break-all text-xl font-semibold text-[#a66b65]">
              {order.order_number}
            </h2>

            <button
              type="button"
              onClick={handleCopyOrderNumber}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#a66b65] px-5 py-2 text-sm text-[#a66b65] transition hover:bg-[#a66b65] hover:text-white"
            >
              <Copy size={16} />
              {copied ? 'Copied Successfully!' : 'Copy Order Number'}
            </button>

            <p className="mt-4 text-xs leading-6 text-[#927d73]">
              Please save your order number. You will need it
              to check your order status later.
            </p>
          </div>

          {/* Order Details */}
          <div className="mt-8 text-left">
            <h2 className="font-serif text-2xl text-[#49352f]">
              Order Details
            </h2>

            <div className="mt-5 space-y-3 text-sm text-[#806b63]">
              <div className="flex justify-between gap-4">
                <span>Customer</span>
                <span className="text-right font-medium text-[#49352f]">
                  {order.full_name}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Email</span>
                <span className="break-all text-right text-[#49352f]">
                  {order.email}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Order Status</span>
                <span className="font-medium text-[#a66b65]">
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>Order Date</span>
                <span className="text-right text-[#49352f]">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString('en-IN')
                    : 'N/A'}
                </span>
              </div>
            </div>

            <div className="my-6 border-t border-[#eadbd5]" />

            <h3 className="font-serif text-xl text-[#49352f]">
              Products Ordered
            </h3>

            <div className="mt-4 space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#49352f]">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-xs text-[#927d73]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium text-[#49352f]">
                    ₹{Number(item.line_total).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-[#eadbd5]" />

            <div className="space-y-3 text-sm text-[#806b63]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {Number(order.shipping_charge) === 0
                    ? 'Free'
                    : `₹${Number(order.shipping_charge).toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between border-t border-[#eadbd5] pt-4 font-semibold text-[#49352f]">
                <span>Order Total</span>

                <span className="text-xl text-[#a66b65]">
                  ₹{Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Actions */}
          <div className="mt-10 flex flex-col justify-center gap-4">

            <Link
              to={`/track-order/${encodeURIComponent(order.order_number)}`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#49352f] px-7 py-3 text-sm text-white transition hover:bg-[#76584e]"
            >
              <Truck size={17} />
              Track Your Order
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#a66b65] px-7 py-3 text-sm text-white transition hover:bg-[#87534e]"
            >
              <ShoppingBag size={17} />
              Continue Shopping
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-[#a66b65] px-7 py-3 text-sm text-[#a66b65]"
            >
              Back to Home
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;
