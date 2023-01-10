import { Paper, Typography, OutlinedInput, Box, IconButton } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import ReactMarkdown from "react-markdown";
import CloseIcon from '@mui/icons-material/Close';
import PreviewIcon from '@mui/icons-material/Preview';
import { useState } from "react";

const Main = ({ apiClient, activeNote, dispatch }) => {
  const [preview, setPreview] = useState(false);
  const handleSave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const saveNote = {
      ...activeNote,
      title: data.get("title"),
      markdown_text: data.get("markdown_text")
    };

    apiClient
      .put(
        `api/note/${saveNote.id}/`,
        saveNote
      )
      .then(() => {
        dispatch({ type: 'deactivate' });
        dispatch({ type: "requestRefresh" });
      })
      .catch((err) => console.log(err));
  };

  if (!activeNote)
    return (
      <Grid container xs={ 12 } justifyContent="center" alignItems="stretch" flexDirection="column">
        <Typography textAlign="center" variant="h4" color="secondary">
          No note selected
        </Typography>
      </Grid>);
  return (
    <Paper
      elevation={ 3 }
      sx={ {
        p: 2,
        flexGrow: 1,
        display: "flex",
        borderRadius: '30px',
        width: "100%"
      } } >
      { preview
        ? <Box sx={ { pl: 3, pr: 3, display: "flex", flexDirection: "column", flexGrow: 1 } }>
          <Box sx={ { display: "flex", justifyContent: "space-between" } }>
            <h1>{
              activeNote.title }
            </h1>
            <IconButton color="secondary" onClick={ () => setPreview(false) }>
              <PreviewIcon
                sx={ {
                  height: 40,
                  width: 40
                } }
                color="secondary" />
            </IconButton>
          </Box>
          <ReactMarkdown
            style={ { width: "100%" } }>
            { activeNote.markdown_text }
          </ReactMarkdown> </Box>
        : <Grid
          component="form"
          noValidate
          onSubmit={ handleSave }
          container
          xs={ 12 }
          flexWrap="nowrap"
          flexDirection="column"
          alignItems="stretch"
          alignContent="stretch"
          justifyContent="flex-start">
          <Grid container justifyContent="space-between">
            <Grid xs={ 10 }>
              <OutlinedInput placeholder="Title" variant="outlined"
                multiline
                name="title"
                maxRows={ 2 }
                fullWidth
                defaultValue={ activeNote.title }
                autoFocus
                sx={ {
                  backgroundColor: "#f8f8f8",
                } } />
            </Grid>
            <Grid xs={ 2 }>
              <IconButton color="secondary" onClick={ () => setPreview(true) }>
                <PreviewIcon
                  sx={ {
                    height: 40,
                    width: 40
                  } }
                  color="secondary" />
              </IconButton>
              <IconButton color="secondary"
                type="submit">
                <CloseIcon
                  sx={ {
                    height: 40,
                    width: 40
                  } }
                  color="secondary" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" flex="1">
            <Grid xs={ 12 }>
              <Box
                sx={ {
                  p: 2,
                  font: "inherit",
                  resize: "none",
                  overflow: "auto",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f8f8f8",
                  borderRadius: "4px",
                  border: "2px solid #ccc",
                  boxSizing: "border-box",
                  "&:hover": {
                    border: "1px",
                    borderStyle: "solid",
                    borderColor: "black"
                  }
                } }
                name="markdown_text"
                rows="20"
                placeholder="Write your note here..."
                defaultValue={ activeNote.markdown_text }
                component="textarea"
              >
              </Box>
            </Grid>
          </Grid>
        </Grid> }
    </Paper>
  );
};


export default Main;