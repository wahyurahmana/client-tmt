import * as React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FormTool() {
  const navigate = useNavigate();

  const [dataTool, setDataTool] = React.useState({});

  const handleOnChange = (e) =>{
    const {name, value} = e.target
    setDataTool({...dataTool, [name] : value});
  }

  const handleOnChangeUploadFoto = (value) =>{
    setDataTool({...dataTool, foto : value});
  }

  const handleSubmitTool = async (e) => {
    try {
      e.preventDefault();
      await axios({
        method : 'POST',
        url: 'http://localhost:3030/tools',
        data: dataTool,
        headers: {
          Authorization: localStorage.getItem('access_token'),
          'Content-Type': 'multipart/form-data',
        }
      });
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
        TAMBAH ALAT
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmitTool}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="nama"
          label="Nama Alat"
          name="nama"
          onChange={handleOnChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="foto"
          type='file'
          onChange={(e) => {
            handleOnChangeUploadFoto(e.target.files[0]);
          }}
        />
        *File Tidak Boleh Lebih Dari 5 MB
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          TAMBAH
        </Button>
      </Box>
    </Box>
  );
}