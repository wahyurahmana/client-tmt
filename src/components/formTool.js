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
        url: `${process.env.REACT_APP_HOST_TMT_API}/tools`,
        data: dataTool,
        headers: {
          Authorization: localStorage.getItem('access_token'),
          'Content-Type': 'multipart/form-data',
        }
      });
      navigate('/tools');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Something Error, please contact administrator",
      });
      navigate('/login')
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
          id="stock"
          label="Stok Alat"
          name="stock"
          type='number'
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