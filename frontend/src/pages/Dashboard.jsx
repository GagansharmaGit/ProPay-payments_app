import React, { useEffect, useState } from 'react'
import AppBar from "./../components/AppBar"
import Users from "./../components/Users"
import Balance from "./../components/Balance"
import axios from 'axios'
const Dashboard = () => {
  const [money,setMoney] = useState("");
  useEffect(()=>{
    axios.get("http://localhost:3000/api/v1/account/balance",{
      headers:{
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    }).then((response)=>{
      const temp = response.data.balance;
      const result1 = temp.toFixed(2);
      setMoney(result1);

    })
  },[])
  return (
    <div>
      <AppBar/>
      <div className='m-8'>
        <Balance value={money} />
        <Users/>
      </div>
    </div>
  )
}

export default Dashboard