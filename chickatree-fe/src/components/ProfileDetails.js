import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AuthContext from './AuthProvider';

const theme = createTheme({
    palette: {
        background: {
            paper: '#c7f9cc',
        }
    },
});

export default function ProfileDetails() {

    const { profile } = useContext(AuthContext);

    const handleProfile = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        profile(
            data.get('id'),
            data.get('username'),
            data.get('first_name'),
            data.get('last_name'),
            data.get('date_of_birth'),
            data.get('gender'),
            data.get('country'),
            data.get('city'),
            data.get('profile_image'),
        );
    };

    const [gender, setGender] = React.useState('');

    const handleChange = (event) => {
        setGender(event.target.value);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Grid item gia eikona profil />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} >
                    <Box
                        sx={{
                            marginTop: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Box component="form" noValidate onSubmit={handleProfile} sx={{ mt: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        autoComplete="given-name"
                                        name="firstName"
                                        required
                                        fullWidth
                                        id="firstName"
                                        label="First Name"
                                        autoFocus
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="lastName"
                                        label="Last Name"
                                        name="lastName"
                                        autoComplete="family-name"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="dateOfBirth"
                                        label="Date of Birth"
                                        name="dateOfBirth"
                                        autoComplete="date-of-birth"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id="demo-select-small">
                                            Gender
                                        </InputLabel>
                                        <Select
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={gender}
                                            label="Gender"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                            <MenuItem value={10}>Male</MenuItem>
                                            <MenuItem value={20}>Female</MenuItem>
                                            <MenuItem value={30}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="city"
                                        label="City"
                                        name="city"
                                        autoComplete="city"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
                                        id="country"
                                        label="Country"
                                        name="country"
                                        autoComplete="country"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid >
            </Container >
        </ThemeProvider >
    )
}