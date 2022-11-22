import { HTMLInputTypeAttribute } from "react";

interface PopupDataInterface {
  name: string;
  type: HTMLInputTypeAttribute | "select";
  placeholder: string;
  dataType: "string" | "number";
  selectData?: "functions" | "graphs" | string[];
}

export const GRAPH_POPUP_DATA: PopupDataInterface[] = [
  {
    name: "Graph name",
    type: "text",
    placeholder: "Amazing function...",
    dataType: "string",
  },
  {
    name: "Graph funciton",
    type: "select",
    selectData: "functions",
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

export const FUNCTION_POPUP_DATA: PopupDataInterface[] = [
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
