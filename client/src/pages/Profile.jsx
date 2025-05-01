import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiBook,
  FiClock,
  FiUser,
  FiGrid,
  FiLayers,
  FiBarChart2,
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  const { user, logout } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [instructorDetails, setInstructorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [createdCourses, setCreatedCourses] = useState([]);
  const [stats, setStats] = useState({
    totalEnrolled: 0,
    categoriesEnrolled: 0,
    totalCreated: 0,
    categoriesCreated: 0,
  });

  const isInstructor = user?.role === 'instructeur';
  const isStudent = user?.role === 'etudiant';

  // Set appropriate default tab based on user role
  useEffect(() => {
    if (isInstructor) {
      setActiveTab('instructor');
    } else {
      setActiveTab('courses');
    }
  }, [isInstructor]);

  // Fetch student enrolled courses if user is a student
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (isStudent && user.id) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8000/api/student/courses`,
          );
          setEnrolledCourses(response.data.courses || []);

          // Calculate enrolled courses statistics
          const courses = response.data.courses || [];
          const uniqueCategories = new Set(courses.map((c) => c.categorie_id))
            .size;

          setStats((prev) => ({
            ...prev,
            totalEnrolled: courses.length,
            categoriesEnrolled: uniqueCategories,
          }));
        } catch (err) {
          console.error('Error fetching enrolled courses:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user) fetchEnrolledCourses();
  }, [user, isStudent]);

  // Fetch instructor details and created courses if user is an instructor
  useEffect(() => {
    const fetchInstructorData = async () => {
      if (isInstructor && user.id) {
        setLoading(true);
        try {
          const [instrRes, coursesRes] = await Promise.all([
            axios.get(`http://localhost:8000/api/instructors/${user.id}`),
            axios.get(`http://localhost:8000/api/instructor/courses`),
          ]);
          setInstructorDetails(instrRes.data);
          setCreatedCourses(coursesRes.data.courses || []);

          console.log('Instructor Data:', instrRes.data);

          // Calculate created courses statistics
          const courses = coursesRes.data.courses || [];
          const uniqueCategories = new Set(courses.map((c) => c.categorie_id))
            .size;

          setStats((prev) => ({
            ...prev,
            totalCreated: courses.length,
            categoriesCreated: uniqueCategories,
          }));
        } catch (err) {
          console.error('Error fetching instructor data:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    if (user) fetchInstructorData();
  }, [user, isInstructor]);

  const instructorData = instructorDetails?.instructeur || null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container-custom">
        <header className="mb-8">
          <h1 className="heading-lg mb-2">Welcome, {user?.nom || 'User'}</h1>
          <p className="text-neutral-600">
            {isInstructor
              ? 'Manage your courses and profile'
              : 'Track your progress and continue learning'}
          </p>
        </header>

        {/* Stats Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isInstructor ? (
              <>
                <div className="bg-white rounded-xl shadow-card p-4 border-l-4 border-emerald-500">
                  <div className="flex items-center mb-2">
                    <FiLayers className="text-emerald-500 text-lg mr-2" />
                    <h3 className="font-medium text-neutral-700">
                      Created Courses
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {stats.totalCreated}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-card p-4 border-l-4 border-violet-500">
                  <div className="flex items-center mb-2">
                    <FiBarChart2 className="text-violet-500 text-lg mr-2" />
                    <h3 className="font-medium text-neutral-700">
                      Categories Taught
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {stats.categoriesCreated}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-card p-4 border-l-4 border-blue-500">
                  <div className="flex items-center mb-2">
                    <FiBook className="text-blue-500 text-lg mr-2" />
                    <h3 className="font-medium text-neutral-700">
                      Enrolled Courses
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {stats.totalEnrolled}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-card p-4 border-l-4 border-amber-500">
                  <div className="flex items-center mb-2">
                    <FiGrid className="text-amber-500 text-lg mr-2" />
                    <h3 className="font-medium text-neutral-700">
                      Categories Learning
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {stats.categoriesEnrolled}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Account Info */}
        <section className="bg-white rounded-xl shadow-card overflow-hidden mb-8">
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-xl font-heading font-semibold flex items-center">
              <FiUser className="mr-2 text-primary" /> Your Account Information
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Nom', 'Email', 'Role'].map((field, idx) => {
              const key = field.toLowerCase();
              const value =
                field === 'Role'
                  ? user?.role?.toLowerCase()
                  : user?.[key] || 'Not available';
              return (
                <div key={idx}>
                  <p className="text-sm text-neutral-500 mb-1">{field}:</p>
                  <p className="font-medium capitalize">{value}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Tabs */}
        <nav className="mb-6 border-b border-neutral-200">
          <div className="flex space-x-8">
            {isStudent && (
              <button
                onClick={() => setActiveTab('courses')}
                className={`pb-1 border-b-2 font-medium text-sm ${
                  activeTab === 'courses'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                Mes Cours
              </button>
            )}

            {isInstructor && (
              <>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    activeTab === 'instructor'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Profil Instructeur
                </button>

                <button
                  onClick={() => setActiveTab('createdCourses')}
                  className={`pb-1 border-b-2 font-medium text-sm ${
                    activeTab === 'createdCourses'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Mes Cours Créés
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Paramètres du Compte
            </button>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <main className="lg:col-span-2 space-y-8">
            {/* Enrolled Courses - Only for Students */}
            {activeTab === 'courses' && isStudent && (
              <section className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiBook className="text-primary" />
                    <h2 className="text-xl font-heading font-semibold">
                      Mes Cours
                    </h2>
                  </div>
                  <div className="text-sm font-medium text-neutral-500">
                    {stats.totalEnrolled} cours dans {stats.categoriesEnrolled}{' '}
                    catégories
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  {loading ? (
                    <div className="text-center p-8 col-span-2">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-neutral-600">
                        Chargement de vos cours...
                      </p>
                    </div>
                  ) : enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                      <article
                        key={course.id}
                        className="bg-white border border-neutral-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={course.image || '/placeholder-course.jpg'}
                            alt={course.titre}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <span className="text-xs font-medium px-2 py-1 bg-white/90 rounded-full text-primary">
                              {course.categorie?.nom || 'Uncategorized'}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-heading font-semibold mb-1 line-clamp-2">
                            <Link
                              to={`/course/${course.id}/learn`}
                              className="hover:text-primary"
                            >
                              {course.titre}
                            </Link>
                          </h3>
                          <p className="text-sm text-neutral-600 mb-3 flex items-center">
                            <FiUser
                              className="mr-1 text-neutral-400"
                              size={14}
                            />
                            {course.instructeur?.nom || 'Unknown Instructor'}
                          </p>

                          <div className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span className="font-medium">
                                {course.progress || 0}%
                              </span>
                            </div>
                            <div className="bg-neutral-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: `${course.progress || 0}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-100">
                            <Link
                              to={`/course/${course.id}/learn`}
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              Continue Learning
                            </Link>
                            <span className="text-xs text-neutral-500 flex items-center">
                              <FiClock className="mr-1" size={12} />{' '}
                              {course.lastAccessed || 'Not started'}
                            </span>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="p-8 text-center col-span-2">
                      <p className="text-neutral-600 mb-4">
                        Vous n'avez pas encore de cours.
                      </p>
                      <Link to="/courses" className="btn-primary">
                        Parcourir les Cours
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Instructor Profile - Only for Instructors */}
            {activeTab === 'instructor' && isInstructor && (
              <section className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                  <div className="flex items-center space-x-2">
                    <FiUser className="text-primary" />
                    <h2 className="text-xl font-heading font-semibold">
                      Profil Instructeur
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {loading ? (
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-neutral-600">
                        Chargement des détails d'instructeur...
                      </p>
                    </div>
                  ) : instructorData ? (
                    <>
                      <div>
                        <h3 className="text-lg font-medium mb-2">Bio</h3>
                        <p className="text-neutral-700">
                          {instructorData.bio || 'Aucune bio ajoutée'}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Specialité</h3>
                        <p className="text-neutral-700 capitalize">
                          {instructorData.specialite || 'Non spécifiée'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-emerald-500/10 p-4 rounded-lg text-center">
                          <p className="text-sm text-neutral-600">
                            Total Cours Créés
                          </p>
                          <p className="text-xl font-bold text-emerald-600">
                            {stats.totalCreated}
                          </p>
                        </div>
                        <div className="bg-violet-500/10 p-4 rounded-lg text-center">
                          <p className="text-sm text-neutral-600">
                            Catégories Distinctes
                          </p>
                          <p className="text-xl font-bold text-violet-600">
                            {stats.categoriesCreated}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-neutral-600 mb-4">
                        No instructor data found. Complete your profile in the
                        settings
                      </p>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="btn-primary"
                      >
                        Finish Profil
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Created Courses - Only for Instructors */}
            {activeTab === 'createdCourses' && isInstructor && (
              <section className="bg-white rounded-xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiLayers className="text-primary" />
                    <h2 className="text-xl font-heading font-semibold">
                      All Created Courses
                    </h2>
                  </div>
                  <Link
                    to="/instructor/courses/create"
                    className="btn-primary-sm"
                  >
                    New Course
                  </Link>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-neutral-600">Loading...</p>
                    </div>
                  ) : createdCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {createdCourses.map((course) => (
                        <div
                          key={course.id}
                          className="border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="h-32 relative bg-neutral-200">
                            {course.image ? (
                              <img
                                src={course.image}
                                alt={course.titre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-neutral-800">
                                <FiLayers className="text-white/90 text-4xl" />
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2">
                              <span className="text-xs font-medium px-2 py-1 bg-white/90 rounded-full text-primary">
                                {course.categorie?.nom || 'Uncategorized'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <Link
                              to={`/instructor/courses/${course.id}/edit`}
                              className="font-semibold hover:text-primary block mb-1"
                            >
                              {course.titre}
                            </Link>
                            <div className="flex justify-between text-sm text-neutral-600">
                              <span>
                                {course.sections?.length || 0} Sections
                              </span>
                              <Link
                                to={`/instructor/courses/${course.id}/edit`}
                                className="text-primary hover:underline"
                              >
                                Edit
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-neutral-50 rounded-lg">
                      <p className="text-neutral-600 mb-4">
                        You Don't Have Any Created Courses Yet.'
                      </p>
                      <Link
                        to="/instructor/courses/create"
                        className="btn-primary"
                      >
                        Create Your First Course
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Profile Settings - For All Users */}
            {activeTab === 'settings' && <ProfileForm />}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-xl shadow-card p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
                {isInstructor && instructorData?.image ? (
                  <img
                    src={instructorData.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : user?.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-primary w-10 h-10" />
                )}
              </div>
              <h3 className="font-heading font-semibold mb-1">
                {user?.nom || 'User Name'}
              </h3>
              <p className="text-sm text-neutral-600 mb-1">
                {user?.email || 'user@example.com'}
              </p>
              <p className="text-xs text-neutral-500 mb-4 capitalize bg-neutral-100 rounded-full py-1 px-3 inline-block">
                {user?.role || 'Student'}
              </p>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {isInstructor ? (
                  <>
                    <div className="bg-neutral-50 rounded p-2">
                      <p className="text-xs text-neutral-500">Created Course</p>
                      <p className="font-semibold">{stats.totalCreated}</p>
                    </div>
                    <div className="bg-neutral-50 rounded p-2">
                      <p className="text-xs text-neutral-500">Categories</p>
                      <p className="font-semibold">{stats.categoriesCreated}</p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* <div className="bg-neutral-50 rounded p-2">
                      <p className="text-xs text-neutral-500">Courses</p>
                      <p className="font-semibold">{stats.totalEnrolled}</p>
                    </div>
                    <div className="bg-neutral-50 rounded p-2">
                      <p className="text-xs text-neutral-500">Categories</p>
                      <p className="font-semibold">
                        {stats.categoriesEnrolled}
                      </p>
                    </div> */}
                  </>
                )}
              </div>

              <button
                onClick={logout}
                className="btn-outline w-full py-2 text-red-500 border-red-200 hover:bg-red-600 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-card p-6">
              <h3 className="font-medium mb-4">Fast Action</h3>
              <div className="space-y-2">
                {isInstructor && (
                  <Link
                    to="/instructor/courses/create"
                    className="flex items-center p-2 hover:bg-neutral-50 rounded-lg text-neutral-700 hover:text-primary"
                  >
                    <FiLayers className="mr-2" /> Create New Course
                  </Link>
                )}
                {isStudent && (
                  <Link
                    to="/courses"
                    className="flex items-center p-2 hover:bg-neutral-50 rounded-lg text-neutral-700 hover:text-primary"
                  >
                    <FiBook className="mr-2" /> See All Courses
                  </Link>
                )}
                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center p-2 hover:bg-neutral-50 rounded-lg text-neutral-700 hover:text-primary w-full text-left"
                >
                  <FiUser className="mr-2" /> Edit My Profil
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
