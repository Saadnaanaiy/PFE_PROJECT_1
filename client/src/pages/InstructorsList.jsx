import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';

const InstructorsList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for instructors
  const instructors = [
    {
      id: '1',
      name: 'Dr. Mohammed Bennani',
      specialty: 'Web Development',
      courses: 12,
      students: 5430,
      rating: 4.8,
      reviews: 320,
      image:
        'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'Leading expert in web development with over 10 years of experience teaching at top universities and working with major tech companies.',
    },
    {
      id: '2',
      name: 'Fatima Zahra',
      specialty: 'Arabic Calligraphy & Art',
      courses: 8,
      students: 2340,
      rating: 4.9,
      reviews: 187,
      image:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'Award-winning calligraphy artist with deep knowledge of traditional Moroccan art forms and contemporary design principles.',
    },
    {
      id: '3',
      name: 'Ahmed Hassan',
      specialty: 'JavaScript & Front-end Development',
      courses: 15,
      students: 4200,
      rating: 4.7,
      reviews: 275,
      image:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'Senior front-end developer and tech lead who has worked with startups and enterprises to build modern web applications.',
    },
    {
      id: '4',
      name: 'Dr. Amina Tazi',
      specialty: 'Data Science & Machine Learning',
      courses: 10,
      students: 3800,
      rating: 4.8,
      reviews: 220,
      image:
        'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'PhD in Computer Science with research focus on machine learning algorithms and their applications in healthcare and finance.',
    },
    {
      id: '5',
      name: 'Chef Karim Alaoui',
      specialty: 'Moroccan Cuisine',
      courses: 7,
      students: 3120,
      rating: 4.7,
      reviews: 256,
      image:
        'https://images.pexels.com/photos/887827/pexels-photo-887827.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'Professional chef with 15 years of experience in top restaurants, specializing in traditional and modern Moroccan cuisine.',
    },
    {
      id: '6',
      name: 'Leila Amrani',
      specialty: 'Arabic & Darija Language',
      courses: 6,
      students: 2650,
      rating: 4.6,
      reviews: 195,
      image:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'Linguistics professor with expertise in teaching Arabic and Darija to students of all levels using immersive and practical methods.',
    },
    {
      id: '7',
      name: 'Hassan Benjelloun',
      specialty: 'Digital Marketing',
      courses: 9,
      students: 3450,
      rating: 4.7,
      reviews: 210,
      image:
        'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'Marketing consultant who has helped dozens of businesses grow their online presence using the latest digital marketing strategies.',
    },
    {
      id: '8',
      name: 'Samira Ouahbi',
      specialty: 'UI/UX Design',
      courses: 11,
      students: 3900,
      rating: 4.9,
      reviews: 315,
      image:
        'https://images.pexels.com/photos/1181695/pexels-photo-1181695.jpeg?auto=compress&cs=tinysrgb&w=600',
      bio: 'Award-winning designer with experience at major tech companies, focusing on creating beautiful and user-friendly interfaces.',
    },
  ];

  // Filter instructors based on search term
  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructor.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Featured instructors (top 4 based on students)
  const featuredInstructors = [...instructors]
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
          <h1 className="heading-lg mb-4">Our Expert Instructors</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Learn from industry experts and skilled professionals who are
            passionate about sharing their knowledge and helping you achieve
            your goals.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-12">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search instructors by name or specialty..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 text-xl" />
            </div>
          </div>
        </div>

        {/* Featured Instructors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-heading font-bold mb-8 text-center">
            Featured Instructors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredInstructors.map((instructor) => (
              <Link
                key={instructor.id}
                to={`/instructors/${instructor.id}`}
                className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={instructor.image}
                    alt={instructor.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                    {instructor.name}
                  </h3>
                  <p className="text-primary text-sm mb-3">
                    {instructor.specialty}
                  </p>
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>{instructor.courses} Courses</span>
                    <span>{instructor.students.toLocaleString()} Students</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* All Instructors */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-8">
            All Instructors
          </h2>

          {filteredInstructors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInstructors.map((instructor, index) => (
                <motion.div
                  key={instructor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    to={`/instructors/${instructor.id}`}
                    className="flex bg-white rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all group"
                  >
                    <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 overflow-hidden">
                      <img
                        src={instructor.image}
                        alt={instructor.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col justify-center">
                      <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {instructor.name}
                      </h3>
                      <p className="text-primary text-sm mb-2">
                        {instructor.specialty}
                      </p>
                      <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                        {instructor.bio}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-600">
                        <span className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          {instructor.rating} ({instructor.reviews} reviews)
                        </span>
                        <span>{instructor.courses} Courses</span>
                        <span>
                          {instructor.students.toLocaleString()} Students
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-card">
              <h3 className="text-xl font-medium mb-2">No instructors found</h3>
              <p className="text-neutral-600 mb-6">
                Try adjusting your search terms
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="btn-primary px-6 py-2"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Apply to Teach CTA */}
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
              Become an Instructor
            </h3>
            <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
              Share your expertise and knowledge with our community. Join our
              team of instructors and make an impact on students' lives.
            </p>
            <Link to="/apply-to-teach" className="btn-primary px-8 py-3">
              Apply to Teach
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorsList;
