import { useEffect, useRef, useState } from "react";
import { useMainContext } from "../../src/context/mainContext";

function Canvas() {
  const [newFunctionState, setNewFunctionState] = useState<
    Function | undefined
  >(undefined);
  const [newGraphState, setNewGraphState] = useState<Function | undefined>(
    undefined
  );

  const { setNewFunction, setNewGraph } = useMainContext();

  async function importFromScript() {
    const { Graph, Function } = await import("../../static/lib/script");
    setNewFunctionState(() => Function.create);
    setNewGraphState(() => Graph.create);
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
        className="cursor-crosshair mx-auto shadow-static hover:shadow-staticBigger rounded-lg duration-200
        w-full aspect-square max-w-[650px]"
      ></canvas>
    </>
  );
}

export default Canvas;
