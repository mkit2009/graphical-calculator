import React, {
  useRef,
  forwardRef,
  type ForwardedRef,
  type HTMLInputTypeAttribute,
} from "react";
import { AiOutlineClose } from "react-icons/ai";

const InputDiv = ({
  title,
  inputType,
}: {
  title: string;
  inputType: HTMLInputTypeAttribute;
}) => {
  return (
    <div className="flex flex-col md:grid md:grid-cols-5">
      <label
        htmlFor={`${title.replace(" ", "")}-input`}
        className="text-xl col-span-2"
      >
        {title}
      </label>
      <input
        id={`${title.replace(" ", "")}-input`}
        type={inputType}
        className="border-blue-500 border-2 border-solid col-span-3 col-start-3"
      />
    </div>
  );
};

const Popup = forwardRef(function Popup(
  { closeFunction }: { closeFunction: () => void },
  ref: ForwardedRef<HTMLDialogElement>
) {
  return (
    <dialog
      ref={ref}
      className="max-w-[800px] w-[80vw] min-w-[250px] backdrop:bg-black backdrop:opacity-50
      rounded-md"
    >
      <div className="p-4">
        <AiOutlineClose
          className="text-4xl ml-auto mb-5 hover:bg-slate-200 rounded-full p-1 cursor-pointer"
          onClick={closeFunction}
        />
        <form className="flex flex-col gap-4">
          <InputDiv title="Graph name" inputType={"text"} />
          <InputDiv title="Graph funciton" inputType={"text"} />
          <InputDiv title="Graph color" inputType={"text"} />
          <button
            type="submit"
            className="bg-blue-500 w-fit py-3 px-8 text-white text-xl font-bold rounded-lg
            ml-auto duration-150 hover:bg-blue-600"
          >
            Create
          </button>
        </form>
      </div>
    </dialog>
  );
});

export default Popup;
