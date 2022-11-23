import React, { useState, useRef, useMemo, useCallback } from "react";
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import Popup from "../Popup/Popup";
import { AiOutlineDelete } from "react-icons/ai";
import { useMainContext } from "../../src/context/mainContext";

const StyledDiv = ({
  title,
  detailed,
  onClickDelete,
  onClickEdit,
}: {
  title: string;
  detailed?: string;
  onClickDelete?: (...args: any) => void;
  onClickEdit?: (...args: any) => void;
}) => {
  return (
    <div className="p-3 bg-slate-600 text-white dark:bg-barelyVisibleWhite rounded-md flex items-center justify-between max-w-[350px]">
      <div>
        <span className="text-lg whitespace-nowrap overflow-ellipsis overflow-hidden">
          {title}
        </span>
        {detailed && <p className="text-slate-400">{detailed}</p>}
      </div>
      <div className="flex flex-row gap-1">
        {/* {onClickEdit && (
          <div
            className="flex items-center"
            onClick={onClickEdit ? () => onClickEdit(title) : undefined}
          >
            <AiOutlineEdit className="text-4xl rounded-full p-1 hover:bg-barelyVisibleWhite cursor-pointer duration-150" />
          </div>
        )} */}
        {onClickDelete && (
          <div
            className="flex items-center"
            onClick={onClickDelete ? () => onClickDelete(title) : undefined}
          >
            <AiOutlineDelete className="text-4xl rounded-full p-1 hover:bg-barelyVisibleWhite cursor-pointer duration-150" />
          </div>
        )}
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
    deleteFunction,
    deleteGraph,
  } = useMainContext();

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

  const deleteGraphFunction = (name: string) => {
    if (deleteGraph) {
      try {
        deleteGraph(name);
        setGraphsArray((old) => {
          return old.filter((item) => {
            return item.name !== name;
          });
        });
      } catch (e) {}
    }
  };

  const deleteFunctionFunction = (name: string) => {
    if (deleteFunction) {
      try {
        deleteFunction(name);
        setFunctionsArray((old) => {
          return old.filter((item) => {
            return item.name !== name;
          });
        });
      } catch (e) {}
    }
  };

  const editGraphFunction = (name: string) => {};

  const handleFunctionForm = (inputArray: string[]) => {
    // Grabs the name from input form name
    const name = inputArray[0];
    // Grab raw function from input form
    const functionString = inputArray[1];
    // Creates variables where indexes of " will be stored
    const variables: number[] = [];
    // Variebles result is object with string keys and number values, the script is dependand on this structure
    const variablesResult: { [index: string]: 0 } = {};
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
      try {
        newFunction(name, functionString.replaceAll('"', ""), variablesResult);
        setFunctionsArray((old) => [
          ...old,
          {
            name: name,
            body: functionString,
            parametres: variablesResult,
          },
        ]);
        functionsPopupRef.current?.close();
      } catch (e) {
        return "Incorrect input!";
      }
    }
  };

  const handleGraphForm = (inputArray: string[]) => {
    const name = inputArray[0];
    const functionVar = inputArray[1];
    const color = inputArray[2];
    const args = inputArray
      .filter((item, index) => {
        return index > 2;
      })
      .map((item) => +item);

    if (graphsArray.find((item) => item.name === name))
      return "This name already exists!";

    if (newGraph) {
      try {
        for (let number of args) {
          if (typeof number !== "number" || isNaN(number)) {
            return "Your value input is not a number!";
          }
        }
        newGraph(name, functionVar, args, color);
        setGraphsArray((old) => [
          ...old,
          {
            name: name,
            functionName: functionVar,
            arguments: args,
            color: color,
          },
        ]);
        graphPopupRef.current?.close();
      } catch (e) {}
    }
  };

  const graphDetailedFunction = useCallback(
    (name: string, parametres: number[]) => {
      const functionObject = functionsArray.find((obj) => obj.name === name);
      let result = functionObject?.body;
      let j = 0;
      for (let i in functionObject?.parametres) {
        result = result?.replaceAll(`"${i}"`, "" + parametres[j]);
        j++;
      }
      return result;
    },
    [graphsArray]
  );

  return (
    <>
      <aside className="p-4 flex flex-col gap-8 overflow-x-hidden max-h-[650px] shadow-xl rounded-md">
        <div>
          <div
            className="flex items-center gap-3 justify-between text-black dark:text-fontColor text-2xl mb-2 sticky top-[-1rem] dark:bg-[#222222]
          p-1"
          >
            <p>Your Graphs</p>
            <AiOutlinePlus
              onClick={handleNewGraph}
              className="text-4xl self-end rounded-full cursor-pointer duration-100 dark:hover:bg-barelyVisibleWhite hover:bg-slate-200
          hover:rotate-90"
            />
          </div>
          <div className="flex flex-col gap-2">
            {graphsArray.map((item, index) => {
              return (
                <StyledDiv
                  title={item.name}
                  key={index}
                  detailed={graphDetailedFunction(
                    item.functionName,
                    item.arguments
                  )}
                  onClickDelete={deleteGraphFunction}
                  onClickEdit={editGraphFunction}
                />
              );
            })}
            {graphsArray.length === 0 && (
              <p className="text-black dark:text-white">
                You have no graphs yet.
              </p>
            )}
          </div>
        </div>
        <div>
          <div
            className="flex items-center gap-3 justify-between text-black dark:text-fontColor text-2xl mb-2 sticky top-[-1rem] dark:bg-[#222222]
          p-1"
          >
            <p>Your Functions</p>
            <AiOutlinePlus
              onClick={handleNewFunction}
              className="text-4xl self-end rounded-full cursor-pointer duration-100 dark:hover:bg-barelyVisibleWhite hover:bg-slate-200
          hover:rotate-90"
            />
          </div>
          <div className="flex flex-col gap-2">
            {functionsArray.map((item, index) => {
              return (
                <StyledDiv
                  title={item.name}
                  detailed={item.body}
                  key={index}
                  onClickDelete={deleteFunctionFunction}
                />
              );
            })}
            {functionsArray.length === 0 && (
              <p className="text-black darl:text-white">
                You have no functions yet.
              </p>
            )}
          </div>
        </div>
      </aside>
      <>
        <Popup
          ref={graphPopupRef}
          closeFunction={() => graphPopupRef.current?.close()}
          submitAction={handleGraphForm}
          dataType="graph"
        />
        <Popup
          ref={functionsPopupRef}
          closeFunction={() => functionsPopupRef.current?.close()}
          submitAction={handleFunctionForm}
          dataType="function"
        />
      </>
    </>
  );
}

export default GraphSidebar;
