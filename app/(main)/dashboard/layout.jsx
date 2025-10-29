import React from 'react'
import AppHeader from '../_components/AppHeader'

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
  
      <AppHeader />

  
      <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 2xl:px-56 mt-6 md:mt-10 w-full">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
