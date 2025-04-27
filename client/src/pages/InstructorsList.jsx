import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';

const InstructorsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/instructors');
        console.log(response.data);
        
        // Transform the data to match our component structure
        // Handling the actual structure from the API response
        const instructorsData = response.data.instructors || [];
        const formattedInstructors = instructorsData.map(user => ({
          id: user.id,
          name: user.nom,
          specialty: user.instructeur?.specialite || "Not specified",
          courses: user.instructeur?.courses_count || 0,
          students: user.instructeur?.students_count || 0,
          image: user.instructeur?.image 
            ? `${user.instructeur.image}` 
            : user.image 
              ? `${user.image}` 
              : '/default-profile.jpg',
          bio: user.instructeur?.bio || "No bio available",
        }));
        
        setInstructors(formattedInstructors);
        setError(null);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setError('Failed to load instructors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  // Function to handle navigation to instructor profile
  const handleInstructorClick = (instructorId) => {
    navigate(`/instructors/${instructorId}`);
  };

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

        {/* Loading/Error States */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-neutral-600">Loading instructors...</p>
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
            {/* Featured Instructors */}
            {featuredInstructors.length > 0 && (
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
                    <div
                      key={instructor.id}
                      className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                      onClick={() => handleInstructorClick(instructor.id)}
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
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

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
                      <div 
                        className="flex bg-white rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all group cursor-pointer"
                        onClick={() => handleInstructorClick(instructor.id)}
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
                            <span>{instructor.courses} Courses</span>
                            <span>
                              {instructor.students.toLocaleString()} Students
                            </span>
                          </div>
                        </div>
                      </div>
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
          </>
        )}

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
            <button className="btn-primary px-8 py-3">
              Apply to Teach
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InstructorsList;