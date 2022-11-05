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
let canvas = document.getElementById("canvas")
let c = canvas.getContext("2d")

let indicators = []

// s barvama si dělej co chceš
let colors = {
    originLine: "black",
    scaleLines: "rgba(0,0,0,0.2)",
    background: "lightgray"
}

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
}

let mouse = {
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    hold: -1,
    over: false,
    wheel: 0,
}

// tady můžeš přidat funkce, pokud se budeš cítit fancy
let functions = {}
function initFunctions(){
    let fns = {
        // vzor: "název": ["pouze pravá strana rovnice", {argument:základní_hodnota, ...}]
        "power": ["pow(x, a)", {a: 2}],
        "sine": ["sin(x) + height", {height: 0}],
        "constant": ["x", {}],
        "sinc": ["sin(x) / x * a", {a: 1}],
    }
    for (let i in fns)
    Function.create(i, fns[i][0], fns[i][1])
}initFunctions()

// tu zas grafy
let graphs = {}
// vzor: "název", "název_funkce", [proměnné ve stejném pořadí, jako deklarace argumentů dané funkce], "barva"
// lépe vysvětlené proměnné:
// pokud: "funkce": ["a + b + c + d", {a: 0, b: 0, d: 5, c: 10}]
// a zároveň: Graph.create("ahojoj", "sine", [1, 2, 3, 4], "green")
// potom: a: 1, b: 2, d: 3, c: 4
// pokud toto způsobilo ještě více zmatení, napiš mi xd
Graph.create("ahoj", "power", [3], "red")
Graph.create("ahojoj", "sine", [1], "green")
Graph.create("ahojo", "constant", [], "blue")
Graph.create("ahojsinco", "sinc", [10], "black")

function main() {
    Graph.drawTable()
    for(let i in graphs)
        graphs[i].calc()
    for(let i in graphs)
        graphs[i].draw()
}
main()

canvas.addEventListener("wheel", e => {
    mouse.wheel = e.deltaY > 0 ? 1 : -1
})
canvas.addEventListener("mouseenter", e => {
    mouse.over = true
})
canvas.addEventListener("mouseleave", e => {
    mouse.over = false
    mouse.hold = -1
})
canvas.addEventListener("mousemove", e => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
})
canvas.addEventListener("mousedown", e => {
    mouse.hold = 0
})
canvas.addEventListener("mouseup", e => {
    mouse.hold = -1
})
function mouseUpdate() {
    let redraw = false
    if (mouse.hold >= 0) {
        mouse.hold++
        view.zeroX -= mouse.lastX - mouse.x
        view.zeroY += mouse.lastY - mouse.y
        if (mouse.lastX != mouse.x || mouse.lastY != mouse.y)
            redraw = true
    }
    if (mouse.hold == 1 && mouse.lastX == mouse.x && mouse.lastY == mouse.y){

    }
    if (mouse.wheel != 0 && view.scaleSize - mouse.wheel * 5.37 * 5 > 0) {
        view.scaleSize -= mouse.wheel * 5.37  * Math.sqrt(Math.sqrt(view.scaleSize))
        if (view.scaleSize < 28) view.scaleSize = 28
        redraw = true
    }
    mouse.lastX = mouse.x
    mouse.lastY = mouse.y
    mouse.wheel = 0
    if (redraw){
        indicators = []
        main()
    }
} setInterval(mouseUpdate, 1000 / 60);