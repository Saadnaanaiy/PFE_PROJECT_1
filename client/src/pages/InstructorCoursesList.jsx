import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiTag,
  FiBook,
  FiCode,
  FiMusic,
  FiCamera,
  FiDollarSign,
  FiGlobe,
  FiHeart,
  FiTrendingUp,
  FiLayers,
  FiCpu,
  FiBriefcase,
  FiAward,
} from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';

const InstructorCoursesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tempSelectedCategory, setTempSelectedCategory] = useState('');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Icons array to use for categories - will be assigned based on category ID
  const categoryIcons = [
    FiBook, // General education
    FiCode, // Programming
    FiMusic, // Music
    FiCamera, // Photography
    FiDollarSign, // Finance
    FiGlobe, // Languages
    FiHeart, // Health & Fitness
    FiTrendingUp, // Business
    FiLayers, // Design
    FiCpu, // Technology
    FiBriefcase, // Career Development
    FiAward, // Self Improvement
  ];

  // Function to get an icon based on category ID
  const getCategoryIcon = (categoryId) => {
    // Use modulo operation to cycle through available icons if we have more categories than icons
    const iconIndex = (categoryId - 1) % categoryIcons.length;
    return categoryIcons[iconIndex] || FiTag; // Fallback to FiTag if something goes wrong
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch courses and categories in parallel
        const [coursesResponse, categoriesResponse] = await Promise.all([
          axios.get('/api/instructor/courses'),
          axios.get('/api/instructor/categories'),
        ]);

        // Transform courses data
        const formattedCourses = coursesResponse.data.courses.map((course) => ({
          id: course.id,
          title: course.titre,
          description: course.description,
          price: course.prix,
          level: course.niveau,
          category: course.categorie?.nom || 'Uncategorized',
          categoryId: course.categorie_id,
          image: course.image ? `${course.image}` : '/default-course.jpg',
          duration: course.dureeMinutes,
          progress: course.progress,
          students: course.etudiants_count || 0,
          createdAt: new Date(course.dateCreation),
        }));

        setCourses(formattedCourses);
        setCategories(categoriesResponse.data.categories);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle navigation to course edit page
  const handleCourseClick = (courseId) => {
    navigate(`/instructor/courses/${courseId}/edit`);
  };

  // Function to create a new course
  const handleCreateCourse = () => {
    navigate('/instructor/courses/create');
  };

  // Function to view category details
  const handleCategoryClick = (categoryId) => {
    navigate(`/instructor/categories/${categoryId}`);
  };

  // Toggle category filter dropdown
  const toggleCategoryFilter = () => {
    // Reset temp category to the current selection when opening
    if (!showCategoryFilter) {
      setTempSelectedCategory(selectedCategory);
    }
    setShowCategoryFilter(!showCategoryFilter);
  };

  // Apply filter button handler
  const handleApplyFilter = () => {
    setSelectedCategory(tempSelectedCategory);
    setShowCategoryFilter(false);
  };

  // Clear filter handler
  const handleClearFilter = () => {
    setTempSelectedCategory('');
  };

  // Function to filter courses based on search term and selected category
  const getFilteredCourses = () => {
    return courses.filter((course) => {
      const matchSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === '' ||
        course.categoryId === parseInt(selectedCategory, 10);

      return matchSearch && matchCategory;
    });
  };

  const filteredCourses = getFilteredCourses();

  // Featured courses (top 4 based on students)
  const featuredCourses = [...courses]
    .sort((a, b) => b.students - a.students)
    .slice(0, 4);

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
          <h1 className="heading-lg mb-4">Manage Your Courses</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Create, edit, and manage your course content. Track student
            engagement and monitor course performance.
          </p>
        </motion.div>

        {/* Tabs for Courses and Categories */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-lg border border-neutral-200 bg-white shadow-sm">
            <Link
              to="/instructor/courses"
              className="px-6 py-3 font-medium text-primary border-b-2 border-primary rounded-l-lg"
            >
              Courses
            </Link>
            <Link
              to="/instructor/categories"
              className="px-6 py-3 font-medium text-neutral-600 hover:text-primary rounded-r-lg"
            >
              Categories
            </Link>
          </div>
        </div>

        {/* Search, Filter, and Add Course */}
        <div className="mb-12 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search courses by title or category..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            />
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 text-xl" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={toggleCategoryFilter}
              className="btn-secondary flex items-center justify-center gap-2 px-6 py-4 rounded-xl shadow-sm"
            >
              <FiFilter className="text-lg" />
              Filter
              {selectedCategory && (
                <span className="ml-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  1
                </span>
              )}
            </button>

            {showCategoryFilter && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg z-50 border border-neutral-200">
                <div className="p-4">
                  <h4 className="font-medium mb-2">Filter by Category</h4>
                  <select
                    value={tempSelectedCategory}
                    onChange={(e) => setTempSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-neutral-300 rounded-lg mb-3"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nom}
                      </option>
                    ))}
                  </select>
                  <div className="flex justify-between">
                    <button
                      onClick={handleClearFilter}
                      className="text-neutral-600 text-sm hover:text-primary"
                    >
                      Clear Filter
                    </button>
                    <button
                      onClick={handleApplyFilter}
                      className="text-primary text-sm font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleCreateCourse}
            className="btn-primary flex items-center justify-center gap-2 px-6 py-4 whitespace-nowrap rounded-xl shadow-sm"
          >
            <FiPlus className="text-lg" />
            Create Course
          </button>
        </div>

        {/* Loading/Error States */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-card">
            <h3 className="text-xl font-medium mb-2 text-red-600">Error</h3>
            <p className="text-neutral-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-2"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Categories Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-16"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-heading font-bold">Categories</h2>
                {/* "Add Category" button removed as requested */}
              </div>

              {categories.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((category) => {
                    // Get the icon component based on category ID
                    const IconComponent = getCategoryIcon(category.id);

                    return (
                      <div
                        key={category.id}
                        className="bg-white p-6 rounded-xl shadow-card hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center group"
                        onClick={() => {
                          setSelectedCategory(category.id.toString());
                          window.scrollTo({
                            top:
                              document.getElementById('all-courses').offsetTop -
                              100,
                            behavior: 'smooth',
                          });
                        }}
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <IconComponent className="text-primary text-xl" />
                        </div>
                        <h3 className="font-heading font-semibold mb-1 group-hover:text-primary transition-colors">
                          {category.nom}
                        </h3>
                        <p className="text-sm text-neutral-500 line-clamp-2">
                          {category.description || 'No description'}
                        </p>
                        <div className="mt-2 text-xs text-primary font-medium">
                          {
                            courses.filter(
                              (course) => course.categoryId === category.id,
                            ).length
                          }{' '}
                          Courses
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-xl shadow-card">
                  <h3 className="text-lg font-medium mb-2">
                    No categories found
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    No categories are available for your courses
                  </p>
                </div>
              )}
            </motion.div>

            {/* Featured Courses */}
            {featuredCourses.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-heading font-bold mb-8 text-center">
                  Top Performing Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                      onClick={() => handleCourseClick(course.id)}
                    >
                      <div className="h-56 overflow-hidden">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-heading text-lg font-semibold group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <span className="text-primary font-medium">
                            ${course.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-primary text-sm mb-3">
                          {course.category}
                        </p>
                        <div className="mb-3">
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-neutral-500">
                            <span>{course.progress}% complete</span>
                            <span>
                              {course.progress === 100 ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-neutral-600">
                          <span>
                            {Math.floor(course.duration / 60)}h{' '}
                            {course.duration % 60}m
                          </span>
                          <span>
                            {course.students.toLocaleString()} Students
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* All Courses */}
            <div id="all-courses" className="mb-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-heading font-bold">All Courses</h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="flex items-center text-sm text-primary"
                  >
                    <span>Clear Filter</span>
                    <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-1">
                      {categories.find(
                        (c) => c.id.toString() === selectedCategory,
                      )?.nom || 'Category'}
                    </span>
                  </button>
                )}
              </div>

              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                    >
                      <div
                        className="flex bg-white rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all group cursor-pointer"
                        onClick={() => handleCourseClick(course.id)}
                      >
                        <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4 sm:p-6 flex flex-col justify-center flex-grow">
                          <div className="flex justify-between items-start">
                            <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                            <span className="text-primary font-medium">
                              ${course.price.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-primary text-sm mb-2">
                            {course.category} • {course.level}
                          </p>
                          <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="mb-2">
                            <div className="w-full bg-neutral-200 rounded-full h-1.5">
                              <div
                                className="bg-primary h-1.5 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-neutral-500">
                              <span>{course.progress}% complete</span>
                              <span>
                                {course.progress === 100
                                  ? 'Published'
                                  : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600">
                            <span>
                              {Math.floor(course.duration / 60)}h{' '}
                              {course.duration % 60}m
                            </span>
                            <span>
                              {course.students.toLocaleString()} Students
                            </span>
                            <span>
                              Created {course.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-card">
                  <h3 className="text-xl font-medium mb-2">No courses found</h3>
                  <p className="text-neutral-600 mb-6">
                    Try adjusting your search terms or create a new course
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="btn-secondary px-6 py-2 mr-4"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={handleCreateCourse}
                    className="btn-primary px-6 py-2"
                  >
                    Create Course
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Course Creation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-primary/5 p-8 rounded-xl shadow-card text-center relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url(${moroccanPattern})`,
              backgroundSize: '120px',
              backgroundRepeat: 'repeat',
            }}
          ></div>
          <div className="relative z-10">
            <h3 className="font-heading text-xl font-semibold mb-4">
              Ready to Create Amazing Content?
            </h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Share your knowledge and expertise with students worldwide. Our
              platform provides all the tools you need to create engaging and
              effective courses.
            </p>
            <button
              onClick={handleCreateCourse}
              className="btn-primary px-8 py-3"
            >
              Start Creating
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorCoursesList;
