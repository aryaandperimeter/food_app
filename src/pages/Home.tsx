import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Food Connector
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Connecting restaurants with shelters to reduce food waste and help those in need.
          Together, we can make a difference, one meal at a time.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card transform hover:scale-105 transition-all duration-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">I'm a Restaurant</h2>
            <p className="text-gray-600 mb-6">
              Have excess food? Donate it to local shelters and make a positive impact in your community.
            </p>
            <Link to="/restaurant" className="btn-primary block text-center">
              Donate Food
            </Link>
          </div>
          
          <div className="card transform hover:scale-105 transition-all duration-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">I'm a Shelter</h2>
            <p className="text-gray-600 mb-6">
              Looking for food donations? Browse available donations and claim them for your shelter.
            </p>
            <Link to="/shelter" className="btn-primary block text-center">
              Browse Donations
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Reduce Food Waste
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Help Communities
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Spread Kindness
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 