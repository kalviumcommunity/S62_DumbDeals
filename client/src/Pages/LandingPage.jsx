const LandingPage = () => {
  return (
    <div className="font-sans bg-white text-black">
      {/* Header */}
      <header className="bg-black text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Welcome to DumbDeals</h1>
          <p className="mt-2 text-lg">The gamified e-commerce experience you never knew you needed!</p>
        </div>
      </header>

      {/* About Section */}
      <section className="container mx-auto py-12 px-6 text-center">
        <h2 className="text-3xl font-bold text-black">What is DumbDeals?</h2>
        <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
          DumbDeals is a humorous, gamified online shopping platform where you can spend virtual credits on the most absurd and useless products. 
          Create an account, earn credits, and browse through a collection of hilarious items that will leave you laughing.
        </p>
      </section>

      {/* Key Features Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black">Key Features</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-black">Gamified Virtual Wallet</h3>
              <p className="mt-4 text-gray-600">Earn or preload virtual credits to make fun and pointless purchases!</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-black">Absurd Product Catalog</h3>
              <p className="mt-4 text-gray-600">Browse through an array of ridiculous and useless products, each with an over-the-top description.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-black">User Rewards</h3>
              <p className="mt-4 text-gray-600">Earn bonus credits by performing actions like logging in daily or sharing with friends.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-white text-black py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-black">Ready to Start Shopping?</h2>
          <p className="mt-4 text-lg">Create an account today and dive into the most absurd shopping experience ever!</p>
          <a href="/signup" className="mt-6 inline-block bg-black text-white py-3 px-6 rounded-lg text-xl hover:bg-gray-800 transition-all duration-300">
          Sign Up Now
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 DumbDeals. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
