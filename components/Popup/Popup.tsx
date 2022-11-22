import { ErrorMessage, useFormik } from "formik";
import React, {
  type FormEvent,
  forwardRef,
  type ForwardedRef,
  useMemo,
} from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useMainContext } from "../../src/context/mainContext";
import { graphSchema, functionSchema } from "../../src/schemas";
import { GRAPH_POPUP_DATA, FUNCTION_POPUP_DATA } from "./PopupData";
import { InputOptions, InputText } from "./PopupInputs";

const graphInitalValues: { [index: string]: "" } = {};
for (let item of GRAPH_POPUP_DATA) {
  graphInitalValues[item.name.replaceAll(" ", "") + "-name"] = "";
}

const functionInitialValues: { [index: string]: "" } = {};
for (let item of FUNCTION_POPUP_DATA) {
  functionInitialValues[item.name.replaceAll(" ", "") + "-name"] = "";
}

// Send inputs to form as children

const Popup = forwardRef(function Popup(
  {
    submitAction,
    closeFunction,
    dataType,
  }: {
    submitAction: (...all: any) => void | string;
    closeFunction: () => void;
    dataType: "graph" | "function";
  },
  ref: ForwardedRef<HTMLDialogElement>
) {
  const [ErrorMessage, setErrorMessage] = React.useState<string>("");

  const formikInitalData = useMemo(() => {
    // Get the right formik data by dataType sent
    switch (dataType) {
      case "graph": {
        return { initalValues: graphInitalValues, schema: graphSchema };
      }
      case "function": {
        return { initalValues: functionInitialValues, schema: functionSchema };
      }
      default: {
        return {};
      }
    }
  }, []);

  const onSubmit = (e: { [index: string]: string }) => {
    const result = submitAction(Object.values(e));
    if (result !== undefined) setErrorMessage(result);
  };

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    resetForm,
  } = useFormik({
    initialValues: formikInitalData.initalValues as {
      [index: string]: "";
    } & FormEvent<Element>,
    validationSchema: formikInitalData.schema,
    onSubmit: onSubmit,
  });

  const { functionsArray, graphsArray } = useMainContext();

  return (
    <dialog
      ref={ref}
      className="max-w-[800px] w-[95vw] sm:w-[90vw] md:w-[80vw] min-w-[250px] backdrop:bg-black backdrop:opacity-50
      rounded-md bg-white dark:bg-backgroundColor text-black dark:text-white p-8"
    >
      <AiOutlineClose
        className="text-4xl ml-auto mb-5 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full p-1 cursor-pointer duration-75"
        onClick={() => {
          resetForm();
          closeFunction();
        }}
      />
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
        onChange={() => setErrorMessage("")}
      >
        {dataType === "function" &&
          FUNCTION_POPUP_DATA.map((item, index) => {
            let selectData;
            if (item.type === "select") {
              switch (item.selectData) {
                case "graphs": {
                  selectData = graphsArray.map((item) => {
                    return item.name;
                  });
                  break;
                }
                case "functions": {
                  selectData = functionsArray.map((item) => {
                    return item.name;
                  });
                  break;
                }
                default: {
                  selectData = item.selectData;
                }
              }
            }
            return (
              <React.Fragment key={index}>
                {selectData ? (
                  <InputOptions
                    title={item.name}
                    placeholder={item.placeholder}
                    selectData={selectData || []}
                    key={index}
                    value={values[item.name.replaceAll(" ", "") + "-name"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      errors[item.name.replaceAll(" ", "") + "-name"] ||
                      undefined
                    }
                    touched={touched[item.name.replaceAll(" ", "") + "-name"]}
                  />
                ) : (
                  <InputText
                    title={item.name}
                    placeholder={item.placeholder}
                    key={index}
                    value={values[item.name.replaceAll(" ", "") + "-name"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      errors[item.name.replaceAll(" ", "") + "-name"] ||
                      undefined
                    }
                    touched={touched[item.name.replaceAll(" ", "") + "-name"]}
                  />
                )}
              </React.Fragment>
            );
          })}
        {dataType === "graph" &&
          GRAPH_POPUP_DATA.map((item, index) => {
            let selectData;
            if (item.type === "select") {
              switch (item.selectData) {
                case "graphs": {
                  selectData = graphsArray.map((item) => {
                    return item.name;
                  });
                  break;
                }
                case "functions": {
                  selectData = functionsArray.map((item) => {
                    return item.name;
                  });
                  break;
                }
                default: {
                  selectData = item.selectData;
                }
              }
            }

            return (
              <React.Fragment key={index}>
                {selectData ? (
                  <InputOptions
                    title={item.name}
                    placeholder={item.placeholder}
                    key={index}
                    parametresArray={functionsArray}
                    parametresValue={values["number"]}
                    selectData={selectData || []}
                    value={values[item.name.replaceAll(" ", "") + "-name"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      errors[item.name.replaceAll(" ", "") + "-name"] ||
                      undefined
                    }
                    touched={touched[item.name.replaceAll(" ", "") + "-name"]}
                  />
                ) : (
                  <InputText
                    title={item.name}
                    placeholder={item.placeholder}
                    key={index}
                    value={values[item.name.replaceAll(" ", "") + "-name"]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      errors[item.name.replaceAll(" ", "") + "-name"] ||
                      undefined
                    }
                    touched={touched[item.name.replaceAll(" ", "") + "-name"]}
                  />
                )}
              </React.Fragment>
            );
          })}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <p
            className={`text-red-500 text-xl duration-200 ${
              ErrorMessage ? "opacity-100" : "opacity-0"
            }`}
          >
            {ErrorMessage}
          </p>

          <button
            type="submit"
            className="bg-blue-500 w-fit py-3 px-8 text-white text-xl font-bold rounded-lg
              duration-150 hover:bg-blue-600"
          >
            Create
          </button>
        </div>
      </form>
    </dialog>
  );
});

export default Popup;
