import { evaluate } from "mathjs";

// z nějakého důvodu keys(obj) ze standardní knihovny nefunguje
let keys = (obj) => {
  let arr = [];
  for (let i in obj) arr.push(i);
  return arr;
};
class Function {
  constructor(cb, variables = {}) {
    this.cb = cb;
    this.args = Variable.createFromObj(variables);
    if (!this.selfVerification()) {
      throw "not a function";
    }
  }
  getY(x, variables = []) {
    return this.cb(...variables, x);
  }
  selfVerification() {
    let args = [];
    for (let i in this.args) args.push(this.args[i].defaultValue);
    if (typeof this.cb(...args, 1) == "number") {
      return true;
    }
    return false;
  }
  static remove(name) {
    for (let i in graphs) {
      if (graphs[i].type == name) {
        delete graphs[i];
      }
    }
    delete functions[name];
    main();
  }
  // call to generate new function
  static create(name = "", input = "", variables = {}) {
    let definition = "f(";
    let names = keys(variables);
    for (let i in names) definition += names[i] + ", ";
    definition += "x) = " + input;
    let fn = evaluate(definition);
    functions[name] = new Function(fn, variables);
  }
}

function distance(point1, point2) {
  let x = point2.x - point1.x;
  let y = point2.y - point1.y;
  let c = Math.sqrt(x ** 2 + y ** 2);
  return { x, y, c, fx: x / c, fy: y / c };
}

class Graph {
  constructor(type = "power", variables = [], color = "red") {
    this.type = type;
    this.color = color;
    this.variables = [...variables];
    this.curve = [];
    this.booleans = {
      abs: {
        x: false,
        y: false,
      },
    };
    if (!this.selfVerification()) {
      throw (
        "number of provided variables doesnt match functions args lenght. variables: " +
        this.variables.length +
        ", args: " +
        functions[this.type].args.length
      );
    }
  }
  getY(x) {
    x = this.booleans.abs.x ? Math.abs(x) : x;
    let y = functions[this.type].getY(x, this.variables);
    y = this.booleans.abs.y ? Math.abs(y) : y;
    return y;
  }
  draw() {
    if (this.curve.length == 0) return;
    c.rect(view.x, view.y, view.width, view.height);
    c.strokeStyle = this.color || "red";
    c.lineWidth = view.lineThickness;
    c.beginPath();
    c.moveTo(view.x + this.curve[0].x, view.height + view.y + this.curve[0].y);
    c.moveTo(this.curve[0].x, this.curve[0].y);
    for (let i in this.curve) {
      c.lineTo(this.curve[i][0], this.curve[i][1]);
    }
    c.stroke();
  }
  calc() {
    let unitSize = Graph.unitSize();
    this.curve = [];
    for (
      let i = -view.zeroX - view.resolution;
      i < view.width - view.zeroX + view.resolution + view.resolution;
      i += view.resolution
    ) {
      let y = -this.getY(i * unitSize) / unitSize - view.zeroY;
      this.curve.push({ x: i + view.zeroX, y });
    }
    let lines = [];
    for (let i = 1; i < this.curve.length - 1; i++) {
      if (
        ((this.curve[i].y <= 0 || this.curve[i - 1].y <= 0) &&
          (this.curve[i].y > -view.height ||
            this.curve[i - 1].y > -view.height)) ||
        ((this.curve[i].y <= 0 || this.curve[i + 1].y <= 0) &&
          (this.curve[i].y > -view.height ||
            this.curve[i + 1].y > -view.height))
      )
        lines.push([
          view.x + this.curve[i].x,
          view.height + view.y + this.curve[i].y,
        ]);
    }

    this.curve = lines;
  }
  selfVerification() {
    if (this.variables.length != functions[this.type].args.length) {
      return false;
    }
    return true;
  }
  static remove(name) {
    delete graphs[name];
    main();
  }
  static create(
    name = "myGraph",
    type = "power",
    variables = [],
    color = "red"
  ) {
    graphs[name] = new Graph(type, variables, color);
    main();
  }
  static unitSize() {
    return view.scaleValue / view.scaleSize;
  }
  static drawTable() {
    c.fillStyle = colors.background;
    c.fillRect(
      view.x,
      view.y,
      view.width + view.lineThickness,
      view.height + view.lineThickness
    );
    c.fillStyle = colors.originLine;
    c.fillRect(view.x + view.zeroX - 1, view.y, 1, view.height);
    c.fillRect(view.x, view.y + view.height - view.zeroY - 1, view.width, 1);
    c.fillStyle = colors.scaleLines;
    if (view.scaleSize > 0 && view.width / view.scaleSize < 30) {
      // vertical
      for (
        let i = -(-view.zeroX % view.scaleSize);
        i < view.width;
        i += view.scaleSize
      ) {
        c.fillRect(view.x + i, view.y, 1, view.width);
      }
      // horizontal
      for (
        let i = (view.height - view.zeroY) % view.scaleSize;
        i < view.height;
        i += view.scaleSize
      ) {
        c.fillRect(view.x, view.y + i, view.width, 1);
      }
    }
  }
  static closest(point = {}) {
    if (graphs.length == 0) return null;
    let closest = { graphIdx: 0, graphVert: 0, distance: Infinity };
    for (let i in graphs) {
      for (let j in graphs[i].curve) {
        let tempPoint = { x: point.x, y: (view.height - point.y) * -1 };
        let dist = distance(tempPoint, graphs[i].curve[j]).c;
        if (dist < closest.distance) {
          closest.graphIdx = i - 0;
          closest.graphVert = j - 0;
          closest.distance = dist;
        }
      }
    }
    return closest;
  }
}

