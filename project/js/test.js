const canvas = document.getElementById('canvas');
const engine = new Engine(canvas);
const map = new Map();
engine.loadValue({
    t: 0
});

const youpng = new Image();
const rockpng = new Image();


function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();


function you_func(obj, map, i) {
    const dir = engine.getKey().dir;
    let [nx, ny, moved] = [0, 0, 0];

    function move(target, x=0, y=0) {
        let i = 0;
        for (const left of map) {
            if (left.x === target.x+x && left.y === target.y+y) {
                if (left.id === 'floor' || left.id === 'null') {
                    target.x += x;
                    target.y += y;
                    return [x, y, 1];
                } else if (left.id === 'wall' || left.id === 'end') {
                    return [0, 0, 0];
                } else if (left.id === 'push') {
                    [nx, ny, moved] = move(left, x, y);
                    if (moved) {
                        target.x += x;
                        target.y += y;
                        return [x, y, 1];
                    } else {
                        return [0, 0, 0];
                    }
                } else {
                    target.x += x;
                    target.y += y;
                    return [x, y, 1];
                }
            }
            i++;
        }
        target.x += x;
        target.y += y;
        return [x, y, 1];
    }

    if (dir === 1) {
        move(obj, 0, -1);
        obj.proms.n = 1;
        obj.proms.as = !obj.proms.as;
    } else if (dir === 2) {
        move(obj, 0, 1);
        obj.proms.n = 2;
        obj.proms.as = !obj.proms.as;
    } else if (dir === 3) {
        move(obj, -1, 0);
        obj.proms.n = 3;
        obj.proms.as = !obj.proms.as;
    } else if (dir === 4) {
        move(obj, 1, 0);
        obj.proms.n = 4;
        obj.proms.as = !obj.proms.as;
    }
}


function you_render(obj, canvas, ctx) {
    ctx.save();
    youpng.src = '../assets/sprites/you-4-1-1.png';

    if (obj.proms.n === 3 && obj.proms.as == 0 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-4-1-1.png';
    } else if (obj.proms.n === 3 && obj.proms.as == 1 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-4-1-2.png';
    } else if (obj.proms.n === 3 && obj.proms.as == 0 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-4-2-1.png';
    } else if (obj.proms.n === 3 && obj.proms.as == 1 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-4-2-2.png';
    }

    else if (obj.proms.n === 4 && obj.proms.as == 0 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-4-1-1.png';
        ctx.translate(obj.x*obj.proms.s, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(obj.proms.s*(obj.x+1)), 0);
    } else if (obj.proms.n === 4 && obj.proms.as == 1 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-4-1-2.png';
        ctx.translate(obj.x*obj.proms.s, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(obj.proms.s*(obj.x+1)), 0);
    } else if (obj.proms.n === 4 && obj.proms.as == 0 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-4-2-1.png';
        ctx.translate(obj.x*obj.proms.s, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(obj.proms.s*(obj.x+1)), 0);
    } else if (obj.proms.n === 4 && obj.proms.as == 1 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-4-2-2.png';
        ctx.translate(obj.x*obj.proms.s, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(obj.proms.s*(obj.x+1)), 0);
    }

    else if (obj.proms.n === 1 && obj.proms.as == 0 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-1-1-1.png';
    } else if (obj.proms.n === 1 && obj.proms.as == 1 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-1-1-2.png';
    } else if (obj.proms.n === 1 && obj.proms.as == 0 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-1-2-1.png';
    } else if (obj.proms.n === 1 && obj.proms.as == 1 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-1-2-2.png';
    }

    else if (obj.proms.n === 2 && obj.proms.as == 0 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-3-1-1.png';
    } else if (obj.proms.n === 2 && obj.proms.as == 1 && engine.setting.t == 0) {
        youpng.src = '../assets/sprites/you-3-1-2.png';
    } else if (obj.proms.n === 2 && obj.proms.as == 0 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-3-2-1.png';
    } else if (obj.proms.n === 2 && obj.proms.as == 1 && engine.setting.t == 1) {
        youpng.src = '../assets/sprites/you-3-2-2.png';
    }

    ctx.drawImage(youpng, obj.x*obj.proms.s, obj.y*obj.proms.s, obj.proms.s, obj.proms.s);
    ctx.restore();
}


function rock_render(obj, canvas, ctx) {
    rockpng.src = '../assets/sprites/rock-1.png';
    ctx.save();

    if (engine.setting.t == 0) {
        rockpng.src = '../assets/sprites/rock-1.png';
    } else if (engine.setting.t == 1) {
        rockpng.src = '../assets/sprites/rock-2.png';
    }

    ctx.drawImage(rockpng, obj.x*obj.proms.s, obj.y*obj.proms.s, obj.proms.s, obj.proms.s);
    ctx.restore();
}


const you = new Object(
    'null', you_func, you_render, {
        s: 32,
        at: 1000,
        as: 0,
        n: 0
    }
);

const rock = new Object(
    'push', ()=>{}, rock_render, {
        s: 32
    }
);

const rock1 = new Object(
    'push', ()=>{}, rock_render, {
        s: 32
    }
);

map.loadObject(you, 1, 1);
map.loadObject(rock, 2, 2);
map.loadObject(rock1, 3, 3);
engine.loadMap(map);
engine.start();

setInterval(() => {
    engine.setting.t = !engine.setting.t;
}, 500);
