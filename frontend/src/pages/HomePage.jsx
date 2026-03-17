import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Book, PenTool, Monitor, Award, Star, Truck, ShieldCheck, Clock } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-[#fafaf9]">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-stone-100/50" />
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative">
          <div className="text-center max-w-4xl mx-auto">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-tight">
              Your Most Trusted <br className="hidden md:block" />
              <span className="text-rose-600">E-Commerce Store</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
              Find everything you need from school textbooks to college materials, competitive exam guides, and premium stationery. Everything in one place.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/books" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-sm text-white bg-rose-600 hover:bg-rose-700 transition hover:shadow-md">
                Browse Catalog
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
              <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 border-2 border-stone-200 text-base font-semibold rounded-lg text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-300 transition">
                Visit Our Store
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-stone-50">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-stone-900">Shop by Category</h2>
            <p className="mt-4 text-stone-500">Discover our wide range of products tailored for your needs.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'School Books', icon: Book, color: 'bg-blue-100 text-blue-600' },
              { name: 'College Books', icon: Book, color: 'bg-indigo-100 text-indigo-600' },
              { name: 'Competitive Exams', icon: Award, color: 'bg-amber-100 text-amber-600' },
              { name: 'Stationery Items', icon: PenTool, color: 'bg-emerald-100 text-emerald-600' }
            ].map((category, idx) => {
              const Icon = category.icon;
              return (
                <Link key={idx} to={`/books?category=${category.name}`} className="group flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-stone-100">
                  <div className={`p-4 rounded-full ${category.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 font-semibold text-stone-900 text-center">{category.name}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-stone-900">Featured Books</h2>
              <p className="mt-2 text-stone-500">Handpicked selections for you.</p>
            </div>
            <Link to="/books" className="text-rose-600 font-medium hover:text-rose-700 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dummy Featured Books */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-56 bg-stone-100 p-6 flex justify-center items-center">
                  <Book className="h-20 w-20 text-stone-300" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base text-stone-900 line-clamp-2">Example Book Title {item}</h3>
                  </div>
                  <p className="text-sm text-stone-500 mt-1">Author Name</p>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-lg text-stone-900">₹299</span>
                    <button className="bg-rose-50 text-rose-600 px-4 py-2 text-sm rounded-lg font-medium hover:bg-rose-600 hover:text-white transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Highlights */}
      <section className="py-16 bg-white border-y border-stone-100">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">100% Genuine</h3>
              <p className="mt-2 text-sm text-stone-500">All books are directly from authorized publishers.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Store Pickup</h3>
              <p className="mt-2 text-sm text-stone-500">Order online and pickup right at our local store.</p>
            </div>
            <div className="p-6">
              <div className="mx-auto w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Trusted Locally</h3>
              <p className="mt-2 text-sm text-stone-500">Rated among the best stores in the area by students.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
