import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseDetails from './pages/CourseDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Header from './components/Header';
import Footer from './components/Footer';
import CoursesList from './pages/CoursesList';
import CategoriesList from './pages/CategoriesList';
import CategoryCourses from './pages/CategoryCourses';
import InstructorsList from './pages/InstructorsList';
import InstructorProfile from './pages/InstructorProfile';
import CourseVideoView from './components/CourseVideoView';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import InstructorCoursesList from './pages/InstructorCoursesList';
import CreateCourse from './pages/CreateCourse';
import CourseEdit from './pages/CourseEdit';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import CategorieDetaille from './pages/CategorieDetaille';
import CheckoutResult from './pages/CheckoutResult';
import PaymentRedirect from './pages/PaymentRedirect';
import Chatbot from './components/Chatbot';

// Define InstructorRoute component
const InstructorRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  // Check if user is authenticated and has instructor role
  const isInstructor = user?.role === 'instructeur';

  if (!isAuthenticated() || !isInstructor) {
    // Redirect if not authenticated or not an instructor
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Define AdminRoute component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated() || !isAdmin()) {
    // Redirect if not authenticated or not an admin
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  // State to track when we should hide header and footer (for video learning experience)
  const [isFullScreenRoute, setIsFullScreenRoute] = useState(false);

  // Monitor route changes to determine when to hide the header and footer
  const checkFullScreenRoute = () => {
    const path = window.location.pathname;
    const isCourseViewRoute =
      path.includes('/course/') && path.includes('/learn');
    setIsFullScreenRoute(isCourseViewRoute);
  };

  useEffect(() => {
    checkFullScreenRoute();
    window.addEventListener('popstate', checkFullScreenRoute);
    return () => window.removeEventListener('popstate', checkFullScreenRoute);
  }, []);

  return (
    <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex flex-col min-h-screen">
        {!isFullScreenRoute && <Header />}
        <main className={`${isFullScreenRoute ? '' : 'flex-grow'}`}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/courses/:courseId" element={<CourseDetails />} />
            <Route path="/courses" element={<CoursesList />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/:id" element={<CategorieDetaille />} />
            <Route
              path="/categories/:categoryId"
              element={<CategoryCourses />}
            />
            <Route path="/instructors" element={<InstructorsList />} />
            <Route
              path="/instructors/:instructorId"
              element={<InstructorProfile />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout/result" element={<CheckoutResult />} />

            {/* Payment redirect routes - these handle redirects from Stripe/backend */}
            <Route path="/payment/success" element={<PaymentRedirect />} />
            <Route path="/payment/cancel" element={<PaymentRedirect />} />

            {/* Protected routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/course/:courseId/learn"
              element={
                <ProtectedRoute>
                  <CourseVideoView onBack={() => window.history.back()} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/:courseId"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />

            {/* Instructor routes */}
            <Route
              path="/instructor/dashboard"
              element={
                <InstructorRoute>
                  <InstructorCoursesList />
                </InstructorRoute>
              }
            />
            <Route
              path="/instructor/courses/create"
              element={
                <InstructorRoute>
                  <CreateCourse />
                </InstructorRoute>
              }
            />
            <Route
              path="/instructor/courses/:id/edit"
              element={
                <InstructorRoute>
                  <CourseEdit />
                </InstructorRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            {/* <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            /> */}
            {/* Add additional admin routes here as needed */}
          </Routes>
        </main>
        {!isFullScreenRoute && <Footer />}
        {!isFullScreenRoute && <Chatbot />}
      </div>
    </AuthProvider>
  );
}

export default App;
