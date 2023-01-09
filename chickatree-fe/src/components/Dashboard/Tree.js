import {
  Box,
  CardContent,
  Card,
  Typography,
  CardActions,
  Button,
  CardMedia,
  IconButton,
  Tooltip
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as React from 'react';
import Note from './Tree/Note';
import { Container } from '@mui/system';


function reducer(state, action) {
  const newTree = () => (
    {
      id: null,
      color: null,
      title: null,
      image: null,
      owner: null,
    }
  );
  switch (action.type) {
    case "create":
      return {
        trees: [...state.trees, newTree]
      };
    case "delete":
      return {
        trees: state.trees.filter((tree) => tree.id !== action.id),
      };
    default: {
      throw Error('Unknown tree action');
    }
  }
}

function TreeItem({ tree, dispatch }) {
  return (
    <Card sx={ {
      height: "100%",
      borderRadius: '30px',
      backgroundColor: tree.color || "#ffffff"
    } }>
      <CardMedia
        component="img"
        height="95"
        image={ tree.image }
        alt="Tree image"
      />
      <CardContent>
        <Typography variant="h5" component="div">
          { tree.title || "No Title" }
        </Typography>
        <Typography sx={ { mb: 1.5 } } color="text.secondary">
          { tree.owner || "unknown user" }
        </Typography>
      </CardContent>
      <CardActions sx={ { pl: 0 } }>
        <Box sx={ { display: "flex", justifyContent: "space-evenly", width: "100%" } }>
          <Button sx={ { color: "secondary.dark" } } size="small">Open</Button>
          <Button sx={ { color: "secondary.dark" } } size="small">Share</Button>
          <Button
            onClick={ () => setTimeout(() => dispatch({ type: 'delete', id: tree.id }), 300) }
            sx={ { color: "secondary.dark" } } size="small">
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

export default function Tree() {
  const [state, dispatch] = React.useReducer(
    reducer,
    {
      trees: []
    },
    (state) => {
      const makeTree = () => ({
        id: null,
        color: null,
        title: null,
        image: null,
        owner: null,
      });
      for (const x of Array(3).keys()) {
        const tree = makeTree();
        tree.id = x;
        state.trees.push(tree);
      }
      return state;
    }
  );

  return (
    <Grid container m={ 1 } spacing={ 4 } justifyContent="flex-start">
      <Grid
        container
        xs={ 2 }
        alignItems="center"
        justifyContent="center"
        sx={ { height: 275, m: 0, width: 275 } }>
        <Tooltip title="Create new Tree" enterDelay={ 500 } leaveDelay={ 200 }>
          <IconButton
            onClick={ () => dispatch({ type: "create" }) }
            size="small"
            sx={ { color: "primary.dark" } }
            aria-label="add to shopping cart">
            <AddCircleOutlineIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </Grid>
      { state.trees.map((tree) => (
        <Grid
          xs={ 2 }
          key={ tree.id }
          sx={ {
            height: 275,
            width: 275,
          } }>
          <TreeItem tree={ tree } dispatch={ dispatch } />
        </Grid>
      )) }
    </Grid>
  );
}