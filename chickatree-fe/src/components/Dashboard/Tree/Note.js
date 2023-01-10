import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useReducer, useEffect } from 'react';
import Main from './Note/Main';
import Sidebar from './Note/Sidebar';


function reducer(state, action) {
  switch (action.type) {
    case "requestRefresh":
      return {
        list: state.list,
        activeNoteId: state.activeNoteId,
        refresh: true
      };
    case "finishRefresh":
      return {
        list: action.data,
        activeNoteId: state.activeNoteId,
        refresh: false
      };

    case "delete":
      return {
        list: state.list.filter((note) => note.id !== action.id),
        activeNoteId: state.activeNoteId,
        refresh: state.refresh
      };

    case "activate": {
      return {
        list: state.list,
        activeNoteId: action.id,
        refresh: state.refresh
      };
    }

    case "deactivate": {
      return {
        list: state.list,
        activeNoteId: null,
        refresh: state.refresh
      };
    }

    default: {
      throw Error('Unknown Note action');
    }
  }
}

export default function Note({ tree, dispatch: treeDispatch, apiClient }) {
  const [state, dispatch] = useReducer(
    reducer,
    { activeNoteId: null, list: [], refresh: true },
  );

  useEffect(() => {
    if (state.refresh) {
      apiClient
        .get(`api/notes/${tree.id}/`)
        .then((response) => {
          dispatch({ type: 'finishRefresh', data: response.data });
        })
        .catch((err) => console.log(err));
    }
  }, [state.refresh, tree.id, apiClient]);

  return (
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
        <Sidebar
          tree={ tree }
          apiClient={ apiClient }
          noteState={ state }
          dispatch={ dispatch }
          treeDispatch={ treeDispatch } />
      </Grid>
      <Grid xs={ 8 } container sx={ { m: 0 } }>
        <Main
          apiClient={ apiClient }
          activeNote={ state.list.find((note) => note.id === state.activeNoteId) }
          dispatch={ dispatch } />
      </Grid>
    </Grid>
  );
}