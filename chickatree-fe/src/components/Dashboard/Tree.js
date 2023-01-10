import {
  Box,
  CardContent,
  Card,
  Typography,
  CardActions,
  Button,
  CardMedia,
  IconButton,
  Tooltip,
  CardActionArea,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as React from 'react';
import Note from './Tree/Note';
import AuthContext from '../AuthProvider';


const newTree = () => (
  {
    id: null,
    color: null,
    title: null,
    image: "https://cdn.discordapp.com/attachments/1034170524416344178/1062028525609169026/kitty-cat-kitten-pet-45201.jpeg",
    owner: null,
    edit: false,
  }
);

function reducer(state, action) {
  switch (action.type) {
    case "open":
      return {
        trees: state.trees,
        createDialog: state.update,
        update: state.update,
        openId: action.id
      };
    case "close":
      return {
        trees: state.trees,
        createDialog: state.update,
        update: state.update,
        openId: null
      };
    case "create":
      return {
        trees: state.trees,
        createDialog: true,
        update: state.update,
        openId: state.openId
      };
    case "requestUpdate":
      return {
        trees: state.tree,
        createDialog: action.id ? state.createDialog : false,
        update: true,
        openId: state.openId
      };
    case "finishUpdate":
      return {
        trees: action.data
          .map((tree) => ({ ...tree, color: "#".concat(tree.color.toString(16)) })) || [],
        createDialog: state.createDialog,
        update: false,
        openId: state.openId
      };
    case "edit":
      return {
        trees: state.trees.map((tree) => {
          if (tree.id === action.id) {
            return { ...tree, edit: true };
          }
          else {
            return tree;
          }
        }),
        createDialog: state.createDialog,
        update: state.update,
        openId: state.openId
      };
    case "delete":
      return {
        trees: state.trees.filter((tree) => tree.id !== action.id),
        createDialog: action.id === null ? false : state.createDialog,
        update: state.update,
        openId: state.openId,
      };
    default: {
      throw Error('Unknown Tree action');
    }
  }
}


function TreeEditItem({ tree, dispatch }) {
  const { user, apiClient } = React.useContext(AuthContext);

  const handleDelete = () => {
    if (tree.id) {
      apiClient
        .delete(`api/tree/${tree.id}/`)
        .then(() => dispatch({ type: "requestUpdate" }))
        .catch((err) => console.log(err));
    }
    else {
      dispatch({ type: "delete", id: tree.id });
    }
  };
  const handleSave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const editedTree = {
      ...tree,
      owner: user.username,
      title: data.get("title"),
      image: (data.get("image").size ? data.get("image") : null), //handle database upload
      color: data.get("color")
    };

    data.set("owner", user.id);
    data.set("color", Number(editedTree.color.replace("#", "0x")));

    if (data.get("image").type === 'application/octet-stream') {
      data.delete("image");
    }

    if (tree.id) {
      apiClient
        .put(
          `api/tree/${tree.id}/`,
          data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => dispatch({ type: "requestUpdate", id: tree.id }))
        .catch((err) => console.log(err));
    }
    else {
      apiClient
        .post(
          "api/tree/",
          data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(() => dispatch({ type: "requestUpdate" }))
        .catch((err) => console.log(err));
    }
  };

  return (
    <Card
      component="form"
      noValidate
      onSubmit={ handleSave }
      sx={ {
        height: "100%",
        borderRadius: '30px',
        backgroundColor: tree.color || "#ffffff"
      } }>
      <CardActionArea component="label">
        <CardMedia
          component="img"
          height="95"
          image={ tree.image }
          alt="Tree image"
        />
        <input name="image" hidden accept="image/png, image/jpeg" type="file" />
      </CardActionArea>
      <CardContent>
        <Box sx={ { display: "flex" } }>
          <TextField name="title" label="Title" defaultValue={ tree.title || null } variant="standard" />
          <Button
            component="label"
            sx={ { color: "secondary" } }>
            <input name="color" type="color" defaultValue={ tree.color || "#ffffff" } />
          </Button>
        </Box>
      </CardContent>
      <CardActions>
        <Box sx={ { display: "flex", flexDirection: "column", width: "100%" } }>
          <Box sx={ { display: "flex", justifyContent: "space-evenly", width: "100%" } }>
            <Button
              type="submit"
              sx={ { color: "secondary.dark" } } size="small">Save</Button>
            <Button
              onClick={ () => setTimeout(handleDelete, 200) }
              sx={ { color: "secondary.dark" } } size="small">
              Delete
            </Button>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
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
        <Typography textOverflow="ellipsis" noWrap variant="h5" component="div">
          { tree.title || "No Title" }
        </Typography>
        <Typography sx={ { mb: 1.5 } } color="text.secondary">
          { tree.owner || "unknown user" }
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={ { display: "flex", justifyContent: "space-evenly", width: "100%" } }>
          <Button
            onClick={ () => setTimeout(() => dispatch({ type: 'open', id: tree.id }), 200) }
            sx={ { color: "secondary.dark" } }
            size="small">
            Open
          </Button>
          <Button sx={ { color: "secondary.dark" } } size="small">Share</Button>
          <Button
            onClick={ () => setTimeout(() => dispatch({ type: 'edit', id: tree.id }), 200) }
            sx={ { color: "secondary.dark" } } size="small">
            Edit
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

export default function Tree() {
  const { apiClient } = React.useContext(AuthContext);
  const [state, dispatch] = React.useReducer(
    reducer,
    {
      trees: [],
      createDialog: false,
      update: true,
      openId: null
    },
  );

  React.useEffect(() => {
    if (state.update) {
      apiClient
        .get('api/tree/')
        .then((response) => {
          dispatch({ type: 'finishUpdate', data: response.data });
        })
        .catch((err) => console.log(err));
    }
  }, [state.update, apiClient]);
  if (state.openId) {
    return (
      <Note
        tree={ state.trees.find((tree) => tree.id === state.openId) }
        dispatch={ dispatch }
        apiClient={ apiClient }
      />
    );
  }
  else {
    return (
      <Grid container m={ 1 } spacing={ 4 } justifyContent="flex-start" columnGap={ 0 }>
        <Grid
          container
          xs={ 2 }
          alignItems="center"
          justifyContent="center"
          sx={ { height: 275, m: 0, width: 275 } }>
          { state.createDialog
            ? <TreeEditItem tree={ newTree() } dispatch={ dispatch } />
            : <Tooltip title="Create new Tree" enterDelay={ 500 } leaveDelay={ 200 }>
              <IconButton
                onClick={ () => dispatch({ type: "create" }) }
                size="small"
                sx={ { color: "primary.dark" } }>
                <AddCircleOutlineIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          }
        </Grid>
        { state.trees
          ? state.trees.map((tree) => (
            <Grid
              xs={ 2 }
              key={ tree.id }
              sx={ {
                height: 275,
                width: 275,
              } }>
              { tree.edit
                ? <TreeEditItem tree={ tree } dispatch={ dispatch } />
                : <TreeItem tree={ tree } dispatch={ dispatch } /> }
            </Grid>
          ))
          : null }
      </Grid>
    );
  }
}