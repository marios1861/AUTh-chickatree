import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box } from '@mui/material';
import { useReducer } from 'react';
import uuid from 'react-uuid';
import Main from './Note/Main';
import Sidebar from './Note/Sidebar';


function reducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        list: [newNote(), ...state.list],
        activeNoteId: state.activeNoteId

      };

    case "update": {
      return {
        list:
          state
            .list
            .filter((note) => note.id !== state.activeNoteId)
            .concat([action.updatedNote]),
        activeNoteId: state.activeNoteId

      };
    }

    case "delete":
      return {
        list: state.list.filter((note) => note.id !== action.id),
        activeNoteId: state.activeNoteId
      };

    case "activate": {
      return {
        list: state.list,
        activeNoteId: action.id
      };
    }
    default: {
      throw Error('Unknown profile action');
    }
  }
}


const newNote = () => {
  return {
    id: uuid(),
    title: "",
    body: "",
    lastModified: Date.now()
  };
};

export default function Note() {
  const [state, dispatch] = useReducer(reducer, { activeNoteId: false, list: [] });

  return (
    <Box sx={ { m: 4, height: "100%" } } >
      <Grid
        m={ 0 }
        height="100%"
        container
        display="flex"
        spacing={ 3 }
        alignItems="stretch"
        flexWrap="nowrap"
        alignContent="stretch">
        <Grid xs={ 4 } container sx={ { m: 0 } }>
          <Sidebar noteState={ state } dispatch={ dispatch } />
        </Grid>
        <Grid xs={ 8 } container sx={ { m: 0 } }>
          <Main activeNote={ state.list.find((note) => note.id === state.activeNoteId) } dispatch={ dispatch } />
        </Grid>
      </Grid>
    </Box>
  );
}