let canvas = document.getElementById("canvas")
let c = canvas.getContext("2d")

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

let operands = {
    midpoint(graph1, graph2, color) {
        let graph = new Graph("undef", { color })
        for (let i in graph1.curve) {
            graph.curve.push({ y: (graph1.curve[i].y + graph2.curve[i].y) / 2, x: graph1.curve[i].x })
        }
        return graph
    },
}

class Graph {
    constructor(type, data) {
        this.type = type
        this.data = data
        this.curve = []
    }
    getY(x) {
        return functions[this.type](x, this.data)
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
}

let graph = new Graph("sin", { a: 1, b: 5, color: "red" })
let graph2 = new Graph("power", { a: 3, c: 0, color: "magenta" })
let graph4 = new Graph("quadratic", { a: 1, b: 0, c: 0, color: "yellow" })

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
function mouseData() {
    let redraw = false
    if (mouse.hold >= 0) {
        mouse.hold++
        view.zeroX -= mouse.lastX - mouse.x
        view.zeroY += mouse.lastY - mouse.y
        redraw = true
    }
    if (mouse.wheel != 0 && view.scaleSize - mouse.wheel * 5.37 * 5 > 0) {
        view.scaleSize -= mouse.wheel * 5.37
        redraw = true
    }
    mouse.lastX = mouse.x
    mouse.lastY = mouse.y
    mouse.wheel = 0
    if (redraw)
        main()
} setInterval(mouseData, 1000 / 60)