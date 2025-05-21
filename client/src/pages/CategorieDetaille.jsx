import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FiClock as ClockIcon,
  FiUser as UserCircleIcon,
  FiShoppingCart as ShoppingCartIcon,
  FiBookOpen as BookIcon,
  FiAward as AwardIcon,
  FiArrowLeft as ArrowLeftIcon,
  FiSearch as SearchIcon,
} from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';

const CategorieDetaille = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const catRes = await axios.get(`/api/categories/${id}`);
        setCategory(catRes.data);
        setCourses(catRes.data.cours || []); // Use the 'cours' data from the response
        setFilteredCourses(catRes.data.cours || []); // Initialize with all courses
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load category');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Search function
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();

    const filtered = courses.filter(
      (course) =>
        course.titre.toLowerCase().includes(query) ||
        course.instructeur_info?.nom?.toLowerCase().includes(query),
    );

    setFilteredCourses(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">
            Loading category details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-heading font-bold mb-3">Oops!</h2>
          <p className="text-neutral-600 mb-6">
            {error || 'Category not found.'}
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn-primary px-6 py-2 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 relative">
      <div
        className="absolute top-0 left-0 w-full h-72 overflow-hidden z-0"
        style={{
          backgroundImage: `url(${moroccanPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
        }}
      />
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-b from-primary/15 to-transparent z-0" />

      <div className="container-custom relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-neutral-600 hover:text-primary transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span>Back to Categories</span>
          </button>
        </motion.div>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-center">
            <h1 className="heading-lg mb-4">{category.nom}</h1>
            <p className="text-neutral-600 max-w-2xl mx-auto mb-4 leading-relaxed">
              {category.description}
            </p>

            <div className="flex items-center justify-center gap-4">
              <span className="bg-primary/10 text-primary px-4 py-2 rounded-full flex items-center">
                <BookIcon className="w-4 h-4 mr-2" />
                <span>{filteredCourses.length} courses</span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center justify-center gap-4"
        >
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full py-3 pl-10 pr-4 rounded-lg border border-neutral-300 focus:ring-primary focus:ring-2 focus:outline-none"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <div className="absolute top-3 left-3">
              <SearchIcon className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-2xl font-heading font-bold mb-6"
          >
            Courses in this category
          </motion.h2>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 h-full transform hover:-translate-y-1"
                  >
                    {/* Hero Banner */}
                    <div className="relative h-48">
                      <img
                        src={course.image || '/placeholder-course.jpg'}
                        alt={course.titre}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded">
                        {category.nom}
                      </div>
                      
                    </div>

                    {/* Info Section */}
                    <div className="p-5 space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {course.titre}
                      </h3>

                      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-3">
                        <div className="flex items-center">
                          {course.instructeur_info?.image ? (
                            <img
                              src={course.instructeur_info.image}
                              alt={course.instructeur.nom}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <UserCircleIcon className="w-5 h-5 text-gray-500 mr-1" />
                          )}
                          <span>{course.instructeur.nom}</span>
                        </div>

                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>
                            {(course.dureeMinutes / 60).toFixed(1)} hours
                          </span>
                        </div>

                        {course.niveau && (
                          <div className="flex items-center">
                            <AwardIcon className="w-4 h-4 mr-1 text-blue-600" />
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                              {course.niveau}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-semibold text-primary">
                          {course.prix > 0
                            ? new Intl.NumberFormat('fr-MA', {
                                style: 'currency',
                                currency: 'MAD',
                              }).format(course.prix)
                            : 'Free'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-card text-center"
            >
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-neutral-600 mb-6">
                No courses matching your search.
              </p>
            </motion.div>
          )}
        </div>

        {/* Browse other categories CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-card text-center"
        >
          <h3 className="font-heading text-xl font-semibold mb-4">
            Browse other categories
          </h3>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="btn-primary px-8 py-3"
            >
              View All Categories
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CategorieDetaille;
