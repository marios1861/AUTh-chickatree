import { Unstable_Grid2 as Grid, Typography, Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import * as React from 'react';

export default function ProfileAvatar({ image, user }) {
  return (<Grid
    container
    display="flex"
    justifyItems="stretch"
    alignItems="stretch"
    sx={ {
      m: 0,
      p: "12px",
      flexGrow: 1,
      flexBasis: 0,
      minHeight: "100%"
    } }>
    <Grid display="flex" xs={ 12 } justifyContent='center' alignItems="center">
      <Avatar variant="circular"
        sx={ {
          width: 250,
          height: 250,
          m: 1
        } }
        alt={ `${user.first_name} ${user.last_name}` }
        src={ image || null }
      />
    </Grid>
    <Grid xs={ 12 } alignItems="center" justifyContent='center' display="flex" sx={ { textAlign: "center" } }>
      <Typography
        variant="h2">
        { user.username }
      </Typography>
    </Grid>
  </Grid>);
}