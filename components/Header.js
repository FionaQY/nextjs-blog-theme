import Link from 'next/link';

export default function Header({ name, auth0 }) {
  // let link = `/api/auth/${auth0}`;
  return (
    <header className="bg-gradient-to-r from-blue-500 to-green-500 pt-4 pb-4 text-white">
      <div className="container mx-auto px-6">
        {/* Flexbox to align elements horizontally and space them out */}
        <div className="flex items-center justify-between w-full">
          
          {/* Logo/Avatar */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-pink-500 flex items-center justify-center">
            <span className="text-xl font-bold text-white">🌟</span>
          </div>

          {/* Title */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-semibold">{name}</h1>
            <p className="text-lg text-center opacity-80">Welcome to the best place for amazing content!</p>
          </div>

          {/* Navigation and Login Button */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-lg font-semibold text-white hover:text-gray-200 transition duration-300 ease-in-out">
              Go to Homepage
            </Link>
            <a href={`/api/auth/${auth0}`}>Login/Logout</a>;
          </div>
        </div>
      </div>
    </header>
  );
}
