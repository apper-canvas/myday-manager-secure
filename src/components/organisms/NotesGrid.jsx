import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { noteService } from "@/services/api/noteService";

const NotesGrid = ({ onEditNote, onAddNote }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await noteService.getAll();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllTags = () => {
    const tagSet = new Set();
    notes.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getPreviewText = (content) => {
    const plainText = stripHtml(content);
    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText;
  };

  const NoteCard = ({ note }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onEditNote(note)}
      className="cursor-pointer"
    >
      <Card className="h-full hover:shadow-card-hover transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 font-display line-clamp-2">
            {note.title}
          </h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ApperIcon name="MoreHorizontal" className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {getPreviewText(note.content)}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {format(new Date(note.updatedAt), "MMM d, yyyy")}
          </span>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Edit" className="w-3 h-3" />
            <span>Edit</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) return <Loading type="notes" />;
  if (error) return <Error message={error} onRetry={loadNotes} />;

  const allTags = getAllTags();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 font-display">
            Notes
          </h2>
          <p className="text-gray-600">
            Capture and organize your thoughts
          </p>
        </div>
        <Button
          onClick={onAddNote}
          variant="primary"
          icon="Plus"
        >
          New Note
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="flex-1"
        />
        
        {allTags.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter by tag:</span>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.Id} note={note} />
          ))}
        </div>
      ) : notes.length === 0 ? (
        <Empty
          type="notes"
          onAction={onAddNote}
        />
      ) : (
        <Empty
          type="search"
          onAction={() => {
            setSearchTerm("");
            setSelectedTag("");
          }}
        />
      )}
    </div>
  );
};

export default NotesGrid;