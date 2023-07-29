import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

async function changeStatusActivityAPI(id, status, buktiTerima, toolId, quantity) {
  try {
    const result = await axios({
      method : 'PATCH',
      url: `${process.env.REACT_APP_HOST_TMT_API}/activities/${id}`,
      data: {
        status,
        buktiTerima,
        toolId,
        quantity,
      },
      headers: {
        Authorization: localStorage.getItem('access_token'),
        'Content-Type': 'multipart/form-data',
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

export default function BasicModal({status, idActivity, toolId, quantity}) {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {status ? (
        <Button variant="outlined" size="small" color='primary'>
          Selesai
        </Button>
      ) : (
        <Button variant="outlined" size="small" color='warning' onClick={handleOpen}>
          Dipinjam
        </Button>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
          <Typography component="h1" variant="h5">
            Bukti Terima
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="foto"
            type='file'
            onChange={(e) => {
              changeStatusActivityAPI(idActivity, !status, e.target.files[0], toolId, quantity);
              navigate(0)
              handleClose()
            }}
          />
          *File Tidak Boleh Lebih Dari 5 MB
          {/* <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            TAMBAH
          </Button> */}
        </Box>
      </Modal>
    </div>
  );
}