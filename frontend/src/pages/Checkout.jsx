
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, MapPin } from 'lucide-react';

import { useCart } from '../context/CartContext';
import api from '../services/api';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

function Checkout() {
  const {
    cartItems,
    totalItems,
    cartTotal,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setSubmitError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      // Step 1: Create order in Django backend.
      const orderData = {
        ...formData,
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const orderResponse = await api.post('/orders/', orderData);
      const orderNumber = orderResponse.data.order_number;

      if (!orderNumber) {
        throw new Error('Order number was not returned by the server.');
      }

      console.log('ORDER CREATED:', orderNumber);

      // Step 2: Load Razorpay Checkout.
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error(
          'Unable to load Razorpay. Please check your internet connection.'
        );
      }

      // Step 3: Create Razorpay payment order.
      const paymentResponse = await api.post(
        '/payments/create-order/',
        {
          order_number: orderNumber,
        }
      );

      const paymentData = paymentResponse.data;

      if (!paymentData.key_id || !paymentData.razorpay_order_id) {
        throw new Error('Invalid Razorpay payment details.');
      }

      console.log('RAZORPAY ORDER CREATED:', {
        order_number: orderNumber,
        razorpay_order_id: paymentData.razorpay_order_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
      });

      // Step 4: Open Razorpay Checkout.
      const options = {
        key: paymentData.key_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: 'Bloom & Grace',
        description: 'Order Payment',
        order_id: paymentData.razorpay_order_id,

        prefill: {
          name: paymentData.customer_name,
          email: paymentData.customer_email,
          contact: paymentData.customer_phone,
        },

        theme: {
          color: '#a66b65',
        },

        handler: async function (razorpayResponse) {
          console.log('RAZORPAY HANDLER STARTED');

          console.log('RAZORPAY RESPONSE:', {
            order_id: razorpayResponse.razorpay_order_id,
            payment_id: razorpayResponse.razorpay_payment_id,
            has_signature: Boolean(
              razorpayResponse.razorpay_signature
            ),
          });

          try {
            setSubmitting(true);
            setSubmitError('');

            // Check that Razorpay returned all required values.
            if (
              !razorpayResponse.razorpay_order_id ||
              !razorpayResponse.razorpay_payment_id ||
              !razorpayResponse.razorpay_signature
            ) {
              throw new Error(
                'Razorpay did not return all required verification details.'
              );
            }

            console.log('SENDING PAYMENT VERIFICATION REQUEST');

            // Step 5: Verify payment on Django backend.
            const verifyResponse = await api.post(
              '/payments/verify/',
              {
                razorpay_order_id:
                  razorpayResponse.razorpay_order_id,

                razorpay_payment_id:
                  razorpayResponse.razorpay_payment_id,

                razorpay_signature:
                  razorpayResponse.razorpay_signature,
              }
            );

            console.log(
              'PAYMENT VERIFICATION RESPONSE:',
              verifyResponse.status,
              verifyResponse.data
            );

            if (!verifyResponse.data.success) {
              throw new Error('Payment verification failed.');
            }

            console.log('PAYMENT VERIFIED SUCCESSFULLY');

            // Clear cart only after successful verification.
            clearCart();

            navigate(`/order-success/${orderNumber}`);

          } catch (verificationError) {
            console.error(
              'Payment verification error:',
              verificationError.response?.data ||
              verificationError.message
            );

            setSubmitError(
              verificationError.response?.data?.error ||
              'Payment was received, but verification failed. Please contact support with your order number: ' +
              orderNumber
            );

          } finally {
            setSubmitting(false);
          }
        },

        modal: {
          ondismiss: function () {
            setSubmitting(false);

            setSubmitError(
              'Payment was cancelled or the payment window was closed. Your order is still pending.'
            );
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response) {
        console.error(
          'RAZORPAY PAYMENT FAILED:',
          response.error?.description
        );

        setSubmitting(false);

        setSubmitError(
          response.error?.description ||
          'Payment failed. Please try again.'
        );
      });

      razorpay.open();

    } catch (error) {
      console.error(
        'Checkout failed:',
        error.response?.data || error.message
      );

      const errorData = error.response?.data;

      setSubmitError(
        errorData?.error ||
        (typeof errorData === 'string'
          ? errorData
          : errorData
            ? JSON.stringify(errorData)
            : error.message || 'Unable to continue. Please try again.')
      );

      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#fffaf7] px-6 py-24 text-center">
        <ShoppingBag
          size={55}
          className="mx-auto text-[#b89b90]"
        />

        <h1 className="mt-5 font-serif text-3xl text-[#49352f]">
          Your Cart is Empty
        </h1>

        <p className="mt-3 text-sm text-[#806b63]">
          Please add products before proceeding to checkout.
        </p>

        <Link
          to="/shop"
          className="mt-7 inline-block rounded-full bg-[#a66b65] px-7 py-3 text-sm text-white"
        >
          Explore Collection
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf7]">

      {/* Page Header */}
      <section className="bg-[#f5e9e5] px-6 py-14 text-center">
        <p className="text-xs tracking-[0.3em] text-[#a66b65]">
          BLOOM & GRACE
        </p>

        <h1 className="mt-3 font-serif text-4xl text-[#49352f]">
          Checkout
        </h1>

        <p className="mt-3 text-sm text-[#806b63]">
          Just a few details before your beautiful order
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">

        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#a66b65]"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-10 lg:grid-cols-3">

            {/* Customer Information */}
            <div className="rounded-2xl border border-[#f0e5df] bg-white p-6 lg:col-span-2 md:p-8">

              <div className="mb-7 flex items-center gap-3">
                <MapPin
                  className="text-[#a66b65]"
                  size={22}
                />

                <div>
                  <h2 className="font-serif text-2xl text-[#49352f]">
                    Delivery Information
                  </h2>

                  <p className="mt-1 text-xs text-[#927d73]">
                    Enter your details for delivery
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-[#49352f]">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-xl border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#49352f]">
                    Email Address *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                    className="w-full rounded-xl border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#49352f]">
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    className="w-full rounded-xl border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm text-[#49352f]">
                    Delivery Address *
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, area..."
                    rows={3}
                    required
                    className="w-full rounded-xl border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#49352f]">
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                    className="w-full rounded-xl border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#49352f]">
                    State *
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                    className="w-full rounded-xl border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-[#49352f]">
                    PIN Code *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit PIN code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    className="w-full rounded-xl border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65]"
                  />
                </div>

              </div>
            </div>

            {/* Order Summary */}
            <aside className="h-fit rounded-2xl border border-[#f0e5df] bg-white p-6">

              <h2 className="font-serif text-2xl text-[#49352f]">
                Order Summary
              </h2>

              <p className="mt-2 text-sm text-[#927d73]">
                {totalItems} items in your cart
              </p>

              <div className="mt-6 space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3"
                  >
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#f7efeb]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag
                            size={22}
                            className="text-[#b89b90]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm text-[#49352f]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-[#927d73]">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="text-sm font-semibold text-[#49352f]">
                      ₹{(
                        Number(item.price) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="my-6 border-t border-[#eadbd5]" />

              <div className="flex justify-between text-sm text-[#806b63]">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="mt-3 flex justify-between text-sm text-[#806b63]">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="my-5 border-t border-[#eadbd5]" />

              <div className="flex justify-between font-semibold text-[#49352f]">
                <span>Order Total</span>

                <span className="text-xl text-[#a66b65]">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              {submitError && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-7 w-full rounded-full bg-[#a66b65] px-6 py-4 text-sm text-white transition hover:bg-[#87534e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Processing...' : 'Proceed to Payment'}
              </button>

              <p className="mt-4 text-center text-xs leading-6 text-[#927d73]">
                Secure payment powered by Razorpay Test Mode.
              </p>

            </aside>

          </div>
        </form>

      </section>
    </main>
  );
}

export default Checkout;
