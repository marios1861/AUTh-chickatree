import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/NotesOutlined';
import { useState } from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import {
  Avatar,
  TextField,
  ListItemText,
  InputAdornment,
  IconButton,
  Typography,
  List,
  Stack,
  CardActions,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Paper
} from '@mui/material';

const Sidebar = ({ noteState, dispatch }) => {
  const [input, setInput] = useState("");
  const [filterednotes, setFilteredNotes] = useState([]);

  const getInput = (text) => {
    setInput(text);
    setFilteredNotes(() => {
      if (!text) {
        return noteState.list;
      }
      return noteState.list
        .filter((note) =>
          note.title
            .toLowerCase()
            .includes(text.toLowerCase()));
    });
  };

  const currentActiveNotes = input ? filterednotes : noteState.list;

  return (
    <Paper
      elevation={ 3 }
      sx={ {
        p:2,
        display: "flex",
        flexGrow: 1,
        borderRadius: '30px',
        width: "100%"
      } } >
      <Grid
        container
        xs={ 12 }
        flexWrap="nowrap"
        flexDirection="column"
        alignItems="center"
        alignContent="stretch"
        justifyContent="flex-start">
        <Grid container xs={ 12 } alignItems="center" justifyContent="space-between" sx={ { height: 100 } }>
          <Grid>
            <Typography variant='h5'>Notes</Typography>
          </Grid>
          <Grid container xs={ 2 } justifyContent="center" alignItems="center">
            <IconButton color="secondary"
              onClick={ () => dispatch({ type: "add" }) }>
              <AddIcon
                sx={ {
                  height: 40,
                  width: 40
                } }
                color="secondary" />
            </IconButton>
          </Grid>
        </Grid>
        <Grid xs={ 10 } >
          <TextField
            sx={ { height: 50 } }
            InputProps={ {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="secondary" />
                </InputAdornment>
              ),
            } }
            variant="outlined"
            onChange={ (e) => getInput(e.target.value) }
            placeholder="Search"
            value={ input }
          />
        </Grid>
        <Grid xs={ 12 } justifyContent="center"  sx={ { height: 0, flexGrow: 1
        } }>
          <List sx={{overflowY: 'auto', maxHeight: "100%"}}>
            { currentActiveNotes?.map((note) => (
              <ListItem
                sx={ { color: 'secondary.main' } }
                key={ note.id }
                secondaryAction={
                  <IconButton
                    sx={ { color: 'secondary.main' } }
                    edge="end"
                    aria-label="delete"
                    onClick={ () => dispatch({ type: "delete", id: note.id }) }>
                    <DeleteIcon
                    />
                  </IconButton>
                }
                onClick={ () => note.id && dispatch({ type: "activate", id: note.id }) }>
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar sx={ { bgcolor: "white" } }>
                      <NotesIcon color="secondary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primaryTypographyProps={ { overflow: "hidden", noWrap: true, textOverflow: "ellipsis" } }
                    secondaryTypographyProps={ { fontSize: "0.7rem" } }
                    primary={ note.title.slice(0, 32) }
                    secondary={ new Date(note.lastModified).toLocaleDateString("en-GB",
                      { hour: "2-digit", minute: "2-digit", }) }
                  />
                </ListItemButton>
              </ListItem>
            )) }
          </List>
        </Grid>
      </Grid>
    </Paper>);
};

export default Sidebar;