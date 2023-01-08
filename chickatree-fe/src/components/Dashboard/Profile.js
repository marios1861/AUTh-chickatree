import * as React from 'react';
import Grid from '@mui/material/Grid';
import Grid2 from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AuthContext from '../AuthProvider';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import ProfileEdit from './Profile/ProfileEdit';
import ProfileAvatar from './Profile/ProfileAvatar';

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
  const { user, apiClient, logoutUser } = React.useContext(AuthContext);
  const [ state, dispatch ] = React.useReducer(
    reducer, { profileData: null, editProfile: false });

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
    <Container maxWidth="xl" sx={ { mt: 4, mb: 4 } }>
      { state.profileData ?
        <Grid2 container spacing={ 3 } sx={ { alignItems: "stretch" } }>
          <Grid2 xs={ 4 } display="flex" alignItems="stretch">
            <Paper
              elevation={ 2 }
              sx={ {
                flexGrow: 1,
                borderRadius: '30px',
              } } >
              <ProfileAvatar
                image={ state.profileData.profile_image }
                user={ user } />
            </Paper>
          </Grid2>
          <Grid2 xs={ 8 } display="flex" alignItems="stretch">
            <Paper
              elevation={ 2 }
              sx={ {
                borderRadius: '30px',
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
          </Grid2>
        </Grid2>
        : null }
    </Container>
  );
};

const ProfileDetails = ({ items, dispatch }) => {

  const componentItems = items.map(([ first, second, ...rest ], index) => {
    return (
      <ProfileRow
        first={ first }
        second={ second }
        key={ index * 2 } />
    );
  });
  let dividedItems = [];
  componentItems.forEach((element, index) => {
    dividedItems.push(element);
    dividedItems.push(
      <Grid2 key={ index * 2 + 1 } xs={ 12 }><Divider /></Grid2>
    );
  });
  return (
    <Grid2
      container
      justifyContent="center"
      alignItems="center"
      sx={ { p: "24px" } }>
      { dividedItems }
      <Grid2
        container
        justifyContent="center"
        alignItems="center"
        xs={ 12 }
        sx={ { height: 80 } }>
        <Button
          variant="outlined"
          onClick={ () => dispatch({ type: 'edit' }) }>
          Edit Profile
        </Button>
      </Grid2>
    </Grid2>
  );
};

const ProfileRow = ({ first, second }) => {
  return (
    <Grid2 container xs={ 12 }>
      <Grid2 xs={ 6 }>
        <Typography
          variant="h6">
          { first }
        </Typography>
      </Grid2>
      <Grid2 alignItems="center" display="flex" xs={ 6 }>
        <Typography
          noWrap>
          { second }
        </Typography>
      </Grid2>
    </Grid2>
  );
};

export default Profile;