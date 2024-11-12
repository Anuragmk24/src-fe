import BreadCrumbs from '@/components/BreadCrumbs'
import React from 'react'
import ChaptersTable from './ChaptersTable'

function page() {
  return (
    <div>
      <BreadCrumbs title1='Dashbord' title2='Chapters    '/>
      <ChaptersTable/>
    </div>
  )
}

export default page
