import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlay, FiClock, FiBook, FiAward, FiStar, FiGlobe, FiDownload } from 'react-icons/fi'

const CourseDetails = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // In a real app, fetch course details based on courseId
  const course = {
    id: courseId,
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Mohammed Bennani",
    image: "https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600",
    rating: 4.8,
    reviewCount: 247,
    duration: "22 hours",
    level: "Beginner",
    price: 899,
    discountPrice: 199,
    category: "Development",
    language: "Arabic, English",
    lastUpdated: "February 2024",
    description: `Learn web development from scratch with this comprehensive bootcamp. Perfect for beginners who want to become professional web developers.

This course covers:
- HTML5, CSS3, and modern JavaScript
- React.js and Node.js
- Database design and implementation
- Real-world project development
- Deployment and hosting`,
    requirements: [
      "Basic computer knowledge",
      "No prior programming experience needed",
      "A computer with internet connection",
      "Enthusiasm to learn!"
    ],
    whatYouWillLearn: [
      "Build responsive websites using HTML5 and CSS3",
      "Master JavaScript and modern ES6+ features",
      "Create full-stack applications with React and Node.js",
      "Work with databases and APIs",
      "Deploy applications to production",
      "Best practices and professional development workflows"
    ],
    curriculum: [
      {
        title: "Introduction to Web Development",
        lessons: [
          { title: "Course Overview", duration: "10:00" },
          { title: "Setting Up Your Development Environment", duration: "15:00" },
          { title: "Understanding Web Technologies", duration: "20:00" }
        ]
      },
      {
        title: "HTML5 Fundamentals",
        lessons: [
          { title: "HTML Document Structure", duration: "25:00" },
          { title: "Working with Text and Links", duration: "20:00" },
          { title: "Forms and Input Elements", duration: "30:00" }
        ]
      }
    ]
  }

  const handleEnroll = () => {
    navigate(`/payment/${courseId}`)
  }

  return (
    <div className="bg-neutral-50 py-12">
      {/* Course Header */}
      <div className="bg-primary text-white py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h1 
                className="heading-lg mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {course.title}
              </motion.h1>
              <p className="text-white/90 text-lg mb-6">
                By {course.instructor}
              </p>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center">
                  <FiStar className="mr-1" />
                  <span>{course.rating} ({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center">
                  <FiGlobe className="mr-1" />
                  <span>{course.language}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{course.duration}</span>
                </div>
              </div>
            </div>
            <div className="md:pl-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full aspect-video rounded-lg object-cover mb-6"
                />
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-secondary">
                    {course.discountPrice} MAD
                  </span>
                  {course.discountPrice && (
                    <span className="ml-2 text-lg line-through text-neutral-500">
                      {course.price} MAD
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleEnroll}
                  className="btn-primary w-full py-4 mb-4"
                >
                  Enroll Now
                </button>
                <ul className="space-y-3 text-sm text-neutral-600">
                  <li className="flex items-center">
                    <FiPlay className="mr-2" />
                    Full lifetime access
                  </li>
                  <li className="flex items-center">
                    <FiDownload className="mr-2" />
                    Downloadable resources
                  </li>
                  <li className="flex items-center">
                    <FiAward className="mr-2" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container-custom mt-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Content Tabs */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="border-b border-neutral-200">
                <div className="flex">
                  {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-neutral-600 hover:text-primary'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-4">Description</h3>
                      <p className="text-neutral-600 whitespace-pre-line">{course.description}</p>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-4">What You'll Learn</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {course.whatYouWillLearn.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <FiBook className="mt-1 mr-2 text-primary" />
                            <span className="text-neutral-600">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-4">Requirements</h3>
                      <ul className="list-disc list-inside space-y-2 text-neutral-600">
                        {course.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-6">
                    {course.curriculum.map((section, index) => (
                      <div key={index} className="border border-neutral-200 rounded-lg">
                        <div className="p-4 bg-neutral-50 font-medium">
                          {section.title}
                        </div>
                        <div className="divide-y divide-neutral-200">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="p-4 flex justify-between items-center">
                              <div className="flex items-center">
                                <FiPlay className="mr-3 text-primary" />
                                <span>{lesson.title}</span>
                              </div>
                              <span className="text-sm text-neutral-500">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails