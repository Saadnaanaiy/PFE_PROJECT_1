import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiBook } from 'react-icons/fi';
import axios from 'axios';
import moroccanPattern from '../assets/moroccan-pattern.svg';

const InstructorProfile = () => {
  const { instructorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('courses');
  const [instructor, setInstructor] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedInstructors, setRelatedInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setLoading(true);

        // Fetch instructor details
        const instructorResponse = await axios.get(
          `/api/instructors/${instructorId}`,
        );

        // Format instructor data
        const instructorData = {
          id: instructorResponse.data.id,
          name: instructorResponse.data.nom,
          specialty: instructorResponse.data.instructeur.specialite,
          image: instructorResponse.data.instructeur.image
            ? `${instructorResponse.data.instructeur.image}`
            : '/default-profile.jpg',
          bio: instructorResponse.data.instructeur.bio,
          fullBio: instructorResponse.data.instructeur.bio, // Use same bio for full bio if not provided
          courses: instructorResponse.data.instructeur.courses_count || 0,
          students: instructorResponse.data.instructeur.students_count || 0,
        };

        setInstructor(instructorData);

        // Fetch courses by this instructor (if you have an endpoint for this)
        try {
          const coursesResponse = await axios.get(
            `/api/instructors/${instructorId}/courses`,
          );
          setInstructorCourses(coursesResponse.data.courses || []);
        } catch (courseErr) {
          console.error('Error fetching instructor courses:', courseErr);
          setInstructorCourses([]); // Set empty courses on error
        }

        // Fetch other instructors for recommendations
        try {
          const allInstructorsResponse = await axios.get('/api/instructors');

          // Filter out current instructor and format data
          const otherInstructors = allInstructorsResponse.data.instructors
            .filter((inst) => inst.id !== parseInt(instructorId))
            .map((inst) => ({
              id: inst.id,
              name: inst.nom,
              specialty: inst.instructeur.specialite,
              image: inst.image
                ? `/storage/${inst.image}`
                : '/default-profile.jpg',
            }))
            .slice(0, 4); // Get only up to 4 instructors

          setRelatedInstructors(otherInstructors);
        } catch (relatedErr) {
          console.error('Error fetching related instructors:', relatedErr);
          setRelatedInstructors([]);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching instructor data:', err);
        setError(
          'Failed to load instructor details. The instructor may not exist or there was a network error.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [instructorId]);

  const handleInstructorClick = (id) => {
    navigate(`/instructors/${id}`);
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-neutral-600">Loading instructor profile...</p>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="heading-lg mb-4">Instructor not found</h1>
        <p className="text-neutral-600 mb-8">
          {error ||
            "The instructor you're looking for doesn't exist or has been removed."}
        </p>
        <Link to="/instructors" className="btn-primary px-6 py-2">
          View All Instructors
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
          <Link to="/instructors" className="flex items-center text-primary">
            <FiArrowLeft className="mr-2" />
            Back to Instructors
          </Link>
        </div>

        {/* Instructor Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-card overflow-hidden mb-8"
        >
          <div className="md:flex">
            {/* Image */}
            <div className="md:w-1/3 h-64 md:h-auto relative">
              <img
                src={instructor.image}
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="p-6 md:p-8 md:w-2/3">
              <h1 className="text-3xl font-heading font-bold mb-2">
                {instructor.name}
              </h1>
              <p className="text-primary text-lg mb-4">
                {instructor.specialty}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                  <FiBook className="text-primary mb-1" />
                  <span className="font-semibold">{instructor.courses}</span>
                  <span className="text-sm text-neutral-600">Courses</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                  <FiUsers className="text-primary mb-1" />
                  <span className="font-semibold">
                    {instructor.students.toLocaleString()}
                  </span>
                  <span className="text-sm text-neutral-600">Students</span>
                </div>
              </div>

              <p className="text-neutral-700 mb-6">{instructor.bio}</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-neutral-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'courses'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-600 hover:text-primary'
              }`}
            >
              Courses
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'about'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-600 hover:text-primary'
              }`}
            >
              About
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-heading font-bold mb-6">
                Courses by {instructor.name}
              </h2>

              {instructorCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {instructorCourses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={course.image || '/default-course.jpg'}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-primary">
                            ${course.price}
                            {course.original_price && (
                              <span className="text-neutral-400 line-through text-sm ml-2">
                                ${course.original_price}
                              </span>
                            )}
                          </span>
                          <span className="text-sm text-neutral-600">
                            {course.students_count?.toLocaleString() || 0}{' '}
                            Students
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-card">
                  <h3 className="text-xl font-medium mb-2">
                    No courses available
                  </h3>
                  <p className="text-neutral-600">
                    This instructor doesn't have any courses available at the
                    moment.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-card p-6 sm:p-8"
            >
              <h2 className="text-2xl font-heading font-bold mb-6">
                About {instructor.name}
              </h2>

              <div className="prose prose-neutral max-w-none">
                {instructor.fullBio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* More Instructors */}
        {relatedInstructors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold mb-6">
              Other Instructors You Might Like
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedInstructors.map((inst) => (
                <div
                  key={inst.id}
                  className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                  onClick={() => handleInstructorClick(inst.id)}
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={inst.image}
                      alt={inst.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                      {inst.name}
                    </h3>
                    <p className="text-primary text-sm mb-3">
                      {inst.specialty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorProfile;
