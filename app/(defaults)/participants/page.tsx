import BreadCrumbs from '@/components/BreadCrumbs'
import React from 'react'
import ParticipantsList from './ParticipantsList'

function page() {
  return (
    <div>
                  <BreadCrumbs
                   title1="Dashbord" title2="Participants" />
                   <ParticipantsList/>

    </div>
  )
}

export default page
