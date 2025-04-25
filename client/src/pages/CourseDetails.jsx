import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiPlay,
  FiClock,
  FiBook,
  FiAward,
  FiStar,
  FiGlobe,
  FiDownload,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiChevronDown,
  FiLock,
} from 'react-icons/fi';
import zelijBackground from '../assets/zelijBack.png';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [newForumTopic, setNewForumTopic] = useState('');
  const [newForumDescription, setNewForumDescription] = useState('');
  const [showNewForumForm, setShowNewForumForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeForumId, setActiveForumId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle section expansion in curriculum
  const toggleSection = (sectionIndex) => {
    setExpandedSections({
      ...expandedSections,
      [sectionIndex]: !expandedSections[sectionIndex],
    });
  };

  // In a real app, fetch course details based on courseId
  const course = {
    id: courseId,
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
    language: 'Arabic, English',
    lastUpdated: 'February 2024',
    description: `Learn web development from scratch with this comprehensive bootcamp. Perfect for beginners who want to become professional web developers.

This course covers:
- HTML5, CSS3, and modern JavaScript
- React.js and Node.js
- Database design and implementation
- Real-world project development
- Deployment and hosting`,
    requirements: [
      'Basic computer knowledge',
      'No prior programming experience needed',
      'A computer with internet connection',
      'Enthusiasm to learn!',
    ],
    whatYouWillLearn: [
      'Build responsive websites using HTML5 and CSS3',
      'Master JavaScript and modern ES6+ features',
      'Create full-stack applications with React and Node.js',
      'Work with databases and APIs',
      'Deploy applications to production',
      'Best practices and professional development workflows',
    ],
    curriculum: [
      {
        title: 'Introduction to Web Development',
        totalDuration: '45:00',
        lessons: [
          { title: 'Course Overview', duration: '10:00', preview: true },
          {
            title: 'Setting Up Your Development Environment',
            duration: '15:00',
            preview: false,
          },
          {
            title: 'Understanding Web Technologies',
            duration: '20:00',
            preview: false,
          },
        ],
      },
      {
        title: 'HTML5 Fundamentals',
        totalDuration: '1:15:00',
        lessons: [
          {
            title: 'HTML Document Structure',
            duration: '25:00',
            preview: true,
          },
          {
            title: 'Working with Text and Links',
            duration: '20:00',
            preview: false,
          },
          {
            title: 'Forms and Input Elements',
            duration: '30:00',
            preview: false,
          },
        ],
      },
      {
        title: 'CSS3 Styling',
        totalDuration: '2:30:00',
        lessons: [
          {
            title: 'CSS Selectors and Properties',
            duration: '30:00',
            preview: true,
          },
          {
            title: 'Box Model and Layout Techniques',
            duration: '40:00',
            preview: false,
          },
          {
            title: 'Responsive Design with Media Queries',
            duration: '45:00',
            preview: false,
          },
          {
            title: 'CSS Animations and Transitions',
            duration: '35:00',
            preview: false,
          },
        ],
      },
      {
        title: 'JavaScript Essentials',
        totalDuration: '3:20:00',
        lessons: [
          {
            title: 'JavaScript Syntax Basics',
            duration: '40:00',
            preview: false,
          },
          { title: 'Working with DOM', duration: '50:00', preview: false },
          { title: 'Event Handling', duration: '35:00', preview: false },
          { title: 'ES6+ Features', duration: '45:00', preview: false },
          {
            title: 'Asynchronous JavaScript',
            duration: '30:00',
            preview: false,
          },
        ],
      },
    ],
    // Mock forums data
    forums: [
      {
        id: 1,
        title: 'Help with HTML forms',
        description: 'I need assistance with creating complex forms in HTML.',
        createdBy: 'Dr. Mohammed Bennani',
        createdAt: 'April 15, 2024',
        messages: [
          {
            id: 1,
            author: 'Dr. Mohammed Bennani',
            text: 'Welcome to this forum. Please share your specific questions about HTML forms.',
            timestamp: 'April 15, 2024',
            isInstructor: true,
          },
          {
            id: 2,
            author: 'Ahmed Khaled',
            text: "I'm struggling with form validation. Can you recommend best practices?",
            timestamp: 'April 16, 2024',
            isInstructor: false,
          },
        ],
      },
      {
        id: 2,
        title: 'JavaScript Frameworks Discussion',
        description:
          "Let's talk about modern JavaScript frameworks and their use cases.",
        createdBy: 'Dr. Mohammed Bennani',
        createdAt: 'April 10, 2024',
        messages: [
          {
            id: 1,
            author: 'Dr. Mohammed Bennani',
            text: 'What frameworks have you tried? What do you think of React vs Angular?',
            timestamp: 'April 10, 2024',
            isInstructor: true,
          },
        ],
      },
    ],
    isInstructor: true, // This would be determined by user authentication in a real app
    enrolled: true, // Mock enrollment status - would come from auth in real app
  };

  const handleEnroll = () => {
    navigate(`/payment/${courseId}`);
  };

  // Handle creating a new forum
  const handleCreateForum = () => {
    // In a real app, this would send an API request
    console.log('Creating new forum:', { newForumTopic, newForumDescription });
    setShowNewForumForm(false);
    setNewForumTopic('');
    setNewForumDescription('');
  };

  // Handle sending a message in a forum
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // In a real app, this would send an API request
    console.log('Sending message in forum:', activeForumId, newMessage);
    setNewMessage('');
  };

  // Get active forum data
  const getActiveForum = () => {
    return course.forums.find((forum) => forum.id === activeForumId);
  };

  // Start viewing course
  const startCourse = () => {
    navigate(`/course/${courseId}/learn`);
  };

  // Zelij background styles with different variations
  const zelijStyles = {
    header: {
      backgroundImage: `url(${zelijBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.12,
    },
    sidebar: {
      backgroundImage: `url(${zelijBackground})`,
      backgroundSize: '200px',
      backgroundPosition: 'center',
      opacity: 0.08,
    },
    curriculum: {
      backgroundImage: `url(${zelijBackground})`,
      backgroundSize: '300px',
      backgroundRepeat: 'repeat',
      opacity: 0.05,
      transform: 'rotate(15deg)',
    },
    forum: {
      backgroundImage: `url(${zelijBackground})`,
      backgroundSize: '250px',
      backgroundRepeat: 'repeat',
      opacity: 0.04,
      transform: 'rotate(-5deg)',
    },
    footer: {
      backgroundImage: `url(${zelijBackground})`,
      backgroundSize: '150px',
      backgroundPosition: 'center',
      opacity: 0.15,
      filter: 'saturate(0.7)',
    },
  };

  return (
    <div className="bg-neutral-50 py-12">
      {/* Course Header - First zelij design */}
      <div className="bg-primary text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0" style={zelijStyles.header} />
        <div className="container-custom relative z-10">
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
                  <span>
                    {course.rating} ({course.reviewCount} reviews)
                  </span>
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

            {/* Second zelij design - course card with sidebar pattern */}
            <div className="md:pl-8">
              <div className="bg-white rounded-xl p-6 shadow-lg relative overflow-hidden">
                <div
                  className="absolute inset-0 right-auto w-12"
                  style={zelijStyles.sidebar}
                />
                <div className="relative z-10">
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
                  {course.enrolled ? (
                    <button
                      onClick={startCourse}
                      className="btn-primary w-full py-4 mb-4"
                    >
                      Continue Learning
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="btn-primary w-full py-4 mb-4"
                    >
                      Enroll Now
                    </button>
                  )}
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
                    <li className="flex items-center">
                      <FiMessageSquare className="mr-2" />
                      Instructor-led discussion forums
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container-custom mt-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Content Tabs - Third zelij design for curriculum section */}
            <div className="bg-white rounded-xl shadow-card overflow-hidden">
              <div className="border-b border-neutral-200">
                <div className="flex overflow-x-auto">
                  {[
                    'overview',
                    'curriculum',
                    'instructor',
                    'reviews',
                    'forum',
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
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
                      <h3 className="font-heading font-semibold text-xl mb-4">
                        Description
                      </h3>
                      <p className="text-neutral-600 whitespace-pre-line">
                        {course.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-4">
                        What You&apos;ll Learn
                      </h3>
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
                      <h3 className="font-heading font-semibold text-xl mb-4">
                        Requirements
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-neutral-600">
                        {course.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div className="space-y-6 relative">
                    <div
                      className="absolute inset-0"
                      style={zelijStyles.curriculum}
                    />
                    <div className="relative z-10">
                      <h3 className="font-heading font-semibold text-xl mb-4">
                        Course Content
                      </h3>
                      <div className="mb-4 text-neutral-600">
                        <span className="font-medium">
                          {course.curriculum.length} sections
                        </span>{' '}
                        • {course.duration} total length
                      </div>

                      {course.curriculum.map((section, index) => (
                        <div
                          key={index}
                          className="border border-neutral-200 rounded-lg mb-4 overflow-hidden"
                        >
                          <button
                            onClick={() => toggleSection(index)}
                            className="w-full p-4 bg-neutral-50 font-medium flex justify-between items-center"
                          >
                            <div className="flex items-center">
                              <FiChevronDown
                                className={`mr-2 transition-transform ${
                                  expandedSections[index] ? 'rotate-180' : ''
                                }`}
                              />
                              <span>{section.title}</span>
                            </div>
                            <span className="text-sm text-neutral-500">
                              {section.totalDuration}
                            </span>
                          </button>

                          {expandedSections[index] && (
                            <div className="divide-y divide-neutral-200">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lessonIndex}
                                  className="p-4 flex justify-between items-center"
                                >
                                  <div className="flex items-center">
                                    <FiPlay className="mr-3 text-primary" />
                                    <span>{lesson.title}</span>
                                    {lesson.preview && (
                                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                                        Preview
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-neutral-500 mr-3">
                                      {lesson.duration}
                                    </span>
                                    {!lesson.preview && !course.enrolled && (
                                      <FiLock className="text-neutral-400" />
                                    )}
                                    {course.enrolled && (
                                      <button
                                        onClick={startCourse}
                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20"
                                      >
                                        Watch
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'forum' && (
                  <div className="space-y-6 relative">
                    <div
                      className="absolute inset-0"
                      style={zelijStyles.forum}
                    />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-heading font-semibold text-xl">
                          Discussion Forums
                        </h3>
                        {course.isInstructor && (
                          <button
                            onClick={() => setShowNewForumForm(true)}
                            className="btn-primary flex items-center"
                          >
                            <FiPlus className="mr-2" />
                            Create New Forum
                          </button>
                        )}
                      </div>

                      {showNewForumForm && (
                        <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6">
                          <h4 className="font-medium mb-3">
                            Create a New Discussion Forum
                          </h4>
                          <input
                            type="text"
                            value={newForumTopic}
                            onChange={(e) => setNewForumTopic(e.target.value)}
                            placeholder="Forum Title"
                            className="w-full p-3 border border-neutral-300 rounded-md mb-3"
                          />
                          <textarea
                            value={newForumDescription}
                            onChange={(e) =>
                              setNewForumDescription(e.target.value)
                            }
                            placeholder="Forum Description"
                            className="w-full p-3 border border-neutral-300 rounded-md mb-3 min-h-[100px]"
                          />
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => setShowNewForumForm(false)}
                              className="px-4 py-2 border border-neutral-300 rounded-md"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleCreateForum}
                              className="btn-primary"
                            >
                              Create Forum
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Forum Messages View */}
                      {activeForumId ? (
                        <div>
                          {getActiveForum() && (
                            <div>
                              <div className="flex items-center mb-4">
                                <button
                                  onClick={() => setActiveForumId(null)}
                                  className="mr-3 text-primary hover:underline"
                                >
                                  ← Back to Forums
                                </button>
                              </div>

                              <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6">
                                <h4 className="font-semibold text-xl mb-2">
                                  {getActiveForum().title}
                                </h4>
                                <p className="text-neutral-600 mb-2">
                                  {getActiveForum().description}
                                </p>
                                <div className="text-sm text-neutral-500">
                                  Created by {getActiveForum().createdBy} •{' '}
                                  {getActiveForum().createdAt}
                                </div>
                              </div>

                              <div className="space-y-4 mb-6">
                                {getActiveForum().messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`p-4 rounded-lg ${
                                      message.isInstructor
                                        ? 'bg-primary/5 border-l-4 border-primary'
                                        : 'bg-white border border-neutral-200'
                                    }`}
                                  >
                                    <div className="flex items-center mb-2">
                                      <span className="font-medium mr-2">
                                        {message.author}
                                      </span>
                                      {message.isInstructor && (
                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                          Instructor
                                        </span>
                                      )}
                                      <span className="text-sm text-neutral-500 ml-auto">
                                        {message.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-neutral-700">
                                      {message.text}
                                    </p>
                                  </div>
                                ))}
                              </div>

                              <div className="mt-4">
                                <label className="block text-sm font-medium text-neutral-700 mb-1">
                                  Post a Reply
                                </label>
                                <div className="flex">
                                  <textarea
                                    value={newMessage}
                                    onChange={(e) =>
                                      setNewMessage(e.target.value)
                                    }
                                    placeholder="Type your message here..."
                                    className="flex-grow p-3 border border-neutral-300 rounded-l-md"
                                    rows={3}
                                  />
                                  <button
                                    onClick={handleSendMessage}
                                    className="bg-primary text-white px-4 rounded-r-md hover:bg-primary-dark transition-colors flex items-center"
                                  >
                                    <FiSend />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {course.forums.map((forum) => (
                            <div
                              key={forum.id}
                              className="bg-white p-4 rounded-lg border border-neutral-200 hover:border-primary transition-colors"
                            >
                              <h4 className="font-medium text-lg mb-2">
                                {forum.title}
                              </h4>
                              <p className="text-neutral-600 mb-3">
                                {forum.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-neutral-500">
                                  Created by {forum.createdBy} •{' '}
                                  {forum.createdAt}
                                </div>
                                <button
                                  onClick={() => setActiveForumId(forum.id)}
                                  className="text-primary hover:text-primary-dark flex items-center"
                                >
                                  View Discussion
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fourth zelij design - call to action footer */}
          <div className="col-span-3 mt-12">
            <div className="bg-secondary/90 text-white p-8 rounded-xl relative overflow-hidden">
              <div className="absolute inset-0" style={zelijStyles.footer} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to start your learning journey?
                </h3>
                <p className="mb-6 text-white/90">
                  Join thousands of students already enrolled in this course
                </p>
                {course.enrolled ? (
                  <button
                    onClick={startCourse}
                    className="bg-white text-secondary hover:bg-neutral-100 font-medium py-3 px-6 rounded-md transition-colors"
                  >
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={handleEnroll}
                    className="bg-white text-secondary hover:bg-neutral-100 font-medium py-3 px-6 rounded-md transition-colors"
                  >
                    Enroll Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
