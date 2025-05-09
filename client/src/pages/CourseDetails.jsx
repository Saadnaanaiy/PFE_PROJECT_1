import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {
  FiPlay,
  FiClock,
  FiBook,
  FiAward,
  FiStar,
  FiDownload,
  FiMessageSquare,
  FiPlus,
  FiSend,
  FiChevronDown,
  FiLock,
} from 'react-icons/fi';
import zelijBackground from '../assets/zelijBack.png';
import axios from 'axios';

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [newForumTopic, setNewForumTopic] = useState('');
  const [newForumDescription, setNewForumDescription] = useState('');
  const [showNewForumForm, setShowNewForumForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeForumId, setActiveForumId] = useState(null);
  const [activeDiscussionId, setActiveDiscussionId] = useState(null);
  const messagesEndRef = useRef(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'instructeur', 'etudiant', or null
  const [isCourseFree, setIsCourseFree] = useState(false);

  // Initialize Echo for real-time messaging
  useEffect(() => {
    try {
      // Check if we have the required environment variables
      const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY;
      const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;
      
      // Only initialize Echo if we have the required configuration
      if (pusherKey) {
        console.log('Initializing Laravel Echo with Pusher');
        window.Pusher = Pusher;
        window.Echo = new Echo({
          broadcaster: 'pusher',
          key: pusherKey,
          cluster: pusherCluster || 'mt1',
          // No authentication needed for public channels
          authEndpoint: '/api/broadcasting/auth',
          // Add CSRF token to requests
          csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        });
      } else {
        console.log('Pusher configuration not found, real-time messaging disabled');
      }
    } catch (error) {
      console.error('Error initializing Echo:', error);
    }

    return () => {
      if (window.Echo) {
        try {
          window.Echo.disconnect();
        } catch (error) {
          console.error('Error disconnecting Echo:', error);
        }
      }
    };
  }, []);

  // Subscribe to discussion channel when discussionId changes
  useEffect(() => {
    if (!activeDiscussionId || !window.Echo) return;

    try {
      // Use public channel instead of private to avoid authentication issues
      const channel = window.Echo.channel(`discussion.${activeDiscussionId}`);
      
      console.log(`Subscribing to public channel: discussion.${activeDiscussionId}`);
      
      channel.listen('NewMessageEvent', (event) => {
        console.log('Received new message event:', event);
        
        // Update the course data to include the new message
        setCourse(prevCourse => {
          if (!prevCourse || !prevCourse.forums) return prevCourse;
          
          // Find the active forum
          const updatedForums = prevCourse.forums.map(forum => {
            // Find the active discussion
            if (forum.id === activeForumId) {
              const updatedDiscussions = forum.discussions.map(discussion => {
                if (discussion.id === activeDiscussionId) {
                  // Add the new message to the discussion
                  return {
                    ...discussion,
                    messages: [...(discussion.messages || []), event.message || event]
                  };
                }
                return discussion;
              });
              return { ...forum, discussions: updatedDiscussions };
            }
            return forum;
          });
          
          return { ...prevCourse, forums: updatedForums };
        });
      });

      return () => {
        try {
          channel.stopListening('NewMessageEvent');
        } catch (error) {
          console.error('Error stopping Echo listener:', error);
        }
      };
    } catch (error) {
      console.error('Error subscribing to discussion channel:', error);
      return () => {};
    }
  }, [activeDiscussionId, activeForumId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [course?.forums]);

  // Fetch course details and check user role
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/courses/${courseId}`);
        setCourse(response.data.data);
        console.log('Course details:', response.data.data);

        // Check if course is free (all lessons are free)
        checkIfCourseFree(response.data.data);

        // Try to get current user information
        await checkUserRole();

        setError(null);
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError('Failed to load course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Check if all lessons in the course are free
  const checkIfCourseFree = (courseData) => {
    if (!courseData || !courseData.sections) {
      setIsCourseFree(false);
      return;
    }

    // If course price is 0, it's free
    if (courseData.prix === 0) {
      setIsCourseFree(true);
      return;
    }

    // Otherwise check all lessons
    let allLessonsFree = true;

    // Loop through all sections and their lessons
    for (const section of courseData.sections) {
      if (!section.lecons || section.lecons.length === 0) continue;

      for (const lecon of section.lecons) {
        if (!lecon.estGratuite) {
          allLessonsFree = false;
          break;
        }
      }

      if (!allLessonsFree) break;
    }

    setIsCourseFree(allLessonsFree);
  };

  // Check if the current user is the instructor of this course or a student
  const checkUserRole = async () => {
    try {
      // Get current user data
      const userResponse = await axios.get('/api/user');
      console.log('User data:', userResponse.data);

      // Check if we got a valid response
      if (userResponse.data) {
        // Extract user data - the response structure might vary
        const userData = userResponse.data.data || userResponse.data;

        console.log('Raw user data:', userData);
        console.log('User role from API:', userData.role);

        if (userData.role === 'instructeur') {
          console.log('Setting user as instructor');
          setUserRole('instructeur');
        } else if (userData.role === 'etudiant') {
          console.log('Setting user as student');
          setUserRole('etudiant');
        } else {
          setUserRole(userData.role);
        }
      } else {
        console.log('No user data in response');
        setUserRole(null);
      }
    } catch (err) {
      console.error('Error checking user role:', err);
      // If there's an error or user is not logged in, they can still view the course
      setUserRole(null);
    }
  };

  // Toggle section expansion in curriculum
  const toggleSection = (sectionIndex) => {
    setExpandedSections({
      ...expandedSections,
      [sectionIndex]: !expandedSections[sectionIndex],
    });
  };

  const handleEnroll = async () => {
    if (isCourseFree) {
      // Navigate to the course learning page if free
      navigate(`/course/${courseId}/learn`);
    } else {
      // Navigate to payment page if not free
     const response = await axios.post('/api/checkout');
      console.log(response.data);

      // Redirect to Stripe's checkout page
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    }
  };

  // Handle creating a new forum
  const handleCreateForum = async () => {
    if (!newForumTopic || !newForumDescription) return;

    try {
      // In a real app, you would make an API call to create a new forum
      await axios.post(`/api/courses/${courseId}/forums`, {
        titre: newForumTopic,
        description: newForumDescription,
        cours_id: courseId,
      });

      // Refresh course details to show the new forum
      const response = await axios.get(`/api/courses/${courseId}`);
      setCourse(response.data.data);

      // Reset form
      setShowNewForumForm(false);
      setNewForumTopic('');
      setNewForumDescription('');
    } catch (err) {
      console.error('Error creating forum:', err);
      alert('Failed to create forum. Please try again.');
    }
  };

  // Handle sending a message in a forum
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeDiscussionId) return;

    try {
      // Send the message to the discussion
      const response = await axios.post(`/api/discussions/${activeDiscussionId}/messages`, {
        contenu: newMessage,
      });

      console.log('Message sent successfully:', response.data);

      // If Echo isn't working, manually update the UI
      if (!window.Echo) {
        // Refresh forum data
        const courseResponse = await axios.get(`/api/courses/${courseId}`);
        setCourse(courseResponse.data.data);
      }

      // Reset message field
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    }
  };

  // Get active forum data
  const getActiveForum = () => {
    return course?.forums?.find((forum) => forum.id === activeForumId);
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">No course data available.</p>
        </div>
      </div>
    );
  }

  console.log('Current user role:', userRole);

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
                {course.titre}
              </motion.h1>
              <p className="text-white/90 text-lg mb-6">
                By {course.instructeur?.user?.nom}
              </p>
              <div className="flex items-center space-x-6 text-white/80">
                <div className="flex items-center">
                  <FiStar className="mr-1" />
                  <span>{course.rating || 0}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="mr-1" />
                  <span>{course.dureeMinutes} minutes</span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium bg-white/20`}
                  >
                    {course.niveau}
                  </span>
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
                    alt={course.titre}
                    className="w-full aspect-video rounded-lg object-cover mb-6"
                  />
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-secondary">
                      {course.prix} MAD
                    </span>
                    {course.prix_original && (
                      <span className="ml-2 text-lg line-through text-neutral-500">
                        {course.prix_original} MAD
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleEnroll}
                    className="btn-primary w-full py-4 mb-4"
                  >
                    {isCourseFree ? 'Go to Course' : 'Enroll Now'}
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
                  {['overview', 'curriculum', 'instructor', 'forum'].map(
                    (tab) => (
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
                    ),
                  )}
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
                        {course.whatYouWillLearn?.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <FiBook className="mt-1 mr-2 text-primary" />
                            <span className="text-neutral-600">{item}</span>
                          </div>
                        )) || (
                          <p className="text-neutral-600">
                            No learning objectives specified for this course.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-heading font-semibold text-xl mb-4">
                        Requirements
                      </h3>
                      <ul className="list-disc list-inside space-y-2 text-neutral-600">
                        {course.requirements?.map((req, index) => (
                          <li key={index}>{req}</li>
                        )) || (
                          <li>No specific requirements for this course.</li>
                        )}
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
                          {course.sections?.length || 0} sections
                        </span>{' '}
                        • {course.dureeMinutes} minutes total length
                      </div>

                      {course.sections?.map((section, index) => (
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
                              <span>{section.titre}</span>
                            </div>
                            <span className="text-sm text-neutral-500">
                              {section.lecons?.length || 0} lessons
                            </span>
                          </button>

                          {expandedSections[index] && (
                            <div className="divide-y divide-neutral-200">
                              {section.lecons?.map((lecon, lessonIndex) => (
                                <div
                                  key={lessonIndex}
                                  className="p-4 flex justify-between items-center"
                                >
                                  <div className="flex items-center">
                                    <FiPlay className="mr-3 text-primary" />
                                    <span>{lecon.titre}</span>
                                    {lecon.estGratuite && (
                                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-md">
                                        Preview
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-neutral-500 mr-3">
                                      {lecon.video?.dureeMinutes || 0} minutes
                                    </span>
                                    {!lecon.estGratuite && (
                                      <FiLock className="text-neutral-400" />
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

                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="mr-4">
                        {course.instructeur?.image ? (
                          <img
                            src={course.instructeur.image}
                            alt={course.instructeur.user?.nom}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                            {course.instructeur?.user?.nom?.charAt(0) || 'I'}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-xl mb-1">
                          {course.instructeur?.user?.nom}
                        </h3>
                        <p className="text-neutral-600 mb-3">
                          {course.instructeur?.specialite || 'Instructor'}
                        </p>
                        <p className="text-neutral-600">
                          {course.instructeur?.bio ||
                            'No bio available for this instructor.'}
                        </p>
                      </div>
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
                        {userRole === 'instructeur' && (
                          <button
                            onClick={() => setShowNewForumForm(true)}
                            className="btn-primary flex items-center"
                          >
                            <FiPlus className="mr-2" />
                            Create New Forum
                          </button>
                        )}
                      </div>

                      {showNewForumForm && userRole === 'instructeur' && (
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

                      {/* Forum detail view */}
                      {activeForumId ? (
                        <div>
                          {getActiveForum() && (
                            <div>
                              <div className="flex items-center mb-4">
                                <button
                                  onClick={() => {
                                    setActiveForumId(null);
                                    setActiveDiscussionId(null);
                                  }}
                                  className="mr-3 text-primary hover:underline"
                                >
                                  ← Back to Forums
                                </button>
                              </div>

                              <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6">
                                <h4 className="font-semibold text-xl mb-2">
                                  {getActiveForum().titre ||
                                    getActiveForum().title}
                                </h4>
                                <p className="text-neutral-600 mb-2">
                                  {getActiveForum().description}
                                </p>
                                <div className="text-sm text-neutral-500">
                                  Created{' '}
                                  {formatDate(
                                    getActiveForum().dateCreation ||
                                      getActiveForum().createdAt,
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4 mb-6">
                                {/* Show discussion title */}
                              <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                                <h4 className="font-semibold text-lg mb-1">
                                  Discussion: {getActiveForum().discussions?.find(d => d.id === activeDiscussionId)?.titre || 'Untitled Discussion'}
                                </h4>
                                <p className="text-neutral-600">
                                  {getActiveForum().discussions?.find(d => d.id === activeDiscussionId)?.contenu || 'No description available'}
                                </p>
                              </div>
                              
                              {/* Messages list */}
                              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto p-2">
                                {getActiveForum().discussions?.find(d => d.id === activeDiscussionId)?.messages?.map(
                                  (message) => (
                                    <div
                                      key={message.id}
                                      className={`p-4 rounded-lg ${
                                        message.user?.role === 'instructeur'
                                          ? 'bg-primary/5 border-l-4 border-primary'
                                          : 'bg-white border border-neutral-200'
                                      }`}
                                    >
                                      <div className="flex items-center mb-2">
                                        <span className="font-medium mr-2">
                                          {message.user?.nom || 'Anonymous'}
                                        </span>
                                        {message.user?.role ===
                                          'instructeur' && (
                                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                            Instructor
                                          </span>
                                        )}
                                        <span className="text-sm text-neutral-500 ml-auto">
                                          {formatDate(message.dateEnvoi)}
                                        </span>
                                      </div>
                                      <p className="text-neutral-700">
                                        {message.contenu}
                                      </p>
                                    </div>
                                  ),
                                )}
                                <div ref={messagesEndRef} />
                              </div>
                              </div>

                              {/* Only allow instructors to add messages */}
                              {userRole === 'instructeur' && (
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
                                      disabled={!newMessage.trim()}
                                    >
                                      <FiSend />
                                    </button>
                                  </div>
                                </div>
                              )}

                              {!userRole && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                                  <p>
                                    Please log in to view discussions.
                                  </p>
                                </div>
                              )}
                              
                              {userRole === 'etudiant' && (
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
                                  <p>
                                    Only instructors can add discussions in this forum.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {course.forums?.map((forum) => (
                            <div
                              key={forum.id}
                              className="bg-white p-4 rounded-lg border border-neutral-200 hover:border-primary transition-colors"
                            >
                              <h4 className="font-medium text-lg mb-2">
                                {forum.titre || forum.title}
                              </h4>
                              <p className="text-neutral-600 mb-3">
                                {forum.description}
                              </p>
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-neutral-500">
                                  Created{' '}
                                  {formatDate(
                                    forum.dateCreation || forum.createdAt,
                                  )}
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveForumId(forum.id);
                                    // If there's at least one discussion, select the first one
                                    if (forum.discussions && forum.discussions.length > 0) {
                                      setActiveDiscussionId(forum.discussions[0].id);
                                    }
                                  }}
                                  className="text-primary hover:text-primary-dark flex items-center"
                                >
                                  View Discussions
                                </button>
                              </div>
                            </div>
                          )) || (
                            <p className="text-neutral-600">
                              {userRole === 'instructeur'
                                ? 'No forums available yet. Create one to start discussions with your students!'
                                : 'No forums available for this course yet.'}
                            </p>
                          )}
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
                <button
                  onClick={handleEnroll}
                  className="bg-white text-secondary hover:bg-neutral-100 font-medium py-3 px-6 rounded-md transition-colors"
                >
                  {isCourseFree ? 'Go to Course' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
