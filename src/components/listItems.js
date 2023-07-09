import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ConstructionIcon from '@mui/icons-material/Construction';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useNavigate } from 'react-router-dom';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

export default function MainListItems(){
  const navigate = useNavigate();
    return (
      <React.Fragment>
        <ListItemButton onClick={() => navigate('tools')}>
          <ListItemIcon>
            <ConstructionIcon />
          </ListItemIcon>
          <ListItemText primary="Tools" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('activities')}>
          <ListItemIcon>
            <AutoStoriesIcon />
          </ListItemIcon>
          <ListItemText primary="Activities" />
        </ListItemButton>
        <ListItemButton onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}>
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </React.Fragment>
    )
}