import * as React from 'react';
import { Alert, Box, Button, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ChangePassword() {
  const navigate = useNavigate();

  const [data, setData] = React.useState({});
  const [alert, setAlert] = React.useState(true);

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setData({...data, [name] : value});
  }

  const changePassword = async (e) => {
    try {
      e.preventDefault()
      const result = await axios({
        url: `${process.env.REACT_APP_HOST_TMT_API}/users/change-password`,
        method: 'POST',
        data : {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
        headers : {
          Authorization: localStorage.getItem('access_token'),
        },
      });
      Swal.fire(result.data.message);
      navigate('/tools');
    } catch (error) {
      if(error.response.status === 401){
        navigate('/login')
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.response.data.message,
          footer: '<a href="">Why do I have this issue?</a>'
        });
      } 
    }
  }

  React.useEffect(() => {
    if(data.verifyNewPassword !== data.newPassword){
      setAlert(true)
    }else{
      setAlert(false)
    }
  },[data.verifyNewPassword])

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Ubah Password
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={changePassword}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="oldPassword"
          label="Password Lama"
          name="oldPassword"
          type="password"
          onChange={handleOnChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="newPassword"
          label="Password Baru"
          name="newPassword"
          type="password"
          onChange={handleOnChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="verifyNewPassword"
          label="Ulangi Password Baru"
          name="verifyNewPassword"
          type="password"
          onChange={handleOnChange}
        />
        {alert ? <Alert severity="error">Password Tidak Cocok!</Alert> : ''}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Ubah
        </Button>
      </Box>
    </Box>
  );
}