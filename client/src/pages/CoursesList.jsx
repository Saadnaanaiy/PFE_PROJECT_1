import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';
import moroccanPattern from '../assets/moroccan-pattern.svg';

const CoursesList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Mock data - would come from API in real app
  const courses = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Mohammed Bennani',
      price: 199,
      originalPrice: 899,
      rating: 4.8,
      reviewsCount: 320,
      studentsCount: 5430,
      image:
        'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Development',
    },
    {
      id: '2',
      title: 'Arabic Calligraphy Masterclass',
      instructor: 'Fatima Zahra',
      price: 149,
      originalPrice: 499,
      rating: 4.9,
      reviewsCount: 187,
      studentsCount: 2340,
      image:
        'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Arts',
    },
    {
      id: '3',
      title: 'Moroccan Cuisine: From Tagine to Couscous',
      instructor: 'Chef Karim Alaoui',
      price: 129,
      originalPrice: 299,
      rating: 4.7,
      reviewsCount: 256,
      studentsCount: 3120,
      image:
        'https://images.pexels.com/photos/7437656/pexels-photo-7437656.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Cooking',
    },
    {
      id: '4',
      title: 'Darija for Beginners: Moroccan Arabic',
      instructor: 'Leila Amrani',
      price: 89,
      originalPrice: 199,
      rating: 4.6,
      reviewsCount: 145,
      studentsCount: 1870,
      image:
        'https://images.pexels.com/photos/6150432/pexels-photo-6150432.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Languages',
    },
    {
      id: '5',
      title: 'Modern Digital Marketing for Businesses',
      instructor: 'Hassan Benjelloun',
      price: 179,
      originalPrice: 599,
      rating: 4.7,
      reviewsCount: 210,
      studentsCount: 2750,
      image:
        'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Marketing',
    },
    {
      id: '6',
      title: 'Introduction to Data Science and AI',
      instructor: 'Dr. Amina Tazi',
      price: 229,
      originalPrice: 799,
      rating: 4.8,
      reviewsCount: 189,
      studentsCount: 2160,
      image:
        'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Data Science',
    },
  ];

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                  <select className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">All Categories</option>
                    <option value="development">Development</option>
                    <option value="business">Business</option>
                    <option value="arts">Arts</option>
                    <option value="cooking">Cooking</option>
                    <option value="languages">Languages</option>
                    <option value="marketing">Marketing</option>
                    <option value="data-science">Data Science</option>
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price
                  </label>
                  <select className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  <select className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent">
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
                  <select className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent">
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
            Showing{' '}
            <span className="font-medium">{filteredCourses.length}</span>{' '}
            results
          </p>
        </div>

        {/* Courses Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {course.title}
                      </h3>
                      <p className="text-neutral-600 mb-1">
                        By {course.instructor}
                      </p>
                      <div className="flex items-center text-sm text-neutral-500 mb-4">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-medium mr-1">
                          {course.rating}
                        </span>
                        <span className="mr-3">
                          ({course.reviewsCount} reviews)
                        </span>
                        <span>{course.studentsCount} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">
                        {course.price} MAD
                      </div>
                      <div className="text-sm line-through text-neutral-500">
                        {course.originalPrice} MAD
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {course.category}
                    </span>
                    <Link
                      to={`/course/${course.id}`}
                      className="btn-primary px-4 py-2"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterOpen(false);
              }}
              className="btn-primary px-6 py-2"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
