import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="min-h-fit pt-28 pb-16 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col justify-start items-center">
        <div className="px-6 flex flex-col items-center">
          <div className="inline-block mx-auto bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full px-4 py-2 mb-8">
            <span className="text-sm font-medium text-white">Trusted by 10,000+ businesses worldwide</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Global Logistics, <span className="text-teal-400">Simplified</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Streamline your supply chain with our comprehensive logistics platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-teal-500 text-white rounded-lg font-semibold text-lg hover:bg-teal-600 transition"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 border border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-slate-900 transition"
            >
              Track Shipment
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Why Choose <span className="text-teal-500">Global Link</span>?
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We combine cutting-edge technology with decades of logistics expertise to deliver unmatched service quality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group max-w-xs mx-auto w-full bg-white shadow-sm rounded-2xl p-6 border border-gray-100 aspect-square flex flex-col justify-center items-center text-center transition-shadow duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-teal-100">
                <svg className="w-8 h-8 text-teal-500 transition-colors duration-300 group-hover:text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Monitor your shipments in real-time with our advanced tracking system.</p>
            </div>
            <div className="group max-w-xs mx-auto w-full bg-white shadow-sm rounded-2xl p-6 border border-gray-100 aspect-square flex flex-col justify-center items-center text-center transition-shadow duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-teal-100">
                <svg className="w-8 h-8 text-teal-500 transition-colors duration-300 group-hover:text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Network</h3>
              <p className="text-gray-600">Access our extensive global network for seamless international shipping.</p>
            </div>
            <div className="group max-w-xs mx-auto w-full bg-white shadow-sm rounded-2xl p-6 border border-gray-100 aspect-square flex flex-col justify-center items-center text-center transition-shadow duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-teal-100">
                <svg className="w-8 h-8 text-teal-500 transition-colors duration-300 group-hover:text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Handling</h3>
              <p className="text-gray-600">Your shipments are handled with the highest security standards.</p>
            </div>
            <div className="group max-w-xs mx-auto w-full bg-white shadow-sm rounded-2xl p-6 border border-gray-100 aspect-square flex flex-col justify-center items-center text-center transition-shadow duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-teal-100">
                <svg className="w-8 h-8 text-teal-500 transition-colors duration-300 group-hover:text-teal-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Experience lightning-fast delivery with our optimized logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-900 text-white py-20">
        <div className="px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Streamline Your Logistics?</h2>
          <Link
            to="/create-shipment"
            className="inline-block px-8 py-4 bg-teal-500 text-white rounded-lg font-semibold text-lg hover:bg-teal-600 transition"
          >
            Create New Shipment
          </Link>
        </div>
      </section>
    </div>
  );
}
