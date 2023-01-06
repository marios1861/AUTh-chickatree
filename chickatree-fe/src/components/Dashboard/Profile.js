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

const theme = createTheme({
  palette: {
    background: {
      paper: '#c7f9cc',
    }
  },
});


const Profile = () => {
  const [ profileData, setProfileData ] = React.useState(null);
  const { user, useApi } = React.useContext(AuthContext);
  const [ editProfile, setEditProfile ] = React.useState(false);
  const apiClient = useApi();
  React.useEffect(() => {
    apiClient.get("api/profile/").then((response) => {
      setProfileData(response.data);
    }).catch((error) => {
      console.log(error);
    });
    return setProfileData(null)
  }, [apiClient, user]);

  let items = [];
  if (profileData) {
    items = [
      [ "Username", user.username, 'username', user.id, profileData.id ],
      [ "Email", user.email, 'email' ],
      [ "Name", `${user.first_name} ${user.last_name}`,
        user.first_name, user.last_name, 'first_name', 'last_name', "First Name", "Last Name" ],
      [ "Date of Birth", profileData.date_of_birth, 'date_of_birth' ],
      [ "Gender", profileData.gender, 'gender' ],
      [ "Location", `${profileData.city}, ${profileData.country}`,
        profileData.city, profileData.country, 'city', 'country', "City", "Country" ],
    ];
  }

  return (
    <Container maxWidth="lg" sx={ { mt: 4, mb: 4 } }>
      <Grid container spacing={ 3 }>
        <Grid item xs={ 12 }>
          { profileData
            ? <Paper
              elevation={ 2 }
              sx={ {
                p: 3,
              } } >
              { editProfile
                ? <ProfileEdit
                  items={ items }
                  apiClient={ apiClient }
                  setEditProfile={ setEditProfile }
                  setProfileData={ setProfileData } />
                : <ProfileDetails
                  items={ items }
                  setEditProfile={ setEditProfile } /> }
            </Paper>
            : null }
        </Grid>
      </Grid>
    </Container>
  );
};

const ProfileDetails = ({ items, setEditProfile }) => {

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
          onClick={ () => setEditProfile(true) }>
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