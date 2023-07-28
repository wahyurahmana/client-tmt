import * as React from 'react';
import {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Alert, Avatar, Button, Grid, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import BasicModal from './modalView'
import InfoIcon from '@mui/icons-material/Info';
import BurstModeIcon from '@mui/icons-material/BurstMode';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// function StatusChecked({status, idActivity}) {
//   if(status){
//     return <>Pending<Switch onChange={(e) => changeStatusActivityAPI(idActivity, e.target.checked)} defaultChecked/>Selesai</>
//   }else{
//     return <>Pending<Switch onChange={(e) => changeStatusActivityAPI(idActivity, e.target.checked)}/>Selesai</>
//   }
// }


export default function ActivityTab() {
  const navigate = useNavigate();
  const [listPinjaman, setListPinjaman] = useState([])
  const [listDipinjam, setListDipinjam] = useState([])

  const [listInitPinjaman, setListInitPinjaman] = useState([])
  const [listInitDipinjam, setListInitDipinjam] = useState([])

  const [search, setSearch] = useState('');

  const getAllActivities = async () => {
    try {
      const result = await axios({
        method: 'GET',
        url: 'http://localhost:3030/activities',
        headers: {
          Authorization : localStorage.getItem('access_token')
        }
      })
      setListPinjaman(result.data.data.listPinjaman);
      setListDipinjam(result.data.data.listDipinjam);

      setListInitPinjaman(result.data.data.listPinjaman);
      setListInitDipinjam(result.data.data.listDipinjam);
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

  const deleteActivityByTeamIdPemberi = (activityId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios({
          method : 'DELETE',
          url: 'http://localhost:3030/activities/'+activityId,
          headers: {
            Authorization: localStorage.getItem('access_token')
          }
        });
        getAllActivities();
        Swal.fire(
          'Deleted!',
          'Your data has been deleted.',
          'success'
        )
      }
    }).catch((error) => {
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
    })
}

  useEffect(() => {
    getAllActivities()
  }, [])

  useEffect(() => {
    if(listInitDipinjam.length > 0){
      let filter = [];
      for (let i = 0; i < listInitDipinjam.length; i++) {
        if(listInitDipinjam[i].nama.toLowerCase().includes(search.toLowerCase())){
          filter.push(listInitDipinjam[i])
        }        
      }
      setListDipinjam(filter)
      filter = []
    }
    if(listInitPinjaman.length > 0){
      let filter = [];
      for (let i = 0; i < listInitPinjaman.length; i++) {
        if(listInitPinjaman[i].nama.toLowerCase().includes(search.toLowerCase())){
          filter.push(listInitPinjaman[i])
        }        
      }
      setListPinjaman(filter)
      filter = []
    }
  }, [search])

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
        <Grid container spacing={2} sx={{mt: 2, mx: 'auto'}}>
          <Grid item xs={12} md={9}>
          <Button variant="outlined" onClick={() => navigate('/form-activity')} fullWidth size="large">Tambah Alat Dipinjam</Button>
          </Grid>
          <Grid item xs={12} md={3}>
          <TextField
            label="Cari"
            id="outlined-size-small"
            placeholder='Cari Alat Disini....'
            size="small"
            name='search'
            onChange={(e) => setSearch(e.target.value)}
          />
          </Grid>
        </Grid>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Dipinjam" {...a11yProps(0)} />
            <Tab label="Pinjaman" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table dipinjam">
            <TableHead>
              <TableRow>
                <TableCell>Nama Alat</TableCell>
                <TableCell>Peminjam</TableCell>
                <TableCell>Pemberi</TableCell>
                <TableCell>Dipinjam Pada</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listDipinjam.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.nama}
                  </TableCell>
                  <TableCell>{row.info.peminjam.user}</TableCell>
                  <TableCell>{row.info.pemberi.user}</TableCell>
                  <TableCell>{row.created_at.split('.')[0].split('T')[0]}@{row.created_at.split('.')[0].split('T')[1].split('+')[0]}</TableCell>
                  {/* <TableCell><StatusChecked status={row.status} idActivity={row.id}></StatusChecked></TableCell> */}
                  <TableCell><BasicModal status={row.status} idActivity={row.id} toolId={row.tool_id} quantity={row.quantity}/></TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => { deleteActivityByTeamIdPemberi(row.id) }}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="info" onClick={() => { navigate(`/detail-activity/${row.id}`) }}>
                      <BurstModeIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="table pinjaman">
            <TableHead>
              <TableRow>
                <TableCell>Nama Alat</TableCell>
                <TableCell>Peminjam</TableCell>
                <TableCell>Pemberi</TableCell>
                <TableCell>Dipinjam Pada</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listPinjaman.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.nama}
                  </TableCell>
                  <TableCell>{row.info.peminjam.user}</TableCell>
                  <TableCell>{row.info.pemberi.user}</TableCell>
                  <TableCell>{row.created_at.split('.')[0].split('T')[0]}@{row.created_at.split('.')[0].split('T')[1].split('+')[0]}</TableCell>
                  <TableCell>{row.status ? <Alert severity="success">Selesai</Alert> : <Alert severity="error">Kembalikan</Alert> }</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>
                    <IconButton aria-label="info" onClick={() => { navigate(`/detail-activity/${row.id}`) }}>
                      <BurstModeIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </CustomTabPanel>
      </Box>
    </>
  );
}