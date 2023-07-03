import * as React from 'react';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'

const defaultTheme = createTheme();

export default function SignIn() {
  const [dataLogin, setDataLogin] = useState({});

  const loginAPI = async () => {
    try {
      const result = await axios.post('http://localhost:3030/login',dataLogin);
      localStorage.setItem('access_token', `Bearer ${result.data.token}`);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Success Login',
        showConfirmButton: false,
        timer: 1500
      })
      return result;
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    loginAPI();
  };

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setDataLogin({...dataLogin, [name] : value});
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="idBadge"
              label="idBadge"
              name="idBadge"
              autoFocus
              onChange={handleOnChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleOnChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/register">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}