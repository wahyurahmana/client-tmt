import * as React from 'react';
import { Box, Button, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FormActivity() {
  const navigate = useNavigate();

  const [dataUserList, setDatauserList] = React.useState({
    listPemberi: [],
    listPeminjam: [],
  });
  const [dataTools, setDataTools] = React.useState([]);
  const [idTool, setIdTool] = React.useState('');
  const [peminjam, setPeminjam] = React.useState('');
  const [pemberi, setPemberi] = React.useState('');
  const [createdAt, setCreatedAt] = React.useState('');

  const getDataTools = async () =>{
    try {
      const result = await axios({
        method : 'GET',
        url: 'http://localhost:3030/tools',
        headers: {
          Authorization: localStorage.getItem('access_token')
        }
      });
      setDataTools(result.data.data.tools);
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
  const getDataUserListAPI = async () => {
    try {
      const result = await axios({
        method : 'GET',
        url: 'http://localhost:3030/users-list',
        headers: {
          Authorization: localStorage.getItem('access_token')
        }
      });
      setDatauserList(result.data.data)
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }
  }

  React.useEffect(() => {
    getDataUserListAPI()
    getDataTools()
  }, [])

  const handleChangeTool = (e) =>{
    setIdTool(e.target.value);
  }

  const handleChangePeminjam = (e) =>{
    setPeminjam(e.target.value);
  }

  const handleChangePemberi = (e) =>{
    setPemberi(e.target.value);
  }

  const handleChangeTime = (e) =>{
    setCreatedAt(e.target.value);
  }

  const handleSubmitActivity = async (e) => {
    try {
      e.preventDefault();
      // console.log({toolId: idTool, createdAt, quantity, peminjamEmail: peminjam.split('$').length === 2 ? peminjam.split('$')[0] : '', teamPeminjam: peminjam.split('$').length === 2 ? peminjam.split('$')[1] : '', pemberiEmail: pemberi.split('$').length === 2 ? pemberi.split('$')[0] : '', teamPemberi: pemberi.split('$').length === 2 ? pemberi.split('$')[1] : ''});
      await axios({
        method : 'POST',
        url: 'http://localhost:3030/activities',
        data: {toolId: idTool, createdAt, peminjamEmail: peminjam.split('$').length === 2 ? peminjam.split('$')[0] : '', teamPeminjam: peminjam.split('$').length === 2 ? peminjam.split('$')[1] : '', pemberiEmail: pemberi.split('$').length === 2 ? pemberi.split('$')[0] : '', teamPemberi: pemberi.split('$').length === 2 ? pemberi.split('$')[1] : ''},
        headers: {
          Authorization: localStorage.getItem('access_token'),
        }
      });
      navigate('/activities');
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
        ADD ACTIVITY
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmitActivity}>
        <InputLabel id="idTool-label">Tool</InputLabel>
        <Select
          labelId="idTool-label"
          id="idTool"
          value={idTool}
          label="Tool"
          name="toolId"
          onChange={handleChangeTool}
          fullWidth
          required
        >
          {dataTools.map(el => <MenuItem value={el.id} key={el.id}>{el.nama}</MenuItem>)}
        </Select>
        <InputLabel id="idTool-label">Dibuat - WITA</InputLabel>
        <TextField
          margin="normal"
          required
          fullWidth
          id="createdAt"
          name="createdAt"
          type='datetime-local'
          onChange={handleChangeTime}
        />
        <InputLabel id="teamId-label">Peminjam</InputLabel>
        <Select
          labelId="peminjam-label"
          id="peminjam"
          value={peminjam}
          label="Peminjam"
          name="peminjam"
          onChange={handleChangePeminjam}
          fullWidth
          required
        >
          {dataUserList.listPeminjam.map(el => <MenuItem value={`${el.email}$${el.team_id}`} key={el.email}>{`${el.email}---${el.nama}`}</MenuItem>)}
        </Select>
        <InputLabel id="teamId-label">Pemberi</InputLabel>
        <Select
          labelId="pemberi-label"
          id="pemberi"
          value={pemberi}
          label="Pemberi"
          name="pemberi"
          onChange={handleChangePemberi}
          fullWidth
          required
        >
          {dataUserList.listPemberi.map(el => <MenuItem value={`${el.email}$${el.team_id}`} key={el.email}>{`${el.email}---${el.nama}`}</MenuItem>)}
        </Select>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add
        </Button>
      </Box>
    </Box>
  );
}