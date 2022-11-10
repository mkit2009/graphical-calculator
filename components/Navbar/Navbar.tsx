import React from "react";
import { TbMathFunction } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";

function Navbar() {
  return (
    <div className="flex justify-between items-center text-white p-6">
      <div className="relative isolate">
        <h1 className="text-5xl font-title">GraphMania</h1>
        <TbMathFunction
          className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
        rotate-[10deg] text-[7rem] z-[-99] text-white opacity-20"
        />
      </div>
      <div>
        <IoSettingsSharp className="text-5xl hover:rotate-[90deg] duration-200 cursor-pointer" />
      </div>
    </div>
  );
}

export default Navbar;
