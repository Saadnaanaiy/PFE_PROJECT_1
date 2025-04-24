import { motion } from 'framer-motion'
import { FiCode, FiDatabase, FiTrendingUp, FiPenTool, FiGlobe, FiCamera, FiMusic, FiBookOpen } from 'react-icons/fi'
import CategoryCard from './CategoryCard'

const Categories = () => {
  const categories = [
    {
      id: 'web-dev',
      title: 'Web Development',
      icon: <FiCode />,
      courseCount: 483,
      bgColor: 'bg-primary/10'
    },
    {
      id: 'data-science',
      title: 'Data Science & AI',
      icon: <FiDatabase />,
      courseCount: 247,
      bgColor: 'bg-blue-100'
    },
    {
      id: 'business',
      title: 'Business',
      icon: <FiTrendingUp />,
      courseCount: 392,
      bgColor: 'bg-amber-100'
    },
    {
      id: 'design',
      title: 'Design & UX',
      icon: <FiPenTool />,
      courseCount: 310,
      bgColor: 'bg-purple-100'
    },
    {
      id: 'languages',
      title: 'Languages',
      icon: <FiGlobe />,
      courseCount: 204,
      bgColor: 'bg-green-100'
    },
    {
      id: 'photography',
      title: 'Photography',
      icon: <FiCamera />,
      courseCount: 168,
      bgColor: 'bg-gray-100'
    },
    {
      id: 'music',
      title: 'Music',
      icon: <FiMusic />,
      courseCount: 137,
      bgColor: 'bg-rose-100'
    },
    {
      id: 'academics',
      title: 'Academics',
      icon: <FiBookOpen />,
      courseCount: 215,
      bgColor: 'bg-teal-100'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            Browse Categories
          </span>
          <h2 className="heading-lg mb-4">Explore Our Popular Categories</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Discover thousands of courses across different categories to take your skills to the next level
          </p>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </motion.div>
        
        <div className="text-center mt-12">
          <button className="btn-outline">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  )
}

export default Categories