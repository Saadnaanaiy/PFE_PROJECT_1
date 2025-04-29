import { useState } from 'react';
import {
  FiPlus,
  FiTrash2,
  FiMove,
  FiChevronUp,
  FiChevronDown,
  FiEdit2,
  FiCheck,
  FiX,
  FiList,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SectionManager = ({ sections, setSections }) => {
  const [newSection, setNewSection] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const addSection = () => {
    if (newSection.trim() === '') return;

    setSections([
      ...sections,
      {
        titre: newSection.trim(),
        ordre: sections.length,
      },
    ]);
    setNewSection('');
  };

  const removeSection = (index) => {
    const updatedSections = [...sections];
    updatedSections.splice(index, 1);

    // Update order after removal
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      ordre: idx,
    }));

    setSections(reorderedSections);
  };

  const moveSection = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedSections = [...sections];
    const temp = { ...updatedSections[index] };

    updatedSections[index] = { ...updatedSections[newIndex], ordre: index };
    updatedSections[newIndex] = { ...temp, ordre: newIndex };

    setSections(updatedSections);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditText(sections[index].titre);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;

    const updatedSections = [...sections];
    updatedSections[editingIndex].titre = editText.trim();

    setSections(updatedSections);
    setEditingIndex(null);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedSections = [...sections];
    const draggedItem = { ...updatedSections[draggedIndex] };

    // Remove the dragged item
    updatedSections.splice(draggedIndex, 1);
    // Insert at the new position
    updatedSections.splice(index, 0, draggedItem);

    // Update all orders
    const reorderedSections = updatedSections.map((section, idx) => ({
      ...section,
      ordre: idx,
    }));

    setSections(reorderedSections);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center">
          <FiList className="mr-2 text-primary" />
          Course Sections
        </h3>
        <span className="text-sm text-neutral-500 font-medium">
          {sections.length} {sections.length === 1 ? 'Section' : 'Sections'}
        </span>
      </div>

      <p className="text-sm text-neutral-600 mb-6 border-l-4 border-primary-light pl-3 py-2 bg-primary-50 rounded-r-md">
        Divide your course into sections to organize content. You'll be able to
        add lessons to each section after creating the course.
      </p>

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {sections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-lg bg-neutral-50"
            >
              <p className="text-neutral-500">No sections added yet</p>
              <p className="text-sm text-neutral-400 mt-1">
                Add your first section below
              </p>
            </motion.div>
          ) : (
            sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: draggedIndex === index ? 1.02 : 1,
                  boxShadow:
                    draggedIndex === index
                      ? '0 8px 16px rgba(0,0,0,0.1)'
                      : '0 1px 3px rgba(0,0,0,0.05)',
                }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
                className={`flex items-center rounded-lg border ${
                  draggedIndex === index
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-neutral-200 hover:border-neutral-300'
                } p-4 shadow-sm`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <div className="flex items-center text-neutral-400 mr-3 cursor-grab active:cursor-grabbing">
                  <FiMove className="text-lg" />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mr-2">
                      {index + 1}
                    </div>

                    {editingIndex === index ? (
                      <div className="flex-grow flex items-center">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-grow px-3 py-2 rounded border border-primary focus:ring-2 focus:ring-primary focus:border-transparent"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={saveEdit}
                          className="ml-2 p-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
                          title="Save"
                        >
                          <FiCheck />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="ml-2 p-2 text-white bg-neutral-400 hover:bg-neutral-500 rounded-md"
                          title="Cancel"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <span className="font-medium text-neutral-800">
                        {section.titre}
                      </span>
                    )}
                  </div>
                </div>

                {editingIndex !== index && (
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => startEditing(index)}
                      className="p-2 text-neutral-500 hover:text-primary hover:bg-primary-50 rounded-md transition-colors"
                      title="Edit section"
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-md transition-colors ${
                        index === 0
                          ? 'text-neutral-300 cursor-not-allowed'
                          : 'text-neutral-500 hover:text-primary hover:bg-primary-50'
                      }`}
                      title="Move up"
                    >
                      <FiChevronUp />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className={`p-2 rounded-md transition-colors ${
                        index === sections.length - 1
                          ? 'text-neutral-300 cursor-not-allowed'
                          : 'text-neutral-500 hover:text-primary hover:bg-primary-50'
                      }`}
                      title="Move down"
                    >
                      <FiChevronDown />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      title="Remove section"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch">
        <div className="relative flex-grow">
          <input
            type="text"
            value={newSection}
            onChange={(e) => setNewSection(e.target.value)}
            placeholder="Enter section title..."
            className="w-full px-4 py-3 rounded-t-lg sm:rounded-l-lg sm:rounded-r-none border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && addSection()}
          />
          {newSection.length > 0 && (
            <button
              type="button"
              onClick={() => setNewSection('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <FiX />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={addSection}
          disabled={!newSection.trim()}
          className={`px-6 py-3 rounded-b-lg sm:rounded-r-lg sm:rounded-l-none flex items-center justify-center ${
            !newSection.trim()
              ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          } transition-colors`}
        >
          <FiPlus className="mr-2" /> Add Section
        </button>
      </div>

      {sections.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-500">
            <span className="inline-block mr-2">💡</span>
            Pro tip: You can drag and drop sections to reorder them
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionManager;
