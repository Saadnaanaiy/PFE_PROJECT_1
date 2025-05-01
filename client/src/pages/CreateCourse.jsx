import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiImage,
  FiDollarSign,
  FiClock,
  FiBookOpen,
  FiUpload,
  FiLayout,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiCheck,
  FiFilm,
  FiFileText,
  FiLock,
  FiUnlock,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiRefreshCw,
} from 'react-icons/fi';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import axios from 'axios';
import CategoryManagement from './CategoryManagement';
import SectionManager from '../components/SectionManager';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    niveau: 'Débutant',
    dureeMinutes: '',
    categorie_id: '',
    image: null,
  });
  const [sections, setSections] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Added for lessons and videos
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [lessons, setLessons] = useState({});
  const [videos, setVideos] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [videoUploading, setVideoUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Modified to NOT auto-advance to next step
  const handleCategorySelect = (categoryId) => {
    setFormData({ ...formData, categorie_id: categoryId });
    // Removed auto-advancing to next step
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // New methods for lessons
  const handleAddLesson = (sectionId, lessonData) => {
    setLessons({
      ...lessons,
      [sectionId]: [
        ...(lessons[sectionId] || []),
        {
          ...lessonData,
          id: Math.random().toString(36).substring(2, 9), // Temporary ID
          section_id: sectionId,
        },
      ],
    });
  };

  const handleRemoveLesson = (sectionId, lessonId) => {
    setLessons({
      ...lessons,
      [sectionId]: lessons[sectionId].filter(
        (lesson) => lesson.id !== lessonId,
      ),
    });

    // Clean up any associated videos
    if (videos[lessonId]) {
      const newVideos = { ...videos };
      delete newVideos[lessonId];
      setVideos(newVideos);
    }
  };

  const handleUpdateLesson = (sectionId, lessonId, updatedData) => {
    setLessons({
      ...lessons,
      [sectionId]: lessons[sectionId].map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...updatedData } : lesson,
      ),
    });
  };

  // Methods for video management
  const handleAddVideo = (lessonId, videoData) => {
    setVideos({
      ...videos,
      [lessonId]: videoData,
    });
  };

  const handleRemoveVideo = (lessonId) => {
    const newVideos = { ...videos };
    delete newVideos[lessonId];
    setVideos(newVideos);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (500MB limit)
      const maxSize = 500 * 1024 * 1024; // 500MB in bytes
      if (file.size > maxSize) {
        setError('Video file size must be less than 500MB');
        return;
      }

      setVideoFile(file);
      setVideoData({
        ...videoData,
        titre: file.name,
      });

      // Get video duration
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          const duration = Math.ceil(video.duration / 60); // Convert to minutes
          setVideoData((prev) => ({
            ...prev,
            dureeMinutes: duration,
          }));
        };
        video.src = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error getting video duration:', error);
      }
    }
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    setUploading(true);
    setError(null);

    try {
      // Create a chunked upload
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const totalChunks = Math.ceil(videoFile.size / chunkSize);
      let uploadedChunks = 0;

      for (let chunk = 0; chunk < totalChunks; chunk++) {
        const start = chunk * chunkSize;
        const end = Math.min(start + chunkSize, videoFile.size);
        const fileChunk = videoFile.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', fileChunk);
        formData.append('chunkNumber', chunk + 1);
        formData.append('totalChunks', totalChunks);
        formData.append('fileName', videoFile.name);
        formData.append('lessonId', lessonId);
        formData.append('videoData', JSON.stringify(videoData));

        await axios.post('/api/instructor/upload-video-chunk', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const chunkProgress =
              (progressEvent.loaded / progressEvent.total) * 100;
            const totalProgress =
              ((uploadedChunks + chunkProgress / 100) / totalChunks) * 100;
            setUploadProgress(totalProgress);
          },
        });

        uploadedChunks++;
      }

      // After all chunks are uploaded, notify the server to combine them
      const response = await axios.post(
        '/api/instructor/complete-video-upload',
        {
          fileName: videoFile.name,
          lessonId: lessonId,
          videoData: videoData,
        },
      );

      // Update video metadata
      handleAddVideo(lessonId, {
        ...videoData,
        url: response.data.url,
        file: videoFile,
      });

      onVideoUploaded();
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.categorie_id) {
      setError('Please select or create a category first');
      setCurrentStep(1);
      return;
    }

    try {
      setLoading(true);

      // Create FormData object for file upload
      const courseFormData = new FormData();
      for (const key in formData) {
        if (formData[key] !== null) {
          courseFormData.append(key, formData[key]);
        }
      }

      // Add sections if any
      if (sections.length > 0) {
        // Create a proper array structure for Laravel to recognize
        sections.forEach((section, index) => {
          Object.keys(section).forEach((key) => {
            courseFormData.append(`sections[${index}][${key}]`, section[key]);
          });

          // Add lessons for this section
          const sectionLessons = lessons[section.id] || [];
          sectionLessons.forEach((lesson, lessonIndex) => {
            Object.keys(lesson).forEach((key) => {
              if (key !== 'id' && key !== 'file') {
                // Skip temporary id and file object
                courseFormData.append(
                  `sections[${index}][lecons][${lessonIndex}][${key}]`,
                  lesson[key],
                );
              }
            });

            // Add video if exists for this lesson
            if (videos[lesson.id]) {
              const video = videos[lesson.id];
              Object.keys(video).forEach((key) => {
                if (key !== 'file') {
                  courseFormData.append(
                    `sections[${index}][lecons][${lessonIndex}][video][${key}]`,
                    video[key],
                  );
                }
              });

              // Add video file if exists
              if (video.file) {
                courseFormData.append(
                  `sections[${index}][lecons][${lessonIndex}][video][file]`,
                  video.file,
                );
              }
            }
          });
        });
      }

      await axios.post('/api/instructor/courses', courseFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to courses list
      navigate('/instructor/courses');
    } catch (err) {
      console.error('Error creating course:', err);
      setError(err.response?.data?.message || 'Failed to create course');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full font-medium transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-neutral-500 border-2 border-neutral-200'
                }`}
              >
                {currentStep > step ? (
                  <FiCheck className="text-lg" />
                ) : (
                  <span>{step}</span>
                )}
                <div className="absolute -bottom-6 whitespace-nowrap text-xs font-medium text-neutral-600">
                  {step === 1 && 'Category'}
                  {step === 2 && 'Details'}
                  {step === 3 && 'Structure'}
                  {step === 4 && 'Lessons'}
                  {step === 5 && 'Videos'}
                </div>
              </div>
              {step < 5 && (
                <div
                  className={`h-1 w-12 md:w-20 transition-all duration-300 ${
                    currentStep > step ? 'bg-primary' : 'bg-neutral-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Lesson Form Component
  const LessonForm = ({ sectionId, lesson = null, onSave, onCancel }) => {
    const [lessonData, setLessonData] = useState({
      titre: lesson?.titre || '',
      ordre: lesson?.ordre || (lessons[sectionId]?.length || 0) + 1,
      estGratuite: lesson?.estGratuite || false,
    });

    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setLessonData({
        ...lessonData,
        [name]: type === 'checkbox' ? checked : value,
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(lessonData);
    };

    return (
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-4"
      >
        <h4 className="font-medium text-neutral-800 mb-3">
          {lesson ? 'Edit Lesson' : 'Add New Lesson'}
        </h4>

        <div className="mb-3">
          <label
            htmlFor="titre"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Lesson Title*
          </label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={lessonData.titre}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            required
          />
        </div>

        <div className="mb-3">
          <label
            htmlFor="ordre"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            Order
          </label>
          <input
            type="number"
            id="ordre"
            name="ordre"
            value={lessonData.ordre}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
            min="1"
          />
        </div>

        <div className="mb-3">
          <label className="flex items-center text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              name="estGratuite"
              checked={lessonData.estGratuite}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            Free Preview (available to non-enrolled students)
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary-dark"
          >
            {lesson ? 'Update' : 'Add'} Lesson
          </button>
        </div>
      </form>
    );
  };

  // Video Upload Component
  const VideoUploader = ({
    lessonId,
    existingVideo,
    onVideoUploaded,
    onRemoveVideo,
  }) => {
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoData, setVideoData] = useState({
      titre: existingVideo?.titre || '',
      dureeMinutes: existingVideo?.dureeMinutes || '',
    });

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        // Check file size (500MB limit)
        const maxSize = 500 * 1024 * 1024; // 500MB in bytes
        if (file.size > maxSize) {
          setError('Video file size must be less than 500MB');
          return;
        }

        setVideoFile(file);
        setVideoData({
          ...videoData,
          titre: file.name,
        });

        // Get video duration
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            const duration = Math.ceil(video.duration / 60); // Convert to minutes
            setVideoData((prev) => ({
              ...prev,
              dureeMinutes: duration,
            }));
          };
          video.src = URL.createObjectURL(file);
        } catch (error) {
          console.error('Error getting video duration:', error);
        }
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setVideoData({
        ...videoData,
        [name]: value,
      });
    };

    const handleUpload = async () => {
      if (!videoFile) return;

      setUploading(true);
      setError(null);

      try {
        // Create a chunked upload
        const chunkSize = 5 * 1024 * 1024; // 5MB chunks
        const totalChunks = Math.ceil(videoFile.size / chunkSize);
        let uploadedChunks = 0;

        for (let chunk = 0; chunk < totalChunks; chunk++) {
          const start = chunk * chunkSize;
          const end = Math.min(start + chunkSize, videoFile.size);
          const fileChunk = videoFile.slice(start, end);

          const formData = new FormData();
          formData.append('chunk', fileChunk);
          formData.append('chunkNumber', chunk + 1);
          formData.append('totalChunks', totalChunks);
          formData.append('fileName', videoFile.name);
          formData.append('lessonId', lessonId);
          formData.append('videoData', JSON.stringify(videoData));

          await axios.post('/api/instructor/upload-video-chunk', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
              const chunkProgress =
                (progressEvent.loaded / progressEvent.total) * 100;
              const totalProgress =
                ((uploadedChunks + chunkProgress / 100) / totalChunks) * 100;
              setUploadProgress(totalProgress);
            },
          });

          uploadedChunks++;
        }

        // After all chunks are uploaded, notify the server to combine them
        const response = await axios.post(
          '/api/instructor/complete-video-upload',
          {
            fileName: videoFile.name,
            lessonId: lessonId,
            videoData: videoData,
          },
        );

        // Update video metadata
        handleAddVideo(lessonId, {
          ...videoData,
          url: response.data.url,
          file: videoFile,
        });

        onVideoUploaded();
      } catch (error) {
        console.error('Upload failed:', error);
        setError(error.response?.data?.message || 'Failed to upload video');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    };

    return (
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        {existingVideo ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-neutral-800">Uploaded Video</h4>
              <button
                onClick={() => onRemoveVideo()}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                <FiTrash2 />
              </button>
            </div>
            <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center">
              <FiFilm className="text-primary mr-2" />
              <div className="flex-1">
                <div className="font-medium">{existingVideo.titre}</div>
                {existingVideo.dureeMinutes && (
                  <div className="text-sm text-neutral-500">
                    Duration: {existingVideo.dureeMinutes} min
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="font-medium text-neutral-800 mb-3">Upload Video</h4>

            {videoFile ? (
              <div>
                <div className="p-3 bg-white rounded-lg border border-neutral-200 flex items-center mb-3">
                  <FiFilm className="text-primary mr-2" />
                  <div className="flex-1">
                    <div className="font-medium">{videoFile.name}</div>
                    <div className="text-sm text-neutral-500">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </div>
                  </div>
                  <button
                    onClick={() => setVideoFile(null)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    <FiX />
                  </button>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    name="titre"
                    value={videoData.titre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                  />
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    name="dureeMinutes"
                    value={videoData.dureeMinutes}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                    min="0"
                    step="0.1"
                    readOnly
                  />
                </div>

                {uploading ? (
                  <div className="mt-4">
                    <div className="w-full bg-neutral-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-neutral-600 mt-1 text-center">
                      Uploading... {Math.round(uploadProgress)}%
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleUpload}
                    className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex items-center justify-center"
                  >
                    <FiUpload className="mr-2" /> Upload Video
                  </button>
                )}
              </div>
            ) : (
              <div
                onClick={() => document.getElementById('videoFile').click()}
                className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                <FiFilm className="text-3xl text-neutral-400 mx-auto mb-2" />
                <p className="text-neutral-600 mb-2">
                  Click to select a video file
                </p>
                <p className="text-neutral-500 text-sm">
                  MP4, WebM or MOV. Max 2GB.
                </p>
                <input
                  id="videoFile"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 relative">
      {/* Decorative background elements */}
      <div
        className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0"
        style={{
          backgroundImage: `url(${moroccanPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
        }}
      ></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0"></div>

      <div className="container mx-auto max-w-5xl px-4 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/instructor/courses')}
            className="flex items-center text-primary hover:text-primary-dark mb-4 font-medium transition-colors group"
          >
            <FiArrowLeft className="mr-2 group-hover:translate-x-[-3px] transition-transform" />{' '}
            Back to Courses
          </button>
          <h1 className="text-3xl font-bold mb-4 text-neutral-800">
            Create New Course
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            Fill in the details below to create your new course. Follow the
            steps to set up your course structure.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-200 shadow-sm flex items-start"
          >
            <FiX className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>{error}</div>
          </motion.div>
        )}

        {renderStepIndicator()}

        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                1
              </span>
              Choose Category
            </h2>

            {/* Category Management Component */}
            <CategoryManagement onCategoryAdded={handleCategorySelect} />

            <div className="flex justify-end mt-8">
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.categorie_id}
                className={`flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] ${
                  !formData.categorie_id
                    ? 'opacity-50 cursor-not-allowed bg-neutral-400'
                    : 'hover:bg-primary-dark'
                }`}
              >
                Next: Course Details
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Course Details */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                2
              </span>
              Course Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="col-span-full">
                <label
                  htmlFor="titre"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Course Title*
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="Enter an engaging title for your course"
                  required
                />
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  Course Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="Describe what students will learn in your course"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div>
                <label
                  htmlFor="prix"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <FiDollarSign className="text-primary" />
                    Price*
                  </div>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  id="prix"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="e.g. 49.99"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="dureeMinutes"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <FiClock className="text-primary" />
                    Duration (minutes)*
                  </div>
                </label>
                <input
                  type="number"
                  min="0"
                  id="dureeMinutes"
                  name="dureeMinutes"
                  value={formData.dureeMinutes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  placeholder="e.g. 120"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="niveau"
                  className="block text-sm font-medium text-neutral-700 mb-1"
                >
                  <div className="flex items-center gap-1">
                    <FiBookOpen className="text-primary" />
                    Difficulty Level*
                  </div>
                </label>
                <select
                  id="niveau"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all"
                  required
                >
                  <option value="Débutant">Beginner</option>
                  <option value="Intermédiaire">Intermediate</option>
                  <option value="Avancé">Advanced</option>
                </select>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  <div className="flex items-center gap-1">
                    <FiImage className="text-primary" />
                    Course Image
                  </div>
                </label>

                <div className="mt-1 flex items-center">
                  {imagePreview ? (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Course preview"
                        className="w-40 h-40 object-cover rounded-lg border border-neutral-300 shadow-sm"
                      />
                      <div
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-lg cursor-pointer"
                        onClick={() => document.getElementById('image').click()}
                      >
                        <span className="text-white text-sm font-medium">
                          Change Image
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => document.getElementById('image').click()}
                      className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="text-center">
                        <FiUpload className="text-2xl text-neutral-400 mx-auto mb-2" />
                        <span className="text-sm text-neutral-500">
                          Upload Image
                        </span>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  Recommended: 16:9 ratio, at least 1280x720px
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-all"
              >
                <FiChevronLeft className="mr-2" />
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={
                  !formData.titre ||
                  !formData.description ||
                  !formData.prix ||
                  !formData.dureeMinutes
                }
                className={`flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] ${
                  !formData.titre ||
                  !formData.description ||
                  !formData.prix ||
                  !formData.dureeMinutes
                    ? 'opacity-50 cursor-not-allowed bg-neutral-400'
                    : 'hover:bg-primary-dark'
                }`}
              >
                Next: Course Structure
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Course Structure */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                3
              </span>
              Course Structure
            </h2>

            <SectionManager sections={sections} setSections={setSections} />

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-all"
              >
                <FiChevronLeft className="mr-2" />
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                disabled={sections.length === 0}
                className={`flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] ${
                  sections.length === 0
                    ? 'opacity-50 cursor-not-allowed bg-neutral-400'
                    : 'hover:bg-primary-dark'
                }`}
              >
                Next: Add Lessons
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Lessons */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                4
              </span>
              Add Lessons
            </h2>

            {sections.length > 0 ? (
              <div>
                <div className="mb-6 flex items-center">
                  <div className="mr-4 font-medium text-neutral-600">
                    Section:
                  </div>
                  <div className="flex space-x-2">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSectionIndex(index)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          currentSectionIndex === index
                            ? 'bg-primary text-white'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {section.titre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 mb-6">
                  <h3 className="text-lg font-medium mb-4">
                    {sections[currentSectionIndex].titre}
                  </h3>

                  {/* Display existing lessons */}
                  {lessons[sections[currentSectionIndex].id]?.length > 0 ? (
                    <div className="mb-4 space-y-2">
                      {lessons[sections[currentSectionIndex].id].map(
                        (lesson) => (
                          <div
                            key={lesson.id}
                            className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm flex items-center justify-between hover:border-primary transition-all"
                          >
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-neutral-700 mr-3 text-sm font-medium">
                                {lesson.ordre}
                              </div>
                              <div>
                                <h4 className="font-medium text-neutral-800">
                                  {lesson.titre}
                                </h4>
                                <div className="text-sm text-neutral-500 flex items-center mt-1">
                                  {lesson.estGratuite ? (
                                    <span className="flex items-center text-green-600">
                                      <FiUnlock className="mr-1" /> Free Preview
                                    </span>
                                  ) : (
                                    <span className="flex items-center">
                                      <FiLock className="mr-1" /> Premium
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setSelectedLesson(lesson)}
                                className="p-2 text-neutral-600 hover:text-primary rounded-full hover:bg-neutral-100"
                              >
                                <FiEdit />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveLesson(
                                    sections[currentSectionIndex].id,
                                    lesson.id,
                                  )
                                }
                                className="p-2 text-neutral-600 hover:text-red-500 rounded-full hover:bg-neutral-100"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-neutral-500">
                      No lessons added yet. Add your first lesson below.
                    </div>
                  )}

                  {/* Add lesson form */}
                  {selectedLesson ? (
                    <LessonForm
                      sectionId={sections[currentSectionIndex].id}
                      lesson={selectedLesson}
                      onSave={(lessonData) => {
                        handleUpdateLesson(
                          sections[currentSectionIndex].id,
                          selectedLesson.id,
                          lessonData,
                        );
                        setSelectedLesson(null);
                      }}
                      onCancel={() => setSelectedLesson(null)}
                    />
                  ) : (
                    <button
                      onClick={() =>
                        handleAddLesson(sections[currentSectionIndex].id, {
                          titre: '',
                          ordre:
                            (lessons[sections[currentSectionIndex].id]
                              ?.length || 0) + 1,
                          estGratuite: false,
                        })
                      }
                      className="w-full py-3 flex items-center justify-center text-primary border-2 border-dashed border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <FiPlusCircle className="mr-2" /> Add New Lesson
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                Please add course sections in the previous step first.
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-all"
              >
                <FiChevronLeft className="mr-2" />
                Previous
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] hover:bg-primary-dark"
              >
                Next: Add Videos
                <FiChevronRight className="ml-2" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Videos */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 mb-8"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center text-neutral-800">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary mr-3">
                5
              </span>
              Add Videos
            </h2>

            {sections.length > 0 &&
            Object.values(lessons).some(
              (sectionLessons) => sectionLessons.length > 0,
            ) ? (
              <div>
                <div className="mb-6">
                  <p className="text-neutral-600 mb-4">
                    Select a lesson to add video content.
                  </p>

                  {sections.map((section) => {
                    // Only show sections that have lessons
                    const sectionLessons = lessons[section.id] || [];
                    if (sectionLessons.length === 0) return null;

                    return (
                      <div key={section.id} className="mb-6">
                        <h3 className="font-medium text-neutral-700 mb-2">
                          {section.titre}
                        </h3>
                        <div className="space-y-2 pl-4 border-l-2 border-neutral-200">
                          {sectionLessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={`w-full text-left px-4 py-2 rounded-lg flex items-center justify-between ${
                                selectedLesson?.id === lesson.id
                                  ? 'bg-primary text-white'
                                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-primary'
                              }`}
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2 ${
                                    selectedLesson?.id === lesson.id
                                      ? 'bg-white text-primary'
                                      : 'bg-neutral-100 text-neutral-700'
                                  }`}
                                >
                                  {lesson.ordre}
                                </div>
                                {lesson.titre}
                              </div>
                              {videos[lesson.id] && (
                                <FiFilm
                                  className={`${
                                    selectedLesson?.id === lesson.id
                                      ? 'text-white'
                                      : 'text-primary'
                                  }`}
                                />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedLesson && (
                  <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <FiFileText className="mr-2 text-primary" />
                      Add Video to: {selectedLesson.titre}
                    </h3>

                    <VideoUploader
                      lessonId={selectedLesson.id}
                      existingVideo={videos[selectedLesson.id]}
                      onVideoUploaded={() => {
                        // Maybe update UI state here
                      }}
                      onRemoveVideo={() => handleRemoveVideo(selectedLesson.id)}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-500">
                Please add lessons in the previous step first.
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center justify-center px-6 py-2 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-all"
              >
                <FiChevronLeft className="mr-2" />
                Previous
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center justify-center px-8 py-3 rounded-full bg-primary text-white font-medium shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] active:translate-y-[1px] ${
                  loading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-primary-dark'
                }`}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="mr-2 animate-spin" /> Creating
                    Course...
                  </>
                ) : (
                  <>Create Course</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
