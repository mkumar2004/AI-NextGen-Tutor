'use client'
import React from 'react'
import FeaturesAssistants from '../_components/FeaturesAssistants'
import History from '../_components/History'
import Feedback from '../_components/Feedback'

function Dashboard() {
  return (
    <div>
      <FeaturesAssistants/>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-10'>
        <History/>
        <Feedback/>
      </div>
    </div>
  )
}

export default Dashboard