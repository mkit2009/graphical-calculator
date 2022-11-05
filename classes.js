// z nějakého důvodu keys(obj) ze standardní knihovny nefunguje
let keys = obj => { let arr = []; for (let i in obj) arr.push(i); return arr }
class Function {
    constructor(cb, variables = {}) {
        this.cb = cb
        this.args = Variable.createFromObj(variables)
        if (!this.selfVerification()) {
            throw "not a function"
        }
    }
    getY(x, variables = []) {
        return this.cb(...variables, x)
    }
    selfVerification() {
        let args = []
        for (let i in this.args)
            args.push(this.args[i].defaultValue)
        if (typeof this.cb(...args, 1) == "number") {
            return true
        }
        return false
    }
    static remove(name) {
        for (let i in graphs) {
            if (graphs[i].type == name) {
                delete graphs[i]
            }
        }
        delete functions[name]
        main()
    }
    // call to generate new function
    static create(name = "", input = "", variables = {}) {
        let definition = "f("
        let names = keys(variables)
        for (let i in names)
            definition += names[i] + ", "
        definition += "x) = " + input
        let fn = math.evaluate(definition)
        functions[name] = new Function(fn, variables)
    }
}

function distance(point1, point2) {
    let x = point2.x - point1.x
    let y = point2.y - point1.y
    let c = Math.sqrt(x ** 2 + y ** 2)
    return { x, y, c, fx: x / c, fy: y / c }
}

class Graph {
    constructor(type = "power", variables = [], color = "red") {
        this.type = type
        this.color = color
        this.variables = [...variables]
        this.curve = []
        this.booleans = {
            abs: {
                x: false,
                y: false,
            }
        }
        if (!this.selfVerification()) {
            throw "number of provided variables doesnt match functions args lenght. variables: " + this.variables.length + ", args: " + functions[this.type].args.length
        }
    }
    getY(x) {
        x = this.booleans.abs.x ? Math.abs(x) : x
        let y = functions[this.type].getY(x, this.variables)
        y = this.booleans.abs.y ? Math.abs(y) : y
        return y
    }
    draw() {
        if (this.curve.length == 0) return
        c.rect(view.x, view.y, view.width, view.height)
        c.strokeStyle = this.color || "red"
        c.lineWidth = view.lineThickness
        c.beginPath()
        c.moveTo(view.x + this.curve[0].x, view.height + view.y + this.curve[0].y)
        c.moveTo(this.curve[0].x, this.curve[0].y)
        for(let i in this.curve){
            c.lineTo(this.curve[i][0], this.curve[i][1])
        }
        c.stroke()
    }
    calc() {
        let unitSize = Graph.unitSize()
        this.curve = []
        for (let i = -view.zeroX - view.resolution; i < (view.width - view.zeroX) + view.resolution + view.resolution; i += view.resolution) {
            let y = -this.getY(i * unitSize) / unitSize - view.zeroY
            this.curve.push({ x: i + view.zeroX, y })
        }
        let lines = []
        for (let i = 1; i < this.curve.length - 1; i++) {
            if ((this.curve[i].y <= 0 || this.curve[i - 1].y <= 0) && (this.curve[i].y > -view.height || this.curve[i - 1].y > -view.height)
            ||(this.curve[i].y <= 0 || this.curve[i + 1].y <= 0) && (this.curve[i].y > -view.height || this.curve[i + 1].y > -view.height))
                lines.push([view.x + this.curve[i].x, view.height + view.y + this.curve[i].y])
        }

        this.curve = lines
    }
    selfVerification() {
        if (this.variables.length != functions[this.type].args.length) {
            return false
        }
        return true
    }
    static remove(name) {
        delete graphs[name]
        main()
    }
    static create(name = "myGraph", type = "power", variables = [], color = "red") {
        graphs[name] = new Graph(type, variables, color)
    }
    static unitSize() {
        return view.scaleValue / view.scaleSize
    }
    static drawTable() {
        c.fillStyle = colors.background
        c.fillRect(view.x, view.y, view.width + view.lineThickness, view.height + view.lineThickness)
        c.fillStyle = colors.originLine
        c.fillRect(view.x + view.zeroX - 1, view.y, 1, view.height)
        c.fillRect(view.x, view.y + view.height - view.zeroY - 1, view.width, 1)
        c.fillStyle = colors.scaleLines
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
                let tempPoint = { x: point.x, y: (view.height - point.y) * -1 }
                let dist = distance(tempPoint, graphs[i].curve[j]).c
                if (dist < closest.distance) {
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
    constructor(graphData) {
        this.color = graphs[graphData.graphIdx].data.color
        this.point = {
            x: graphs[graphData.graphIdx].curve[graphData.graphVert].x,
            y: view.height + graphs[graphData.graphIdx].curve[graphData.graphVert].y,
        }
    }
}

class Variable {
    constructor(name = "", defaultValue = 0) {
        this.name = name
        if (typeof defaultValue == "number") {
            this.defaultValue = defaultValue
        } else {
            throw "default vaule is not a number: name = " + name + ", value = " + defaultValue
        }
    }
    static createFromObj(obj = {}) {
        let arr = []
        for (let i in obj) {
            arr.push(new Variable(i, obj[i]))
        }
        return arr
    }
}