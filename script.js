window.onload = function() {
    fetch('./assetData.json').then( response => {
        return response.json();
    }).then(data => {
        const app = new App(window.innerWidth, window.innerHeight);
        const tile = new Image();
        tile.src = 'tile.png';
        tile.onload = function() {
            app.loadAsset(tile, data);
            app.write('my name is abhishek', 50, 100);
            app.write('This page is built', 80, 160)
            app.write('using canvas only', 70, 220);
            app.render();
        }
    });
}

class App {
    width;
    height;
    canvas;
    context;
    assets;
    cursor;
    renderStack;

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.assets = {};
        this.cursor = {x: 0, y: 0};
        this.renderStack = [];
        this.init();
    }

    init() {
        document.body.appendChild(this.canvas);
        this.setup();
        this.initEvents();
    }
    
    setup() {        
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initEvents() {
        const self = this;
        window.onresize = function() {
            self.width = window.innerWidth;
            self.height = window.innerHeight;
            self.setup();
            self.render();
        }
    }

    loadAsset(tile, data) {
        data.assets.forEach(element => {
            this.assets[element.name] = new Asset(tile, element.dimension, this.context);
        });

    }

    write(text, x, y) {
        if(typeof x !== 'undefined') this.cursor.x = x;
        if(typeof y !== 'undefined') this.cursor.y = y;
        
        [...text.toUpperCase()].forEach( char => {
            let sprite = this.assets[char].clone();
            sprite.place(this.cursor.x, this.cursor.y);
            this.cursor.x = sprite.getBoundry().x;
            this.renderStack.push(sprite);
        });
    }

    render() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.renderStack.forEach(elem => {
            elem.draw();
        });
    }
}

class Asset {
    w;
    h;
    x;
    y;
    s;
    posX;
    posY;
    tile;
    context;

    constructor(tile, data, context) {
        this.w = data.w;
        this.h = data.h;
        this.x = data.x;
        this.y = data.y;
        this.s = data.s;
        this.tile = tile;
        this.context = context;
    }

    place(x, y) {
        this.posX = x;
        this.posY = y;
    }

    draw() {
        this.context.drawImage(
            this.tile,
            this.x,
            this.y,
            this.w,
            this.h,
            this.posX,
            this.posY,
            this.w * this.s,
            this.h * this.s
        );
    }

    getBoundry() {
        return { x: this.posX + (this.w * this.s), y: this.posY + (this.h * this.s)};
    }

    clone() {
        return new Asset(this.tile, this, this.context);
    }
}