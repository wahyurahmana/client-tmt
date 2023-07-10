import * as React from 'react';
import {useEffect, useState} from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Avatar, Button, IconButton, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';

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

async function changeStatusActivityAPI(id, status) {
  try {
    const result = await axios({
      method : 'PATCH',
      url: 'http://localhost:3030/activities/'+id,
      data: {
        status
      },
      headers: {
        Authorization: localStorage.getItem('access_token'),
      }
    });
    Swal.fire(result.data.message);
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.response.data.message,
      footer: '<a href="">Why do I have this issue?</a>'
    })
  }
}

function StatusChecked({status, idActivity}) {
  if(status){
    return <>Pending<Switch onChange={(e) => changeStatusActivityAPI(idActivity, e.target.checked)} defaultChecked/>Selesai</>
  }else{
    return <>Pending<Switch onChange={(e) => changeStatusActivityAPI(idActivity, e.target.checked)}/>Selesai</>
  }
}

export default function ActivityTab() {
  const navigate = useNavigate();
  const [listPinjaman, setListPinjaman] = useState([])
  const [listDipinjam, setListDipinjam] = useState([])

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
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response.data.message,
        footer: '<a href="">Why do I have this issue?</a>'
      })
    })
}

  useEffect(() => {
    getAllActivities()
  }, [])
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Button sx={{
          mx: 'auto',
          width: '100%',
          p: 1,
          m: 1,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#101010' : 'grey.50',
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          textAlign: 'center',
          fontSize: '0.875rem',
          fontWeight: '700',
        }} onClick={() => navigate('/form-activity')}>Tambah Alat Dipinjam</Button>
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
                <TableCell>Dibuat Pada</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Foto Alat</TableCell>
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
                  <TableCell>{row.created_at.split('.')[0].split('T')[0]}@{row.created_at.split('.')[0].split('T')[1]}</TableCell>
                  <TableCell><StatusChecked status={row.status} idActivity={row.id}></StatusChecked></TableCell>
                  <TableCell><Avatar alt={row.nama} src={row.foto} /></TableCell>
                  <TableCell>
                    <IconButton aria-label="delete" onClick={() => { deleteActivityByTeamIdPemberi(row.id) }}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton aria-label="edit">
                      <CreateIcon />
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
                <TableCell>Dibuat Pada</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Foto Alat</TableCell>
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
                  <TableCell>{row.created_at.split('.')[0].split('T')[0]}@{row.created_at.split('.')[0].split('T')[1]}</TableCell>
                  <TableCell><StatusChecked status={row.status} idActivity={row.id}></StatusChecked></TableCell>
                  <TableCell><Avatar alt={row.nama} src={row.foto} /></TableCell>
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