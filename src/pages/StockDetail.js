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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faNewspaper, faChartLine, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const StockDetail = () => {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [caseContent, setCaseContent] = useState('');
  const [activeDrawers, setActiveDrawers] = useState([]);

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

  const toggleDrawer = (drawerName) => {
    setActiveDrawers(prevDrawers => {
      if (prevDrawers.includes(drawerName)) {
        return prevDrawers.filter(name => name !== drawerName);
      } else {
        return [...prevDrawers, drawerName];
      }
    });
  };

  const renderDrawerContent = () => {
    const drawerOrder = ['case', 'info', 'financial', 'news'];
    return drawerOrder
      .filter(drawerName => activeDrawers.includes(drawerName))
      .map((drawerName, index, filteredArray) => {
        let content;
        switch (drawerName) {
          case 'case':
            content = (
              <CaseComponent
                ticker={ticker}
                initialContent={caseContent}
                onSave={handleCaseSave}
              />
            );
            break;
          case 'info':
            content = <StockInfo ticker={ticker} />;
            break;
          case 'news':
            content = <NewsSentiment ticker={ticker} />;
            break;
          case 'financial':
            content = <FinancialHealth ticker={ticker} />;
            break;
          default:
            return null;
        }
        return (
          <div key={drawerName} className={`${index < filteredArray.length - 1 ? 'pb-2' : ''}`}>
            {content}
          </div>
        );
      });
  };

  return (
    <div className="min-h-screen bg-base-200 relative">
      <Header title={stock ? stock.name : 'Loading...'} />
      <div className="drawer drawer-end">
        <input 
          id="stock-drawer" 
          type="checkbox" 
          className="drawer-toggle" 
          checked={activeDrawers.length > 0} 
          onChange={() => setActiveDrawers([])} 
        />
        <div className="drawer-content">
          <div className="p-2 pr-16">
            {stock ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {/* Top Row */}
                <div className="lg:col-span-4 flex flex-col">
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
              </div>
            ) : (
              <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading stock details...</p>
              </div>
            )}
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="stock-drawer" className="drawer-overlay"></label>
          <div className="p-4 pt-20 pr-20 w-[60rem] min-h-full bg-base-200 text-base-content overflow-y-auto">
            {renderDrawerContent()}
          </div>
        </div>
      </div>
      <AddNoteModal
        isOpen={isAddModalOpen}
        onRequestClose={() => setIsAddModalOpen(false)}
        addNote={addNote}
      />
      <div className="fixed top-20 right-2 flex flex-col space-y-2 z-50">
        <button 
          onClick={() => toggleDrawer('case')} 
          className={`btn btn-circle ${activeDrawers.includes('case') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Investment Case"
        >
          <FontAwesomeIcon icon={faBriefcase} />
        </button>
        <button 
          onClick={() => toggleDrawer('info')} 
          className={`btn btn-circle ${activeDrawers.includes('info') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Stock Info"
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        <button 
          onClick={() => toggleDrawer('financial')} 
          className={`btn btn-circle ${activeDrawers.includes('financial') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="Financial Health"
        >
          <FontAwesomeIcon icon={faChartLine} />
        </button>
        <button 
          onClick={() => toggleDrawer('news')} 
          className={`btn btn-circle ${activeDrawers.includes('news') ? 'btn-primary' : 'btn-ghost bg-base-100'}`}
          title="News Sentiment"
        >
          <FontAwesomeIcon icon={faNewspaper} />
        </button>
      </div>
    </div>
  );
};

export default StockDetail;