import Hero from '../components/Hero';
import Categories from '../components/Categories';
import CoursesList from '../components/CoursesList';
import FeaturedInstructors from '../components/FeaturedInstructors';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';

// Sample courses data with Moroccan-themed items
const courses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    instructor: 'Dr. Mohammed Bennani',
    image:
      'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    reviewCount: 247,
    duration: '22 hours',
    level: 'Beginner',
    price: 899,
    discountPrice: 199,
    category: 'Development',
  },
  {
    id: 2,
    title: 'Moroccan Cuisine Masterclass',
    instructor: 'Chef Fatima Zahrae',
    image:
      'https://images.pexels.com/photos/7438875/pexels-photo-7438875.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    reviewCount: 312,
    duration: '15 hours',
    level: 'All Levels',
    price: 699,
    discountPrice: 149,
    category: 'Culinary',
  },
  {
    id: 3,
    title: 'Traditional Moroccan Crafts',
    instructor: 'Hassan El Ouazzani',
    image:
      'https://images.pexels.com/photos/4992432/pexels-photo-4992432.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.7,
    reviewCount: 163,
    duration: '18 hours',
    level: 'Intermediate',
    price: 799,
    discountPrice: null,
    category: 'Arts',
  },
  {
    id: 4,
    title: 'Modern Arabic Calligraphy',
    instructor: 'Laila Benhalima',
    image:
      'https://images.pexels.com/photos/5998024/pexels-photo-5998024.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    reviewCount: 215,
    duration: '12 hours',
    level: 'Beginner',
    price: 599,
    discountPrice: 129,
    category: 'Art',
  },
  {
    id: 5,
    title: 'Digital Marketing for Moroccan Business',
    instructor: 'Yasmine Berrada',
    image:
      'https://images.pexels.com/photos/6457579/pexels-photo-6457579.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.6,
    reviewCount: 178,
    duration: '20 hours',
    level: 'Intermediate',
    price: 899,
    discountPrice: 199,
    category: 'Marketing',
  },
  {
    id: 6,
    title: 'Moroccan Interior Design',
    instructor: 'Samira El Fassi',
    image:
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    reviewCount: 142,
    duration: '16 hours',
    level: 'All Levels',
    price: 849,
    discountPrice: 179,
    category: 'Design',
  },
  {
    id: 7,
    title: 'Modern JavaScript Development',
    instructor: 'Youssef Khalid',
    image:
      'https://images.pexels.com/photos/4974914/pexels-photo-4974914.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.8,
    reviewCount: 203,
    duration: '25 hours',
    level: 'Advanced',
    price: 999,
    discountPrice: 249,
    category: 'Development',
  },
  {
    id: 8,
    title: 'Moroccan Textile Design',
    instructor: 'Amina Zidane',
    image:
      'https://images.pexels.com/photos/6192554/pexels-photo-6192554.jpeg?auto=compress&cs=tinysrgb&w=600',
    rating: 4.9,
    reviewCount: 134,
    duration: '14 hours',
    level: 'All Levels',
    price: 699,
    discountPrice: null,
    category: 'Design',
  },
];

const Home = () => {
  return (
    <div className="bg-neutral-50">
      <Hero />
      <Categories />
      <CoursesList
        title="Popular Courses"
        subtitle="Discover our most highly-rated and in-demand courses"
        courses={courses}
      />
      <FeaturedInstructors />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Home;
