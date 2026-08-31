import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-8">
      {/* Hero Section */}
      <section>
        <span>Exclusive Luxury Collection 2026</span>
        <h1>Elevate Your Style With Premium Watches & Perfumes</h1>
        <p>
          Explore our curated selection of high-end timepieces and long-lasting
          luxury fragrances.
        </p>

        <Link href="/shop">
          Shop Now
        </Link>
      </section>

      {/* Features Highlights */}
      <section>
        <ul>
          <li>
            <h3>Islandwide Fast Delivery</h3>
            <p>Secure shipping to your doorstep</p>
          </li>

          <li>
            <h3>100% Genuine Products</h3>
            <p>Authentic luxury guaranteed</p>
          </li>

          <li>
            <h3>Dedicated Support</h3>
            <p>24/7 customer assistance</p>
          </li>
        </ul>
      </section>
    </div>
  );
}