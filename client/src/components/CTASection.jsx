import { motion } from 'framer-motion'

const CTASection = () => {
  return (
    <section className="py-20 bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h2 
              className="heading-lg text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Ready to Advance Your Career?
            </motion.h2>
            
            <motion.p 
              className="text-white/90 text-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Join MarocAcademy today and get unlimited access to over 5,000 courses taught by industry experts.
              Start with a 7-day free trial and cancel anytime.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <button className="btn bg-white text-secondary hover:bg-neutral-100 focus:ring-white">
                Start Free Trial
              </button>
              <button className="btn border border-white text-white hover:bg-white/10 focus:ring-white">
                View Plans
              </button>
            </motion.div>
          </div>
          
          <div className="lg:pl-12">
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-heading font-semibold mb-4">
                Subscribe to our newsletter
              </h3>
              <p className="mb-6 text-white/80">
                Get the latest courses, special offers, and learning resources delivered to your inbox.
              </p>
              
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 rounded-md bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <button 
                    type="submit" 
                    className="btn bg-white text-secondary hover:bg-neutral-100 w-full"
                  >
                    Subscribe
                  </button>
                </div>
                <p className="text-sm text-white/70">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection