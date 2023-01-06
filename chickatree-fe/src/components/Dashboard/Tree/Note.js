import {useState, useMemo} from 'react';
import uuid from 'react-uuid';
import './Note.css';
import Main from './Note/Main';
import Sidebar from './Note/Sidebar';

const newNote = () => {
  return { id: uuid(),
   title:"",
   body: "",
   lastModified: Date.now()}
 };

export default function Note() {
  const [notes, setNotes] = useState([]);
  const [filterednotes, setFilteredNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);
  

  // Add a new note
  const onAddNote = () => {
    

    // update the list of notes
    setNotes([newNote(), ...notes]);
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArray = notes.map((note) => {
      if(note.id === activeNote) {
        return updatedNote;
      }
      return note;
    });
    
    setNotes(updatedNotesArray);
  }

  const onDeleteNote = (idToDelete) => {
     setNotes(notes.filter((note) => note.id !== idToDelete))
  }

  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote);
  }

  return (
    <div className="App">
     <Sidebar notes={notes} setNotes={setNotes} onAddNote={onAddNote} onDeleteNote={onDeleteNote} activeNote={activeNote} setActiveNote={setActiveNote}  filterednotes={filterednotes} setFilteredNotes={setFilteredNotes}/>
     <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  )
}