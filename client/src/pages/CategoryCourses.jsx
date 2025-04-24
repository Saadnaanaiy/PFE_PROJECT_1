import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';
import moroccanPattern from '../assets/moroccan-pattern.svg';

const CategoryCourses = () => {
  const { categoryId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState(null);

  // Mock data - would come from API in real app
  const categoriesData = {
    development: {
      id: 'development',
      name: 'Web & Mobile Development',
      description:
        'Learn to code websites, mobile apps, and software with expert instructors and comprehensive curriculum. Master languages like JavaScript, Python, React, and more.',
      icon: '💻',
      image:
        'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    'data-science': {
      id: 'data-science',
      name: 'Data Science & AI',
      description:
        'Explore the world of data analysis, machine learning, and artificial intelligence with our hands-on courses designed for all skill levels.',
      icon: '📊',
      image:
        'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    business: {
      id: 'business',
      name: 'Business & Entrepreneurship',
      description:
        'Develop essential business skills, learn management techniques, and build your entrepreneurial mindset with our practical business courses.',
      icon: '💼',
      image:
        'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    arts: {
      id: 'arts',
      name: 'Arts & Crafts',
      description:
        'Express your creativity through traditional and modern art forms, including Moroccan calligraphy, painting, and crafts.',
      icon: '🎨',
      image:
        'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    cooking: {
      id: 'cooking',
      name: 'Cooking & Cuisine',
      description:
        'Master the art of Moroccan cooking and international cuisines with step-by-step recipes and expert culinary techniques.',
      icon: '🍲',
      image:
        'https://images.pexels.com/photos/7437656/pexels-photo-7437656.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    languages: {
      id: 'languages',
      name: 'Languages',
      description:
        'Learn Arabic, Darija, French, English and other languages with our immersive and practical language courses.',
      icon: '🗣️',
      image:
        'https://images.pexels.com/photos/6150432/pexels-photo-6150432.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    marketing: {
      id: 'marketing',
      name: 'Marketing & Communications',
      description:
        'Develop your marketing skills with courses on digital marketing, social media, SEO, and effective communication strategies.',
      icon: '📱',
      image:
        'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    'personal-development': {
      id: 'personal-development',
      name: 'Personal Development',
      description:
        'Grow personally and professionally with courses on productivity, leadership, communication, and other essential life skills.',
      icon: '🌱',
      image:
        'https://images.pexels.com/photos/4064432/pexels-photo-4064432.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  };

  const allCourses = [
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
      category: 'development',
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      instructor: 'Ahmed Hassan',
      price: 129,
      originalPrice: 399,
      rating: 4.7,
      reviewsCount: 215,
      studentsCount: 3820,
      image:
        'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'development',
    },
    {
      id: '3',
      title: 'React.js for Beginners',
      instructor: 'Samira Ouahbi',
      price: 149,
      originalPrice: 499,
      rating: 4.9,
      reviewsCount: 178,
      studentsCount: 2950,
      image:
        'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'development',
    },
    {
      id: '4',
      title: 'Introduction to Data Science',
      instructor: 'Dr. Amina Tazi',
      price: 179,
      originalPrice: 599,
      rating: 4.8,
      reviewsCount: 189,
      studentsCount: 2160,
      image:
        'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'data-science',
    },
    {
      id: '5',
      title: 'Machine Learning Essentials',
      instructor: 'Karim El Mansouri',
      price: 199,
      originalPrice: 699,
      rating: 4.7,
      reviewsCount: 165,
      studentsCount: 1980,
      image:
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'data-science',
    },
    {
      id: '6',
      title: 'Arabic Calligraphy Masterclass',
      instructor: 'Fatima Zahra',
      price: 149,
      originalPrice: 499,
      rating: 4.9,
      reviewsCount: 187,
      studentsCount: 2340,
      image:
        'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'arts',
    },
    {
      id: '7',
      title: 'Moroccan Cuisine: From Tagine to Couscous',
      instructor: 'Chef Karim Alaoui',
      price: 129,
      originalPrice: 299,
      rating: 4.7,
      reviewsCount: 256,
      studentsCount: 3120,
      image:
        'https://images.pexels.com/photos/7437656/pexels-photo-7437656.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'cooking',
    },
    {
      id: '8',
      title: 'Darija for Beginners: Moroccan Arabic',
      instructor: 'Leila Amrani',
      price: 89,
      originalPrice: 199,
      rating: 4.6,
      reviewsCount: 145,
      studentsCount: 1870,
      image:
        'https://images.pexels.com/photos/6150432/pexels-photo-6150432.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'languages',
    },
    {
      id: '9',
      title: 'Modern Digital Marketing for Businesses',
      instructor: 'Hassan Benjelloun',
      price: 179,
      originalPrice: 599,
      rating: 4.7,
      reviewsCount: 210,
      studentsCount: 2750,
      image:
        'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'marketing',
    },
  ];

  // Filter courses by category and search term
  const categoryCourses = allCourses.filter(
    (course) =>
      course.category === categoryId &&
      (searchTerm === '' ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  useEffect(() => {
    // Get category data
    setCategory(categoriesData[categoryId] || null);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="heading-lg mb-4">Category not found</h1>
        <p className="text-neutral-600 mb-8">
          The category you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/categories" className="btn-primary px-6 py-2">
          View All Categories
        </Link>
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
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/categories" className="flex items-center text-primary">
            <FiArrowLeft className="mr-2" />
            Back to Categories
          </Link>
        </div>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl mr-4">
              {category.icon}
            </div>
            <h1 className="heading-lg">{category.name}</h1>
          </div>
          <p className="text-neutral-600 max-w-3xl">{category.description}</p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-card p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Search */}
              <div className="w-full sm:w-2/3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search in ${category.name}...`}
                    className="w-full pl-10 pr-4 py-3 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-neutral-300 sm:ml-auto"
              >
                <FiFilter className="text-neutral-500" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters Panel */}
            {filterOpen && (
              <div className="mt-4 pt-4 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </select>
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort By
                  </label>
                  <select className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="popularity">Most Popular</option>
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
        <div className="mb-6">
          <p className="text-neutral-600">
            Showing{' '}
            <span className="font-medium">{categoryCourses.length}</span>{' '}
            courses in <span className="font-medium">{category.name}</span>
          </p>
        </div>

        {/* Courses Grid */}
        {categoryCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No courses found</h3>
            <p className="text-neutral-600 mb-6">
              Try adjusting your search criteria or check back later for new
              courses
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-primary px-6 py-2"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* More Categories */}
        <div className="mt-16">
          <h2 className="font-heading text-2xl font-bold mb-6">
            Explore More Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(categoriesData)
              .filter((cat) => cat.id !== categoryId)
              .slice(0, 4)
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}`}
                  className="bg-white p-4 rounded-xl shadow-card hover:shadow-lg transition-all text-center"
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="font-medium">{cat.name}</h3>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCourses;
