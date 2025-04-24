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

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
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
      <Footer />
    </div>
  );
}

export default App;
