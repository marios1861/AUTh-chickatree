import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';

const Sidebar = ({ notes, filterednotes, setFilteredNotes, onAddNote, onDeleteNote, activeNote, setActiveNote }) => {
  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);
  const [ input, setInput ] = useState("");
  const getInput = (text) => {
    setInput(text);
    setFilteredNotes(prev => {
      if (!text) {
        return notes;
      }
      return notes.filter((note) => note.title.toLowerCase().includes(text.toLowerCase()));
    });
  };

  const currentActiveNotes = input ? filterednotes : notes;


  return (<div className="app-sidebar">
    <div className="app-sidebar-header">
      <h1><span className="highlight">Notes</span></h1>
      <AddIcon className="app-sidebar-header-add" onClick={ onAddNote } />
    </div>
    <div className="app-sidebar-search">
      <input type="text" placeholder="Search" onChange={ (e) => getInput(e.target.value) } value={ input }></input>
      <SearchIcon className="app-sidebar-search-icon" />
    </div>
    <div className="app-sidebar-notes">
      { currentActiveNotes.map((note) => (
        <div className={ `app-sidebar-note ${note.id === activeNote && "active"}` } onClick={ () => setActiveNote(note.id) }>
          <DeleteIcon
            className="sidebar-note-delete"
            onClick={ () => onDeleteNote(note.id) } />
          <div className="sidebar-note-title">
            <strong>{ note.title }</strong>
          </div>
          <p>{ note.body && note.body.substr(0, 100) + "..." }</p>
          <small className="note-meta">
            { new Date(note.lastModified).toLocaleDateString("en-GB",
              { hour: "2-digit", minute: "2-digit", }) }
          </small>
        </div>
      )) }
    </div>
  </div>);
};

export default Sidebar;