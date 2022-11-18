import React, { useState, useRef } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import Popup from "../Popup/Popup";
import { AiOutlineDelete } from "react-icons/ai";
import { useMainContext } from "../../src/context/mainContext";
import { PopupDataArray } from "../Popup/Popup";

const GRAPH_POPUP_DATA: PopupDataArray[] = [
  {
    name: "Graph name",
    type: "text",
    placeholder: "Amazing function...",
    dataType: "string",
  },
  {
    name: "Graph funciton",
    type: "text",
    placeholder: "Amazing function...",
    dataType: "string",
  },
  {
    name: "Graph color",
    type: "text",
    placeholder: "Amazing function...",
    dataType: "string",
  },
];

const FUNCTION_POPUP_DATA: PopupDataArray[] = [
  {
    name: "Function name",
    placeholder: "Amazing function...",
    type: "text",
    dataType: "string",
  },
  {
    name: "Functions right side",
    placeholder: 'sin(x + "a") + "b"',
    type: "text",
    dataType: "string",
  },
];

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
  const {
    functionsArray,
    graphsArray,
    setFunctionsArray,
    setGraphsArray,
    newFunction,
    newGraph,
  } = useMainContext();

  // console.log(newFunction);

  const graphPopupRef = useRef<HTMLDialogElement>(null);
  const functionsPopupRef = useRef<HTMLDialogElement>(null);

  const handleNewGraph = () => {
    if (graphPopupRef.current) {
      graphPopupRef.current.showModal();
    }
  };

  const handleNewFunction = () => {
    if (functionsPopupRef.current) {
      functionsPopupRef.current.showModal();
    }
  };

  const handleFunctionForm = (
    inputArray: {
      value: string;
    }[]
  ) => {
    // Grabs the name from input form name
    const name = inputArray[0].value;
    // Grab raw function from input form
    const functionString = inputArray[1].value;
    // Creates variables where indexes of " will be stored
    const variables: number[] = [];
    // Variebles result is object with string keys and number values, the script is dependand on this structure
    const variablesResult: { [index: string]: number } = {};
    // Pushes all the " indexes to variable array
    for (let i = 0; i < functionString.length; i++) {
      if (functionString[i] === '"') variables.push(i);
    }
    // Go through all even indexes of variable array to get content between them
    for (let i = 0; i < variables.length; i += 2) {
      let string = "";
      // Get the content between and push it to string
      for (let k = 0; k < variables[i + 1] - variables[i] - 1; k++) {
        string += functionString[variables[i] + 1 + k];
      }
      // Set the default value of key to 0
      variablesResult[string] = 0;
    }
    if (newFunction) {
      newFunction(name, functionString.replaceAll('"', ""), variablesResult);
      // newGraph("ahojoj", "sine", [5], "blue");
    }
  };

  const handleGraphForm = () => {};

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
          {graphsArray.map((item, index) => {
            return <StyledDiv title={item.name} key={index} />;
          })}
          {graphsArray.length === 0 && (
            <p className="text-white">You have no graphs yet.</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-3 text-fontColor text-2xl mb-2">
            <p>Your Functions</p>
            <AiOutlinePlus
              onClick={handleNewFunction}
              className="text-4xl self-end rounded-full cursor-pointer duration-100 hover:bg-barelyVisibleWhite
          hover:rotate-90"
            />
          </div>
          {functionsArray.map((item, index) => {
            return <StyledDiv title={item.name} key={index} />;
          })}
          {functionsArray.length === 0 && (
            <p className="text-white">You have no functions yet.</p>
          )}
        </div>
      </aside>
      <>
        <Popup
          ref={graphPopupRef}
          submitAction={handleGraphForm}
          closeFunction={() => graphPopupRef.current?.close()}
          dataArray={GRAPH_POPUP_DATA}
        />
        <Popup
          ref={functionsPopupRef}
          submitAction={handleFunctionForm}
          closeFunction={() => functionsPopupRef.current?.close()}
          dataArray={FUNCTION_POPUP_DATA}
        />
      </>
    </>
  );
}

export default GraphSidebar;
