import ProductCard from './ProductCard';

const ProductsPage = () => {
  const dummyProducts = [
    {
      name: 'Colorful Headphones',
      price: 99.99,
      points: 50,
      badge: 'Top Seller',
      description: 'These headphones amplify sound so absurdly, you might just hear colors!',
      image: 'https://i.pinimg.com/474x/5d/d4/17/5dd417cdc87f02e6157616c35117bc74.jpg',
    },
    {
      name: 'Pointless Mug',
      price: 19.99,
      points: 10,
      description:
        'A mug that holds just enough liquid to leave you questioning life decisions. Pointless, yet oddly charming!',
      image: 'https://i.pinimg.com/736x/bb/f9/03/bbf90307a0b38f6a255dc18828eb47a7.jpg',
    },
  ];

  return (
    <div className="products-page bg-gray-100 min-h-screen py-12">
      <div className="container mx-auto">
        <h1 className="products-title text-4xl font-bold text-black text-center mb-8">
          Our Absurd Products
        </h1>
        <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
