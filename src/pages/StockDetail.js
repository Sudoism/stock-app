import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStock, getNotes, createNote, updateNote, deleteNote } from '../api';
import StockChart from '../components/StockChart';
import NotesPane from '../components/NotesPane';
import AddNoteModal from '../components/AddNoteModal';

const StockDetail = () => {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const addNote = async (note) => {
    try {
      const response = await createNote({
        ...note,
        stockId: stock.id,
      });
      setNotes([...notes, response.data]);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const updateExistingNote = async (note) => {
    try {
      await updateNote(note);
      setNotes(notes.map((n) => (n.id === note.id ? note : n)));
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const deleteExistingNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <Link to="/">
        <button className="mb-4 p-2 bg-gray-500 text-white rounded">
          Back to Overview
        </button>
      </Link>
      {stock ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{stock.name}</h1>
          <div className="w-full max-w-4xl">
            <StockChart
              ticker={ticker}
              notes={notes}
              selectedNote={selectedNote}
              setSelectedNote={setSelectedNote}
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Add Note
            </button>
          </div>
          <div className="w-full max-w-4xl mt-4">
            <NotesPane
              selectedNote={selectedNote}
              updateNote={updateExistingNote}
              deleteNote={deleteExistingNote}
            />
          </div>
          <AddNoteModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            addNote={addNote}
          />
        </>
      ) : (
        <p>Loading stock details...</p>
      )}
    </div>
  );
};

export default StockDetail;
