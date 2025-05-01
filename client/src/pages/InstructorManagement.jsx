import { useState, useRef, useEffect } from 'react';
import {
  FiUser,
  FiMoreVertical,
  FiX,
  FiSave,
  FiEdit,
  FiTrash,
  FiImage,
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

// This component adds the ability to edit and delete instructors
function InstructorTable({ data: initialData, formatDate }) {
  const [instructors, setInstructors] = useState(initialData);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    bio: '',
    specialite: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleEditInstructor = (instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      nom: instructor.user?.nom || '',
      email: instructor.user?.email || '',
      bio: instructor.bio || '',
      specialite: instructor.specialite || '',
    });
    setPreviewUrl(instructor.image || '');
    setSelectedFile(null);
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDeleteInstructor = async (instructorId) => {
    if (!window.confirm('Are you sure you want to delete this instructor?'))
      return;

    try {
      setIsDeleting(true);
      await axios.delete(`/api/admin/instructors/${instructorId}/delete`);
      toast.success('Instructor deleted successfully!');
      // Update state instead of reloading the page
      setInstructors(
        instructors.filter((instructor) => instructor.id !== instructorId),
      );
    } catch (err) {
      console.error('Failed to delete instructor:', err);
      toast.error(
        `Failed to delete instructor: ${
          err.response?.data?.message || err.message
        }`,
      );
    } finally {
      setIsDeleting(false);
      setOpenDropdownId(null);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingInstructor(null);
    setFormErrors({});
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageButtonClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.specialite.trim())
      errors.specialite = 'Specialty is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('nom', formData.nom);
      payload.append('email', formData.email);
      payload.append('bio', formData.bio);
      payload.append('specialite', formData.specialite);

      if (selectedFile) payload.append('image', selectedFile);

      const response = await axios.put(
        `/api/admin/instructors/${editingInstructor.id}/update`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      toast.success('Instructor updated successfully!');

      // Update the instructor in our local state
      const updatedInstructor = response.data?.instructor || {
        ...editingInstructor,
        user: {
          ...editingInstructor.user,
          nom: formData.nom,
          email: formData.email,
        },
        bio: formData.bio,
        specialite: formData.specialite,
        image: selectedFile ? previewUrl : editingInstructor.image,
      };

      setInstructors(
        instructors.map((instructor) =>
          instructor.id === editingInstructor.id
            ? updatedInstructor
            : instructor,
        ),
      );

      handleCloseModal();
    } catch (err) {
      console.error('Failed to update instructor:', err);
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        toast.error(
          `Failed to update instructor: ${
            err.response?.data?.message || err.message
          }`,
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Keep the component's data in sync with props
    setInstructors(initialData);
  }, [initialData]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Specialty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {instructors.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-neutral-500"
                >
                  No instructors found
                </td>
              </tr>
            ) : (
              instructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                    <img
                      className="w-16 h-16 rounded-full object-cover"
                      src={instructor.image || '/path/to/default-avatar.png'}
                      alt=""
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                    {instructor.user?.nom || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {instructor.user?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {instructor.specialite || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {formatDate(instructor.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === instructor.id
                            ? null
                            : instructor.id,
                        )
                      }
                      className="text-neutral-600 hover:text-neutral-900"
                    >
                      <FiMoreVertical size={18} />
                    </button>
                    {openDropdownId === instructor.id && (
                      <div className="absolute right-6 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleEditInstructor(instructor)}
                          className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                        >
                          <FiEdit className="mr-2" size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInstructor(instructor.id)}
                          disabled={isDeleting}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 flex items-center"
                        >
                          <FiTrash className="mr-2" size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Instructor Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Edit Instructor</h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full hover:bg-neutral-100"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex justify-center">
                <div className="relative group w-48 h-48 rounded-full overflow-hidden bg-neutral-100 border-2 border-dashed flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Instructor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser size={48} className="text-neutral-400" />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={handleImageButtonClick}
                      className="bg-primary text-white rounded px-3 py-2 text-sm"
                    >
                      Change Image
                    </button>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Field
                  label="Name"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  error={formErrors.nom}
                />
                <Field
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                />
                <Field
                  label="Specialty"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleInputChange}
                  error={formErrors.specialite}
                />
                <Field
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  error={formErrors.bio}
                  textarea
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-primary text-white rounded"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, name, value, onChange, error, textarea }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border ${
            error ? 'border-red-500' : 'border-neutral-300'
          } rounded focus:ring-2 focus:ring-primary`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border ${
            error ? 'border-red-500' : 'border-neutral-300'
          } rounded focus:ring-2 focus:ring-primary`}
        />
      )}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default InstructorTable;
