import * as React from 'react';
import { useEffect, useState } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ToolTab() {
  const navigate = useNavigate();
  const [dataTools, setDataTools] = useState([]);
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

  const deleteToolByTeamIdHandler = (toolId) => {
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
            url: 'http://localhost:3030/tools/'+toolId,
            headers: {
              Authorization: localStorage.getItem('access_token')
            }
          });
          getDataTools();
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
    getDataTools();
  }, [])

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
        }} onClick={() => navigate('/form-tool')}>Tambah Alat</Button>
        <Grid container>
          {dataTools.map((item) => (
            <Grid item xs={12} md={4}  key={item.id}>
              <ImageListItem>
                <img
                  src= {item.foto}
                  srcSet= {item.foto}
                  alt={item.nama}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.nama}
                  actionIcon={
                    <>
                    <IconButton aria-label="delete" color='error' onClick={() => {
                        deleteToolByTeamIdHandler(item.id)
                      }}>
                        <DeleteIcon/>
                      </IconButton>
                      <IconButton aria-label="edit" color='primary' onClick={() => {
                        navigate(`/tools/${item.id}`)
                      }}>
                        <EditIcon />
                      </IconButton>
                    </>
                  }
                />
              </ImageListItem>
            </Grid>
          ))}
        </Grid>
    </>
  );
}
