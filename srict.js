let canvas = document.getElementById("canvas")
let c = canvas.getContext("2d")

let graphs = []
let indicators = []

let view = {
    x: 0,
    y: 0,
    zeroX: 450,
    zeroY: 150,
    width: 650,
    height: 650,
    lineThickness: 2,
    scaleSize: 50,
    scaleValue: 1,
    resolution: 5
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

let functions = {
    linear(x, data) {
        return data.a * x + data.b
    },
    absolute(x, data) {
        return x
    },
    quadratic(x, data) {
        return data.a * Math.pow(x, 2) + data.b * x + data.c
    },
    power(x, data) {
        let pow = Math.pow(data.a, x)
        if (pow == Infinity)
            return 10 + data.c
        if (pow == -Infinity)
            return -10 + data.c
        return pow + data.c
    },
    sin(x, data) {
        return Math.sin(x * data.a) + data.b
    },
    undef() {
        throw "cannot calculate new points on undefined function"
    }
}

class Function {
    constructor(cb, variables = {}){
        this.cb = cb
        this.variables = {...variables}
    }
    getY(variables = {}){

    }
    getRequiredVaribles(){
        return this.variables
    }
    static createCustom(name = "", input = "", variables = {}){
        let definition = "f("
        let vars = keys(variables)
        for (let i in vars)
            definition += vars[i] + (i - 0 < vars.length - 1 ? ", " : "")
        definition += ") = " + input
        let fn = math.evaluate(definition)
        functions[name] = new Function(fn, variables)
    }
}

let operands = {
    midpoint(graph1, graph2, color) {
        let graph = new Graph("undef", { color })
        for (let i in graph1.curve) {
            graph.curve.push({ y: (graph1.curve[i].y + graph2.curve[i].y) / 2, x: graph1.curve[i].x })
        }
        return graph
    },
}

function distance(point1, point2) {
    let x = point2.x - point1.x
    let y = point2.y - point1.y
    let c = Math.sqrt(x ** 2 + y ** 2)
    return { x, y, c, fx: x / c, fy: y / c }
}

class Graph {
    constructor(type = "power", data = {}) {
        this.type = type
        this.data = { ...data }
        this.curve = []
        this.booleans = {
            abs: {
                x: true,
                y: false,
            }
        }
    }
    getY(x) {
        x = this.booleans.abs.x ? Math.abs(x) : x
        let y = functions[this.type](x, this.data)
        y = this.booleans.abs.y ? Math.abs(y) : y
        return y
    }
    draw() {
        c.rect(view.x, view.y, view.width, view.height)
        c.strokeStyle = this.data.color || "red"
        c.lineWidth = view.lineThickness
        c.beginPath()
        c.moveTo(view.x + this.curve[0].x, view.height + view.y + this.curve[0].y)
        for (let i = 1; i < this.curve.length; i++) {
            if (Math.abs(this.curve[i].y) <= 999999999 && (this.curve[i].y <= 0 || this.curve[i - 1].y <= 0) && (this.curve[i].y > -view.height || this.curve[i - 1].y > -view.height))
                c.lineTo(view.x + this.curve[i].x, view.height + view.y + this.curve[i].y)
        }
        c.stroke()
    }
    calc() {
        let unitSize = Graph.unitSize()
        this.curve = []
        for (let i = -view.zeroX; i < (view.width - view.zeroX) + view.resolution; i += view.resolution) {
            let y = -this.getY(i * unitSize) / unitSize - view.zeroY
            this.curve.push({ x: i + view.zeroX, y })
        }
    }
    static unitSize() {
        return view.scaleValue / view.scaleSize
    }
    static drawTable() {
        c.fillStyle = "lightgray"
        c.fillRect(view.x, view.y, view.width + view.lineThickness, view.height + view.lineThickness)
        c.fillStyle = "black"
        c.fillRect(view.x + view.zeroX - 1, view.y, 1, view.height)
        c.fillRect(view.x, view.y + view.height - view.zeroY - 1, view.width, 1)
        c.fillStyle = "rgba(0,0,0,0.2)"
        if (view.scaleSize > 0 && view.width / view.scaleSize < 30) {
            // vertical
            for (let i = -(-view.zeroX % view.scaleSize); i < view.width; i += view.scaleSize) {
                c.fillRect(view.x + i, view.y, 1, view.width)
            }
            // horizontal
            for (let i = (view.height - view.zeroY) % view.scaleSize; i < view.height; i += view.scaleSize) {
                c.fillRect(view.x, view.y + i, view.width, 1)
            }
        }
    }
    static closest(point = {}) {
        if (graphs.length == 0) return null
        let closest = { graphIdx: 0, graphVert: 0, distance: Infinity }
        for (let i in graphs) {
            for (let j in graphs[i].curve) {
                let tempPoint = {x: point.x, y: (view.height - point.y) * -1}
                let dist = distance(tempPoint, graphs[i].curve[j]).c
                if (dist < closest.distance){
                    closest.graphIdx = i - 0
                    closest.graphVert = j - 0
                    closest.distance = dist
                }
            }
        }
        return closest
    }
}

class Indicator {
    constructor(graphData){
        this.color = graphs[graphData.graphIdx].data.color
        this.point = {
            x: graphs[graphData.graphIdx].curve[graphData.graphVert].x,
            y: view.height +  graphs[graphData.graphIdx].curve[graphData.graphVert].y,
        }
    }
}

let graph = new Graph("sin", { a: 1, b: 5, color: "red" })
let graph2 = new Graph("power", { a: 3, c: 0, color: "magenta" })
let graph4 = new Graph("quadratic", { a: 1, b: 0, c: 0, color: "yellow" })
graphs.push(graph)

function main() {
    Graph.drawTable()
    graph.calc()
    graph2.calc()
    graph4.calc()
    let graph3 = operands.midpoint(graph, graph2, "green")
    graph.draw()
    graph2.draw()
    graph3.draw()
    graph4.draw()
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
        indicators.push(new Indicator(Graph.closest(mouse)))
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
        console.log("xcdvsd")
        indicators = []
        main()
    }
} setInterval(mouseUpdate, 1000 / 60)