import React from 'react'
import CreateSetBtn from '@/components/createSetBtn'
import FilterBtnsBar from '@/components/filterBtnsBar'

const BoardPage = () => {



  return (
    <>
      <div className="flex justify-around p-10 items-center">
        <div className="">
          <CreateSetBtn />
        </div>
        <div className="">
          <h3>My board</h3>
        </div>
        <div className="">
          <FilterBtnsBar />
        </div>
      </div>
      <div className=""></div>
    </>
  )

}

 export default BoardPage
