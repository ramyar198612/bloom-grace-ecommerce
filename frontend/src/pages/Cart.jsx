
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalItems,
    cartTotal,
  } = useCart();

  return (
    <main className="min-h-screen bg-[#fffaf7]">
      <section className="bg-[#f5e9e5] px-6 py-14 text-center">
        <p className="text-xs tracking-[0.3em] text-[#a66b65]">
          BLOOM & GRACE
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[#49352f]">
          Shopping Cart
        </h1>
        <p className="mt-3 text-sm text-[#806b63]">
          Review your beautiful selections
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-[#f0e5df] bg-white px-6 py-16 text-center">
            <ShoppingBag size={55} className="mx-auto text-[#b89b90]" />
            <h2 className="mt-5 font-serif text-2xl text-[#49352f]">
              Your Cart is Empty
            </h2>
            <p className="mt-3 text-sm text-[#806b63]">
              Discover something beautiful for your special moments.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#a66b65] px-7 py-3 text-sm text-white transition hover:bg-[#87534e]"
            >
              <ShoppingBag size={17} />
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-[#49352f]">
                  Your Items
                </h2>
                <span className="text-sm text-[#806b63]">
                  {totalItems} items
                </span>
              </div>

              {cartItems.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl border border-[#f0e5df] bg-white p-4 sm:flex-row sm:items-center"
                >
                  <Link
                    to={`/products/${item.id}`}
                    className="h-32 w-full flex-shrink-0 overflow-hidden rounded-xl bg-[#f7efeb] sm:w-28"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#b89b90]">
                        <ShoppingBag size={35} />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="font-serif text-lg text-[#49352f] hover:text-[#a66b65]">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm font-semibold text-[#a66b65]">
                      ₹{Number(item.price).toFixed(2)}
                    </p>

                    <p className="mt-1 text-xs text-[#927d73]">
                      Subtotal: ₹
                      {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center gap-4 rounded-full border border-[#eadbd5] px-3 py-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="text-[#806b63] disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-5 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= Number(item.stock)}
                          className="text-[#806b63] disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-1 text-xs text-red-500 transition hover:text-red-700"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 py-3 text-sm text-[#a66b65] hover:text-[#87534e]"
              >
                <ArrowLeft size={16} />
                Continue Shopping
              </Link>
            </div>

            <aside className="h-fit rounded-2xl border border-[#f0e5df] bg-white p-6">
              <h2 className="font-serif text-2xl text-[#49352f]">
                Order Summary
              </h2>

              <div className="mt-6 flex justify-between text-sm text-[#806b63]">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="mt-4 flex justify-between text-sm text-[#806b63]">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>

              <div className="my-5 border-t border-[#eadbd5]" />

              <div className="flex justify-between font-semibold text-[#49352f]">
                <span>Total</span>
                <span className="text-xl text-[#a66b65]">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-3 text-xs text-[#927d73]">
                Shipping charges, if applicable, will be calculated at checkout.
              </p>

              <Link
                to="/checkout"
                className="mt-7 block rounded-full bg-[#a66b65] px-6 py-4 text-center text-sm text-white transition hover:bg-[#87534e]"
              >
                Proceed to Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

export default Cart;
