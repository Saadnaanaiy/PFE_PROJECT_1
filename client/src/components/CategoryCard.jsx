import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const CategoryCard = ({ category }) => {
  const { id, title, icon, courseCount, bgColor = 'bg-primary/10' } = category

  return (
    <Link to={`/category/${id}`}>
      <motion.div 
        className={`${bgColor} rounded-xl p-6 h-full transition-all group hover:shadow-md`}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="text-4xl mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-600">
            {courseCount} courses
          </p>
        </div>
      </motion.div>
    </Link>
  )
}

export default CategoryCard