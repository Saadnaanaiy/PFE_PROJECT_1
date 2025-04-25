import { Routes, Route } from 'react-router-dom';
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
import { useState, useEffect } from 'react';
import CourseVideoView from './components/CourseVideoView';

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
    <div className="flex flex-col min-h-screen">
      {!isFullScreenRoute && <Header />}
      <main className={`${isFullScreenRoute ? '' : 'flex-grow'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route
            path="/course/:courseId/learn"
            element={<CourseVideoView onBack={() => window.history.back()} />}
          />
          <Route path="/courses" element={<CoursesList />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:categoryId" element={<CategoryCourses />} />
          <Route path="/instructors" element={<InstructorsList />} />
          <Route
            path="/instructors/:instructorId"
            element={<InstructorProfile />}
          />
          <Route path="/payment/:courseId" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </main>
      {!isFullScreenRoute && <Footer />}
    </div>
  );
}

export default App;
