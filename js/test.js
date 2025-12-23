const canvas = document.getElementById('canvas');

const pe = PirateEngine(canvas);
const map = pe.createMap(0, 0, window.innerWidth, window.innerHeight, 'test', 50, [], '#000');


function player_func(map, i) {
    let key = pe.getLastKey();
    if (key === 1) {
        map[i].y--;
    } else if (key === 2) {
        map[i].y++;
    } else if (key === 3) {
        map[i].x--;
    } else if (key === 4) {
        map[i].x++;
    }
}

map.map.push(pe.createTile(5, 5, 'player', player_func, null, false, 'P', '#fff', '#000'));

window.addEventListener('resize', () => {
    map.w = window.innerWidth;
    map.h = window.innerHeight;
    pe.syncData();
});

pe.loadMap(map);
pe.startGame();
