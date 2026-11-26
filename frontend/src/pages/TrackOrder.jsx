
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import api from '../services/api';

function TrackOrder() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          `/orders/${encodeURIComponent(orderId)}/`
        );

        setOrder(response.data);
      } catch {
        setError('Unable to find this order. Please check your order number.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString('en-IN')}`;

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
    });

  const steps = [
    { status: 'PENDING', label: 'Order Placed', icon: CheckCircle },
    { status: 'CONFIRMED', label: 'Order Confirmed', icon: CheckCircle },
    { status: 'PROCESSING', label: 'Processing', icon: Package },
    { status: 'SHIPPED', label: 'Shipped', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: MapPin },
  ];

  const currentStep = steps.findIndex(
    (step) => step.status === order?.status
  );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf6]">
        <p className="text-[#795b4f]">Loading order details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fffaf6] px-6 text-center">
        <Package className="mb-4 h-12 w-12 text-[#b98270]" />
        <h1 className="mb-3 font-serif text-3xl text-[#49352f]">
          Order Not Found
        </h1>
        <p className="mb-6 text-[#927c73]">{error}</p>
        <Link
          to="/my-orders"
          className="rounded-lg bg-[#49352f] px-6 py-3 text-white"
        >
          Try Again
        </Link>
      </main>
    );
  }

  const isCancelled = order.status === 'CANCELLED';

  return (
    <main className="min-h-screen bg-[#fffaf6] px-6 py-16">
      <div className="mx-auto max-w-4xl">

        <div className="mb-10 text-center">
          <Truck className="mx-auto mb-4 h-12 w-12 text-[#b98270]" />
          <h1 className="mb-3 font-serif text-4xl text-[#49352f]">
            Track Your Order
          </h1>
          <p className="text-sm text-[#927c73]">
            Follow your Bloom & Grace order status.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <div className="mb-8 flex flex-wrap justify-between gap-4 border-b border-[#f0e5df] pb-6">
            <div>
              <p className="text-xs text-[#927c73]">Order Number</p>
              <h2 className="mt-1 font-semibold text-[#49352f]">
                {order.order_number}
              </h2>
            </div>

            <div>
              <p className="text-xs text-[#927c73]">Order Status</p>
              <span className="mt-1 inline-block rounded-full bg-[#f5eee8] px-4 py-2 text-sm font-medium text-[#795b4f]">
                {order.status}
              </span>
            </div>
          </div>

          {isCancelled ? (
            <div className="mb-8 rounded-xl bg-red-50 p-5 text-center text-red-700">
              This order has been cancelled.
            </div>
          ) : (
            <div className="mb-10">
              <h3 className="mb-6 font-serif text-xl text-[#49352f]">
                Order Progress
              </h3>

              <div className="space-y-6">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const completed = currentStep >= index;

                  return (
                    <div key={step.status} className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                          completed
                            ? 'bg-[#49352f] text-white'
                            : 'bg-[#f5eee8] text-[#b9a49a]'
                        }`}
                      >
                        <StepIcon size={20} />
                      </div>

                      <div>
                        <p
                          className={`font-medium ${
                            completed ? 'text-[#49352f]' : 'text-[#b9a49a]'
                          }`}
                        >
                          {step.label}
                        </p>

                        {index === 0 && order.created_at && (
                          <p className="mt-1 text-xs text-[#927c73]">
                            {formatDate(order.created_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentStep === -1 && (
                <p className="mt-5 text-sm text-[#927c73]">
                  Order status is not yet updated.
                </p>
              )}
            </div>
          )}

          <div className="mb-8 border-t border-[#f0e5df] pt-6">
            <h3 className="mb-4 font-serif text-xl text-[#49352f]">
              Delivery Details
            </h3>

            <p className="font-medium text-[#49352f]">{order.full_name}</p>
            <p className="mt-1 text-sm text-[#927c73]">{order.phone}</p>
            <p className="text-sm text-[#927c73]">{order.email}</p>
            <p className="mt-2 text-sm text-[#927c73]">
              {order.address}, {order.city}, {order.state} - {order.pincode}
            </p>
          </div>

          <div className="mb-8 border-t border-[#f0e5df] pt-6">
            <h3 className="mb-4 font-serif text-xl text-[#49352f]">
              Ordered Products
            </h3>

            {order.items?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 border-b border-[#f5eee8] py-3"
              >
                <div>
                  <p className="font-medium text-[#49352f]">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-[#927c73]">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="font-medium text-[#49352f]">
                  {formatPrice(item.line_total)}
                </p>
              </div>
            ))}

            <div className="mt-5 flex justify-between text-lg font-semibold text-[#49352f]">
              <span>Total Amount</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#49352f] px-5 py-3 text-white hover:bg-[#76584e]"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </Link>

            <Link
              to="/my-orders"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#49352f] px-5 py-3 text-[#49352f] hover:bg-[#f5eee8]"
            >
              <Clock size={18} />
              My Orders
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}

export default TrackOrder;
