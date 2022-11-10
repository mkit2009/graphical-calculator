import React, { useState, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Popup from "../Popup/Popup";
import { AiOutlineDelete } from "react-icons/ai";

const StyledDiv = ({ title }: { title: string }) => {
  return (
    <div className="p-3 text-white bg-barelyVisibleWhite rounded-md flex items-center justify-between max-w-[350px]">
      <span className="text-lg whitespace-nowrap overflow-ellipsis overflow-hidden">
        {title}
      </span>
      <div className="flex items-center">
        <AiOutlineDelete className="text-4xl rounded-full p-1 hover:bg-barelyVisibleWhite cursor-pointer" />
      </div>
    </div>
  );
};

function GraphSidebar() {
  const [graphs, setGraphs] = useState<
    {
      name: string; // Name of graph, key
      function: string; // Name of function which will graph use
      arguments: number[];
      color: string;
    }[]
  >([]);

  const [functions, setFunctions] = useState([]);

  const popupRef = useRef<HTMLDialogElement>(null);

  const handleNewGraph = () => {
    if (popupRef.current) {
      popupRef.current.showModal();
    }
  };

  return (
    <>
      <aside className="p-4 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-3 text-fontColor text-2xl mb-2">
            <p>Your Graphs</p>
            <AiOutlinePlus
              onClick={handleNewGraph}
              className="text-4xl self-end rounded-full cursor-pointer duration-100 hover:bg-barelyVisibleWhite
          hover:rotate-90"
            />
          </div>
          {graphs.map((item, index) => {
            return <StyledDiv title={item.name} key={index} />;
          })}
          {graphs.length === 0 && (
            <p className="text-white">You have no graphs yet.</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 text-fontColor text-2xl mb-2">
            <p>Your Functions</p>
            <AiOutlinePlus
              className="text-4xl self-end rounded-full cursor-pointer duration-100 hover:bg-barelyVisibleWhite
          hover:rotate-90"
            />
          </div>
          {functions.map((item, index) => {
            return <StyledDiv title={item} key={index} />;
          })}
          {functions.length === 0 && (
            <p className="text-white">You have no functions yet.</p>
          )}
        </div>
      </aside>
      <>
        <Popup ref={popupRef} closeFunction={() => popupRef.current?.close()} />
      </>
    </>
  );
}

export default GraphSidebar;
