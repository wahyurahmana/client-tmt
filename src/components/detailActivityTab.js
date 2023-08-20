import * as React from 'react';
import { Alert, Box, Button, Grid, ImageListItem, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function DetailTab() {
  const navigate = useNavigate();
  
  const { activityId } =  useParams();

  const [detailActivity, setDetailActivity] = React.useState({})

  const getDetailActivity = async () => {
    try {
      const result = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_HOST_TMT_API}/activities/${activityId}`,
        headers: {
          Authorization : localStorage.getItem('access_token')
        }
      })
      console.log(result.data.data.activity);
      setDetailActivity(result.data.data.activity)
      console.log(detailActivity);
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
    getDetailActivity()
  }, [])
  
  return (
    <Grid container spacing={2} sx={{mt: 2, mx: 'auto'}}>
      <Grid item xs={12} md={12}>
        <Typography component="h1" variant="h5" align='center'>
          Nama Alat {detailActivity.nama}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12} >
      <Typography component="h1" variant="h5" align='center'>
          Foto Alat
        </Typography>
      <ImageListItem>
        <img
          src= {detailActivity.foto ? detailActivity.foto : 'https://indolearning.co.id/img/image-not-found-scaled-1150x647.png'}
          srcSet= {detailActivity.foto ? detailActivity.foto : 'https://indolearning.co.id/img/image-not-found-scaled-1150x647.png'}
          alt={detailActivity.nama ? detailActivity.nama : ''}
          loading="lazy"
        />
      </ImageListItem>
      </Grid>
      <Grid item xs={12} md={12} >
        <Typography component="h1" variant="h5" align='center'>
          Foto Bukti Pinjam
        </Typography>
        {detailActivity.bukti_pinjam ? 
        <ImageListItem>
          <img
            src= {detailActivity.bukti_pinjam}
            srcSet= {detailActivity.bukti_pinjam}
            alt={detailActivity.nama}
            loading="lazy"
            />
          </ImageListItem>
        : <Alert severity="warning">Tidak Ada Bukti Pinjam</Alert>
        }
      </Grid>
      <Grid item xs={12} md={12} >
        <Typography component="h1" variant="h5" align='center'>
          Foto Bukti Terima
        </Typography>
        {detailActivity.bukti_terima ? 
        <ImageListItem>
          <img
            src= {detailActivity.bukti_terima}
            srcSet= {detailActivity.bukti_terima}
            alt={detailActivity.nama}
            loading="lazy"
            />
          </ImageListItem>
        : <Alert severity="warning">Tidak Ada Bukti Terima</Alert>
        }
      </Grid>
      <Grid item xs={12} md={12}>
        <Typography component="h1" variant="h5" align='center'>
          Dipinjam Pada {detailActivity.created_at ? `${detailActivity.created_at.split('.')[0].split('T')[0].split('-').reverse().join('/')} Pukul:  ${detailActivity.created_at.split('.')[0].split('T')[1].split('+')[0]}` : ''}
        </Typography>
      </Grid>
      <Grid item xs={12} md={12}>
        <Typography component="h1" variant="h5" align='center'>
          Note:  {detailActivity.note}
        </Typography>
      </Grid>
    </Grid>
  );
}