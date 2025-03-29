import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Homeless Shelter Food Connector
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Connecting restaurants with surplus food to homeless shelters in need.
          Together, we can reduce food waste and fight food insecurity.
        </p>
        
        <div className="mt-8 space-y-4">
          <Link to="/restaurant" className="block">
            <button className="btn-primary w-full">
              I'm a Restaurant
            </button>
          </Link>
          <Link to="/shelter" className="block">
            <button className="btn-secondary w-full">
              I'm a Shelter
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 