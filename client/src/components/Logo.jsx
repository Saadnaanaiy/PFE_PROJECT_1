import { Link } from 'react-router-dom'
import marocademyLogo from '../assets/morocademy.ico'
import PropTypes from 'prop-types'

const Logo = ({ className = 'h-12 w-auto' }) => {
  return (
    <Link to="/" className="flex items-center">
      <div className={`relative ${className}`}>
        <div className="flex items-center space-x-2">
          <img
            src={marocademyLogo}
            alt="Marocademy Logo"
            className="w-10 h-auto"
          />

          <span className="font-heading font-bold text-xl tracking-tight text-neutral-900">
            MAROCADEMY
          </span>
        </div>
      </div>
    </Link>
  )
}

Logo.propTypes = {
  className: PropTypes.string
}

export default Logo
