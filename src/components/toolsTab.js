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
import { Button, Grid, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function ToolTab() {
  const navigate = useNavigate();
  const [dataTools, setDataTools] = useState([]);
  const [dataToolsInit, setDataToolsInit] = useState([]);
  const [search, setSearch] = useState("");
  const getDataTools = async () =>{
    try {
      const result = await axios({
        method : 'GET',
        url: `${process.env.REACT_APP_HOST_TMT_API}/tools`,
        headers: {
          Authorization: localStorage.getItem('access_token')
        }
      });
      setDataTools(result.data.data.tools);
      setDataToolsInit(result.data.data.tools)
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
            url: `${process.env.REACT_APP_HOST_TMT_API}/tools/${toolId}`,
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
    getDataTools();
  }, [])

  useEffect(() => {
    if(dataToolsInit.length > 0){
      let filter = [];
      for (let i = 0; i < dataToolsInit.length; i++) {
        if(dataToolsInit[i].nama.toLowerCase().includes(search.toLowerCase())){
          filter.push(dataToolsInit[i])
        }        
      }
      setDataTools(filter)
      filter = []
    }
  }, [search])

  return (
    <>
      <Grid container spacing={2} sx={{mt: 2, mx: 'auto'}}>
        <Grid item xs={12} md={9}>
          <Button variant="outlined" onClick={() => navigate('/form-tool')} fullWidth size="large">Tambah Alat</Button>
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
        <Grid container sx={{mt : 2, ml : 2}}>
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
                  subtitle={`Jumlah: ${item.stock}`}
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
