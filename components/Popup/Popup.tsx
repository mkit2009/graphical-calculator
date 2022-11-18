import { useFormik } from "formik";
import React, {
  type FormEvent,
  forwardRef,
  type ForwardedRef,
  type HTMLInputTypeAttribute,
  useMemo,
} from "react";
import { AiOutlineClose } from "react-icons/ai";

export const InputDiv = ({
  title,
  inputType,
  placeholder,
}: {
  title: string;
  inputType: HTMLInputTypeAttribute;
  placeholder: string;
}) => {
  return (
    <div className="flex flex-col md:grid md:grid-cols-5">
      <label
        htmlFor={`${title.replace(" ", "")}-input`}
        className="text-xl col-span-2 grid items-center"
      >
        {title}
      </label>
      <span
        className={`col-span-3 col-start-3 relative ${
          inputType === "text"
            ? "before:content-[''] before:absolute before:w-full before:h-1 before:bg-red-800 before:left-0 before:bottom-0 before:rounded-full"
            : ""
        }`}
      >
        <input
          id={`${title.replaceAll(" ", "")}-input`}
          name={`${title.replaceAll(" ", "")}-name`}
          type={inputType}
          placeholder={placeholder}
          className={`w-full p-2 outline-none ${
            inputType === "text" ? "bg-transparent" : ""
          }`}
        />
      </span>
    </div>
  );
};

// Send inputs to form as children

export interface PopupDataArray {
  name: string;
  type: HTMLInputTypeAttribute;
  placeholder: string;
  dataType: "string" | "email" | "number";
}

const Popup = forwardRef(function Popup(
  {
    dataArray,
    submitAction,
    closeFunction,
  }: {
    dataArray: PopupDataArray[];
    submitAction: Function;
    closeFunction: () => void;
  },
  ref: ForwardedRef<HTMLDialogElement>
) {
  const formInitialValue = useMemo(() => {
    const array: { [index: string]: any } = {};
    for (let i in dataArray) {
      array[dataArray[i].name.replaceAll(" ", "") + "-name"] = "";
    }
    return array;
  }, []);

  const form = useFormik({
    initialValues: formInitialValue,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submitAction(e.target);
  };

  return (
    <dialog
      ref={ref}
      className="max-w-[800px] w-[80vw] min-w-[250px] backdrop:bg-black backdrop:opacity-50
      rounded-md bg-white dark:bg-backgroundColor text-black dark:text-white p-8"
    >
      <AiOutlineClose
        className="text-4xl ml-auto mb-5 hover:bg-slate-200 dark:hover:bg-gray-700 rounded-full p-1 cursor-pointer duration-75"
        onClick={closeFunction}
      />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {dataArray.map((item, index) => {
          return (
            <InputDiv
              title={item.name}
              key={index}
              placeholder={item.placeholder}
              inputType={item.type}
            />
          );
        })}
        <button
          type="submit"
          className="bg-blue-500 w-fit py-3 px-8 text-white text-xl font-bold rounded-lg
            ml-auto duration-150 hover:bg-blue-600"
        >
          Create
        </button>
      </form>
    </dialog>
  );
});

export default Popup;
