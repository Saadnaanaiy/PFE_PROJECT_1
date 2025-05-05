import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiClock } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';

const getLevelColor = (niveau) => {
  switch (niveau?.toLowerCase()) {
    case 'débutant':
      return 'bg-green-100 text-green-800';
    case 'intermédiaire':
      return 'bg-blue-100 text-blue-800';
    case 'avancé':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const fixImagePath = (imagePath) => {
  const storagePrefix = 'http://localhost:8000/storage/';
  if (imagePath && imagePath.includes(storagePrefix + storagePrefix)) {
    return imagePath.replace(storagePrefix + storagePrefix, storagePrefix);
  }
  return imagePath;
};

const CoursesList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedSort, setSelectedSort] = useState('popular');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [coursesRes, categoriesRes] = await Promise.all([
          axios.get('/api/courses'),
          axios.get('/api/categories'),
        ]);
        const coursesData = coursesRes.data.data.data.map((course) => {
          return {
            ...course,
            dureeHeures: (course.dureeMinutes / 60).toFixed(1),
          };
        });
        setCourses(coursesData);
        setCategories(categoriesRes.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on all criteria
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructeur?.user?.nom
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      course.categorie?.nom.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !selectedCategory || course.categorie_id === parseInt(selectedCategory);

    let matchesPrice = true;
    if (selectedPrice) {
      switch (selectedPrice) {
        case 'free':
          matchesPrice = course.prix === 0;
          break;
        case 'paid':
          matchesPrice = course.prix > 0;
          break;
        case 'under-100':
          matchesPrice = course.prix < 100;
          break;
        case '100-200':
          matchesPrice = course.prix >= 100 && course.prix <= 200;
          break;
        case 'over-200':
          matchesPrice = course.prix > 200;
          break;
        default:
          break;
      }
    }

    const matchesRating =
      !selectedRating || course.rating >= parseFloat(selectedRating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  // Sort courses based on selected sort option
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (selectedSort) {
      case 'newest':
        return new Date(b.dateCreation) - new Date(a.dateCreation);
      case 'price-low':
        return a.prix - b.prix;
      case 'price-high':
        return b.prix - a.prix;
      case 'rating':
        return b.rating - a.rating;
      default: // 'popular'
        return b.etudiants_count - a.etudiants_count;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="heading-lg mb-4">Explore Our Courses</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover a wide range of courses taught by expert instructors,
            designed to help you develop new skills and achieve your goals.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-card p-4">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              {/* Search */}
              <div className="w-full lg:w-1/3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-neutral-300 lg:ml-auto"
              >
                <FiFilter className="text-neutral-500" />
                <span>Filters</span>
              </button>

              {/* View Toggle */}
              <div className="flex border border-neutral-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${
                    viewMode === 'grid'
                      ? 'bg-primary text-white'
                      : 'bg-white text-neutral-500'
                  }`}
                >
                  <FiGrid />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-white text-neutral-500'
                  }`}
                >
                  <FiList />
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {filterOpen && (
              <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    <option value="">All Prices</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="under-100">Under 100 MAD</option>
                    <option value="100-200">100 - 200 MAD</option>
                    <option value="over-200">Over 200 MAD</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Rating
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                  >
                    <option value="">All Ratings</option>
                    <option value="4.5">4.5 & Up</option>
                    <option value="4.0">4.0 & Up</option>
                    <option value="3.5">3.5 & Up</option>
                    <option value="3.0">3.0 & Up</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort By
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-neutral-600">
            Showing <span className="font-medium">{sortedCourses.length}</span>{' '}
            results
          </p>
        </div>

        {/* Courses Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <img
                    src={fixImagePath(course.image)}
                    alt={course.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {course.titre}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        {course.instructeur?.image ? (
                          <img
                            src={fixImagePath(course.instructeur.image)}
                            alt={course.instructeur.user?.nom}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-medium">
                              {course.instructeur?.user?.nom?.charAt(0) || 'I'}
                            </span>
                          </div>
                        )}
                        <p className="text-neutral-600">
                          By {course.instructeur?.user?.nom}
                        </p>
                      </div>
                      <div className="flex items-center text-sm text-neutral-500 mb-4">
                        <span>{course.etudiants_count} students</span>
                        <span className="mx-1.5 text-neutral-300">•</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                            course.niveau,
                          )}`}
                        >
                          {course.niveau}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-neutral-400" />
                        <p className="text-neutral-500">
                          {course.dureeHeures} hours
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="text-xl font-semibold text-primary">
                        {course.prix === 0 ? 'Free' : `${course.prix} MAD`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
