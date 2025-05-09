/* CategoryCard.jsx */
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCode, FaLaptopCode, FaDatabase, FaPalette, FaChartBar, FaMobileAlt, FaCloud, FaRobot, FaShieldAlt, FaGamepad } from 'react-icons/fa';

const CategoryCard = ({ category }) => {
  const { id, title, courseCount, bgColor } = category;
  
  // Function to get icon based on category title
  const getIconByTitle = (title) => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('web') || titleLower.includes('html') || titleLower.includes('css')) return <FaCode size={32} />;
    if (titleLower.includes('javascript') || titleLower.includes('react') || titleLower.includes('vue')) return <FaLaptopCode size={32} />;
    if (titleLower.includes('data') || titleLower.includes('sql')) return <FaDatabase size={32} />;
    if (titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux')) return <FaPalette size={32} />;
    if (titleLower.includes('analytics') || titleLower.includes('business')) return <FaChartBar size={32} />;
    if (titleLower.includes('mobile') || titleLower.includes('app')) return <FaMobileAlt size={32} />;
    if (titleLower.includes('cloud') || titleLower.includes('devops')) return <FaCloud size={32} />;
    if (titleLower.includes('ai') || titleLower.includes('machine')) return <FaRobot size={32} />;
    if (titleLower.includes('security') || titleLower.includes('cyber')) return <FaShieldAlt size={32} />;
    if (titleLower.includes('game')) return <FaGamepad size={32} />;
    
    // Default icon if no match is found
    return <FaCode size={32} />;
  };

  return (
    <Link to={`/categories/${id}`}>
      <motion.div
        className={`${bgColor} rounded-xl p-6 h-full transition-all group hover:shadow-md`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center text-gray-800 group-hover:text-primary transition-colors duration-300">
            {getIconByTitle(title)}
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-600">{courseCount} courses</p>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
