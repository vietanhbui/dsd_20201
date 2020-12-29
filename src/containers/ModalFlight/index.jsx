import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import { Form, Input, Col, Row } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({

  input: {
    fontSize: 20,
  },
  formItem: {
    padding: 10,
    margin: 0
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },

  button: {
    margin: theme.spacing(1),
  },

  divButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));



export default function TransitionsModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const [drones, setDrones] = useState([]);

  const getData = () => {
    fetch("http://skyrone.cf:6789/droneState/getParameterFlightRealTime/" + props.id)
      .then(response => response.json())
      .then(json => {
        setDrones(json.data);
        setOpen(true);
      });
  };

  const handleOpen = () => {
      getData();
      
  };

  const handleClose = () => {
    setOpen(false);
  };



  return (
    <div>

      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        startIcon={<VisibilityIcon />}
      >
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Id# : {props.id} </h2>
            <h3 id="transition-modal-title">Tọa độ Lat :  {drones.locationLat}</h3>
            <h3 id="transition-modal-title">Tọa độ Lng :  {drones.locationLng}</h3>
            <h3 id="transition-modal-title">Độ cao (m) :  {drones.heightFlight}</h3>
            {/* <h3 id="transition-modal-title">Thời gian đã bay :  {drones.time}</h3> */}
            <h3 id="transition-modal-title">Tốc độ bay :  {drones.speed} m/phút</h3>
            <h3 id="transition-modal-title">Phần trăm pin :  {drones.percentBattery} %</h3>
          </div>
        </Fade>
      </Modal>
    </div>
  );

}

