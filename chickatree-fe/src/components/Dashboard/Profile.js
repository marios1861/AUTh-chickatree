import * as React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AuthContext from '../AuthProvider';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import ProfileEdit from './Profile/ProfileEdit';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    background: {
      paper: '#c7f9cc',
    }
  },
});

function reducer(state, action) {
  switch (action.type) {
    case 'load': {
      return {
        profileData: action.profileData,
        editProfile: state.editProfile,
      };
    }
    case 'edit': {
      return {
        editProfile: true,
        profileData: state.profileData,
      };
    }
    case 'save': {
      return {
        profileData: action.profileData,
        editProfile: false,
      };
    }
    default: {
      throw Error('Unknown profile action');
    }

  }
}

const Profile = () => {
  const { user, useApi, logoutUser } = React.useContext(AuthContext);
  const [ state, dispatch ] = React.useReducer(
    reducer, { profileData: null, editProfile: false });

  const apiClient = useApi();
  React.useEffect(() => {
    apiClient.get("api/profile/").then((response) => {
      dispatch({
        type: "load",
        profileData: response.data
      });
    }).catch((error) => {
      console.log(error);
    });
  }, [ apiClient ]);

  let items = [];
  if (state.profileData) {
    items = [
      [ "Username", user.username, 'username', user.id, state.profileData.id ],
      [ "Email", user.email, 'email' ],
      [ "Name", `${user.first_name} ${user.last_name}`,
        user.first_name, user.last_name, 'first_name', 'last_name', "First Name", "Last Name" ],
      [ "Date of Birth", state.profileData.date_of_birth, 'date_of_birth' ],
      [ "Gender", state.profileData.gender, 'gender' ],
      [ "Location", `${state.profileData.city}, ${state.profileData.country}`,
        state.profileData.city, state.profileData.country, 'city', 'country', "City", "Country" ],
    ];
  }

  return (
    <Container maxWidth="lg" sx={ { mt: 4, mb: 4 } }>
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 }>
          { state.profileData
            ? <Paper
              elevation={ 2 }
              sx={ {
                p: 3,
              } } >
              { state.editProfile
                ? <ProfileEdit
                  items={ items }
                  apiClient={ apiClient }
                  dispatch={ dispatch }
                  user={ user }
                  logout={ logoutUser } />
                : <ProfileDetails
                  items={ items }
                  dispatch={ dispatch } /> }
            </Paper>
            : null }
        </Grid>
      </Grid>
    </Container>
  );
};

const ProfileDetails = ({ items, dispatch }) => {

  const componentItems = items.map(([ first, second, ...rest ], index) => {
    return (
      <React.Fragment key={ index }>
        <ProfileRow
          first={ first }
          second={ second } />
        <Grid item xs={ 12 }><Divider /></Grid>
      </React.Fragment>

    );
  });
  return (
    <Grid
      container
      rowSpacing={ 2 }>
      { componentItems }
      <Grid
        item
        xs={ 12 }
        sx={ { textAlign: "center" } }
      >
        <Button
          variant="outlined"
          onClick={ () => dispatch({ type: 'edit' }) }>
          Edit Profile
        </Button>
      </Grid>
    </Grid>
  );
};

const ProfileRow = ({ first, second }) => {
  return (
    <>
      <Grid item xs={ 6 }>
        <Typography>
          { first }
        </Typography>
      </Grid>
      <Grid item xs={ 6 }>
        <Typography>
          { second }
        </Typography>
      </Grid>
    </>
  );
};

export default Profile;