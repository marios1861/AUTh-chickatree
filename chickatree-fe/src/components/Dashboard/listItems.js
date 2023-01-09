import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ParkIcon from '@mui/icons-material/Park';
import ForestIcon from '@mui/icons-material/Forest';
import { useNavigate } from 'react-router-dom';

export const MainListItems = () => {
  const navigate = useNavigate();

  return (<React.Fragment>
    <ListItemButton onClick={() => navigate("profile")}>
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItemButton>
    <ListItemButton onClick={() => navigate("trees")}>
      <ListItemIcon>
        <ParkIcon />
      </ListItemIcon>
      <ListItemText primary="Trees" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ForestIcon />
      </ListItemIcon>
      <ListItemText primary="Forest" />
    </ListItemButton>
  </React.Fragment>
)};