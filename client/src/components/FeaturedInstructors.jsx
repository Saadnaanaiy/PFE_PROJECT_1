import { motion } from 'framer-motion'
import { FiExternalLink } from 'react-icons/fi'

const InstructorCard = ({ instructor }) => {
  const { name, avatar, specialty, courseCount, studentCount, rating } = instructor

  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-card transition-all hover:shadow-card-hover"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="pt-6 px-6 pb-5">
        <div className="flex items-center mb-4">
          <img 
            src={avatar} 
            alt={name} 
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
          />
          <div className="ml-4">
            <h3 className="font-heading font-semibold text-lg">{name}</h3>
            <p className="text-sm text-neutral-600">{specialty}</p>
          </div>
        </div>
        
        <div className="flex justify-between mb-4 text-sm">
          <div>
            <p className="font-medium text-neutral-900">{courseCount}</p>
            <p className="text-neutral-500">Courses</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">{studentCount}</p>
            <p className="text-neutral-500">Students</p>
          </div>
          <div>
            <p className="font-medium text-neutral-900">{rating}</p>
            <p className="text-neutral-500">Rating</p>
          </div>
        </div>
        
        <button className="w-full flex items-center justify-center py-2 px-4 border border-primary text-primary hover:bg-primary hover:text-white rounded-md transition-colors">
          <span>View Profile</span>
          <FiExternalLink className="ml-2" />
        </button>
      </div>
    </motion.div>
  )
}

const FeaturedInstructors = () => {
  const instructors = [
    {
      name: "Dr. Mohammed Bennani",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600",
      specialty: "Web Development",
      courseCount: 12,
      studentCount: "8.4K",
      rating: 4.8
    },
    {
      name: "Leila Amrani",
      avatar: "https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=600",
      specialty: "Data Science",
      courseCount: 8,
      studentCount: "6.2K",
      rating: 4.9
    },
    {
      name: "Karim Tazi",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
      specialty: "Business & Entrepreneurship",
      courseCount: 15,
      studentCount: "12K",
      rating: 4.7
    },
    {
      name: "Nadia El Fassi",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
      specialty: "Design & UX",
      courseCount: 9,
      studentCount: "7.5K",
      rating: 4.8
    }
  ]

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            Learn from the Best
          </span>
          <h2 className="heading-lg mb-4">Our Featured Instructors</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Learn from industry experts who are passionate about teaching and helping you achieve your goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, index) => (
            <InstructorCard key={index} instructor={instructor} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="btn-outline">
            View All Instructors
          </button>
        </div>
      </div>
    </section>
  )
}

export default FeaturedInstructors