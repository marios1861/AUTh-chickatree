import { Unstable_Grid2 as Grid, TextField, Divider, Button, MenuItem } from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import React from "react";
import { Box } from "@mui/system";

function deepEqual(x, y) {
  return (x && y && typeof x === 'object' && typeof y === 'object') ?
    (Object.keys(x).length === Object.keys(y).length) &&
    Object.keys(x).reduce(function (isEqual, key) {
      return isEqual && deepEqual(x[ key ], y[ key ]);
    }, true) : (x === y);
}

export default function ProfileEdit({ items, apiClient, dispatch, user, logout }) {
  const genderChoices = [ 'male', 'female', 'other' ];
  const [ formState, setFormState ] = React.useState(
    {
      date: items.find(element => element[ 0 ] === "Date of Birth")[1],
      gender: genderChoices.findIndex(
        (item) => item === items.find(element => element[ 0 ] === "Gender")[1]),
    }
  );


  const handleEdit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const profileData = {
      city: data.get('city'),
      country: data.get('country'),
      date_of_birth: dayjs(data.get('date_of_birth')).format('YYYY-MM-DD'),
      gender: genderChoices[ data.get('gender') ],
    };
    const userData = {
      id: user.id,
      username: user.username,
      email: data.get('email'),
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
    };
    if (deepEqual(userData, user)) {
      dispatch(
        {
          type: "save",
          profileData: profileData,
        });
      apiClient
        .put('api/profile/update/', profileData)
        .catch((err) => console.log(err));
    } else {
      apiClient
        .put(`api/user/${user.id}/`, userData)
        .catch((err) => console.log(err));
      apiClient
        .put('api/profile/update/', profileData)
        .catch((err) => console.log(err));
      logout();
    }
  };
  let formItems = items.map((item, index) => {
    if (item[ 0 ] === "Name" || item[ 0 ] === "Location") {
      return (
        <Grid
          container
          xs = { 12 }
          key={ index }>
          { item[ 0 ] === "Location" && <Grid xs={ 12 }><Divider /></Grid> }
          <Grid
            xs={ 6 }>
            <TextField
              name={ item[ 4 ] }
              id={ item[ 4 ] }
              label={ item[ 6 ] }
              defaultValue={ item[ 2 ] } />
          </Grid>
          <Grid
            xs={ 6 }>
            <TextField
              name={ item[ 5 ] }
              id={ item[ 5 ] }
              label={ item[ 7 ] }
              defaultValue={ item[ 3 ] } />
          </Grid>
          <Grid xs={ 12 }><Divider /></Grid>
        </Grid>
      );
    }
    else if (item[ 0 ] === "Email") {
      return (
        <Grid
          container
          xs={ 12 }
          key={ index }>
          <Grid
            xs={ 6 }>
            <TextField
              name={ item[ 2 ] }
              id={ item[ 2 ] }
              label={ item[ 0 ] }
              defaultValue={ item[ 1 ] }
            />
          </Grid>
          <Grid xs={ 12 }><Divider /></Grid>
        </Grid>
      );
    }
    else if (item[ 0 ] === "Gender") {
      return (
        <Grid
          container
          key={ index }>
          <Grid
            xs={ 6 }>
            <TextField
              id={ item[ 2 ] }
              name={ item[ 2 ] }
              select
              label={ item[ 0 ] }
              value={ formState.gender === -1 ? 0 : formState.gender }
              onChange={ (event) => {
                setFormState(
                  prevState => ({
                    ...prevState,
                    gender: event.target.value
                  }));
              } }
              sx={ { minWidth: 120 } }>
              <MenuItem key={ 0 } value={ 0 }>
                Male
              </MenuItem>
              <MenuItem key={ 1 } value={ 1 }>
                Female
              </MenuItem>
              <MenuItem key={ 2 } value={ 2 }>
                Other
              </MenuItem>
            </TextField>
          </Grid>
        </Grid>
      );
    }
    else if (item[ 0 ] === "Date of Birth") {
      return (
        <Grid
          key={ index }
          xs={ 6 }>
          <LocalizationProvider dateAdapter={ AdapterDayjs }>
            <DatePicker
              label={ item[ 0 ] }
              value={ formState.date }
              onChange={ (newValue) => {
                setFormState(
                  prevState => ({
                    ...prevState,
                    date: newValue
                  }));
              } }
              renderInput={ (params) => <TextField name={ item[ 2 ] } { ...params } /> }
            />
          </LocalizationProvider>
        </Grid>
      );
    }
    else {
      return null;
    }
  });


  return (
    <Box
      component="form"
      noValidate
      onSubmit={ handleEdit }>
      <Grid
        container
        rowSpacing={ 3 }
        sx={{m: 0}} >
        { formItems }
        <Grid
          xs={ 12 }
          sx={ { textAlign: "center" } }
        >
          <Button
            type="submit"
            variant="outlined">
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}