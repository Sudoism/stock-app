import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStock, getNotes, createNote, updateNote, deleteNote } from '../api';
import StockChart from '../components/StockChart';
import StockInfo from '../components/StockInfo';
import NoteDetail from '../components/NoteDetail';
import Header from '../components/Header';
import AddNoteModal from '../components/AddNoteModal';

const StockDetail = () => {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockResponse, notesResponse] = await Promise.all([
          getStock(ticker),
          getNotes(ticker)
        ]);
        setStock(stockResponse.data);
        setNotes(notesResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [ticker]);

  const addNote = async (note) => {
    try {
      const response = await createNote({ ...note, stockId: stock.id });
      setNotes([...notes, response.data]);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const updateExistingNote = async (note) => {
    try {
      await updateNote(note);
      setNotes(notes.map((n) => (n.id === note.id ? note : n)));
      setSelectedNote(note);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const deleteExistingNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
      setSelectedNote(null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header title={stock ? stock.name : 'Loading...'} />
      <div className="container mx-auto p-4">
        {stock ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <StockChart
                ticker={ticker}
                notes={notes}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
              />
            </div>
            <div className="lg:col-span-1">
              <StockInfo ticker={ticker} />
              {selectedNote && (
                <NoteDetail
                  note={selectedNote}
                  updateNote={updateExistingNote}
                  deleteNote={deleteExistingNote}
                  onClose={() => setSelectedNote(null)}
                />
              )}
              <div className="mt-4">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary btn-block"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Loading stock details...</p>
          </div>
        )}
      </div>
      <AddNoteModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        addNote={addNote}
      />
    </div>
  );
};

export default StockDetail;