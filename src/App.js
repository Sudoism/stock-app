import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StockChart from './components/StockChart';
import NotesPane from './components/NotesPane';
import StocksOverview from './pages/StocksOverview';
import StockDetail from './pages/StockDetail';

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [selectedNote, setSelectedNote] = useState(null);

  const addNote = (note) => {
    const newNotes = [...notes, note];
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const updateNote = (updatedNote) => {
    const newNotes = notes.map(note => note.id === updatedNote.id ? updatedNote : note);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<StocksOverview />} />
        <Route path="/stocks/:stockId" element={
          <div className="min-h-screen bg-gray-100 flex">
            <StockChart
              notes={notes}
              addNote={addNote}
              setSelectedNote={setSelectedNote}
              selectedNote={selectedNote}
            />
            <NotesPane
              selectedNote={selectedNote}
              updateNote={updateNote}
              deleteNote={deleteNote}
            />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
