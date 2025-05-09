import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link is imported but not used in the provided snippet. Remove if not needed elsewhere.
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiGrid, FiList, FiClock } from 'react-icons/fi';
import CourseCard from '../components/CourseCard'; // Assuming CourseCard is correctly implemented
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
  if (imagePath && imagePath.startsWith(storagePrefix + storagePrefix)) {
    return imagePath.replace(storagePrefix + storagePrefix, storagePrefix);
  }
  // Ensure it returns a valid path or an empty string if path is problematic
  if (imagePath && imagePath.startsWith('storage/')) {
    return `http://localhost:8000/${imagePath}`;
  }
  if (imagePath && !imagePath.startsWith('http')) {
    // Assuming it might be a relative path that needs the prefix
    return `${storagePrefix.replace('/storage/', '')}/${
      imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
    }`;
  }
  return imagePath || ''; // Return empty string if imagePath is null/undefined
};

const CoursesList = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllCourses, setShowAllCourses] = useState(false);

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

        // console.log('Raw Courses Response:', coursesRes.data);
        // console.log('Raw Categories Response:', categoriesRes.data);

        // Defensive check for data structure, adjust if API differs
        const rawCourses =
          coursesRes.data?.data?.data ||
          coursesRes.data?.data ||
          coursesRes.data ||
          [];
        if (!Array.isArray(rawCourses)) {
          console.error('Courses data is not an array:', rawCourses);
          throw new Error('Unexpected format for courses data.');
        }

        const coursesData = rawCourses.map((course) => {
          const dureeMinutesNum = parseFloat(course.dureeMinutes);
          const parsedPrix = parseFloat(course.prix);
          const parsedRating = parseFloat(course.rating);
          const parsedStudents = parseInt(course.etudiants_count, 10);

          return {
            ...course,
            titre: course.titre || '', // Ensure titre is a string
            dureeHeures:
              !isNaN(dureeMinutesNum) && dureeMinutesNum >= 0
                ? (dureeMinutesNum / 60).toFixed(1)
                : 'N/A',
            etudiants_count: !isNaN(parsedStudents) ? parsedStudents : 0,
            rating: !isNaN(parsedRating) ? parsedRating : 0,
            prix: parsedPrix, // Parsed to number or NaN. Filter/sort will handle NaN.
            dateCreation: course.dateCreation, // Keep as is for now, sort function will handle
            niveau: course.niveau || 'Inconnu', // Default for getLevelColor
            // Ensure instructor and category objects are at least empty objects if null/undefined, to prevent errors on access
            // instructeur: course.instructeur || {}, // Optional: Or handle with ?. in JSX
            // categorie: course.categorie || {}, // Optional: Or handle with ?. in JSX
          };
        });
        setCourses(coursesData);

        const rawCategories =
          categoriesRes.data?.data || categoriesRes.data || [];
        if (!Array.isArray(rawCategories)) {
          console.error('Categories data is not an array:', rawCategories);
          setCategories([]); // Set to empty array if format is wrong
        } else {
          setCategories(rawCategories);
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter courses based on all criteria
  const filteredCourses = courses.filter((course) => {
    const searchTermLower = searchTerm.toLowerCase();

    // Search matching (robust against null/undefined)
    const titleMatches = (course.titre || '')
      .toLowerCase()
      .includes(searchTermLower);
    const instructorNameMatches = (course.instructeur?.user?.nom || '')
      .toLowerCase()
      .includes(searchTermLower);
    const categoryNameMatches = (course.categorie?.nom || '')
      .toLowerCase()
      .includes(searchTermLower);
    const matchesSearch =
      titleMatches || instructorNameMatches || categoryNameMatches;

    // Category matching
    const matchesCategory =
      !selectedCategory ||
      (course.categorie_id !== null &&
        course.categorie_id !== undefined &&
        course.categorie_id.toString() === selectedCategory);
    // Assuming selectedCategory is string ID from <select> and course.categorie_id can be number or string

    // Price matching
    let matchesPrice = true;
    if (selectedPrice) {
      if (isNaN(course.prix)) {
        // Check if course.prix became NaN after parseFloat
        matchesPrice = false; // A non-numeric price shouldn't match specific price filters
      } else {
        // course.prix is a valid number here
        switch (selectedPrice) {
          case 'free':
            matchesPrice = course.prix === 0;
            break;
          case 'paid':
            matchesPrice = course.prix > 0;
            break;
          case 'under-100':
            matchesPrice = course.prix < 100; // Includes 0 (free)
            break;
          case '100-200':
            matchesPrice = course.prix >= 100 && course.prix <= 200;
            break;
          case 'over-200':
            matchesPrice = course.prix > 200;
            break;
          default:
            // If selectedPrice has an unexpected value, treat as no filter or no match
            matchesPrice = true; // Or false, based on desired strictness
            break;
        }
      }
    }

    // Rating matching (course.rating is guaranteed to be a number due to mapping)
    const matchesRating =
      !selectedRating || course.rating >= parseFloat(selectedRating);

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  // Sort courses based on selected sort option
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (selectedSort) {
      case 'newest':
        const dateA = a.dateCreation ? new Date(a.dateCreation).getTime() : 0;
        const dateB = b.dateCreation ? new Date(b.dateCreation).getTime() : 0;
        // Handle potential Invalid Date (results in NaN for getTime())
        if (isNaN(dateA) && isNaN(dateB)) return 0;
        if (isNaN(dateA)) return 1; // Push items with invalid dates to the end
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
      case 'price-low':
        // Handle NaN prices: push them to the end for low-to-high
        const priceALow = isNaN(a.prix) ? Number.POSITIVE_INFINITY : a.prix;
        const priceBLow = isNaN(b.prix) ? Number.POSITIVE_INFINITY : b.prix;
        return priceALow - priceBLow;
      case 'price-high':
        // Handle NaN prices: push them to the end (treat as lowest) for high-to-low
        const priceAHigh = isNaN(a.prix) ? Number.NEGATIVE_INFINITY : a.prix;
        const priceBHigh = isNaN(b.prix) ? Number.NEGATIVE_INFINITY : b.prix;
        return priceBHigh - priceAHigh;
      case 'rating':
        // course.rating is already normalized to a number (0 if invalid)
        return b.rating - a.rating;
      default: // 'popular'
        // course.etudiants_count is already normalized to a number
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
            onClick={() => {
              // Reset error and try fetching again
              setError(null);
              // Re-trigger useEffect by changing a dependency or calling a reload function
              // For simplicity, window.location.reload() is used here as in original.
              // A more React-idiomatic way would be to have a function that calls fetchData.
              window.location.reload();
            }}
            className="btn-primary px-6 py-2" // Ensure btn-primary class is defined in your global styles
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
        {' '}
        {/* Ensure container-custom is defined */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="heading-lg mb-4">Explore Our Courses</h1>{' '}
          {/* Ensure heading-lg is defined */}
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Discover a wide range of courses taught by expert instructors,
            designed to help you develop new skills and achieve your goals.
          </p>
        </motion.div>
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-card p-4">
            {' '}
            {/* Ensure shadow-card is defined */}
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
                      ? 'bg-primary text-white' // Ensure primary color is defined
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
              <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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



                {/* Rating Filter */}


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
                    
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-neutral-600">
            Showing <span className="font-medium">{showAllCourses ? sortedCourses.length : Math.min(3, sortedCourses.length)}</span>{' '}
            {showAllCourses ? 'of ' : ''}<span className="font-medium">{showAllCourses ? sortedCourses.length : ''}</span>{' '}
            results
          </p>
          {sortedCourses.length > 3 && (
            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {showAllCourses ? 'Show Less' : 'View All'}
            </button>
          )}
        </div>
        {/* Courses Grid/List */}
        {sortedCourses.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-500">
              No courses match your criteria.
            </p>
            <p className="text-neutral-400 mt-2">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(showAllCourses ? sortedCourses : sortedCourses.slice(0, 3)).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {(showAllCourses ? sortedCourses : sortedCourses.slice(0, 3)).map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-card overflow-hidden flex flex-col md:flex-row transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <img
                    src={fixImagePath(course.image)}
                    alt={course.titre || 'Course image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display =
                        'none'; /* Optionally hide or set a fallback image container */
                    }}
                  />
                  {!fixImagePath(course.image) && ( // Fallback if image is empty or fails
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                      {/* Assuming CourseCard or similar would link to course details */}
                      {/* <Link to={`/courses/${course.slug || course.id}`}> */}
                      {course.titre}
                      {/* </Link> */}
                    </h3>
                    <div className="flex items-center gap-2 mb-1">
                      {course.instructeur?.image ? (
                        <img
                          src={fixImagePath(course.instructeur.image)}
                          alt={course.instructeur.user?.nom || 'Instructor'}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {(course.instructeur?.user?.nom || 'I')
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                      <p className="text-neutral-600 text-sm">
                        By{' '}
                        {course.instructeur?.user?.nom || 'Unknown Instructor'}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-neutral-500 mb-4 gap-2 flex-wrap">
                      <span>{course.etudiants_count} students</span>
                      <span className="text-neutral-300 hidden sm:inline">
                        •
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                          course.niveau,
                        )}`}
                      >
                        {course.niveau}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <FiClock className="text-neutral-400" />
                      <p>
                        {course.dureeHeures !== 'N/A'
                          ? `${course.dureeHeures} hours`
                          : 'Duration not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end mt-4 md:mt-0">
                    <div className="text-xl font-semibold text-primary mb-2">
                      {isNaN(course.prix)
                        ? 'N/A'
                        : course.prix === 0
                        ? 'Free'
                        : `${course.prix.toFixed(2)} MAD`}
                    </div>
                    {/* Example: Link to course details
                     <Link to={`/courses/${course.slug || course.id}`} className="btn-secondary text-sm px-4 py-2">
                       View Details
                     </Link>
                     */}
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
