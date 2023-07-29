import * as React from 'react';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const [teams, setTeams] = useState([]);
  const [timId, setTimId] = React.useState('');
  const [dataRegister, setDataRegister] = useState({});
  // const checkToken = async () => {
  //   try {
  //     await axios({
  //       method: 'GET',
  //       url: 'http://localhost:3030/tools',
  //       headers : {
  //         Authorization: localStorage.getItem('access_token')
  //       }
  //     })
  //     navigate('/tools');
  //   } catch (error) {
  //     navigate('/register');
  //   }
  // }

  // useEffect(() => {
  //   checkToken();
  // },[])

  const registerAPI = async () => {
    try {
      const result = await axios.post(`${process.env.REACT_APP_HOST_TMT_API}/register`,{...dataRegister, teamId: timId}, {
        headers : {
          Authorization: localStorage.getItem('access_token')
        }
      });
      Toast.fire({
        icon: 'success',
        title: result.data.message
      })
      navigate('/register')
      return result;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }
  
  const getDataTeams = async () => {
    try {
      const result = await axios.get(`${process.env.REACT_APP_HOST_TMT_API}/teams`);
      setTeams(result.data.data.teams);
      return result;
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }
  
  const handleChangeTeam = (event) => {
    setTimId(event.target.value);
  };

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setDataRegister({...dataRegister, [name] : value});
  }

  useEffect(() => {
    getDataTeams()
  },[])
  
  const handleSubmit = (event) => {
    event.preventDefault();
    registerAPI();
  };

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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="noHP"
                  label="No HP"
                  name="noHP"
                  placeholder='6281234567890'
                  onChange={handleOnChange}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="teamId-label">Team</InputLabel>
                <Select
                  labelId="teamId-label"
                  id="teamId"
                  value={timId}
                  label="Team"
                  name="teamId"
                  onChange={handleChangeTeam}
                  fullWidth
                >
                  {teams.map(el => <MenuItem value={el.id} key={el.id}>{el.nama}</MenuItem>)}
                </Select>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to="/login">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}