import React, { useState } from "react";
import NotesGrid from "@/components/organisms/NotesGrid";
import QuickAddModal from "@/components/organisms/QuickAddModal";

const NotesPage = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleAddNote = () => {
    setShowQuickAdd(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowQuickAdd(true);
  };

  const handleQuickAddSuccess = () => {
    // Refresh the notes data
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <NotesGrid
        onAddNote={handleAddNote}
        onEditNote={handleEditNote}
      />
      
      <QuickAddModal
        isOpen={showQuickAdd}
        onClose={() => {
          setShowQuickAdd(false);
          setEditingNote(null);
        }}
        type="note"
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
};

export default NotesPage;