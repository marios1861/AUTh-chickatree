import { Paper, Typography, TextField } from "@mui/material";
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
        p:2,
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
        alignItems="center"
        alignContent="stretch"
        justifyContent="space-between">
        <Grid>
          <TextField label="Title" variant="outlined"
            size="large"
            multiline
            maxRows={4}
            value={ activeNote.title }
            onChange={ (e) => onEditField("title", e.target.value) }
            autoFocus />
        </Grid>
        <Grid>
          <textarea
            placeholder="Write your note here..."
            value={ activeNote.body }
            onChange={ (e) => onEditField("body", e.target.value) } />
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