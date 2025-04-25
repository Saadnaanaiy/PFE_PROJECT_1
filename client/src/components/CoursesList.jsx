import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import CourseCard from './CourseCard';

const CoursesList = ({ title, subtitle, courses, showViewAll = true }) => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Popular', 'New', 'Data Science', 'Design', 'Business'];

  // Filter courses based on active tab
  // In a real app, this would be handled by an API call
  const filteredCourses = courses;

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8">
          <div className="mb-6 md:mb-0">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              Expand Your Skills
            </span>
            <h2 className="heading-lg">{title}</h2>
            {subtitle && <p className="text-neutral-600 mt-2">{subtitle}</p>}
          </div>

          {showViewAll && (
            <button className="btn-outline self-start md:self-auto">
              View All Courses
            </button>
          )}
        </div>

        {/* Category tabs */}
        <div className="mb-8 overflow-x-auto scrollbar-hidden">
          <div className="flex space-x-2 md:space-x-4 pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-full whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white font-medium'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Pagination/Navigation for mobile */}
        <div className="flex justify-center mt-10 md:hidden">
          <button className="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-300 text-neutral-700 mr-3 hover:bg-neutral-100">
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center border border-neutral-300 text-neutral-700 hover:bg-neutral-100">
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
export default CoursesList;
