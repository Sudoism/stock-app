import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStock, getNotes, createNote, updateNote, deleteNote } from '../api';
import StockChart from '../components/StockChart';
import NotesPane from '../components/NotesPane';
import AddNoteModal from '../components/AddNoteModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

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
      <div className="flex items-center justify-between w-full max-w-4xl">
        <Link to="/" className="text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faHome} size="lg" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto">{stock ? stock.name : ''}</h1>
      </div>
      {stock ? (
        <>
          <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center">
              <StockChart
                ticker={ticker}
                notes={notes}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Note
              </button>
            </div>
            <div className="w-full mt-4">
              <NotesPane
                selectedNote={selectedNote}
                updateNote={updateExistingNote}
                deleteNote={deleteExistingNote}
              />
            </div>
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
