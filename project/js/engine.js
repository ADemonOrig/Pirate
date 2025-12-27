class Object {
    constructor(id=1, logic=()=>{}, draw=()=>{}, proms=null) {
        this.x = 0;
        this.y = 0;
        this.id = id;
        this.logic = logic;
        this.draw = draw;
        this.proms = proms;
    }

    load(id=1, logic=()=>{}, draw=()=>{}, proms=null) {
        this.x = 0;
        this.y = 0;
        this.id = id;
        this.logic = logic;
        this.draw = draw;
        this.proms = proms;
    }
};


class Map {
    constructor(map=[new Object()], proms=null) {
        this.map = map;
        this.proms = proms;
    }

    load(map=[new Object()], proms=null) {
        this.map = map;
        this.proms = proms;
    }

    loadMap(map=[new Object()]) {
        this.map = map;
    }

    loadValue(proms=null) {
        this.proms = proms;
    }

    loadObject(Object=new Object(), x=0, y=0) {
        Object.x = x;
        Object.y = y;
        this.map.push(Object);
    }
};


class Engine {
    constructor(canvas, map=new Map(), subLogic=()=>{}, subRender=()=>{}, setting={}, keys=[]) {
        this.game = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.map = map;
        this.subRender = subRender;
        this.subUpdate = subLogic;
        this.keys = keys;
        this.setting = setting;
    }

    load(canvas, map=new Map(), subLogic=()=>{}, subRender=()=>{}, setting={}, keys=[]) {
        this.game = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.map = map;
        this.subRender = subRender;
        this.subUpdate = subLogic;
        this.keys = keys;
        this.setting = setting;
    }

    loadValue(setting=null) {
        this.setting = setting;
    }

    loadCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    loadMap(map=new Map()) {
        this.map = map;
    }

    loadSubRender(subRender=()=>{}) {
        this.subRender = subRender;
    }

    loadLogic(subLogic=()=>{}) {
        this.subUpdate = subLogic;
    }

    loadKey(type=0, dir=0, x=null, y=null) {
        this.keys.push({type, dir, x, y});
    }

    getKey() {
        return this.keys[0] ?? {type: 0, dir: 0, x: null, y: null};
    }

    delKey() {
        this.keys.shift();
    }

    initControls(minDistance = 50) {
        if (!this.canvas) return;
        this.canvas.tabIndex = 0;
        this.canvas.focus();
        let startX = 0, startY = 0, endX = 0, endY = 0;
        let active = false;

        const processEnd = () => {
            const dx = endX - startX;
            const dy = endY - startY;

            if (Math.abs(dx) < minDistance && Math.abs(dy) < minDistance) {
                this.loadKey(1, 0, startX, startY);
            } else {
                let dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 4 : 3) : (dy > 0 ? 2 : 1);
                this.loadKey(2, dir, null, null);
            }
            active = false;
        };

        this.canvas.addEventListener("touchstart", e => {
            const t = e.touches[0];
            startX = endX = t.clientX;
            startY = endY = t.clientY;
            active = true;
        }, { passive: true });

        this.canvas.addEventListener("touchmove", e => {
            if (!active) return;
            const t = e.touches[0];
            endX = t.clientX;
            endY = t.clientY;
        }, { passive: true });

        this.canvas.addEventListener("touchend", processEnd);
        this.canvas.addEventListener("touchcancel", () => active = false);

        this.canvas.addEventListener("mousedown", e => {
            startX = endX = e.clientX;
            startY = endY = e.clientY;
            active = true;
        });

        this.canvas.addEventListener("mousemove", e => {
            if (!active) return;
            endX = e.clientX;
            endY = e.clientY;
        });

        this.canvas.addEventListener("mouseup", processEnd);
        this.canvas.addEventListener("mouseleave", () => active = false);

        this.canvas.addEventListener("keydown", e => {
            const keyMap = {
                ArrowUp: 1, ArrowDown: 2, ArrowLeft: 3, ArrowRight: 4,
                w: 1, s: 2, a: 3, d: 4,
                W: 1, S: 2, A: 3, D: 4
            };
            if (keyMap[e.key]) this.loadKey(3, keyMap[e.key], null, null);
        });
    }

    update() {
        for (let i = 0; i < this.map.map.length; i++) {
            this.map.map[i].logic(this.map.map[i], this.map.map, i);
        }
        this.delKey();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.map.map.length; i++) {
            this.map.map[i].draw(this.map.map[i], this.canvas, this.ctx);
        }
    }

    loop() {
        if (!this.game) return;
        this.subUpdate(this);
        this.update();
        this.subRender(this);
        this.render();
        requestAnimationFrame(() => this.loop());
    }

    prestart() {

    }

    start() {
        this.game = true;
        this.prestart();
        this.initControls();
        this.loop();
    }

    stop() {
        this.game = false;
    }
}

window.Object = Object;
window.Map = Map;
window.Engine = Engine;
