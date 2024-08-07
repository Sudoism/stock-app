import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  getStock, 
  getNotes, 
  createNote, 
  updateNote, 
  deleteNote, 
  getCase, 
  createOrUpdateCase, 
  getBullBearCase, 
  getNewsSentiment, 
  getFinancialStatement, 
  getStockInfo, 
  getLatestStockPrice,
  getYahooStockData
} from '../api';
import StockChart from '../components/StockChart';
import Header from '../components/Header';
import AddNoteModal from '../components/AddNoteModal';
import TransactionSummary from '../components/TransactionSummary';
import NotesCard from '../components/NotesCard';
import Drawer from '../components/Drawer';

const StockDetail = () => {
  const { ticker } = useParams();
  const [stock, setStock] = useState(null);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [caseContent, setCaseContent] = useState('');
  const [activeDrawers, setActiveDrawers] = useState([]);
  const [bullBearData, setBullBearData] = useState(null);
  const [newsSentimentData, setNewsSentimentData] = useState(null);
  const [financialData, setFinancialData] = useState(null);
  const [stockInfoData, setStockInfoData] = useState(null);
  const [latestPrice, setLatestPrice] = useState(null);
  const [stockChartData, setStockChartData] = useState(null);

  const [isMainDataLoaded, setIsMainDataLoaded] = useState(false);

  const isUSStock = (ticker) => {
    return !/\.[A-Z]+$/.test(ticker);
  };

  useEffect(() => {
    const fetchMainData = async () => {
      setIsMainDataLoaded(false);
      try {
        const [stockResponse, notesResponse, caseResponse, priceResponse, chartDataResponse] = await Promise.all([
          getStock(ticker),
          getNotes(ticker),
          getCase(ticker),
          getLatestStockPrice(ticker),
          getYahooStockData(ticker, Math.floor(Date.now() / 1000) - 31536000, Math.floor(Date.now() / 1000), '1d')
        ]);
        setStock(stockResponse.data);
        setNotes(notesResponse.data);
        setCaseContent(caseResponse.data?.content || '');
        setLatestPrice(priceResponse.data.price);
        setStockChartData(chartDataResponse.data);
        setIsMainDataLoaded(true);
      } catch (error) {
        console.error('Failed to fetch main data:', error);
      }
    };
    fetchMainData();
  }, [ticker]);

  useEffect(() => {
    if (isMainDataLoaded) {
      const fetchAdditionalData = async () => {
        try {
          const promises = [getBullBearCase(ticker)];

          if (isUSStock(ticker)) {
            promises.push(
              getNewsSentiment(ticker),
              getFinancialStatement(ticker),
              getStockInfo(ticker)
            );
          }

          const results = await Promise.all(promises);

          setBullBearData(results[0].data);

          if (isUSStock(ticker)) {
            setNewsSentimentData(results[1].data);
            setFinancialData(results[2].data);
            setStockInfoData(results[3].data[0]);
          }

        } catch (error) {
          console.error('Failed to fetch additional data:', error);
        }
      };
      fetchAdditionalData();
    }
  }, [ticker, isMainDataLoaded]);

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
    <div className="min-h-screen bg-white relative">
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
            {isMainDataLoaded ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                {/* Top Row */}
                <div className="lg:col-span-4 flex flex-col">
                  <TransactionSummary notes={notes} ticker={ticker} latestPrice={latestPrice} />
                </div>
                
                {/* Second Row */}
                <div className="lg:col-span-3 card bg-base-100 flex flex-col">
                  <div className="card-body p-0">
                    <StockChart
                      ticker={ticker}
                      notes={notes}
                      selectedNote={selectedNote}
                      setSelectedNote={setSelectedNote}
                      chartData={stockChartData}
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
              <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            )}
          </div>
        </div>
        <Drawer 
          activeDrawers={activeDrawers}
          setActiveDrawers={setActiveDrawers}
          ticker={ticker}
          caseContent={caseContent}
          handleCaseSave={handleCaseSave}
          stockName={stock ? stock.name : ''}
          stockInfoData={stockInfoData}
          newsSentimentData={newsSentimentData}
          financialData={financialData}
          bullBearData={bullBearData}
        />
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