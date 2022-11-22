import React, { ChangeEventHandler, useState, useRef } from "react";

const COLORS: { [index: string]: string } = {
  white: "#ffffff",
  black: "#000000",
  green: "#32a852",
} as const;

export default function ColorPicker({
  title,
  value,
  error,
  onBlur,
  onChange,
  setValueFunction,
}: {
  title: string;
  value: any;
  error: any;
  onBlur: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  setValueFunction: Function;
}) {
  const [pickedColor, setPickedColor] = useState<keyof typeof COLORS>("black");
  const [isOpened, setIsOpened] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

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
          className="w-14 aspect-square rounded-full bg-black"
          onClick={() => {
            setIsOpened((old) => !old);
          }}
          // onClick={() => {
          //   if (inputRef.current) {
          //     console.log(inputRef.current.value);
          //     setValueFunction((old: Object) => {
          //       const value = inputRef?.current?.name;
          //       if (value === undefined) {
          //         return old;
          //       }
          //       return { ...old, [value]: pickedColor };
          //     });
          //   }
          // }}
        ></div>
      </div>
      <p className="text-red-500">{error}</p>
      {isOpened && (
        <div className="bg-white z-20 w-full h-full absolute top-0 left-0 flex flex-wrap gap-2 p-4">
          {Object.keys(COLORS).map((color: string, index) => {
            const colorClass = COLORS[color];
            console.log(pickedColor === color);
            return (
              <div
                style={{ backgroundColor: colorClass }}
                onClick={() => setPickedColor(color)}
                className={`w-20 h-20 border-2 border-solid border-black rounded-full relative ${
                  color === pickedColor
                    ? "before:content-[''] before:absolute before:w-8 before:h-8 before:rounded-full before:right-0 before:top-0 before:bg-blue-600"
                    : ""
                }`}
                key={index}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
}
