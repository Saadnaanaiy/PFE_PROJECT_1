import { useState, useEffect, useRef } from 'react';
import {
  FiUsers,
  FiBook,
  FiUser,
  FiMoreVertical,
  FiSearch,
  FiStar,
  FiX,
  FiSave,
  FiImage,
  FiDownload,
  FiFileText,
  FiFile,
  FiTrash,
  FiEdit,
} from 'react-icons/fi';
import axios from 'axios';
import moroccanPattern from '../assets/moroccan-pattern.svg';
import DashboardStats from './DashboardStats';
import { jsPDF } from 'jspdf';

import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import InstructorTable from './InstructorManagement';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    etudiants: [],
    instructeurs: [],
    courses: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [error, setError] = useState(null);
  const [downloadType, setDownloadType] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    niveau: '',
    prix: '',
    dureeMinutes: '',
    categorie_id: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('/api/admin/dashboard');
        setDashboardData({
          etudiants: res.data[0] || [],
          instructeurs: res.data[1] || [],
          courses: res.data[2] || [],
          categories: res.data[3] || [],
        });
        console.log(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const specialties = Array.from(
    new Set(
      dashboardData.instructeurs.map((i) => i.specialite).filter(Boolean),
    ),
  );

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      setError(null);
      await axios.delete(`/api/admin/courses/${courseId}`);
      setDashboardData((prev) => ({
        ...prev,
        courses: prev.courses.filter((c) => c.id !== courseId),
      }));
      alert('Course deleted successfully!');
    } catch (err) {
      console.error('Failed to delete course:', err);
      setError(
        `Failed to delete course: ${
          err.response?.data?.message || err.message
        }`,
      );
      alert(
        `Failed to delete course. ${
          err.response?.data?.message || 'Please try again.'
        }`,
      );
    } finally {
      setOpenDropdownId(null);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setFormData({
      titre: course.titre || '',
      description: course.description || '',
      niveau: course.niveau || 'Débutant',
      prix: course.prix || '0',
      dureeMinutes: course.dureeMinutes || '60',
      categorie_id:
        course.categorie_id || dashboardData.categories[0]?.id || '',
    });
    setPreviewUrl(course.image || '');
    setSelectedFile(null);
    setIsEditModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingCourse(null);
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
    if (!formData.titre.trim()) errors.titre = 'Title is required';
    if (!formData.description.trim())
      errors.description = 'Description is required';
    if (!formData.niveau) errors.niveau = 'Level is required';
    if (!formData.prix) errors.prix = 'Price is required';
    if (isNaN(Number(formData.prix))) errors.prix = 'Price must be a number';
    if (!formData.dureeMinutes) errors.dureeMinutes = 'Duration is required';
    if (isNaN(Number(formData.dureeMinutes)))
      errors.dureeMinutes = 'Duration must be a number';
    if (!formData.categorie_id) errors.categorie_id = 'Category is required';
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
      Object.entries(formData).forEach(([key, val]) =>
        payload.append(key, val),
      );
      if (selectedFile) payload.append('image', selectedFile);
      await axios.post(
        `/api/admin/courses/${editingCourse.id}/update`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setDashboardData((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                ...formData,
                image: previewUrl,
                categorie: prev.categories.find(
                  (cat) => cat.id === Number(formData.categorie_id),
                ),
              }
            : c,
        ),
      }));
      handleCloseModal();
      alert('Course updated successfully!');
    } catch (err) {
      console.error('Failed to update course:', err);
      if (err.response?.data?.errors) setFormErrors(err.response.data.errors);
      else
        alert(
          `Failed to update course: ${
            err.response?.data?.message || err.message
          }`,
        );
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFilteredData = (dataArray) => {
    if (!dataArray) return [];
    let filtered = dataArray;

    // courses: filter by selected level
    if (activeTab === 'courses' && selectedLevel) {
      filtered = filtered.filter((item) => item.niveau === selectedLevel);
    }

    // instructors: filter by selected specialty
    if (activeTab === 'instructors' && selectedSpecialty) {
      filtered = filtered.filter(
        (item) => item.specialite === selectedSpecialty,
      );
    }

    // if there's no search term, return what we have so far
    if (!searchTerm) return filtered;

    // global text search on name/email (students & instructors) or title/desc (courses)
    return filtered.filter((item) => {
      const term = searchTerm.toLowerCase();

      if (activeTab === 'students' || activeTab === 'instructors') {
        return (
          item.user?.nom?.toLowerCase().includes(term) ||
          item.user?.email?.toLowerCase().includes(term)
        );
      }

      if (activeTab === 'courses') {
        return (
          item.titre?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term)
        );
      }

      return true;
    });
  };

  // Download functions
  const downloadExcel = (data, fileName) => {
    setIsDownloading(true);
    try {
      let exportData = [];

      if (activeTab === 'students') {
        exportData = data.map((student) => ({
          ID: student.id,
          Name: student.user?.nom || 'N/A',
          Email: student.user?.email || 'N/A',
          'Joined Date': formatDate(student.created_at),
        }));
      } else if (activeTab === 'instructors') {
        exportData = data.map((instructor) => ({
          ID: instructor.id,
          Name: instructor.user?.nom || 'N/A',
          Email: instructor.user?.email || 'N/A',
          Specialty: instructor.specialite || 'N/A',
          'Joined Date': formatDate(instructor.created_at),
        }));
      } else if (activeTab === 'courses') {
        exportData = data.map((course) => ({
          ID: course.id,
          Title: course.titre || 'N/A',
          Description: course.description || 'N/A',
          Category: course.categorie?.nom || 'N/A',
          Level: course.niveau || 'N/A',
          'Price (MAD)': course.prix || 0,
          Duration: course.dureeMinutes
            ? `${Math.floor(course.dureeMinutes / 60)}h ${
                course.dureeMinutes % 60
              }m`
            : 'N/A',
        }));
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
      );

      // Generate file and trigger download
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
      toast.success('Excel file generated successfully!');
    } catch (err) {
      console.error('Error generating Excel:', err);
      toast.error('Failed to generate Excel file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPDF = (data, fileName) => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();

      // Document settings
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 14;
      const tableStartY = 35;
      let currentY = tableStartY;

      // Colors in RGB format
      const headerBgColor = [41, 128, 185]; // Blue
      const headerTextColor = [255, 255, 255]; // White
      const borderColor = [189, 195, 199]; // Light gray
      const alternateRowColor = [240, 240, 240]; // Light gray

      // Cell dimensions
      const colWidths = {
        id: 15,
        name: 40,
        email: 50,
        date: 30,
        specialty: 40,
        title: 45,
        category: 30,
        level: 25,
        price: 25,
        duration: 30,
      };

      // Add title with styling
      doc.setFontSize(18);
      doc.setTextColor(44, 62, 80);
      doc.text(`${fileName} Report`, margin, 15);

      // Add date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 25);

      // Define columns based on active tab
      let headers = [];
      let columnWidths = [];
      let rows = [];

      if (activeTab === 'students') {
        headers = ['ID', 'Name', 'Email', 'Joined Date'];
        columnWidths = [
          colWidths.id,
          colWidths.name,
          colWidths.email,
          colWidths.date,
        ];
        rows = data.map((student) => [
          student.id,
          student.user?.nom || 'N/A',
          student.user?.email || 'N/A',
          formatDate(student.created_at),
        ]);
      } else if (activeTab === 'instructors') {
        headers = ['ID', 'Name', 'Email', 'Specialty', 'Joined Date'];
        columnWidths = [
          colWidths.id,
          colWidths.name,
          colWidths.email,
          colWidths.specialty,
          colWidths.date,
        ];
        rows = data.map((instructor) => [
          instructor.id,
          instructor.user?.nom || 'N/A',
          instructor.user?.email || 'N/A',
          instructor.specialite || 'N/A',
          formatDate(instructor.created_at),
        ]);
      } else if (activeTab === 'courses') {
        headers = [
          'ID',
          'Title',
          'Category',
          'Level',
          'Price (MAD)',
          'Duration',
        ];
        columnWidths = [
          colWidths.id,
          colWidths.title,
          colWidths.category,
          colWidths.level,
          colWidths.price,
          colWidths.duration,
        ];
        rows = data.map((course) => [
          course.id,
          course.titre || 'N/A',
          course.categorie?.nom || 'N/A',
          course.niveau || 'N/A',
          course.prix || 0,
          course.dureeMinutes
            ? `${Math.floor(course.dureeMinutes / 60)}h ${
                course.dureeMinutes % 60
              }m`
            : 'N/A',
        ]);
      }

      // Calculate total width based on column widths
      const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);

      // Function to draw styled cell
      const drawCell = (
        text,
        x,
        y,
        width,
        height,
        bgColor,
        textColor,
        fontSize,
        isBold = false,
      ) => {
        // Draw cell background
        doc.setFillColor(...bgColor);
        doc.rect(x, y, width, height, 'F');

        // Draw cell border
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.1);
        doc.rect(x, y, width, height, 'S');

        // Draw text
        doc.setTextColor(...textColor);
        doc.setFontSize(fontSize);
        if (isBold) doc.setFont(undefined, 'bold');
        else doc.setFont(undefined, 'normal');

        // Add padding and center text vertically
        const textPadding = 2;
        const textY = y + height / 2 + fontSize / 4;
        doc.text(String(text), x + textPadding, textY);
      };

      // Function to check if we need a new page
      const checkForNewPage = (currentYPos, rowHeight) => {
        if (currentYPos + rowHeight > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();

          // Add header to new page
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`${fileName} Report (continued)`, margin, 10);

          // Reset Y position for new page
          return 20;
        }
        return currentYPos;
      };

      // Draw table headers
      const rowHeight = 10;
      let xOffset = margin;

      // Draw header cells
      headers.forEach((header, i) => {
        drawCell(
          header,
          xOffset,
          currentY,
          columnWidths[i],
          rowHeight,
          headerBgColor,
          headerTextColor,
          11,
          true,
        );
        xOffset += columnWidths[i];
      });

      currentY += rowHeight;

      // Draw data rows
      rows.forEach((row, rowIndex) => {
        currentY = checkForNewPage(currentY, rowHeight);
        xOffset = margin;

        // Set background color for alternating rows
        const bgColor =
          rowIndex % 2 === 0 ? [255, 255, 255] : alternateRowColor;

        row.forEach((cell, colIndex) => {
          drawCell(
            cell,
            xOffset,
            currentY,
            columnWidths[colIndex],
            rowHeight,
            bgColor,
            [0, 0, 0],
            10,
            false,
          );
          xOffset += columnWidths[colIndex];
        });

        currentY += rowHeight;
      });

      // Add footer with page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' },
        );
      }

      // Save the document
      doc.save(`${fileName}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = (type) => {
    let data;
    let fileName;

    if (activeTab === 'students') {
      data = getFilteredData(dashboardData.etudiants);
      fileName = 'Students_List';
    } else if (activeTab === 'instructors') {
      data = getFilteredData(dashboardData.instructeurs);
      fileName = 'Instructors_List';
    } else if (activeTab === 'courses') {
      data = getFilteredData(dashboardData.courses);
      fileName = 'Courses_List';
    }

    if (type === 'excel') {
      downloadExcel(data, fileName);
    } else if (type === 'pdf') {
      downloadPDF(data, fileName);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-neutral-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          Reload Page
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: 'Students',
      count: dashboardData.etudiants.length,
      icon: <FiUsers size={24} className="text-blue-500" />,
    },
    {
      title: 'Instructors',
      count: dashboardData.instructeurs.length,
      icon: <FiUser size={24} className="text-green-500" />,
    },
    {
      title: 'Courses',
      count: dashboardData.courses.length,
      icon: <FiBook size={24} className="text-purple-500" />,
    },
    {
      title: 'Categories',
      count: dashboardData.categories.length,
      icon: <FiStar size={24} className="text-yellow-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12 relative">
      <div
        className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0"
        style={{
          backgroundImage: `url(${moroccanPattern})`,
          backgroundSize: '200px',
          backgroundRepeat: 'repeat',
          opacity: 0.05,
        }}
      />
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/10 to-transparent z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-neutral-600">
            Manage students, instructors and courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow flex items-center"
            >
              <div className="mr-4 p-3 bg-primary/5 rounded-lg">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-neutral-800">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-primary">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>

        <DashboardStats dashboardData={dashboardData} />

        <div className="bg-white rounded-xl shadow mb-8">
          <div className="flex flex-wrap justify-between p-4">
            <div className="flex space-x-4 border-b md:border-b-0 mb-4 md:mb-0">
              {['students', 'instructors', 'courses'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium ${
                    activeTab === tab
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-neutral-600 hover:text-primary'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Download buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload('pdf')}
                  disabled={isDownloading}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  {isDownloading && downloadType === 'pdf' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiFileText className="mr-2" />
                  )}
                  PDF
                </button>
                <button
                  onClick={() => handleDownload('excel')}
                  disabled={isDownloading}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {isDownloading && downloadType === 'excel' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiFile className="mr-2" />
                  )}
                  Excel
                </button>
              </div>

              {/* Search and filters */}
              <div className="flex space-x-4">
                <div className="relative">
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-primary"
                    placeholder="Search..."
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                </div>
                {activeTab === 'courses' && (
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="py-2 px-4 border rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Levels</option>
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
                )}

                {activeTab === 'instructors' && (
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="py-2 px-4 border rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {activeTab === 'students' && (
            <StudentTable
              data={getFilteredData(dashboardData.etudiants)}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'instructors' && (
            <InstructorTable
              data={getFilteredData(dashboardData.instructeurs)}
              formatDate={formatDate}
            />
          )}
          {activeTab === 'courses' && (
            <CourseTable
              data={getFilteredData(dashboardData.courses)}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
              onEdit={handleEditCourse}
              onDelete={handleDeleteCourse}
            />
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-xl font-semibold">Edit Course</h3>
              <button
                onClick={handleCloseModal}
                className="p-1 rounded-full hover:bg-neutral-100"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex justify-center">
                <div className="relative group w-48 h-48 rounded-lg overflow-hidden bg-neutral-100 border-2 border-dashed flex items-center justify-center">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Course"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiImage size={48} className="text-neutral-400" />
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
                  label="Title"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange}
                  error={formErrors.titre}
                />
                <Field
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={formErrors.description}
                  textarea
                />
                <Field
                  label="Category"
                  name="categorie_id"
                  value={formData.categorie_id}
                  onChange={handleInputChange}
                  error={formErrors.categorie_id}
                  select
                  options={dashboardData.categories.map((c) => ({
                    value: c.id,
                    label: c.nom,
                  }))}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field
                    label="Level"
                    name="niveau"
                    value={formData.niveau}
                    onChange={handleInputChange}
                    error={formErrors.niveau}
                    select
                    options={[
                      { value: 'Débutant', label: 'Débutant' },
                      { value: 'Intermédiaire', label: 'Intermédiaire' },
                      { value: 'Avancé', label: 'Avancé' },
                    ]}
                  />
                  <Field
                    label="Price (MAD)"
                    name="prix"
                    value={formData.prix}
                    onChange={handleInputChange}
                    error={formErrors.prix}
                  />
                  <Field
                    label="Duration (minutes)"
                    name="dureeMinutes"
                    value={formData.dureeMinutes}
                    onChange={handleInputChange}
                    error={formErrors.dureeMinutes}
                  />
                </div>
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
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  textarea,
  select,
  options,
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      {select ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border ${
            error ? 'border-red-500' : 'border-neutral-300'
          } rounded focus:ring-2 focus:ring-primary`}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
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

