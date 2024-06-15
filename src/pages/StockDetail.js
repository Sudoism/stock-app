import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStock, getNotes, createNote } from '../api';

const StockDetail = () => {
  const { stockId } = useParams();
  const [stock, setStock] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchStock = async () => {
      const response = await getStock(stockId);
      setStock(response.data);
    };

    const fetchNotes = async () => {
      const response = await getNotes(stockId);
      setNotes(response.data);
    };

    fetchStock();
    fetchNotes();
  }, [stockId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    const response = await createNote({ stockId, content: newNote });
    setNotes([...notes, response.data]);
    setNewNote('');
  };

  return (
    <div className="container mx-auto p-4">
      {stock && (
        <>
          <h1 className="text-2xl font-bold mb-4">{stock.name} Stock Chart</h1>
          {/* You can integrate the StockChart component here */}
          <ul className="mb-4">
            {notes.map(note => (
              <li key={note.id} className="border-b py-2">{note.content}</li>
            ))}
          </ul>
          <form onSubmit={handleAddNote}>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note"
              className="py-2 px-4 border rounded mb-2"
            />
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">Add Note</button>
          </form>
        </>
      )}
    </div>
  );
};

export default StockDetail;
