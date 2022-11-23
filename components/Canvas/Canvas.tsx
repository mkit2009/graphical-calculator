import { useEffect, useRef, useState } from "react";
import { useMainContext } from "../../src/context/mainContext";

function Canvas() {
  const [newFunctionState, setNewFunctionState] = useState<
    Function | undefined
  >(undefined);
  const [newGraphState, setNewGraphState] = useState<Function | undefined>(
    undefined
  );

  const {
    setNewFunction,
    setNewGraph,
    setFunctionsArray,
    setDeleteFunction,
    setDeleteGraph,
  } = useMainContext();

  async function importFromScript() {
    const { Graph, Function } = await import("../../static/lib/script");
    setNewFunctionState(() => Function.create);
    setNewGraphState(() => Graph.create);
    setDeleteFunction(() => Function.remove);
    setDeleteGraph(() => Graph.remove);
    setFunctionsArray([
      { name: "samplePow", body: 'pow(x, "a")', parametres: { a: 0 } },
      { name: "sampleSin", body: 'sin(x) + "a"', parametres: { a: 0 } },
      { name: "sampleConstant", body: "x", parametres: {} },
    ]);
  }

  useEffect(() => {
    importFromScript();
  }, []);

  useEffect(() => {
    setNewFunction(() => newFunctionState);
    setNewGraph(() => newGraphState);
  }, [newFunctionState, newGraphState]);

  return (
    <>
      <canvas
        id="canvas"
        width="650"
        height="650"
        className="cursor-crosshair mx-auto shadow-static dark:shadow-staticDark hover:shadow-staticBigger
         dark:hover:shadow-staticBiggerDark rounded-lg duration-200
        w-full aspect-square max-w-[650px]"
      ></canvas>
    </>
  );
}

export default Canvas;