export default AdminDashboard;

function StudentTable({ data, formatDate }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Joined Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-12 text-center text-neutral-500"
              >
                No students found
              </td>
            </tr>
          ) : (
            data.map((student) => (
              <tr key={student.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                  <img
                    className="w-16 h-16 rounded-full object-cover"
                    src={student.image}
                    alt=""
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                  {student.user?.nom || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {student.user?.email || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {formatDate(student.created_at)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function CourseTable({
  data,
  openDropdownId,
  setOpenDropdownId,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Level
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-12 text-center text-neutral-500"
              >
                No courses found
              </td>
            </tr>
          ) : (
            data.map((course) => (
              <tr key={course.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                  {course.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800 flex items-center">
                  {course.image && (
                    <div className="w-10 h-10 bg-neutral-100 rounded-md overflow-hidden mr-3">
                      <img
                        src={course.image}
                        alt={course.titre}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <span className="truncate max-w-[200px]">{course.titre}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {course.categorie?.nom || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.niveau === 'Débutant'
                        ? 'bg-green-100 text-green-800'
                        : course.niveau === 'Intermédiaire'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {course.niveau || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {course.prix ? `${course.prix} MAD` : 'Free'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                  {course.dureeMinutes
                    ? `${Math.floor(course.dureeMinutes / 60)}h ${
                        course.dureeMinutes % 60
                      }m`
                    : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === course.id ? null : course.id,
                      )
                    }
                    className="text-neutral-600 hover:text-neutral-900"
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {openDropdownId === course.id && (
                    <div className="absolute right-6 mt-2 w-36 bg-white rounded-md shadow-lg z-10">
                      <button
                        onClick={() => onEdit(course)}
                        className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                      >
                        <FiEdit className="mr-2" size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(course.id)}
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
  );
}
