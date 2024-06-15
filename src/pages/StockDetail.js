import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStock, getNotes, createNote, updateNote, deleteNote } from '../api';
import StockChart from '../components/StockChart';
import NotesPane from '../components/NotesPane';

const StockDetail = () => {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getStock(ticker);
        setStock(response.data);
      } catch (error) {
        console.error('Failed to fetch stock:', error);
      }
    };

    const fetchNotes = async () => {
      try {
        const response = await getNotes(ticker);
        setNotes(response.data);
      } catch (error) {
        console.error('Failed to fetch notes:', error);
      }
    };

    fetchStock();
    fetchNotes();
  }, [ticker]);

  const handleAddNote = async (note) => {
    try {
      const response = await createNote({
        stockId: stock.id,
        date: note.date,
        content: note.content,
      });
      setNotes([...notes, response.data]);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleUpdateNote = async (updatedNote) => {
    try {
      await updateNote(updatedNote);
      setNotes(notes.map(note => (note.id === updatedNote.id ? updatedNote : note)));
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex">
      {stock ? (
        <>
          <div className="w-2/3 p-4">
            <h1 className="text-2xl font-bold mb-4">{stock.name} Stock Chart</h1>
            <StockChart
              stock={stock}
              notes={notes}
              addNote={handleAddNote}
              setSelectedNote={setSelectedNote}
              selectedNote={selectedNote}
            />
          </div>
          <NotesPane
            selectedNote={selectedNote}
            updateNote={handleUpdateNote}
            deleteNote={handleDeleteNote}
          />
        </>
      ) : (
        <p>Loading stock details...</p>
      )}
    </div>
  );
};

export default StockDetail;
