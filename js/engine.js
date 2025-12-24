class Tile {
    constructor(x=0, y=0, tag=1, logic=()=>{}, draw=()=>{}, value=null) {
        this.x = x;
        this.y = y;
        this.tag = tag;
        this.logic = logic;
        this.draw = draw;
        this.value = value;
    }

    load(x=0, y=0, tag=1, logic=()=>{}, draw=()=>{}, value=null) {
        this.x = x;
        this.y = y;
        this.tag = tag;
        this.logic = logic;
        this.draw = draw;
        this.value = value;
    }
};


class Map {
    constructor(map=[new Tile()], value=null) {
        this.map = map;
        this.value = value;
    }

    load(map=[new Tile()], value=null) {
        this.map = map;
        this.value = value;
    }

    loadMap(map=[new Tile()]) {
        this.map = map;
    }

    loadValue(value=null) {
        this.value = value;
    }

    pushTile(tile=new Tile()) {
        this.map.push(tile);
    }
};


class World {
    constructor(maps=[new Map()]) {
        this.maps = maps;
    }

    load(maps=[new Map()]) {
        this.maps = maps;
    }

    pushMap(map=new Map()) {
        this.maps.push(map);
    }
}


class Engine {
    constructor(canvas, world=new World(), subLogic=()=>{}, subRender=()=>{}, keys=[]) {
        this.game = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.wld = world;
        this.subRender = subRender;
        this.subUpdate = subLogic;
        this.keys = keys;
    }

    load(canvas, world=new World(), subLogic=()=>{}, subRender=()=>{}, keys=[]) {
        this.game = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.wld = world;
        this.subRender = subRender;
        this.subUpdate = subLogic;
        this.keys = keys;
    }

    loadCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    loadWorld(world=new World()) {
        this.wld = world;
    }

    loadSubRender(subRender=()=>{}) {
        this.subRender = subRender;
    }

    loadLogic(subLogic=()=>{}) {
        this.subUpdate = subLogic;
    }

    pushKey(type=0, dir=0, x=null, y=null) {
        this.keys.push({type, dir, x, y});
    }

    lastKey() {
        return this.keys[0] ?? {type: 0, dir: 0, x: null, y: null};
    }

    popKey() {
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
                this.pushKey(1, 0, startX, startY);
            } else {
                let dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 4 : 3) : (dy > 0 ? 2 : 1);
                this.pushKey(2, dir, null, null);
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
            if (keyMap[e.key]) this.pushKey(3, keyMap[e.key], null, null);
        });
    }

    update(mapNum) {
        for (let i = 0; i < this.wld.maps[mapNum].map.length; i++) {
            this.wld.maps[mapNum].map[i].logic(this.wld.maps[mapNum].map[i], this.wld.maps[mapNum].map, i);
        }
    }

    render(mapNum) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.wld.maps[mapNum].map.length; i++) {
            this.wld.maps[mapNum].map[i].draw(this.wld.maps[mapNum].map[i], this.canvas, this.ctx);
        }
    }

    loop(mapNum) {
        if (!this.game) return;
        this.subUpdate(this.wld, mapNum);
        this.update(mapNum);
        this.subRender(this.wld, mapNum);
        this.render(mapNum);
        requestAnimationFrame(() => this.loop(mapNum));
    }

    prestart() {

    }

    start(mapNum) {
        this.game = true;
        this.prestart();
        this.loop(mapNum);
    }

    stop() {
        this.game = false;
    }
}

window.Tile = Tile;
window.Map = Map;
window.World = World;
window.Engine = Engine;
