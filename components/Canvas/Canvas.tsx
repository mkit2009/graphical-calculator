import { useEffect, useRef } from "react";

function Canvas() {
  const Graph = useRef<any>(null);

  async function importFromScript() {
    const { Graph: GraphImport } = await import("../../static/lib/script");
    Graph.current = GraphImport;
  }

  useEffect(() => {
    importFromScript();
    return () => {
      Graph.current = null;
    };
  }, []);

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
