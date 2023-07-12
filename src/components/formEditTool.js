import * as React from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function FormEditTool() {
  const navigate = useNavigate();
  const { toolId } = useParams();
  // const [dataTool, setDataTool] = React.useState({});
  const [detailTool, setDetailTool] = React.useState({});
  const [namaTool, setNamaTool] = React.useState('');
  const [fotoTool, setFotoTool] = React.useState(null);

  const handleOnChangeNama = (e) =>{
    setNamaTool(e.target.value);
  }

  const handleOnChangeUploadFoto = (value) =>{
    setFotoTool(value);
  }

  const getDetailTool = async () => {
    try {
      const result = await axios({
        method: 'GET',
        url: `http://localhost:3030/tools/${toolId}`,
        headers: {
          Authorization: localStorage.getItem('access_token'),
        },
      });
      setDetailTool(result.data.data.tool);
      setNamaTool(result.data.data.tool.nama);
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

  const handleSubmitTool = async (e) => {
    try {
      e.preventDefault();
      await axios({
        method : 'PUT',
        url: `http://localhost:3030/tools/${toolId}`,
        data: {
          nama: namaTool,
          foto: fotoTool,
        },
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

  React.useEffect(() => {
    getDetailTool();
  }, [])

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
        Ubah ALAT
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmitTool}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="nama"
          label="Nama Alat"
          name="nama"
          onChange={handleOnChangeNama}
          value={namaTool}
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
        {!detailTool.foto ? '' : <Avatar
          alt={!detailTool.nama ? '' : detailTool.nama}
          src={!detailTool.foto ? '' : detailTool.foto}
          sx={{ width: 56, height: 56 }}
        />}
        *File Tidak Boleh Lebih Dari 512kb
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          UBAH
        </Button>
      </Box>
    </Box>
  );
}