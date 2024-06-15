import React from 'react';

function NotesPane({ selectedNote, updateNote, deleteNote }) {
  const handleEditNote = () => {
    const text = prompt('Edit your note:', selectedNote.content);
    if (text !== null) {
      updateNote({ ...selectedNote, content: text });
    }
  };

  if (!selectedNote) {
    return (
      <div className="w-1/3 p-4 bg-white">
        <h2 className="text-xl font-bold">Select a note to view details</h2>
      </div>
    );
  }

  return (
    <div className="w-1/3 p-4 bg-white">
      <h2 className="text-xl font-bold">{selectedNote.date}</h2>
      <p>{selectedNote.content}</p>
      <button
        className="bg-yellow-500 text-white p-2 mt-2"
        onClick={handleEditNote}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white p-2 mt-2"
        onClick={() => deleteNote(selectedNote.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default NotesPane;
