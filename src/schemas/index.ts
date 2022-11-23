import * as yup from "yup";

const functionRightSideRules = /^([a-z]?[A-Z]?[0-9]?\(?\)?\.?"?\+?\-?\/?\*?\ ?)*$/;

export const functionSchema = yup.object().shape({
  "Functionname-name": yup.string().required("This field is required"),
  "Functionsrightside-name": yup.string()
    .matches(functionRightSideRules, { message: "Detected invalid characters" })
    .required("This field is required"),
})

export const graphSchema = yup.object().shape({
  "Graphname-name": yup.string().required("This field is required"),
  "Graphfunciton-name": yup.string().required("You must select an option"),
  "Graphcolor-name": yup.string().required("Pick a color"),
  "number": yup.number().optional()
});