/* Categories.jsx */
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import CategoryCard from './CategoryCard';
import * as Icons from 'react-icons/fi';

// A palette of Tailwind bg color classes
const bgClasses = [
  'bg-primary/10',
  'bg-blue-100',
  'bg-amber-100',
  'bg-purple-100',
  'bg-green-100',
  'bg-gray-100',
  'bg-rose-100',
  'bg-teal-100',
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/api/categories') // API endpoint for categories
      .then((response) => {
        console.log('Full response:', response);
        const data = response.data;
        if (!Array.isArray(data)) {
          throw new Error('Invalid categories format');
        }
        console.log('Fetched categories:', data);

        const enriched = data.map((cat, idx) => {
          const title        = cat.nom || 'Category';
          // read the correct field:
          const courseCount  = Array.isArray(cat.cours)
            ? cat.cours.length
            : cat.cours_count ?? 0;
          const key = Object.keys(Icons).find(name =>
            name
              .toLowerCase()
              .includes(title.replace(/\s+/g, '').toLowerCase())
          );
          const IconComponent = key ? Icons[key] : Icons.FiGlobe;
        
          return {
            id:          cat.id,
            title,
            description: cat.description,
            image:       cat.image,
            courseCount,            // ← now correct
            icon:        <IconComponent />,
            bgColor:     bgClasses[idx % bgClasses.length],
          };
        });
        setCategories(enriched);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Fetch error');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-16">Loading categories...</p>;
  }
  if (error) {
    return (
      <p className="text-center py-16 text-red-500">
        Failed to load categories: {error}
      </p>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            Browse Categories
          </span>
          <h2 className="heading-lg mb-4">Explore Our Popular Categories</h2>
          <p className="max-w-2xl mx-auto text-neutral-600">
            Discover thousands of courses across different categories to take
            your skills to the next level
          </p>
        </div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <button className="btn-outline">View All Categories</button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
