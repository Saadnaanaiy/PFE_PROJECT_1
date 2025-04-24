import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiStar, FiUsers, FiBook, FiAward } from 'react-icons/fi';
import CourseCard from '../components/CourseCard';
import moroccanPattern from '../assets/moroccan-pattern.svg';

const InstructorProfile = () => {
  const { instructorId } = useParams();
  const [activeTab, setActiveTab] = useState('courses');
  const [instructor, setInstructor] = useState(null);
  const [instructorCourses, setInstructorCourses] = useState([]);

  // Mock data for instructors
  const instructorsData = {
    1: {
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
      fullBio: `Dr. Mohammed Bennani is a renowned web development instructor with more than a decade of experience in both academia and industry.

He holds a Ph.D. in Computer Science from the University of Casablanca and has worked as a senior developer at several major tech companies. His teaching approach combines theoretical foundations with practical, real-world applications.

Dr. Bennani specializes in full-stack development, with particular expertise in JavaScript frameworks, responsive design, and scalable architecture. His courses have helped thousands of students transition from beginners to professional developers.

When not teaching, he contributes to open-source projects and mentors young developers in the Moroccan tech community.`,
      credentials: [
        {
          title: 'Ph.D. in Computer Science',
          institution: 'University of Casablanca',
        },
        {
          title: 'Senior Web Developer',
          institution: 'TechMorocco (2015-2020)',
        },
        { title: 'Google Certified Web Developer', institution: 'Google' },
        {
          title: 'AWS Certified Solutions Architect',
          institution: 'Amazon Web Services',
        },
      ],
      socialLinks: {
        website: 'https://mbennani.dev',
        linkedin: 'https://linkedin.com/in/mbennani',
        github: 'https://github.com/mbennani',
        twitter: 'https://twitter.com/mbennani',
      },
    },
    2: {
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
      fullBio: `Fatima Zahra is one of Morocco's most respected calligraphy artists and educators, with a passion for preserving and modernizing traditional Arabic calligraphy styles.

Born in Fez, Fatima began studying calligraphy at the age of twelve under master calligraphers. She later obtained her formal education in Fine Arts at the National Institute of Fine Arts in Tetouan, specializing in Arabic calligraphy and ornamental design.

Her work has been exhibited in galleries across Morocco, the Middle East, and Europe. She has received multiple awards for her contributions to the field, including the Royal Award for Moroccan Calligraphy in 2018.

As an instructor, Fatima is known for her patient, methodical approach that makes the complex art of calligraphy accessible to beginners while challenging advanced students to refine their technique and develop their unique style.`,
      credentials: [
        {
          title: 'Bachelor of Fine Arts',
          institution: 'National Institute of Fine Arts, Tetouan',
        },
        {
          title: 'Master Calligrapher Certification',
          institution: 'Royal Academy of Traditional Arts',
        },
        {
          title: 'Royal Award for Moroccan Calligraphy',
          institution: '2018 Recipient',
        },
        {
          title: 'Artist in Residence',
          institution: 'Marrakech Art Biennale (2016, 2019)',
        },
      ],
      socialLinks: {
        website: 'https://fatima-calligraphy.ma',
        instagram: 'https://instagram.com/fatima.calligraphy',
        facebook: 'https://facebook.com/fatimacalligraphy',
      },
    },
  };

  // Mock data for courses
  const coursesData = [
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      instructor: 'Dr. Mohammed Bennani',
      instructorId: '1',
      price: 199,
      originalPrice: 899,
      rating: 4.8,
      reviewsCount: 320,
      studentsCount: 5430,
      image:
        'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'development',
      description:
        'A comprehensive web development course covering HTML, CSS, JavaScript, React, Node.js, and more.',
    },
    {
      id: '2',
      title: 'JavaScript Fundamentals',
      instructor: 'Dr. Mohammed Bennani',
      instructorId: '1',
      price: 129,
      originalPrice: 399,
      rating: 4.7,
      reviewsCount: 215,
      studentsCount: 3820,
      image:
        'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'development',
      description:
        'Master the core concepts of JavaScript programming with practical examples and exercises.',
    },
    {
      id: '3',
      title: 'React.js for Beginners',
      instructor: 'Dr. Mohammed Bennani',
      instructorId: '1',
      price: 149,
      originalPrice: 499,
      rating: 4.9,
      reviewsCount: 178,
      studentsCount: 2950,
      image:
        'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'development',
      description:
        'Build modern, interactive user interfaces with React.js, the popular JavaScript library.',
    },
    {
      id: '6',
      title: 'Arabic Calligraphy Masterclass',
      instructor: 'Fatima Zahra',
      instructorId: '2',
      price: 149,
      originalPrice: 499,
      rating: 4.9,
      reviewsCount: 187,
      studentsCount: 2340,
      image:
        'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'arts',
      description:
        'Learn the beautiful art of Arabic calligraphy from basic strokes to advanced compositions.',
    },
  ];

  useEffect(() => {
    // Get instructor data
    setInstructor(instructorsData[instructorId] || null);

    // Get instructor courses
    const courses = coursesData.filter(
      (course) => course.instructorId === instructorId,
    );
    setInstructorCourses(courses);
  }, [instructorId]);

  if (!instructor) {
    return (
      <div className="container-custom py-16 text-center">
        <h1 className="heading-lg mb-4">Instructor not found</h1>
        <p className="text-neutral-600 mb-8">
          The instructor you're looking for doesn't exist or has been removed.
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
                <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                  <FiStar className="text-primary mb-1" />
                  <span className="font-semibold">{instructor.rating}</span>
                  <span className="text-sm text-neutral-600">Rating</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-primary/5 rounded-lg">
                  <FiAward className="text-primary mb-1" />
                  <span className="font-semibold">{instructor.reviews}</span>
                  <span className="text-sm text-neutral-600">Reviews</span>
                </div>
              </div>

              <p className="text-neutral-700 mb-6">{instructor.bio}</p>

              <div className="flex flex-wrap gap-2">
                {instructor.socialLinks &&
                  Object.entries(instructor.socialLinks).map(
                    ([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-neutral-100 rounded-full text-sm hover:bg-primary/10 transition-colors"
                      >
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </a>
                    ),
                  )}
              </div>
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
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'credentials'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-neutral-600 hover:text-primary'
              }`}
            >
              Credentials
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
                    <CourseCard key={course.id} course={course} />
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

          {/* Credentials Tab */}
          {activeTab === 'credentials' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-card p-6 sm:p-8"
            >
              <h2 className="text-2xl font-heading font-bold mb-6">
                Credentials
              </h2>

              {instructor.credentials && instructor.credentials.length > 0 ? (
                <div className="space-y-4">
                  {instructor.credentials.map((credential, index) => (
                    <div
                      key={index}
                      className="p-4 border border-neutral-200 rounded-lg"
                    >
                      <h3 className="font-medium text-lg">
                        {credential.title}
                      </h3>
                      <p className="text-neutral-600">
                        {credential.institution}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-600">
                  No credentials information available.
                </p>
              )}
            </motion.div>
          )}
        </div>

        {/* More Instructors */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold mb-6">
            Other Instructors You Might Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(instructorsData)
              .filter((inst) => inst.id !== instructor.id)
              .slice(0, 4)
              .map((inst) => (
                <Link
                  key={inst.id}
                  to={`/instructors/${inst.id}`}
                  className="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all group"
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
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfile;
