import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import zelij from '../assets/zelij.ico';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary to-primary-dark text-white py-16 md:py-24 overflow-hidden">
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/src/assets/moroccan-pattern.svg')",
          backgroundSize: '200px',
        }}
      />

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 text-center md:text-left">
            <motion.h1
              className="heading-xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Expand Your Knowledge with Moroccan Excellence
            </motion.h1>

            <motion.p
              className="text-xl mb-8 text-neutral-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Access over 5,000 courses taught by Moroccan experts and global
              instructors. Start learning today and transform your future.
            </motion.p>

            <motion.div
              className="max-w-xl mx-auto md:mx-0 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <input
                type="text"
                placeholder="What do you want to learn today?"
                className="w-full py-4 px-6 pl-12 rounded-full text-neutral-900 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 text-xl" />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-6 rounded-full transition-colors">
                Search
              </button>
            </motion.div>

            <motion.div
              className="mt-8 text-sm text-neutral-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p>
                Popular searches: Web Development, Arabic, Business, Data
                Science, AI
              </p>
            </motion.div>
          </div>

          {/* Zelij Element on the right */}
          <motion.div
            className="md:w-2/5 mt-10 md:mt-0 flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src={zelij}
              alt="Moroccan Zelij Pattern"
              className="w-4/5 max-w-md filter drop-shadow-2xl"
              style={{
                transform: 'rotate(5deg)',
                borderRadius: '15px',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
