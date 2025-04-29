import { useState } from 'react';
import {
  FiVideo,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiList,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const LessonManager = ({ sectionId, lessons, setLessons }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    estGratuite: false,
    video: {
      titre: '',
      url: '',
      dureeMinutes: '',
    },
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('video.')) {
      const videoField = name.split('.')[1];
      setFormData({
        ...formData,
        video: {
          ...formData.video,
          [videoField]: type === 'number' ? parseInt(value, 10) || '' : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      estGratuite: false,
      video: {
        titre: '',
        url: '',
        dureeMinutes: '',
      },
    });
    setFormVisible(false);
    setEditingIndex(null);
  };

  const handleAddLesson = () => {
    const newLesson = {
      ...formData,
      ordre: lessons.length,
    };

    setLessons([...lessons, newLesson]);
    resetForm();
  };

  const handleEditLesson = (index) => {
    const lesson = lessons[index];
    setFormData({
      titre: lesson.titre,
      estGratuite: lesson.estGratuite || false,
      video: lesson.video || {
        titre: '',
        url: '',
        dureeMinutes: '',
      },
    });
    setEditingIndex(index);
    setFormVisible(true);
  };

  const handleUpdateLesson = () => {
    const updatedLessons = [...lessons];
    updatedLessons[editingIndex] = {
      ...updatedLessons[editingIndex],
      ...formData,
      ordre: updatedLessons[editingIndex].ordre,
    };

    setLessons(updatedLessons);
    resetForm();
  };

  const handleDeleteLesson = (index) => {
    const updatedLessons = lessons.filter((_, i) => i !== index);

    // Update ordre for remaining lessons
    const reorderedLessons = updatedLessons.map((lesson, i) => ({
      ...lesson,
      ordre: i,
    }));

    setLessons(reorderedLessons);
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <FiList className="mr-2 text-primary" />
          Lessons
        </h3>
        {!formVisible && (
          <button
            type="button"
            onClick={() => setFormVisible(true)}
            className="flex items-center text-sm px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors"
          >
            <FiPlus className="mr-1" /> Add Lesson
          </button>
        )}
      </div>

      <AnimatePresence>
        {formVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-neutral-200 rounded-lg p-4 mb-4 bg-neutral-50 overflow-hidden"
          >
            <h4 className="font-medium mb-3">
              {editingIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Lesson Title*
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                  placeholder="Enter lesson title"
                  required
                />
              </div>

              <div className="col-span-full">
                <label className="flex items-center space-x-2 text-sm font-medium text-neutral-700">
                  <input
                    type="checkbox"
                    name="estGratuite"
                    checked={formData.estGratuite}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300 text-primary focus:ring-primary"
                  />
                  <span className="flex items-center">
                    <FiDollarSign className="mr-1 text-primary" />
                    Free Preview Lesson
                  </span>
                </label>
              </div>

              <div className="col-span-full mt-3">
                <h5 className="font-medium flex items-center text-sm">
                  <FiVideo className="mr-1 text-primary" />
                  Video Details
                </h5>
                <hr className="my-2" />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Video Title*
                </label>
                <input
                  type="text"
                  name="video.titre"
                  value={formData.video.titre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <div className="flex items-center gap-1">
                    <FiClock className="text-primary" />
                    Duration (minutes)*
                  </div>
                </label>
                <input
                  type="number"
                  name="video.dureeMinutes"
                  min="0"
                  value={formData.video.dureeMinutes}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                  placeholder="e.g. 15"
                  required
                />
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Video URL*
                </label>
                <input
                  type="text"
                  name="video.url"
                  value={formData.video.url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                  placeholder="Enter YouTube or video URL"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center text-sm px-3 py-2 bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-md"
              >
                <FiX className="mr-1" /> Cancel
              </button>
              <button
                type="button"
                onClick={
                  editingIndex !== null ? handleUpdateLesson : handleAddLesson
                }
                className="flex items-center text-sm px-4 py-2 bg-primary text-white hover:bg-primary-dark rounded-md"
                disabled={
                  !formData.titre ||
                  !formData.video.titre ||
                  !formData.video.url ||
                  !formData.video.dureeMinutes
                }
              >
                <FiCheck className="mr-1" />
                {editingIndex !== null ? 'Update Lesson' : 'Add Lesson'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lessons List */}
      <div className="space-y-2">
        {lessons.length === 0 ? (
          <div className="text-center py-4 text-neutral-500 bg-neutral-50 rounded-lg border border-neutral-200">
            No lessons added yet
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <div
              key={index}
              className="border border-neutral-200 rounded-lg p-3 bg-white flex items-center justify-between group hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <div className="bg-primary/10 text-primary rounded-md p-1.5">
                  <FiVideo className="text-lg" />
                </div>
                <div>
                  <h4 className="font-medium">{lesson.titre}</h4>
                  <div className="text-sm text-neutral-600 mt-0.5">
                    {lesson.video?.titre} • {lesson.video?.dureeMinutes} min
                    {lesson.estGratuite && (
                      <span className="ml-2 inline-flex items-center text-green-600 text-xs font-medium">
                        <FiDollarSign className="mr-0.5" /> Free Preview
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleEditLesson(index)}
                  className="p-1 text-neutral-600 hover:text-neutral-900"
                >
                  <FiEdit2 />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteLesson(index)}
                  className="p-1 text-neutral-600 hover:text-red-600"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonManager;
