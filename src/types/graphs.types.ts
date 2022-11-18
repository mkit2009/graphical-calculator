import { FunctionArrayType } from "./functions.types";

export interface GraphsInterface {
  name: string; // Name of graph, key
  functionName: FunctionArrayType[number]["name"] // Name of function which will graph use
  arguments: number[];
  color: string;
}

export type GraphsArrayType = GraphsInterface[]