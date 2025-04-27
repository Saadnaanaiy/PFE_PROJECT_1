import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiClock, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ProfileForm from '../components/ProfileForm'; // Import the new component

const Profile = () => {
  const { user, logout } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses'); // Add this to manage tabs

  // Fetch instructor details if user is an instructor
  useEffect(() => {
    // Fetch instructor details if user is an instructor
    const fetchInstructorDetails = async () => {
      if (user && user.role === 'instructeur' && user.id) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/instructors/${user.id}`,
          );
          setInstructorDetails(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching instructor details:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (user) {
      fetchInstructorDetails();
    }
  }, [user]);

  // Mock data for enrolled courses - in a real app, this would come from an API
  useEffect(() => {
    // Simulate API call to get enrolled courses
    setEnrolledCourses([
      {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        instructor: 'Dr. Mohammed Bennani',
        progress: 35,
        image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
        lastAccessed: '2 days ago'
      },
      {
        id: '2',
        title: 'Arabic Calligraphy Masterclass',
        instructor: 'Fatima Zahra',
        progress: 68,
        image: 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=600',
        lastAccessed: 'Yesterday'
      }
    ]);
  }, []);

  // Extract instructor data if user is an instructor
  const instructorData = instructorDetails?.instructeur || null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="heading-lg mb-2">Welcome, {user?.nom || 'Student'}</h1>
          <p className="text-neutral-600">Track your progress and continue learning</p>
        </div>

        {/* Display authenticated user information */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-xl font-heading font-semibold flex items-center">
              <FiUser className="mr-2 text-primary" />
              Your Account Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Name:</p>
                <p className="font-medium">{user?.nom || 'Not available'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Email:</p>
                <p className="font-medium">{user?.email || 'Not available'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Role:</p>
                <p className="font-medium capitalize">{user?.role || 'Not available'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for different sections */}
        <div className="mb-6 border-b border-neutral-200">
          <div className="flex flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab('courses')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Mes Cours
            </button>
            {user?.role === 'instructeur' && (
              <button
                onClick={() => setActiveTab('instructor')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'instructor'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Profil Instructeur
              </button>
            )}
            <button
              onClick={() => setActiveTab('settings')}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Paramètres du Compte
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses Section */}
            {activeTab === 'courses' && (
              <section className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                  <h2 className="text-xl font-heading font-semibold flex items-center">
                    <FiBook className="mr-2 text-primary" />
                    My Courses
                  </h2>
                </div>

                <div className="divide-y divide-neutral-100">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                      <div key={course.id} className="p-6">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-1/4 mb-4 sm:mb-0">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-24 object-cover rounded-md"
                            />
                          </div>
                          <div className="sm:w-3/4 sm:pl-6">
                            <h3 className="font-heading font-semibold mb-1">
                              <Link
                                to={`/course/${course.id}/learn`}
                                className="hover:text-primary transition-colors"
                              >
                                {course.title}
                              </Link>
                            </h3>
                            <p className="text-sm text-neutral-600 mb-3">
                              {course.instructor}
                            </p>
                            <div className="mb-2">
                              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-neutral-600">
                                {course.progress}% complete
                              </span>
                              <span className="text-xs text-neutral-500 flex items-center">
                                <FiClock className="mr-1" />
                                Last accessed {course.lastAccessed}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-neutral-600 mb-4">
                        You haven't enrolled in any courses yet.
                      </p>
                      <Link to="/courses" className="btn-primary py-2 px-4">
                        Browse Courses
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Instructor Profile Section */}
            {activeTab === 'instructor' && user?.role === 'instructeur' && (
              <section className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                  <h2 className="text-xl font-heading font-semibold flex items-center">
                    <FiUser className="mr-2 text-primary" />
                    Instructor Profile
                  </h2>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="text-center py-4">
                      <p className="text-neutral-600">Loading instructor details...</p>
                    </div>
                  ) : instructorData ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Bio</h3>
                        <p className="text-neutral-700">{instructorData.bio || 'No bio available'}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Speciality</h3>
                        <p className="text-neutral-700">{instructorData.specialite || 'Not specified'}</p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 px-4 py-2 rounded-lg">
                          <p className="text-sm text-neutral-600">Courses</p>
                          <p className="text-xl font-bold">{instructorData.courses_count || 0}</p>
                        </div>
                        <div className="bg-primary/10 px-4 py-2 rounded-lg">
                          <p className="text-sm text-neutral-600">Students</p>
                          <p className="text-xl font-bold">{instructorData.students_count || 0}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-neutral-600">No instructor details found.</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Profile Settings Section */}
            {activeTab === 'settings' && <ProfileForm />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  {(user?.role === 'instructeur' && instructorData?.image) ? (
                    <img
                      src={instructorData.image}
                      alt="Photo de profil"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : user?.image ? (
                    <img
                      src={user.image}
                      alt="Photo de profil"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-8 h-8 text-primary" />
                  )}
                </div>
                <h3 className="font-heading font-semibold mb-1">{user?.nom || 'Student'}</h3>
                <p className="text-sm text-neutral-600 mb-4">{user?.email || 'No email available'}</p>

                <div className="space-y-2">
                  <button onClick={logout} className="btn-outline w-full py-2 text-red-500 border-red-200 hover:bg-red-600 hover:text-white transition-colors">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
