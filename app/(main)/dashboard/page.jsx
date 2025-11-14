'use client'
import React, { useState } from 'react'
import FeaturesAssistants from '../_components/FeaturesAssistants'
import History from '../_components/History'
import Feedback from '../_components/Feedback'
import MeetingUrl from '../_components/MeetingUrl'

function Dashboard() {
  const [roomdata , setRoomdata] = useState(null);
  const [meetingdata , setMeetingdata] = useState(null);

  return (
    <div>
      <FeaturesAssistants Setroomid={setRoomdata} Setmeetingdata={setMeetingdata}/>
      <MeetingUrl roomId={roomdata} meetingData={meetingdata}/>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-10'>
        <History/>
        <Feedback/>
      </div>
    </div>
  )
}

export default Dashboard