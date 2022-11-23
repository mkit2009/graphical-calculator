import React, { ChangeEventHandler, useState, useRef, useEffect } from "react";
import { BsCheck } from "react-icons/bs";
import { BiColorFill } from "react-icons/bi";

const COLORS: { [index: string]: string } = {
  white: "#ffffff",
  black: "#000000",
  lightGreen: "#1eeb36",
  green: "#32a852",
  lightRed: "#eb4034",
  lightBlue: "#24bde3",
  blue: "#2a34f7",
  darkBlue: "#0f0f7a",
  lightOrange: "#f76d2d",
  yellow: "#e8e115",
  pink: "#e6256f",
  purple: "#9a24e3",
} as const;

export default function ColorPicker({
  title,
  value,
  error,
  onBlur,
  onChange,
  values,
  setValueFunction,
}: {
  title: string;
  value: any;
  error: any;
  onBlur: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  values: { [index: string]: string };
  setValueFunction: Function;
}) {
  const [pickedColor, setPickedColor] = useState<keyof typeof COLORS>("black");
  const [isOpened, setIsOpened] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleColorChange = (color: keyof typeof COLORS) => {
    if (inputRef.current) {
      setValueFunction((old: Object) => {
        const value = inputRef?.current?.name;
        if (value === undefined) {
          return old;
        }
        setPickedColor(color);
        setIsOpened(false);
        return { ...old, [value]: COLORS[color] };
      });
    }
  };

  useEffect(() => {
    if (values[`${title.replaceAll(" ", "")}-name`] === "") {
      handleColorChange("black");
      setValueFunction((old: any) => {
        return { ...old, [`${title.replaceAll(" ", "")}-name`]: "black" };
      });
    }
  }, [values[`${title.replaceAll(" ", "")}-name`]]);

  return (
    <div className="">
      <input
        ref={inputRef}
        id={`${title.replaceAll(" ", "")}-input`}
        name={`${title.replaceAll(" ", "")}-name`}
        type={"text"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="opacity-0 pointer-events-none absolute"
      ></input>
      <div className="flex justify-between items-center">
        <p className="text-xl">Pick color</p>
        <div
          className={`w-14 aspect-square rounded-full cursor-pointer grid place-items-center group overflow-hidden`}
          style={{ backgroundColor: COLORS[pickedColor] }}
          onClick={() => {
            setIsOpened((old) => !old);
          }}
        >
          <BiColorFill
            className="text-[2.4rem] pointer-events-none translate-y-[120%]
           group-hover:translate-y-[0%] duration-150"
          />
        </div>
      </div>
      <p className="text-red-500">{error}</p>
      {isOpened && (
        <div className="bg-white z-20 w-full h-full absolute top-0 left-0 flex flex-wrap gap-2 p-4 content-start">
          {Object.keys(COLORS).map((color: string, index) => {
            const colorClass = COLORS[color];
            return (
              <div
                style={{ backgroundColor: colorClass }}
                onClick={() => handleColorChange(color)}
                className={`w-20 h-20 shadow-slate-300 shadow-xl rounded-full relative drop-shadow-lg cursor-pointer hover:scale-105
                duration-100`}
                key={index}
              >
                {color === pickedColor && (
                  <div
                    className="w-6 h-6 rounded-full bg-green-500 absolute top-0 right-0 grid place-content-center
                  border-2 border-black border-solid"
                  >
                    <BsCheck className="text-2xl" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
