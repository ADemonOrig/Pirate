const canvas = document.getElementById('canvas');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const engine = new Engine(canvas);
const wld = new World();
const map = new Map();


function you_func(tile, map, i) {
    const dir = engine.lastKey().dir;
    if (dir === 1) tile.y--;
    else if (dir === 2) tile.y++;
    else if (dir === 3) tile.x--;
    else if (dir === 4) tile.x++;
    engine.popKey();
}

function you_render(tile, canvas, ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(tile.x*50, tile.y*50, 50, 50);
}

const you = new Tile(
    5, 5, 'you', you_func, you_render
);

map.pushTile(you);
wld.pushMap(map);
engine.loadWorld(wld);
engine.initControls();
engine.start(1);
