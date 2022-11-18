import React, { createContext, useContext, useState } from "react";
import { FunctionArrayType } from "../types/functions.types";
import { GraphsArrayType } from "../types/graphs.types";

interface MainContextInterface {
  functionsArray: FunctionArrayType;
  setFunctionsArray: React.Dispatch<React.SetStateAction<FunctionArrayType>>;
  graphsArray: GraphsArrayType;
  setGraphsArray: React.Dispatch<React.SetStateAction<GraphsArrayType>>;
  newGraph:
    | ((a: string, b: string, c: number[], d: string) => void)
    | undefined;
  setNewGraph: React.Dispatch<
    React.SetStateAction<
      ((a: string, b: string, c: number[], d: string) => void) | undefined
    >
  >;
  newFunction:
    | ((a: string, b: string, vars: { [index: string]: number }) => void)
    | undefined;
  setNewFunction: React.Dispatch<
    React.SetStateAction<
      | ((a: string, b: string, vars: { [index: string]: number }) => void)
      | undefined
    >
  >;
}

const MainContext = createContext<MainContextInterface>(
  {} as MainContextInterface
);

const MainContextWrapper = ({ children }: { children: React.ReactElement }) => {
  const [functionsArray, setFunctionsArray] = useState<FunctionArrayType>([]);
  const [graphsArray, setGraphsArray] = useState<GraphsArrayType>([]);
  const [newGraph, setNewGraph] = useState<
    ((a: string, b: string, c: number[], d: string) => void) | undefined
  >(undefined);
  const [newFunction, setNewFunction] = useState<
    | ((a: string, b: string, vars: { [index: string]: number }) => void)
    | undefined
  >(undefined);

  return (
    <MainContext.Provider
      value={{
        functionsArray,
        setFunctionsArray,
        graphsArray,
        setGraphsArray,
        newGraph,
        setNewGraph,
        newFunction,
        setNewFunction,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export default MainContextWrapper;

export const useMainContext = () => useContext(MainContext);
