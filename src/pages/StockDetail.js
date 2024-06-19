import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStock, getNotes, createNote, updateNote, deleteNote } from '../api';
import StockChart from '../components/StockChart';
import NotesPane from '../components/NotesPane';
import AddNoteModal from '../components/AddNoteModal';
import StockInfo from '../components/StockInfo';
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
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between w-full max-w-4xl mb-4">
        <Link to="/" className="text-gray-500 hover:text-gray-700">
          <FontAwesomeIcon icon={faHome} size="lg" />
        </Link>
        <h1 className="text-2xl font-bold mx-auto">{stock ? stock.name : ''}</h1>
      </div>
      {stock ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-4xl">
            <div className="lg:col-span-3">
              <div className="mb-2">
                <StockChart
                  ticker={ticker}
                  notes={notes}
                  selectedNote={selectedNote}
                  setSelectedNote={setSelectedNote}
                />
              </div>
              <div className="flex items-center justify-between mb-2 space-x-4">
                
                <div className="flex-grow">
                  <NotesPane
                    selectedNote={selectedNote}
                    updateNote={updateExistingNote}
                    deleteNote={deleteExistingNote}
                  />
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Note
                </button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <StockInfo ticker={ticker} />
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
