import { CheckCircleTwoTone } from '@ant-design/icons';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import { Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { PROJECT_TYPE_MAP_TITLE, ref } from '../config4';
import { Button, notification, Spin } from 'antd';
import { BASE_URL } from '../config4';

var axios = require('axios');

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: 8,
    maxWidth: 1400,
  },
  image: {
    margin: 'auto',
    display: 'block',
    width: 650,
    height: 410,
  },
  title: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  header: {
    fontSize: 24
  },
  gridDescription: {
    direction: "row",
    justify: "flex-start",
    alignItems: "center"
  }
}));


const GridDetailed = (props) => {
  const { title, content, link } = props;
  const classes = useStyles();
  return (
    <Grid container spacing={3}>
      <Grid item sm={3} xs={12}>
        <Typography className={classes.gridDescription, classes.title}>{title}</Typography>
      </Grid>
      <Grid item sm={9} xs={12}>
        {link ?
          <Typography><Link href={content}>{content}</Link></Typography> :
          <Typography>{content}</Typography>
        }
      </Grid>
    </Grid>
  )
}

const DetailedNotification = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [notificationDetail, setNotificationDetail] = useState([]);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  const onVerify = () => {
    if (status) openNotificationWithIcon("success", "Notification", "Unverified Incident Successfully")
    else openNotificationWithIcon("success", "Notification", "Verified Incident Successfully")
    setStatus(!status);
    var config = {
      method: 'post',
      url: `${BASE_URL}/check_ntf`,
      headers : {
        'Content-Type': 'application/json',
        'project-type': localStorage.getItem('project-type'),
        'api-token': localStorage.getItem('token')
      },
      data: {
        "idNtf": id
      }
    };
    axios(config)
      .then(function (response) {
        console.log(`verified successfully: `, response)
      })
      .catch(function (error) {
        console.log(error);
      });
    
  }

  const openNotificationWithIcon = (type, message, description) => {
    notification[type]({
      message: message,
      description: description
    });
  };

  const getStatus = notification => {
    var user = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user);
    for (const item  of notification.toUser) {
      if (item._id.toString() === user.user.id.toString()) return item.check
    }
  }

  useEffect(() => {
    console.log(`token: ${localStorage.getItem("token")}`)
    console.log(`project-type: ${localStorage.getItem("project-type")}`)
    var config = {
      method: 'get',
      url: `${BASE_URL}/get_ntf`,
      headers: {
        "Content-Type": "application/json",
        "api-token": localStorage.getItem("token"),
        "project-type": localStorage.getItem("project-type")
      },
      params: { "idNtf": id }
    };
    axios(config).then(function (response) {
      const detailedNtf = response.data.data
      setNotificationDetail(detailedNtf);
      setStatus(getStatus(detailedNtf));
      setLoading(false);
      console.log(response.data);
    }).catch(function (error) {
      console.log(error);
    });

  }, [])

  const content = () => (
    <div>
        <div className={classes.root}>
        <div className={classes.header}>Thông tin cảnh báo chi tiết</div>
        <Paper className={classes.paper}>
          <Grid container spacing={2}>
            <Grid item>
              <ButtonBase className={classes.image}>
                {notificationDetail.ref && <img className={classes.image} alt="complex" src={ref.prop[notificationDetail.ref._type].img} />}
              </ButtonBase>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                  >
                    {notificationDetail.project_type && <Typography gutterBottom variant="h4" className={classes.title} >{PROJECT_TYPE_MAP_TITLE[notificationDetail.project_type]}</Typography>}
                    <Tooltip title={status ? "verified" : "unverified"}>
                      <CheckCircleTwoTone twoToneColor={status ? "#52c41a" : "#8c8c8c"} style={{ fontSize: 32, marginLeft: 8, marginBottom: 10, cursor: "pointer" }} onClick={onVerify} />
                    </Tooltip>
                  </Grid>
                  <GridDetailed title={"ID cảnh báo:"} content={notificationDetail._id}></GridDetailed>
                  <Grid container spacing={3}>
                    <Grid item sm={3} xs={12}>
                      <Typography className={classes.gridDescription, classes.title}>Mức độ:</Typography>
                    </Grid>
                    <Grid item sm={9} xs={12}>
                      <Rating name="read-only" value={notificationDetail.level || 0} readOnly style={{ color: "red" }} />
                    </Grid>
                  </Grid>
                  <GridDetailed title={"Mô tả:"} content={notificationDetail.content}></GridDetailed>
                  {notificationDetail.fromUser && <GridDetailed title={"From user:"} content={notificationDetail.fromUser._id}></GridDetailed>}
                  <GridDetailed title={"created At:"} content={notificationDetail.createdAt}></GridDetailed>
                  {notificationDetail.ref && <GridDetailed title={"Ref Link:"} content={notificationDetail.ref._link} link={true}></GridDetailed>}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        </div>
    </div>
  )

  return (
    <div>
      {loading
        ? <Spin size="large" style={{marginTop: 300}} spinning={loading} delay={500}> </Spin> 
        : content() 
      }
      
    </div>

  );

}

export default DetailedNotification;