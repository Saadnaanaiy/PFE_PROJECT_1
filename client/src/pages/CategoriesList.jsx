import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaBook, FaChalkboardTeacher, FaLaptopCode, FaFlask } from 'react-icons/fa'; // Example icons
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Array of icons to choose from
  const icons = [FaBook, FaChalkboardTeacher, FaLaptopCode, FaFlask];

  // Array of vibrant Moroccan-inspired colors
  const colors = [
    '#e63946', // Red
    '#f1faee', // Off-white
    '#a8dadc', // Light blue
    '#457b9d', // Blue
    '#1d3557', // Dark blue
    '#f1c40f', // Yellow
    '#2ecc71', // Green
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/categories');

        setCategories(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch categories');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-card max-w-md">
          <div className="text-3xl mb-4">😕</div>
          <h2 className="text-xl font-heading font-bold mb-2">
            Something went wrong
          </h2>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 relative">
      {/* Decorative background elements */}
      <div
        className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0"
        style={{
          backgroundImage: `url(${moroccanPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>

      <div className="container-custom relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="heading-lg mb-4">Course Categories</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Browse our diverse range of course categories and find the perfect
            learning path to enhance your skills and knowledge.
          </p>
        </motion.div>

        {/* Featured Categories */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category) => {
                // Select a random icon and color
                const RandomIcon = icons[Math.floor(Math.random() * icons.length)];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                return (
                  <Link
                    key={category.id}
                    to={`/categories/${category.id}`}
                    className="group relative block aspect-square overflow-hidden rounded-xl shadow-card transition-all hover:shadow-lg"
                  >
                    <div className="absolute inset-0">
                      <img
                        src={category.image || '/placeholder-category.jpg'}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <div className="mb-2 text-4xl" style={{ color: 'white' }}>
                        <RandomIcon /> {/* Render the randomly selected icon with the random color */}
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-white mb-1">
                        {category.nom}
                      </h3>
                      <p className="text-white text-sm mb-1">
                        {category.description || 'Explore this category'}
                      </p>
                      <p className="text-white/80 text-xs">
                        {category.cours_count || 0} courses
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* All Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">
            All Categories
          </h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, index) => {
                // Select a random icon and color
                const RandomIcon = icons[Math.floor(Math.random() * icons.length)];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={`/categories/${category.id}`}
                      className="flex bg-white rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                        <img
                          src={category.image || '/placeholder-category.jpg'}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 sm:p-6 flex flex-col justify-center">
                        <h3 className="font-heading font-semibold text-lg mb-1">
                          {category.nom}
                        </h3>
                        <p className="text-neutral-500 text-sm mb-2">
                          {category.cours_count || 0} courses
                        </p>
                        <div className="text-2xl text-gray">
                          <RandomIcon /> {/* Render the randomly selected icon with the random color */}
                        </div>
                        <p className="text-neutral-600 text-sm hidden sm:block">
                          {category.description ||
                            'Explore courses in this category.'}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-card text-center">
              <p className="text-neutral-600">No categories found.</p>
            </div>
          )}
        </div>

        {/* Browse All Courses CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-card text-center"
        >
          <h3 className="font-heading text-xl font-semibold mb-4">
            Not sure where to start?
          </h3>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Browse all of our courses and find the perfect match for your
            learning goals and interests.
          </p>
          <Link to="/courses" className="btn-primary px-8 py-3">
            Explore All Courses
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoriesList;
