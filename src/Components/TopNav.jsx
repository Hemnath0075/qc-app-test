import React from 'react';
import MenuIcon from '../Assets/menu.svg';

function TopNav() {
  return (
    <div className="flex flex-row justify-between items-center h-16 bg-white border-b-2 border-[#E3E8EF] w-full px-8">
        <p className='text-3xl font-[600]'>Welcome Rishab Mathur</p>
        <div className="rounded-[50%] bg-[#e3e8ef] p-4">
            <img src={MenuIcon} alt="" />
        </div>
    </div>
  )
}

export default TopNav