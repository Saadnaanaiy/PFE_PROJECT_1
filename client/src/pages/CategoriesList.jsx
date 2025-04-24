import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import moroccanPattern from '../assets/moroccan-pattern.svg';

const CategoriesList = () => {
  // Mock data for categories
  const categories = [
    {
      id: 'development',
      name: 'Web & Mobile Development',
      count: 120,
      image:
        'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Learn to code websites, apps, and software with our programming courses.',
      icon: '💻',
    },
    {
      id: 'data-science',
      name: 'Data Science & AI',
      count: 87,
      image:
        'https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Master data analysis, machine learning, and artificial intelligence.',
      icon: '📊',
    },
    {
      id: 'business',
      name: 'Business & Entrepreneurship',
      count: 95,
      image:
        'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Start and grow your business with courses on management and strategy.',
      icon: '💼',
    },
    {
      id: 'arts',
      name: 'Arts & Crafts',
      count: 78,
      image:
        'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Explore traditional and modern art forms, including calligraphy and painting.',
      icon: '🎨',
    },
    {
      id: 'cooking',
      name: 'Cooking & Cuisine',
      count: 64,
      image:
        'https://images.pexels.com/photos/7437656/pexels-photo-7437656.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Learn to cook authentic Moroccan dishes and international cuisine.',
      icon: '🍲',
    },
    {
      id: 'languages',
      name: 'Languages',
      count: 56,
      image:
        'https://images.pexels.com/photos/6150432/pexels-photo-6150432.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Master Arabic, Darija, French, English, and other languages.',
      icon: '🗣️',
    },
    {
      id: 'marketing',
      name: 'Marketing & Communications',
      count: 72,
      image:
        'https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Learn digital marketing, social media, SEO, and branding strategies.',
      icon: '📱',
    },
    {
      id: 'personal-development',
      name: 'Personal Development',
      count: 89,
      image:
        'https://images.pexels.com/photos/4064432/pexels-photo-4064432.jpeg?auto=compress&cs=tinysrgb&w=600',
      description:
        'Improve your soft skills, productivity, and personal growth.',
      icon: '🌱',
    },
  ];

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group relative block aspect-square overflow-hidden rounded-xl shadow-card transition-all hover:shadow-lg"
              >
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="mb-2 text-4xl">{category.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {category.count} courses
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* All Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">
            All Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
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
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col justify-center">
                    <h3 className="font-heading font-semibold text-lg mb-1">
                      {category.name}
                    </h3>
                    <p className="text-neutral-500 text-sm mb-2">
                      {category.count} courses
                    </p>
                    <p className="text-neutral-600 text-sm hidden sm:block">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
