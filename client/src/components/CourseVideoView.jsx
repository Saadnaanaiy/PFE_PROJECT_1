import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FiChevronLeft,
  FiCheck,
  FiLock,
  FiPlay,
  FiBook,
  FiMessageSquare,
  FiClock,
  FiDownload,
  FiCalendar,
  FiUser,
  FiAward,
  FiChevronDown,
  FiBookmark,
  FiFile,
  FiFileText,
  FiChevronRight,
  FiX,
} from 'react-icons/fi';
import VideoPlayer from './VideoPlayer';

import laravelVideo from '../assets/laravel.mp4';

// Moroccan color palette
const moroccanColors = {
  primary: '#E63946',      // Vibrant red
  secondary: '#2A9D8F',    // Teal
  tertiary: '#F4A261',     // Sandy orange
  accent1: '#E9C46A',      // Gold
  accent2: '#264653',      // Deep blue
  accent3: '#5F4B8B',      // Royal purple
};

const CourseVideoView = ({ onBack }) => {
  const { courseId } = useParams();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});
  const [completedLessons, setCompletedLessons] = useState({});
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Fetch course data
  useEffect(() => {
    // In a real app, this would be an API call using the courseId
    // For demo purposes, we'll use mock data
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Simulate API call
        setTimeout(() => {
          setCourse({
            id: courseId,
            title: 'Complete Web Development Bootcamp',
            instructor: 'Dr. Mohammed Bennani',
            image:
              'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=600',
            rating: 4.8,
            reviewCount: 247,
            duration: '22 hours',
            level: 'Beginner',
            curriculum: [
              {
                title: 'Introduction to Web Development',
                totalDuration: '45:00',
                color: moroccanColors.primary,
                lessons: [
                  {
                    title: 'Course Overview',
                    duration: '10:00',
                    preview: true,
                  },
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
                color: moroccanColors.secondary,
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
                color: moroccanColors.tertiary,
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
                color: moroccanColors.accent1,
                lessons: [
                  {
                    title: 'JavaScript Syntax Basics',
                    duration: '40:00',
                    preview: false,
                  },
                  {
                    title: 'Working with DOM',
                    duration: '50:00',
                    preview: false,
                  },
                  {
                    title: 'Event Handling',
                    duration: '35:00',
                    preview: false,
                  },
                  { title: 'ES6+ Features', duration: '45:00', preview: false },
                  {
                    title: 'Asynchronous JavaScript',
                    duration: '30:00',
                    preview: false,
                  },
                ],
              },
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Initialize with first section expanded once course is loaded
  useEffect(() => {
    if (course) {
      setExpandedSections({ 0: true });
    }
  }, [course]);

  // Get active video URL
  const getActiveVideo = () => {
    // Use the imported Laravel video instead of the sample URL
    return laravelVideo;
  };

  const getActiveLesson = () => {
    if (
      course?.curriculum?.[activeSectionIndex]?.lessons?.[activeLessonIndex]
    ) {
      return course.curriculum[activeSectionIndex].lessons[activeLessonIndex];
    }
    return null;
  };

  const toggleSection = (sectionIndex) => {
    setExpandedSections({
      ...expandedSections,
      [sectionIndex]: !expandedSections[sectionIndex],
    });
  };

  const selectLesson = (sectionIndex, lessonIndex) => {
    setActiveSectionIndex(sectionIndex);
    setActiveLessonIndex(lessonIndex);

    // In a real app, you'd save this progress to the backend
    // For now, we'll just expand the selected section
    setExpandedSections({
      ...expandedSections,
      [sectionIndex]: true,
    });
  };

  const markLessonComplete = () => {
    const key = `${activeSectionIndex}-${activeLessonIndex}`;
    setCompletedLessons({
      ...completedLessons,
      [key]: true,
    });

    // Automatically advance to next lesson if available
    const currentSection = course.curriculum[activeSectionIndex];
    if (activeLessonIndex < currentSection.lessons.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    } else if (activeSectionIndex < course.curriculum.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1);
      setActiveLessonIndex(0);
      setExpandedSections({
        ...expandedSections,
        [activeSectionIndex + 1]: true,
      });
    }
  };

  const isLessonCompleted = (sectionIndex, lessonIndex) => {
    const key = `${sectionIndex}-${lessonIndex}`;
    return completedLessons[key] || false;
  };

  // Calculate course progress
  const calculateProgress = () => {
    if (!course) return 0;

    const totalLessons = course.curriculum.reduce(
      (total, section) => total + section.lessons.length,
      0,
    );
    const completed = Object.keys(completedLessons).length;
    return Math.round((completed / totalLessons) * 100);
  };

  // Moroccan zelij background styles with SVG patterns
  const moroccanStyles = {
    sidebar: {
      background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='none' stroke='%23${moroccanColors.accent1.substring(
        1,
      )}' stroke-width='1'/%3E%3Cpath d='M50 20 L80 50 L50 80 L20 50 Z' fill='none' stroke='%23${moroccanColors.primary.substring(
        1,
      )}' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '150px',
      backgroundPosition: 'center',
      opacity: 0.15,
    },
    notes: {
      background: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 10 L110 60 L60 110 L10 60 Z' fill='none' stroke='%23${moroccanColors.secondary.substring(
        1,
      )}' stroke-width='1'/%3E%3Cpath d='M60 30 L90 60 L60 90 L30 60 Z' fill='none' stroke='%23${moroccanColors.tertiary.substring(
        1,
      )}' stroke-width='1'/%3E%3Ccircle cx='60' cy='60' r='10' fill='none' stroke='%23${moroccanColors.accent3.substring(
        1,
      )}' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '200px',
      backgroundRepeat: 'repeat',
      opacity: 0.08,
    },
    header: {
      background: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 5 L75 40 L40 75 L5 40 Z' fill='none' stroke='%23${moroccanColors.primary.substring(
        1,
      )}' stroke-width='1'/%3E%3Cpath d='M40 20 L60 40 L40 60 L20 40 Z' fill='none' stroke='%23${moroccanColors.secondary.substring(
        1,
      )}' stroke-width='1'/%3E%3C/svg%3E")`,
      backgroundSize: '120px',
      backgroundPosition: 'center',
      opacity: 0.1,
    },
    buttonGradient: `linear-gradient(to right, ${moroccanColors.primary}, ${moroccanColors.secondary})`,
    progressGradient: `linear-gradient(to right, ${moroccanColors.secondary}, ${moroccanColors.tertiary})`,
  };

  const activeLesson = getActiveLesson();
  const activeSection = course?.curriculum?.[activeSectionIndex];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-5">
            <div
              className="absolute inset-0"
              style={moroccanStyles.notes}
            ></div>
            <div
              className="w-24 h-24 border-4 rounded-full animate-spin relative z-10"
              style={{
                borderColor: `${moroccanColors.primary} transparent ${moroccanColors.secondary} transparent`,
              }}
            ></div>
          </div>
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: moroccanColors.primary }}
          >
            Loading Course
          </h3>
          <p className="text-neutral-600">
            Preparing your learning experience...
          </p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="text-center p-8 max-w-md bg-white rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0" style={moroccanStyles.notes}></div>
          <div className="relative z-10">
            <div
              className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${moroccanColors.primary}20` }}
            >
              <FiBook
                className="text-2xl"
                style={{ color: moroccanColors.primary }}
              />
            </div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-3">
              Course Not Found
            </h2>
            <p className="text-neutral-600 mb-6">
              We couldn&apos;t find the course you&apos;re looking for. It may
              have been removed or the link is incorrect.
            </p>
            <button
              onClick={onBack}
              className="px-6 py-2 text-white rounded-md hover:shadow-lg transition-all"
              style={{ background: moroccanStyles.buttonGradient }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      {/* Header with Moroccan pattern background */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-sm relative">
        <div className="absolute inset-0" style={moroccanStyles.header}></div>
        <div className="container-custom py-3 relative z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center mr-4 text-neutral-700 hover:text-white transition-all bg-neutral-100 hover:shadow-md p-2 rounded-md"
                style={{
                  borderLeft: `3px solid ${moroccanColors.primary}`,
                  ':hover': { backgroundColor: moroccanColors.primary },
                }}
              >
                <FiChevronLeft className="text-lg" />
              </button>
              <div className="hidden md:block">
                <h1 className="font-medium text-neutral-800 truncate max-w-md">
                  {course.title}
                </h1>
                <div className="flex items-center text-sm text-neutral-500">
                  <FiUser
                    className="mr-1"
                    style={{ color: moroccanColors.primary }}
                  />
                  <span>{course.instructor}</span>
                  <span className="mx-2">•</span>
                  <FiAward
                    className="mr-1"
                    style={{ color: moroccanColors.secondary }}
                  />
                  <span>{course.level}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-neutral-600 hidden sm:block">
                Your progress:{' '}
                <span
                  className="font-medium"
                  style={{ color: moroccanColors.primary }}
                >
                  {calculateProgress()}%
                </span>
              </div>
              <div className="w-24 h-2.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${calculateProgress()}%`,
                    background: moroccanStyles.progressGradient,
                  }}
                ></div>
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 bg-neutral-100 rounded-md text-neutral-700 hover:bg-neutral-200 md:hidden"
              >
                {sidebarCollapsed ? <FiChevronLeft /> : <FiChevronDown />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`grid ${
          sidebarCollapsed
            ? 'grid-cols-1'
            : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
        } min-h-[calc(100vh-64px)]`}
      >
        {/* Video and content area */}
        <div
          className={`${
            sidebarCollapsed ? 'col-span-1' : 'md:col-span-2 lg:col-span-3'
          } bg-white p-4 md:p-6`}
        >
          <div className="max-w-4xl mx-auto">
            {/* Video player with Moroccan-inspired border */}
            <div
              className="bg-neutral-900 rounded-xl overflow-hidden shadow-xl"
              style={{ border: `3px solid ${moroccanColors.accent1}` }}
            >
              <VideoPlayer
                videoUrl={getActiveVideo()}
                thumbnail={course.image}
                title={activeLesson?.title}
                previewOnly={false}
                onComplete={markLessonComplete}
              />
            </div>

            {/* Course information and navigation */}
            <div className="mt-2 flex items-center justify-between text-sm text-neutral-500 px-1">
              <div className="flex items-center">
                <span
                  className="font-medium"
                  style={{
                    color:
                      course?.curriculum?.[activeSectionIndex]?.color ||
                      moroccanColors.primary,
                  }}
                >
                  {activeSection?.title}
                </span>
                <span className="mx-2">•</span>
                <span>
                  Lesson {activeLessonIndex + 1}/{activeSection?.lessons.length}
                </span>
              </div>
              <div className="flex space-x-4">
                <button className="flex items-center hover:text-primary transition-colors group">
                  <FiBookmark
                    className="mr-1 group-hover:scale-110 transition-transform"
                    style={{ color: moroccanColors.tertiary }}
                  />
                  <span className="hidden sm:inline">Bookmark</span>
                </button>
                <button className="flex items-center hover:text-primary transition-colors group">
                  <FiDownload
                    className="mr-1 group-hover:scale-110 transition-transform"
                    style={{ color: moroccanColors.accent3 }}
                  />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden md:flex items-center hover:text-primary transition-all group"
                >
                  {sidebarCollapsed ? (
                    <>
                      <FiChevronLeft
                        className="mr-1 group-hover:scale-110 transition-transform"
                        style={{ color: moroccanColors.secondary }}
                      />
                      <span className="hidden sm:inline">Show Sidebar</span>
                    </>
                  ) : (
                    <>
                      <FiChevronRight
                        className="mr-1 group-hover:scale-110 transition-transform"
                        style={{ color: moroccanColors.secondary }}
                      />
                      <span className="hidden sm:inline">Hide Sidebar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Content tabs */}
            <div className="mt-6 border-b border-neutral-200">
              <div className="flex">
                {['content', 'notes', 'discussions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab
                        ? 'text-primary'
                        : 'text-neutral-600 hover:text-primary'
                    }`}
                    style={{
                      color: activeTab === tab ? moroccanColors.primary : '',
                    }}
                  >
                    {activeTab === tab && (
                      <span
                        className="absolute bottom-0 left-0 w-full h-1 rounded-t-md"
                        style={{ background: moroccanStyles.buttonGradient }}
                      ></span>
                    )}
                    {tab === 'content' && (
                      <FiFileText
                        className="inline-block mr-2"
                        style={{
                          color:
                            activeTab === tab
                              ? moroccanColors.primary
                              : moroccanColors.tertiary,
                        }}
                      />
                    )}
                    {tab === 'notes' && (
                      <FiBook
                        className="inline-block mr-2"
                        style={{
                          color:
                            activeTab === tab
                              ? moroccanColors.primary
                              : moroccanColors.secondary,
                        }}
                      />
                    )}
                    {tab === 'discussions' && (
                      <FiMessageSquare
                        className="inline-block mr-2"
                        style={{
                          color:
                            activeTab === tab
                              ? moroccanColors.primary
                              : moroccanColors.accent1,
                        }}
                      />
                    )}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            <div className="mt-6">
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm relative overflow-hidden">
                    <div
                      className="absolute top-0 left-0 w-full h-1.5"
                      style={{ background: moroccanStyles.buttonGradient }}
                    ></div>
                    <h1
                      className="text-2xl font-bold mb-3"
                      style={{
                        color:
                          course?.curriculum?.[activeSectionIndex]?.color ||
                          moroccanColors.primary,
                      }}
                    >
                      {activeLesson?.title}
                    </h1>
                    <div className="flex flex-wrap items-center text-sm text-neutral-500 mb-4">
                      <div className="flex items-center mr-4 mb-2">
                        <FiClock
                          className="mr-1"
                          style={{ color: moroccanColors.tertiary }}
                        />
                        <span>{activeLesson?.duration}</span>
                      </div>
                      <div className="flex items-center mr-4 mb-2">
                        <FiCalendar
                          className="mr-1"
                          style={{ color: moroccanColors.accent3 }}
                        />
                        <span>Updated April 2024</span>
                      </div>
                    </div>
                    <p className="text-neutral-600 mb-6">
                      This lesson covers the fundamentals of{' '}
                      {activeLesson?.title}. Follow along with the video
                      instruction to master these concepts.
                    </p>

                    <div className="bg-neutral-50 p-5 rounded-lg border border-neutral-200 relative overflow-hidden">
                      {/* Moroccan decorative corner */}
                      <div className="absolute top-0 right-0 w-12 h-12">
                        <svg
                          viewBox="0 0 100 100"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 0 L100 0 L100 100 Z"
                            fill={`${moroccanColors.tertiary}15`}
                          />
                          <path
                            d="M20 0 L100 0 L100 80 Z"
                            fill={`${moroccanColors.primary}10`}
                          />
                          <path
                            d="M40 0 L100 0 L100 60 Z"
                            fill={`${moroccanColors.secondary}05`}
                          />
                        </svg>
                      </div>

                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <FiFile
                          className="mr-2"
                          style={{ color: moroccanColors.primary }}
                        />
                        Additional Resources
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-center transition-colors hover:text-primary-dark">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                            style={{
                              backgroundColor: `${moroccanColors.primary}15`,
                            }}
                          >
                            <FiFileText
                              style={{ color: moroccanColors.primary }}
                            />
                          </div>
                          <a
                            href="#"
                            className="flex-1 hover:underline"
                            style={{ color: moroccanColors.primary }}
                          >
                            Lesson slides (PDF)
                          </a>
                          <span className="text-xs text-neutral-500">
                            1.2 MB
                          </span>
                        </li>
                        <li className="flex items-center transition-colors hover:text-primary-dark">
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center mr-3"
                            style={{
                              backgroundColor: `${moroccanColors.secondary}15`,
                            }}
                          >
                            <FiDownload
                              style={{ color: moroccanColors.secondary }}
                            />
                          </div>
                          <a
                            href="#"
                            className="flex-1 hover:underline"
                            style={{ color: moroccanColors.secondary }}
                          >
                            Exercise files
                          </a>
                          <span className="text-xs text-neutral-500">
                            4.5 MB
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-neutral-200 shadow-sm">
                    <button
                      className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        activeSectionIndex === 0 && activeLessonIndex === 0
                      }
                      onClick={() => {
                        if (activeLessonIndex > 0) {
                          setActiveLessonIndex(activeLessonIndex - 1);
                        } else if (activeSectionIndex > 0) {
                          setActiveSectionIndex(activeSectionIndex - 1);
                          setActiveLessonIndex(
                            course.curriculum[activeSectionIndex - 1].lessons
                              .length - 1,
                          );
                        }
                      }}
                    >
                      <FiChevronLeft className="mr-1" />
                      Previous Lesson
                    </button>

                    <button
                      className="px-4 py-2 text-white rounded-md hover:shadow-md flex items-center transition-all"
                      onClick={markLessonComplete}
                      style={{ background: moroccanStyles.buttonGradient }}
                    >
                      Mark as Complete
                      <FiCheck className="ml-1" />
                    </button>

                    <button
                      className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        activeSectionIndex === course.curriculum.length - 1 &&
                        activeLessonIndex ===
                          course.curriculum[activeSectionIndex].lessons.length -
                            1
                      }
                      onClick={() => {
                        const currentSection =
                          course.curriculum[activeSectionIndex];
                        if (
                          activeLessonIndex <
                          currentSection.lessons.length - 1
                        ) {
                          setActiveLessonIndex(activeLessonIndex + 1);
                        } else if (
                          activeSectionIndex <
                          course.curriculum.length - 1
                        ) {
                          setActiveSectionIndex(activeSectionIndex + 1);
                          setActiveLessonIndex(0);
                        }
                      }}
                    >
                      Next Lesson
                      <FiChevronLeft className="ml-1 rotate-180" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="relative">
                  <div
                    className="absolute inset-0"
                    style={moroccanStyles.notes}
                  ></div>
                  <div className="relative z-10">
                    <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                      <h3 className="font-medium text-lg mb-3 flex items-center">
                        <FiBook
                          className="mr-2"
                          style={{ color: moroccanColors.secondary }}
                        />
                        Your Notes for &quot;{activeLesson?.title}&quot;
                      </h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Your notes are saved automatically and are only visible
                        to you.
                      </p>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your notes for this lesson here..."
                        className="w-full p-4 border border-neutral-300 rounded-lg min-h-[250px] focus:ring transition-all"
                        style={{
                          borderColor: `${moroccanColors.secondary}40`,
                          ':focus': {
                            borderColor: moroccanColors.secondary,
                            ringColor: `${moroccanColors.secondary}20`,
                          },
                        }}
                      />
                      <div className="mt-4 flex justify-end">
                        <button
                          className="px-5 py-2 text-white rounded-md hover:shadow-md flex items-center transition-all"
                          style={{ background: moroccanStyles.buttonGradient }}
                        >
                          <FiCheck className="mr-2" />
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-sm">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="font-medium text-lg flex items-center">
                        <FiMessageSquare
                          className="mr-2"
                          style={{ color: moroccanColors.accent1 }}
                        />
                        Lesson Discussion
                      </h3>
                      <button
                        className="px-4 py-2 text-white rounded-md hover:shadow-md flex items-center transition-all"
                        style={{ background: moroccanStyles.buttonGradient }}
                      >
                        <FiMessageSquare className="mr-2" />
                        Ask a Question
                      </button>
                    </div>

                    <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 text-center relative overflow-hidden">
                      {/* Moroccan decorative element */}
                      <div className="absolute inset-0 opacity-5">
                        <div
                          className="w-full h-full"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 10 L110 60 L60 110 L10 60 Z' fill='none' stroke='%23${moroccanColors.primary.substring(
                              1,
                            )}' stroke-width='1'/%3E%3Ccircle cx='60' cy='60' r='20' fill='none' stroke='%23${moroccanColors.secondary.substring(
                              1,
                            )}' stroke-width='1'/%3E%3C/svg%3E")`,
                            backgroundSize: '60px',
                            backgroundPosition: 'center',
                          }}
                        ></div>
                      </div>

                      <div className="relative z-10">
                        <div
                          className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3"
                          style={{ background: `${moroccanColors.accent1}15` }}
                        >
                          <FiMessageSquare
                            className="text-2xl"
                            style={{ color: moroccanColors.accent1 }}
                          />
                        </div>
                        <h4 className="font-medium text-lg text-neutral-700 mb-2">
                          No discussions yet
                        </h4>
                        <p className="text-neutral-600 mb-1">
                          No questions have been asked about this lesson yet.
                        </p>
                        <p className="text-sm text-neutral-500">
                          Be the first to start a discussion!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar with curriculum - Moroccan style */}
        {!sidebarCollapsed && (
          <div className="md:col-span-1 lg:col-span-1 border-l border-neutral-200 overflow-y-auto max-h-[calc(100vh-64px)] relative bg-neutral-50">
            <div
              className="absolute inset-0"
              style={moroccanStyles.sidebar}
            ></div>
            <div className="p-4 relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="font-medium text-lg"
                  style={{ color: moroccanColors.primary }}
                >
                  Course Content
                </h3>
                <div className="flex items-center">
                  <div className="text-sm text-neutral-600 mr-2">
                    <span
                      className="font-medium"
                      style={{ color: moroccanColors.accent1 }}
                    >
                      {Object.keys(completedLessons).length}
                    </span>{' '}
                    /
                    <span>
                      {' '}
                      {course.curriculum.reduce(
                        (total, section) => total + section.lessons.length,
                        0,
                      )}{' '}
                      lessons
                    </span>
                  </div>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="hidden md:flex p-2 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded-full transition-colors"
                    style={{ color: moroccanColors.secondary }}
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 mb-5 flex items-center text-sm shadow-sm relative overflow-hidden">
                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-12 h-12">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0 100 L100 0 L100 100 Z"
                      fill={`${moroccanColors.tertiary}15`}
                    />
                    <path
                      d="M20 100 L100 20 L100 100 Z"
                      fill={`${moroccanColors.primary}10`}
                    />
                  </svg>
                </div>

                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={{ background: `${moroccanColors.accent1}20` }}
                >
                  <FiClock style={{ color: moroccanColors.accent1 }} />
                </div>
                <div className="relative z-10">
                  <p className="font-medium text-neutral-800">
                    {course.duration} total length
                  </p>
                  <p className="text-neutral-500 text-xs">
                    {course.curriculum.length} sections •{' '}
                    {course.curriculum.reduce(
                      (total, section) => total + section.lessons.length,
                      0,
                    )}{' '}
                    lessons
                  </p>
                </div>
              </div>

              {/* Course curriculum with Moroccan-styled sections */}
              {course.curriculum.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4">
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex justify-between items-center p-3 bg-white hover:bg-neutral-50 rounded-lg transition-colors border border-neutral-200 shadow-sm"
                    style={{
                      borderLeft: `4px solid ${section.color || '#4F46E5'}`,
                      background: expandedSections[sectionIndex]
                        ? `${section.color}05`
                        : '',
                    }}
                  >
                    <div className="flex items-center truncate pr-2">
                      <div
                        className={`mr-2 transition-transform text-neutral-400 flex items-center justify-center w-5 h-5 rounded-full`}
                        style={{
                          background: `${section.color}15`,
                          color: section.color,
                        }}
                      >
                        <FiChevronDown
                          className={`transition-transform ${
                            expandedSections[sectionIndex] ? 'rotate-180' : ''
                          }`}
                          fontSize="0.85rem"
                        />
                      </div>
                      <span
                        className="font-medium truncate"
                        style={{
                          color: expandedSections[sectionIndex]
                            ? section.color
                            : '',
                        }}
                      >
                        {section.title}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-neutral-500">
                      <span className="mr-2">{section.totalDuration}</span>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          background: `${section.color}15`,
                          color: section.color,
                        }}
                      >
                        {section.lessons.length}
                      </div>
                    </div>
                  </button>

                  {expandedSections[sectionIndex] && (
                    <div
                      className="mt-1 pl-2 border-l-2 transition-all"
                      style={{ borderColor: `${section.color}50` }}
                    >
                      {section.lessons.map((lesson, lessonIndex) => {
                        const isActive =
                          activeSectionIndex === sectionIndex &&
                          activeLessonIndex === lessonIndex;
                        const isCompleted = isLessonCompleted(
                          sectionIndex,
                          lessonIndex,
                        );

                        return (
                          <button
                            key={lessonIndex}
                            onClick={() =>
                              selectLesson(sectionIndex, lessonIndex)
                            }
                            className={`w-full flex justify-between items-center p-3 my-1 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-white text-primary shadow-sm'
                                : 'hover:bg-white hover:shadow-sm'
                            }`}
                            style={{
                              border: isActive
                                ? `1px solid ${section.color}30`
                                : '',
                              background: isActive ? `${section.color}10` : '',
                            }}
                          >
                            <div className="flex items-center truncate pr-2">
                              {/* Circular checkboxes */}
                              {isCompleted ? (
                                <div
                                  className="w-6 h-6 mr-2 rounded-full flex items-center justify-center text-white"
                                  style={{ background: section.color }}
                                >
                                  <FiCheck className="text-xs" />
                                </div>
                              ) : isActive ? (
                                <div
                                  className="w-6 h-6 mr-2 rounded-full flex items-center justify-center"
                                  style={{
                                    border: `2px solid ${section.color}`,
                                    background: `${section.color}15`,
                                  }}
                                >
                                  <FiPlay
                                    className="text-xs"
                                    style={{ color: section.color }}
                                  />
                                </div>
                              ) : (
                                <div className="w-6 h-6 mr-2 rounded-full border border-neutral-300"></div>
                              )}
                              <span className="text-sm truncate">
                                {lesson.title}
                              </span>
                              {lesson.preview && (
                                <span
                                  className="ml-2 text-xs px-1.5 py-0.5 rounded"
                                  style={{
                                    background: `${moroccanColors.secondary}15`,
                                    color: moroccanColors.secondary,
                                  }}
                                >
                                  Free
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-neutral-500">
                              <span className="mr-2">{lesson.duration}</span>
                              {!lesson.preview && (
                                <FiLock className="text-neutral-400" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Decorative Moroccan pattern footer */}
              <div className="mt-8 pt-6 border-t border-neutral-200 relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-8 overflow-hidden">
                    <svg
                      viewBox="0 0 100 50"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 0 L100 0 L50 50 Z"
                        fill="white"
                        stroke={`${moroccanColors.primary}30`}
                        strokeWidth="1"
                      />
                      <path
                        d="M20 0 L80 0 L50 30 Z"
                        fill="white"
                        stroke={`${moroccanColors.secondary}30`}
                        strokeWidth="1"
                      />
                      <circle
                        cx="50"
                        cy="15"
                        r="8"
                        fill="white"
                        stroke={`${moroccanColors.tertiary}30`}
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-center text-sm text-neutral-500">
                  <div
                    className="font-medium px-3 py-2 rounded-md"
                    style={{ color: moroccanColors.primary }}
                  >
                    Happy Learning!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CourseVideoView.propTypes = {
  onBack: PropTypes.func,
};

export default CourseVideoView;
