import { Paper, Typography, OutlinedInput, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import ReactMarkdown from "react-markdown";

const Main = ({ activeNote, dispatch }) => {
  const onEditField = (key, value) => {
    dispatch({
      type: "update",
      updatedNote: {
        ...activeNote,
        [key]: value,
        lastModified: Date.now(),
      }
    });
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

      <Grid
        container
        xs={ 12 }
        flexWrap="nowrap"
        flexDirection="column"
        alignItems="stretch"
        alignContent="stretch"
        justifyContent="flex-start">
        <Grid container justifyContent="center">
          <Grid xs={ 10 }>
            <OutlinedInput placeholder="Title" variant="outlined"
              multiline
              maxRows={ 2 }
              fullWidth
              value={ activeNote.title }
              onChange={ (e) => onEditField("title", e.target.value) }
              autoFocus
              sx={ {
                backgroundColor: "#f8f8f8",
              } } />
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
                    borderStyle:"solid",
                    borderColor: "black"
                  }
                } }
                rows="20"
                placeholder="Write your note here..."
                value={ activeNote.body }
                onChange={ (e) => onEditField("body", e.target.value) }
                component="textarea"
            >
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};


export default Main;

const a = (<>
  <h1 className="preview-title">{
    "activeNote.title" }
  </h1>
  <ReactMarkdown
    className="markdown-preview">
    { "activeNote.body" }
  </ReactMarkdown> </>);