import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 pt-10  bg-gray-50">
      <div className="flex flex-col relative">
        {/* Vertical line decoration */}
        <div className="absolute h-full w-px left-0 top-0"></div>

        {/* Text content with padding to account for the line */}
        <div className="">
          <span className="text-gray-500 text-sm font-normal">Hola:</span>
          <h1 className="text-gray-800 text-xl font-semibold">Paisanx</h1>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
          <Search className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
          <Bell className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
