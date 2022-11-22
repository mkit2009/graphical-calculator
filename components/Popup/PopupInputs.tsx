import React, { useRef } from "react";
import { ChangeEventHandler } from "react";

export const InputText = ({
  title,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: {
  title: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onBlur: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  error: string | undefined;
  touched?: boolean;
}) => {
  return (
    <div className="flex flex-col md:grid md:grid-cols-5">
      <label
        htmlFor={`${title.replace(" ", "")}-input`}
        className="text-xl col-span-2 grid items-center"
      >
        {title}
      </label>
      <span className={`col-span-3 col-start-3 relative`}>
        <input
          id={`${title.replaceAll(" ", "")}-input`}
          name={`${title.replaceAll(" ", "")}-name`}
          type={"text"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full py-3 px-5 outline-none border-blue-400 border-2 border-solid rounded-full bg-transparent ${
            error && touched ? "border-red-500" : ""
          }`}
        />

        <p
          className={`text-red-400 text-[1rem] pl-2 ${
            error && touched ? "opacity-1" : "opacity-0"
          }`}
        >
          {error || "Sample text"}
        </p>
      </span>
    </div>
  );
};

export const InputOptions = ({
  title,
  selectData,
  parametresArray,
  parametresValue,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
}: {
  title: string;
  selectData: string[];
  parametresArray?: {
    name: string;
    parametres: { [index: string]: 0 };
  }[];
  parametresValue?: any;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onBlur: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  error: string | undefined;
  touched?: boolean;
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="flex flex-col md:grid md:grid-cols-5">
      <label
        htmlFor={`${title.replace(" ", "")}-input`}
        className="text-xl col-span-2 grid items-center"
      >
        {title}
      </label>
      <span className={`col-span-3 col-start-3 relative`}>
        <>
          <select
            ref={selectRef}
            name={`${title.replaceAll(" ", "")}-name`}
            id={`${title.replaceAll(" ", "")}-input`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={`w-full py-3 px-5 outline-none border-blue-400 border-2 border-solid rounded-full bg-transparent open ${
              error && touched ? "border-red-500" : ""
            }`}
          >
            <>
              <option disabled value={""} className="option">
                Select your function
              </option>
              {selectData.map((value, index) => {
                return (
                  <option value={value} key={index} className="option">
                    {value}
                  </option>
                );
              })}
            </>
          </select>
        </>
        <p
          className={`text-red-400 text-[1rem] pl-2 ${
            error && touched ? "opacity-1" : "opacity-0"
          }`}
        >
          {error || "Sample text"}
        </p>
        {parametresArray &&
          selectRef.current?.selectedIndex !== undefined &&
          selectRef.current?.selectedIndex > 0 &&
          Object.keys(
            parametresArray[selectRef.current?.selectedIndex - 1].parametres
          ).map((item, index) => {
            return (
              <div key={index}>
                {item} ={" "}
                <input
                  id={item + "-attr"}
                  name={item + "-attr"}
                  type="text"
                  onChange={onChange}
                  value={parametresValue}
                  className="bg-transparent border-2 border-solid border-blue-400 rounded-full py-2 px-3 outline-none"
                />
              </div>
            );
          })}
      </span>
    </div>
  );
};
