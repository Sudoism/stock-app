import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStock, getNotes, createNote, updateNote, deleteNote, getCase, createOrUpdateCase } from '../api';
import StockChart from '../components/StockChart';
import StockInfo from '../components/StockInfo';
import FinancialHealth from '../components/FinancialHealth';
import Header from '../components/Header';
import AddNoteModal from '../components/AddNoteModal';
import TransactionSummary from '../components/TransactionSummary';
import NotesCard from '../components/NotesCard';
import CaseComponent from '../components/CaseComponent';
import NewsSentiment from '../components/NewsSentiment';

const StockDetail = () => {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [caseContent, setCaseContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stockResponse, notesResponse, caseResponse] = await Promise.all([
          getStock(ticker),
          getNotes(ticker),
          getCase(ticker)
        ]);
        setStock(stockResponse.data);
        setNotes(notesResponse.data);
        setCaseContent(caseResponse.data?.content || '');
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

  const updateExistingNote = async (updatedNote) => {
    try {
      await updateNote(updatedNote);
      setNotes(notes.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
      setSelectedNote(updatedNote);
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

  const handleCaseSave = async (content) => {
    try {
      await createOrUpdateCase(ticker, content);
      setCaseContent(content);
    } catch (error) {
      console.error('Failed to update case:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header title={stock ? stock.name : 'Loading...'} />
      <div className="p-2">
        {stock ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
            {/* Top Row */}
            <div className="lg:col-span-3 flex flex-col">
              <CaseComponent
                ticker={ticker}
                initialContent={caseContent}
                onSave={handleCaseSave}
              />
            </div>
            <div className="lg:col-span-1 flex flex-col">
              <TransactionSummary notes={notes} ticker={ticker} />
            </div>
            

            {/* Second Row */}
            <div className="lg:col-span-3 card bg-base-100 shadow-xl flex flex-col">
              <div className="card-body p-0">
                <StockChart
                  ticker={ticker}
                  notes={notes}
                  selectedNote={selectedNote}
                  setSelectedNote={setSelectedNote}
                />
              </div>
            </div>
            <div className="lg:col-span-1 flex flex-col space-y-6">
              <NotesCard
                notes={notes}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
                updateNote={updateExistingNote}
                deleteNote={deleteExistingNote}
                addNote={addNote}
                openAddNoteModal={() => setIsAddModalOpen(true)}
              />
            </div>

            {/* Third Row */}
            <div className="lg:col-span-2 flex flex-col">
              <StockInfo ticker={ticker} />
            </div>
            <div className="lg:col-span-2 flex flex-col">
              <FinancialHealth ticker={ticker} />
            </div>

            {/* forth Row (News Sentiment) */}
            <div className="lg:col-span-4 flex flex-col">
              <NewsSentiment ticker={ticker} />
            </div>

          </div>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl">Loading stock details...</p>
          </div>
        )}
      </div>
      <AddNoteModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        addNote={addNote}
      />
    </div>
  );
};

export default StockDetail;