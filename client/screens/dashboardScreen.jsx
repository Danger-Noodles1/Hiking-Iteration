import React, {useEffect, useState} from 'react'
import axios from 'axios'
import HikeFeed from '../components/hikeFeed';
import ProfileInfo from '../components/profileInfo'

const DashboardScreen = () => {
  const [hikesData, setHikesData] = useState([]);
  const [userData, setUserData] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  const getHikes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.post(
        "/api/hikes/get-hikes",
        {
          userid: user._id
        }
      );
      setHikesData(response.data);
    }
    catch (error){
      console.log('error in gethikes function')
    }
  }

  const getUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.post(
        "/api/users/getallusers",
        {
          userid: user._id
        }
      );
      setUserData(response.data);
    }
    catch (error){
      console.log('error in getUser function')
    }
  }

const deleteHikes = async (hikeID) => {
  try {
    await axios.delete(`api/hikes/${hikeID}`);
    getHikes();
  }
  catch (error) {
    console.log('error in deletehikes function', hikeID)
  }
}

const editHikes = async ( title, date, type, location, distance, difficulty, crowds, notes, id
) => {
  console.log('hikeID in editHikes', title, date, type, location, distance, difficulty, crowds, notes, id);
  try {
    await axios.put(`api/hikes/${id}`, {
      payload: { title, date, type, location, distance, difficulty, crowds, notes, id}
    });
    getHikes();
  } catch (error) {
    console.log('error in edithikes function');
  }
};

useEffect(() => {
  getHikes();
}, []);

//console.log('in dashboard screen', {hikesData})

  return (
    <div className="dashboard">
      <div className="profile">
        {user && <ProfileInfo user={user} />}
      </div>
      <div className="hikeFeed">
        <HikeFeed hikesData = {hikesData} deleteHikes = {deleteHikes} editHikes = {editHikes}/>
      </div>
    </div>
  )
}

export default DashboardScreen;