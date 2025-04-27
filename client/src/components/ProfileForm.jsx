import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiAlertTriangle, FiEdit } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfileForm = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  // Initialize form data with current user data
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form data when component mounts or when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Nom est requis';
    if (!formData.email) newErrors.email = 'Email est requis';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password =
        'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (
      formData.password &&
      formData.password !== formData.password_confirmation
    ) {
      newErrors.password_confirmation =
        'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only proceed if form is in edit mode
    if (!isEditing) return;

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Get token from appropriate storage
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:8000/api/profile/update',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Update user in context with the response data
      if (response.data && response.data.user) {
        setUser(response.data.user);

        // Only now switch back to view mode
        setIsEditing(false);
        setSuccessMessage('Profil mis à jour avec succès');

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);

      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else if (error.response.data.message) {
          alert(error.response.data.message);
        }
      } else {
        alert('Une erreur est survenue lors de la mise à jour du profil');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'Êtes-vous sûr de vouloir supprimer votre compte? Cette action est irréversible.',
      )
    ) {
      return;
    }

    try {
      // Get token from appropriate storage
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');

      await axios.delete('http://localhost:8000/api/profile/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Logout and redirect
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Une erreur est survenue lors de la suppression du compte');
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-card overflow-hidden">
      <div className="p-6 border-b border-neutral-100">
        <h2 className="text-xl font-heading font-semibold flex items-center">
          <FiEdit className="mr-2 text-primary" />
          Modifier votre profil
        </h2>
      </div>

      {successMessage && (
        <div className="m-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Nom
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${
                  errors.nom ? 'border-red-500' : 'border-neutral-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  !isEditing ? 'bg-neutral-50' : ''
                }`}
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-neutral-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
                  !isEditing ? 'bg-neutral-50' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password fields - only show when editing */}
            {isEditing && (
              <>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.password ? 'border-red-500' : 'border-neutral-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">
                    Laissez vide si vous ne souhaitez pas changer votre mot de
                    passe
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Confirmez le mot de passe
                  </label>
                  <input
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.password_confirmation
                        ? 'border-red-500'
                        : 'border-neutral-300'
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-primary`}
                  />
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn-primary py-2 px-6"
                >
                  Modifier
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="btn-primary py-2 px-6 flex items-center"
                  >
                    <FiSave className="mr-2" />
                    {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data to current user data
                      setFormData({
                        nom: user?.nom || '',
                        email: user?.email || '',
                        password: '',
                        password_confirmation: '',
                      });
                      setErrors({});
                    }}
                    className="btn-outline py-2 px-6"
                  >
                    Annuler
                  </button>
                </>
              )}
            </div>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="mt-12 border-t border-neutral-200 pt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-700 flex items-center mb-4">
              <FiAlertTriangle className="mr-2" />
              Zone de danger
            </h3>
            <p className="text-neutral-700 mb-6">
              La suppression de votre compte est irréversible et entraînera la
              perte de toutes vos données. Veuillez être certain de votre
              décision avant de continuer.
            </p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-white text-red-600 border border-red-300 hover:bg-red-50 font-medium rounded-md px-4 py-2 transition-colors"
              >
                Supprimer mon compte
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">
                  Êtes-vous vraiment sûr de vouloir supprimer votre compte?
                </p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white hover:bg-red-700 font-medium rounded-md px-4 py-2 transition-colors"
                  >
                    Oui, supprimer définitivement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 font-medium rounded-md px-4 py-2 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileForm;