class Indicator {
  constructor(graphData) {
    this.color = graphs[graphData.graphIdx].data.color;
    this.point = {
      x: graphs[graphData.graphIdx].curve[graphData.graphVert].x,
      y: view.height + graphs[graphData.graphIdx].curve[graphData.graphVert].y,
    };
  }
}

class Variable {
  constructor(name = "", defaultValue = 0) {
    this.name = name;
    if (typeof defaultValue == "number") {
      this.defaultValue = defaultValue;
    } else {
      throw (
        "default vaule is not a number: name = " +
        name +
        ", value = " +
        defaultValue
      );
    }
  }
  static createFromObj(obj = {}) {
    let arr = [];
    for (let i in obj) {
      arr.push(new Variable(i, obj[i]));
    }
    return arr;
  }
}

/**
 *  !Important
 *
 * // funkce
 * Function.create(název, výraz, argumenty) // vytvoření funkce
 * Function.remove(název) // smazání funkce a všech grafů s ní provázaných
 *
 * // grafy
 * Graph.create(název, název_funkce, argumenty = [...args]) // vytvoření grafu
 * Graph.remove(název) // smazání grafu
 *
 * // nastavení
 * view.scaleValue // velikost jednoho "čtverečku" v souřadné soustavě
 * view.lineThickness // tloušťka křivky grafu
 * view.resulution // s jakou přesností se grafy počítají
 */
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
let indicators = [];

// s barvama si dělej co chceš
let colors = {
  originLine: "black",
  scaleLines: "rgba(0,0,0,0.2)",
  background: "lightgray",
};

let view = {
  // todle dej do nastavení
  scaleValue: 1,
  lineThickness: 2,
  resolution: 5,
  // toto změň pouze pokud změníš hodnoty width a height v tagu canvas
  width: 650,
  height: 650,
  // todle nech být
  x: 0,
  y: 0,
  zeroX: 450,
  zeroY: 150,
  scaleSize: 50,
};

let mouse = {
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,
  hold: -1,
  over: false,
  wheel: 0,
};

// tady můžeš přidat funkce, pokud se budeš cítit fancy
let functions = {};
function initFunctions() {
  let fns = {
    // vzor: "název": ["pouze pravá strana rovnice", {argument:základní_hodnota, ...}]
    power: ["pow(x, a)", { a: 2 }],
    sine: ["sin(x) + height", { height: 0 }],
    constant: ["x", {}],
    sinc: ["sin(x) / x * a", { a: 1 }],
  };
  for (let i in fns) Function.create(i, fns[i][0], fns[i][1]);
}
initFunctions();

// tu zas grafy
let graphs = {};
// vzor: "název", "název_funkce", [proměnné ve stejném pořadí, jako deklarace argumentů dané funkce], "barva"
// lépe vysvětlené proměnné:
// pokud: "funkce": ["a + b + c + d", {a: 0, b: 0, d: 5, c: 10}]
// a zároveň: Graph.create("ahojoj", "sine", [1, 2, 3, 4], "green")
// potom: a: 1, b: 2, d: 3, c: 4
// pokud toto způsobilo ještě více zmatení, napiš mi xd
Graph.create("ahoj", "power", [3], "red");
Graph.create("ahojoj", "sine", [1], "green");
Graph.create("ahojo", "constant", [], "blue");
Graph.create("ahojsinco", "sinc", [10], "black");

function main() {
  Graph.drawTable();
  for (let i in graphs) graphs[i].calc();
  for (let i in graphs) graphs[i].draw();
}
main();

canvas.addEventListener("wheel", (e) => {
  mouse.wheel = e.deltaY > 0 ? 1 : -1;
});
canvas.addEventListener("mouseenter", (e) => {
  mouse.over = true;
});
canvas.addEventListener("mouseleave", (e) => {
  mouse.over = false;
  mouse.hold = -1;
});
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});
canvas.addEventListener("mousedown", (e) => {
  mouse.hold = 0;
});
canvas.addEventListener("mouseup", (e) => {
  mouse.hold = -1;
});
function mouseUpdate() {
  let redraw = false;
  if (mouse.hold >= 0) {
    mouse.hold++;
    view.zeroX -= mouse.lastX - mouse.x;
    view.zeroY += mouse.lastY - mouse.y;
    if (mouse.lastX != mouse.x || mouse.lastY != mouse.y) redraw = true;
  }
  if (mouse.hold == 1 && mouse.lastX == mouse.x && mouse.lastY == mouse.y) {
  }
  if (mouse.wheel != 0 && view.scaleSize - mouse.wheel * 5.37 * 5 > 0) {
    view.scaleSize -= mouse.wheel * 5.37 * Math.sqrt(Math.sqrt(view.scaleSize));
    if (view.scaleSize < 28) view.scaleSize = 28;
    redraw = true;
  }
  mouse.lastX = mouse.x;
  mouse.lastY = mouse.y;
  mouse.wheel = 0;
  if (redraw) {
    indicators = [];
    // console.log(keys(graphs).length);
    // console.log(graphs);
    main();
  }
}
setInterval(mouseUpdate, 1000 / 60);

export { Graph };
