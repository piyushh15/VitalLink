import React, { useState } from 'react'
import axios from 'axios';

const NodeAddition = ({handleClose}) => {
  const [nodeid,setNodeid]=useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 

  const format = (mac) => mac.match(/.{2}/g).join(':');
  const handleSubmit = async(e) => {
    setLoading(true);

    e.preventDefault();
    const macRegex = /^[0-9A-Fa-f]{12}$/;

    if (!macRegex.test(nodeid)) {
      setError('Please enter a valid 12-digit MAC address.');
      return;
    }
    const sensorID=format(nodeid);
    let headersList={
      "Accept": "*/*",
      "Content-Type": "application/json",
      "Authorization":`Bearer ${localStorage.getItem("accessToken")}`,
    }
    let bodyContent=JSON.stringify({
      "sensorID": sensorID
    })
    let reqOptions = {
      url: `${process.env.BACKEND_API}/hospital/add-sensor`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    }
    await axios.request(reqOptions);
    setLoading(false);
    handleClose();
  }
  return (
   <form className="flex justify-center flex-col "onSubmit={handleSubmit}>
    <div className='mb-4 text-black'>
      <label className='block text-gray-700 mb-2' htmlFor='nodeid'>Node ID/Add Mac Address of Node</label>
      <input className='w-full px-3 py-2 border text-black rounded' type='text' id='nodeid' name='nodeid' value={nodeid} maxLength={12} onChange={(e)=>setNodeid(e.target.value)} required/>
      {error && <p className='text-red-500 text-sm'>{error}</p>}
    </div>
    <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
        {loading? 'Loading...':'Add Node'}
      </button>
   </form>
  )
}

export default NodeAddition