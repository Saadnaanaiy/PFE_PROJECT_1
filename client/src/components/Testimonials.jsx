import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  
  const testimonials = [
    {
      content: "MarocAcademy helped me transition into a career in data science. The courses were comprehensive and the instructors were incredibly supportive throughout my learning journey.",
      author: "Yousef El Mansouri",
      role: "Data Scientist at Tech Maroc",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 5
    },
    {
      content: "As someone looking to improve my design skills, I found exactly what I needed. The platform is easy to navigate and the content is high-quality and relevant to the Moroccan job market.",
      author: "Amal Belkadi",
      role: "UI/UX Designer",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 5
    },
    {
      content: "I've tried many online learning platforms, but MarocAcademy stands out for its focus on local business practices while maintaining global standards. The entrepreneurship course was transformative for my startup.",
      author: "Karim Bouazza",
      role: "Founder & CEO, TechStart Morocco",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600",
      rating: 5
    }
  ]

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-neutral-50 overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            Success Stories
          </span>
          <h2 className="heading-lg mb-4">What Our Students Say</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Join thousands of satisfied students who have transformed their careers with MarocAcademy
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              initial={false}
              animate={{ x: `-${activeIndex * 100}%` }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="min-w-full px-4">
                  <div className="bg-white rounded-xl p-8 shadow-card">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="text-amber-500 fill-current w-5 h-5" />
                      ))}
                    </div>
                    
                    <blockquote className="text-lg md:text-xl text-neutral-800 mb-6 font-heading font-medium italic">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author} 
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div>
                        <p className="font-semibold text-neutral-900">{testimonial.author}</p>
                        <p className="text-sm text-neutral-600">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeIndex === index ? 'bg-primary' : 'bg-neutral-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="hidden sm:block">
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-neutral-700 hover:text-primary transition-colors"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-neutral-700 hover:text-primary transition-colors"
              aria-label="Next testimonial"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials