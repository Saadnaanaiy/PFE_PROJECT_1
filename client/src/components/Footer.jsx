import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi'
import Logo from './Logo'

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <Logo className="h-12 w-auto mb-4" />
            <p className="text-neutral-300 mb-6 max-w-md">
              Morocco's premier online learning platform. Discover thousands of courses 
              taught by expert instructors to help you develop new skills and achieve your goals.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-neutral-300 hover:text-white transition-colors" aria-label="Facebook">
                <FiFacebook className="w-6 h-6" />
              </a>
              <a href="https://twitter.com" className="text-neutral-300 hover:text-white transition-colors" aria-label="Twitter">
                <FiTwitter className="w-6 h-6" />
              </a>
              <a href="https://instagram.com" className="text-neutral-300 hover:text-white transition-colors" aria-label="Instagram">
                <FiInstagram className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com" className="text-neutral-300 hover:text-white transition-colors" aria-label="LinkedIn">
                <FiLinkedin className="w-6 h-6" />
              </a>
              <a href="https://youtube.com" className="text-neutral-300 hover:text-white transition-colors" aria-label="YouTube">
                <FiYoutube className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-4">Courses</h3>
            <ul className="space-y-3">
              <li><Link to="/courses/web-development" className="text-neutral-300 hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/courses/mobile-apps" className="text-neutral-300 hover:text-white transition-colors">Mobile Apps</Link></li>
              <li><Link to="/courses/data-science" className="text-neutral-300 hover:text-white transition-colors">Data Science</Link></li>
              <li><Link to="/courses/design" className="text-neutral-300 hover:text-white transition-colors">Design</Link></li>
              <li><Link to="/courses/business" className="text-neutral-300 hover:text-white transition-colors">Business</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-neutral-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-neutral-300 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/press" className="text-neutral-300 hover:text-white transition-colors">Press</Link></li>
              <li><Link to="/blog" className="text-neutral-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-neutral-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="text-neutral-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="text-neutral-300 hover:text-white transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-neutral-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/accessibility" className="text-neutral-300 hover:text-white transition-colors">Accessibility</Link></li>
              <li><Link to="/cookie-settings" className="text-neutral-300 hover:text-white transition-colors">Cookie Settings</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} MarocAcademy. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/terms" className="text-neutral-400 text-sm hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-neutral-400 text-sm hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/cookie-policy" className="text-neutral-400 text-sm hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <Link to="/sitemap" className="text-neutral-400 text-sm hover:text-white transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer