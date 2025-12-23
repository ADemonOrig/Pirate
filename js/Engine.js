function PirateEngine(canvas) {
    const engine = {
        game: false,
        map: null,
        moves: [],
        canvas: null,
        ctx: null,
        keys: [],
        setting: { swipeOnRelease: false },

// ===================================================================================================================================================================================================================
        addKey(dir) {
            this.keys.push(dir);
        },

        getLastKey() {
            return this.keys.shift() || null;
        },

// ===================================================================================================================================================================================================================
        createTile(x = 0, y = 0, tag = 'null', logic = (map, i) => {}, value = null, img = false, label = '', bg = '#000', color = '#fff') {
            return { x, y, tag, logic, value, img, label, bg, color };
        },

        createMap(x = 0, y = 0, w = 300, h = 500, name = 'null', tileSize = 50, map = [], bg = '#000') {
            return { x, y, w, h, size: tileSize, name, map, bg };
        },

// ===================================================================================================================================================================================================================
        initControls(minDistance = 50) {
            if (!this.canvas) return;
            let startX = 0;
            let startY = 0;
            let endX = 0;
            let endY = 0;
            let active = false;

            const handleDirection = dir => this.addKey(dir);

            this.canvas.addEventListener("touchstart", e => {
                const t = e.touches[0];
                startX = t.clientX;
                startY = t.clientY;
                endX = startX;
                endY = startY;
                active = true;
            }, { passive: true });

            this.canvas.addEventListener("touchmove", e => {
                if (!active) return;
                const t = e.touches[0];
                endX = t.clientX;
                endY = t.clientY;
            }, { passive: true });

            this.canvas.addEventListener("touchend", () => {
                if (!active) return;
                const dx = endX - startX;
                const dy = endY - startY;

                if (Math.abs(dx) >= minDistance || Math.abs(dy) >= minDistance) {
                    if (Math.abs(dx) > Math.abs(dy)) {
                        handleDirection(dx > 0 ? 4 : 3);
                    } else {
                        handleDirection(dy > 0 ? 2 : 1);
                    }
                }
                active = false;
            });

            this.canvas.addEventListener("touchcancel", () => {
                active = false;
            });

            this.canvas.addEventListener("mousedown", e => {
                startX = e.clientX;
                startY = e.clientY;
                endX = startX;
                endY = startY;
                active = true;
            });

            this.canvas.addEventListener("mousemove", e => {
                if (!active) return;
                endX = e.clientX;
                endY = e.clientY;
            });

            this.canvas.addEventListener("mouseup", () => {
                if (!active) return;
                const dx = endX - startX;
                const dy = endY - startY;

                if (Math.abs(dx) >= minDistance || Math.abs(dy) >= minDistance) {
                    if (Math.abs(dx) > Math.abs(dy)) {
                        handleDirection(dx > 0 ? 4 : 3);
                    } else {
                        handleDirection(dy > 0 ? 2 : 1);
                    }
                }

                active = false;
            });

            this.canvas.addEventListener("mouseleave", () => {
                active = false;
            });

            document.addEventListener("keydown", e => {
                const keyMap = {
                    ArrowUp: 1,
                    ArrowDown: 2,
                    ArrowLeft: 3,
                    ArrowRight: 4,
                    w: 1, s: 2, a: 3, d: 4,
                    W: 1, S: 2, A: 3, D: 4
                };
                if (keyMap[e.key]) handleDirection(keyMap[e.key]);
            });
        },

        initCanvas(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
        },

// ===================================================================================================================================================================================================================
        update() {
            if (!this.map) return;
            for (let i = 0; i < this.map.map.length; i++) {
                this.map.map[i].logic(this.map.map, i);
            }
        },

        render() {
            if (!this.map || !this.ctx) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (let i = 0; i < this.map.map.length; i++) {
                const tile = this.map.map[i];

                if (!tile.img) {
                    this.ctx.fillStyle = tile.bg;
                    this.ctx.fillRect(tile.x * this.map.size, tile.y * this.map.size, this.map.size, this.map.size);
                    let fontSize = this.map.size * 0.5;
                    this.ctx.font = fontSize + 'px Arial';
                    const maxWidth = this.map.size * 0.9;
                    while (this.ctx.measureText(tile.label).width > maxWidth && fontSize > 5) {
                        fontSize -= 1;
                        this.ctx.font = fontSize + 'px Arial';
                    }
                    this.ctx.fillStyle = tile.color;
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    const centerX = tile.x * this.map.size + this.map.size / 2;
                    const centerY = tile.y * this.map.size + this.map.size / 2;
                    this.ctx.fillText(tile.label, centerX, centerY);
                } else {
                    const pattern = this.ctx.createPattern(tile.img, 'repeat');
                    this.ctx.fillStyle = pattern;
                    this.ctx.fillRect(tile.x * this.map.size, tile.y * this.map.size, this.map.size, this.map.size);
                }
            }
        },

// ===================================================================================================================================================================================================================
        loadMap(map) {
            this.map = map;
            this.syncData();
        },

        syncData() {
            if (!this.canvas || !this.map) return;
            this.canvas.style.background = this.map.bg;
            this.canvas.width = this.map.w;
            this.canvas.height = this.map.h;
            this.canvas.style.top = this.map.y + 'px';
            this.canvas.style.left = this.map.x + 'px';
        },

// ===================================================================================================================================================================================================================
        initGame(canvas, map) {
            this.initCanvas(canvas);
            this.loadMap(map);
        },

        startGame(minDisSwipe = 50) {
            this.game = true;
            this.initControls(minDisSwipe);
            this.gameLoop();
        },

        gameLoop() {
            if (!this.game) return;
            this.update();
            this.render();
            requestAnimationFrame(() => this.gameLoop());
        }
    };
    engine.initCanvas(canvas);
    return engine;
}

// ===================================================================================================================================================================================================================
window.PirateEngine = PirateEngine;
