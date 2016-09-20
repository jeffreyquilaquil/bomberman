///<reference path='../lib/phaser.comments.d.ts'/>
var Bomberman = (function () {
    function Bomberman() {
        //
        this.DIRECTION_N = "n";
        this.DIRECTION_S = "s";
        this.DIRECTION_E = "e";
        this.DIRECTION_W = "w";
        this.DIRECTION_SE = "se";
        this.DIRECTION_SW = "sw";
        this.DIRECTION_NW = "nw";
        this.DIRECTION_NE = "ne";
        //
        this.KEY_TILEMAP = 'tilemap';
        this.KEY_TILESET = 'bomberman_spritesheet';
        this.KEY_SPRITESHEET = "spritesheet-main";
        //
        this.KEY_TILED_BLOCK = 45;
        this.KEY_TILED_BRICK = 46;
        //
        this.COLOR_GROUND = '#008000';
        //
        this.spritesData = [
            {
                name: 'man',
                frame: 1,
                animations: [
                    {
                        name: this.DIRECTION_S,
                        frames: [0, 1, 2]
                    },
                    {
                        name: this.DIRECTION_E,
                        frames: [4, 5, 6]
                    },
                    {
                        name: this.DIRECTION_N,
                        frames: [8, 9, 10]
                    },
                    {
                        name: this.DIRECTION_W,
                        frames: [12, 13, 14]
                    },
                    {
                        name: 'destroy',
                        frames: [16, 17, 18, 20, 21, 22, 23, 3]
                    }
                ]
            },
            {
                name: 'enemy',
                frame: 24,
                animations: [
                    {
                        name: this.DIRECTION_W,
                        frames: [24, 25, 26]
                    },
                    {
                        name: this.DIRECTION_E,
                        frames: [28, 29, 30]
                    },
                    {
                        name: 'destroy',
                        frames: [32, 33, 34, 36, 37]
                    }
                ]
            },
            {
                name: 'bomb',
                frame: 40,
                animations: [
                    {
                        name: 'default',
                        frames: [40, 41, 42]
                    }
                ]
            },
            {
                name: 'explosion-top',
                frame: 56,
                animations: [
                    {
                        name: 'default',
                        frames: [56, 57, 58, 57, 56, 3]
                    }
                ]
            },
            {
                name: 'explosion-bottom',
                frame: 60,
                animations: [
                    {
                        name: 'default',
                        frames: [60, 61, 62, 61, 60, 3]
                    }
                ]
            },
            {
                name: 'explosion-left',
                frame: 64,
                animations: [
                    {
                        name: 'default',
                        frames: [64, 65, 66, 65, 64, 3]
                    }
                ]
            },
            {
                name: 'explosion-right',
                frame: 68,
                animations: [
                    {
                        name: 'default',
                        frames: [68, 69, 70, 69, 68, 3]
                    }
                ]
            },
            {
                name: 'explosion-center',
                frame: 72,
                animations: [
                    {
                        name: 'default',
                        frames: [72, 73, 74, 73, 72, 3]
                    }
                ]
            },
            {
                name: 'brick',
                frame: 45,
                animations: [
                    {
                        name: 'destroy',
                        frames: [48, 49, 50, 51, 52, 53, 54]
                    }
                ]
            },
            {
                name: 'button',
                frame: 46
            }
        ];
        //
        this.tileSize = 16;
        this.tileCount = 19;
        this.tileCountWidth = 21;
        this.tileCountHeight = 11;
        this.bombJustDeployed = false;
        this.isManDead = false;
        //
        this.phGame = new Phaser.Game(this.tileSize * this.tileCountWidth, this.tileSize * this.tileCountHeight, Phaser.AUTO, document.getElementById('container'), this, false, false);
        console.log("dasd");
    }
    //PHASER main state functions ---------------------------------------------------------------------------
    Bomberman.prototype.preload = function () {
        console.log('state preload');
        //load tilemap
        this.phGame.load.tilemap(this.KEY_TILEMAP, './assets/tilemap.json?date=' + new Date(), null, Phaser.Tilemap.TILED_JSON);
        //load spritesheets
        this.phGame.load.spritesheet(this.KEY_SPRITESHEET, './assets/bomberman_spritesheet.png', 16, 16, 4 * 21, 0, 1);
    };
    Bomberman.prototype.create = function () {
        console.log('state create');
        //
        this.phGame.stage.backgroundColor = this.COLOR_GROUND;
        //
        this.phGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        Phaser.Canvas.setImageRenderingCrisp(this.phGame.canvas);
        //
        this.initTilemap();
        //
        this.initGame();
        //
        this.createRandomEnemies();
    };
    Bomberman.prototype.update = function () {
        //if man is dead
        if (this.isManDead == false) {
            //
            this.checkKeyboardInput();
            //
            this.updateManMovement();
        }
        //man vs tiles, bomb
        this.phGame.physics.arcade.collide(this.phSpriteMan, [this.phLayerBase, this.phLayerLevel, this.phBombGroup]);
        //man vs explosion
        this.phGame.physics.arcade.collide(this.phSpriteMan, this.phExplosionGroup, function () {
            this.isManDead = true;
            this.phSpriteMan.body.velocity.set(0, 0);
            this.phSpriteMan.animations.play('destroy', 8, false, true);
        }, null, this);
        //enemy vs tiles, bomb
        this.phGame.physics.arcade.collide(this.phEnemyGroup, [this.phLayerBase, this.phLayerLevel, this.phBombGroup], function (object1, object2) {
            this.setRandomEnemyMovement(object1);
        }, null, this);
        //enemy vs explosion
        this.phGame.physics.arcade.collide(this.phEnemyGroup, this.phExplosionGroup, function (object1, object2) {
            var enemy = object1;
            enemy.body.velocity.set(0, 0);
            enemy.animations.play('destroy', 8, false, true);
        }, null, this);
        //explosion vs bricks
        this.phGame.physics.arcade.overlap(this.phExplosionGroup, this.phLayerLevel, function (object1, object2) {
            if (this.isBrick(object2)) {
                //create brick sprite
                var brick = this.createSprite('brick');
                this.positionSpriteAtTile(brick, object2.x, object2.y, true);
                brick.animations.play('destroy', 20, false, true);
                //remove collided tile
                this.phMap.removeTile(object2.x, object2.y, this.phLayerLevel);
            }
        }, null, this);
        //man vs enemy
        this.phGame.physics.arcade.collide(this.phSpriteMan, this.phEnemyGroup, function () {
            //do nothing
        }, function () {
            this.isManDead = true;
            this.phSpriteMan.body.velocity.set(0, 0);
            this.phSpriteMan.animations.play('destroy', 8, false, true);
            return false;
        }, this);
    };
    Bomberman.prototype.render = function () {
        //this.phGame.debug.body(this.phSpriteMan);
        //this.phGame.debug.pointer(this.phGame.input.mousePointer);
    };
    //INITS -------------------------------------------------------------------------------
    Bomberman.prototype.initGame = function () {
        //tiles physics
        this.phMap.setCollision(this.KEY_TILED_BLOCK, true, this.phLayerBase);
        this.phMap.setCollision(this.KEY_TILED_BRICK, true, this.phLayerLevel);
        //this.phLayerBase.debug=true;
        //
        this.phEnemyGroup = this.phGame.add.group();
        this.phEnemyGroup.enableBody = true;
        //
        this.phBombGroup = this.phGame.add.group();
        this.phBombGroup.enableBody = true;
        //
        this.phExplosionGroup = this.phGame.add.group();
        this.phExplosionGroup.enableBody = true;
        //
        this.phSpriteMan = this.createSprite('man');
        this.phSpriteMan.crop(new Phaser.Rectangle(2, 0, 12, 16), false);
        this.positionSpriteAtTile(this.phSpriteMan, 1, 1);
        this.phGame.physics.enable(this.phSpriteMan);
        //init vars
        this.keySequence = new Phaser.ArraySet([]);
    };
    Bomberman.prototype.initTilemap = function () {
        //create the tilemap
        this.phMap = this.phGame.add.tilemap(this.KEY_TILEMAP, this.tileSize, this.tileSize);
        this.phMap.addTilesetImage(this.KEY_TILESET, this.KEY_SPRITESHEET);
        //create the map layers
        this.phLayerBase = this.phMap.createLayer('base');
        this.phLayerLevel = this.phMap.createLayer('level_1');
    };
    //FUNCTIONS ---------------------------------------------------------------------------
    Bomberman.prototype.checkKeyboardInput = function () {
        //north
        if (this.phGame.input.keyboard.isDown(Phaser.KeyCode.W)) {
            this.keySequence.add(this.DIRECTION_N);
        }
        else {
            this.keySequence.remove(this.DIRECTION_N);
        }
        //south
        if (this.phGame.input.keyboard.isDown(Phaser.KeyCode.S)) {
            this.keySequence.add(this.DIRECTION_S);
        }
        else {
            this.keySequence.remove(this.DIRECTION_S);
        }
        //east
        if (this.phGame.input.keyboard.isDown(Phaser.KeyCode.D)) {
            this.keySequence.add(this.DIRECTION_E);
        }
        else {
            this.keySequence.remove(this.DIRECTION_E);
        }
        //west
        if (this.phGame.input.keyboard.isDown(Phaser.KeyCode.A)) {
            this.keySequence.add(this.DIRECTION_W);
        }
        else {
            this.keySequence.remove(this.DIRECTION_W);
        }
        //bomb
        if (this.phGame.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)) {
            if (this.bombJustDeployed == false) {
                this.deployBomb();
                this.bombJustDeployed = true;
            }
        }
        else {
            this.bombJustDeployed = false;
        }
        //console.log(this.keySequence.list);
        //console.log(this.bombJustDeployed);
    };
    Bomberman.prototype.createExplosion = function (x, y) {
        //
        var tileCenter = this.phMap.getTileWorldXY(x, y, this.tileSize, this.tileSize, this.phLayerBase);
        var tileTop = this.phMap.getTile(tileCenter.x, tileCenter.y - 1, this.phLayerBase);
        var tileBottom = this.phMap.getTile(tileCenter.x, tileCenter.y + 1, this.phLayerBase);
        var tileLeft = this.phMap.getTile(tileCenter.x - 1, tileCenter.y, this.phLayerBase);
        var tileRight = this.phMap.getTile(tileCenter.x + 1, tileCenter.y, this.phLayerBase);
        //center
        this.createExplosionChildren('explosion-center', tileCenter.x, tileCenter.y);
        //
        if (this.isBlock(tileTop) == false) {
            this.createExplosionChildren('explosion-top', tileTop.x, tileTop.y);
        }
        //
        if (this.isBlock(tileBottom) == false) {
            this.createExplosionChildren('explosion-bottom', tileBottom.x, tileBottom.y);
        }
        //
        if (this.isBlock(tileLeft) == false) {
            this.createExplosionChildren('explosion-left', tileLeft.x, tileLeft.y);
        }
        //
        if (this.isBlock(tileRight) == false) {
            this.createExplosionChildren('explosion-right', tileRight.x, tileRight.y);
        }
    };
    Bomberman.prototype.createExplosionChildren = function (name, xInTiles, yInTiles) {
        var explosion = this.createSprite(name);
        //
        this.phExplosionGroup.add(explosion);
        explosion.body.immovable = true;
        //
        this.positionSpriteAtTile(explosion, xInTiles, yInTiles, true);
        explosion.animations.play('default', 15, false, true);
        //
        return explosion;
    };
    Bomberman.prototype.createRandomEnemies = function () {
        for (var i = 0; i < 10; i++) {
            var enemy = this.createSprite('enemy', '_' + i);
            this.phEnemyGroup.add(enemy);
            //position randomly			
            while (this.positionSpriteAtTile(enemy, Math.floor(Math.random() * this.tileCountWidth), Math.floor(Math.random() * this.tileCountHeight)) == false)
                ;
            //set initial movement
            this.setRandomEnemyMovement(enemy);
        }
    };
    Bomberman.prototype.createSprite = function (name, nameSuffix) {
        if (nameSuffix === void 0) { nameSuffix = ""; }
        //get the data object
        var data;
        for (var i = 0; i < this.spritesData.length; i++) {
            if (this.spritesData[i].name == name) {
                data = this.spritesData[i];
                break;
            }
        }
        if (data == undefined)
            return null;
        //
        var sprite = this.phGame.add.sprite(0, 0, this.KEY_SPRITESHEET, data.frame);
        sprite.anchor.set(0.5);
        sprite.name = name + nameSuffix;
        //animations
        if (data.animations) {
            for (var i = 0; i < data.animations.length; i++) {
                sprite.animations.add(data.animations[i].name, data.animations[i].frames);
            }
        }
        //
        return sprite;
    };
    Bomberman.prototype.deployBomb = function () {
        //
        var tile = this.phMap.getTileWorldXY(this.phSpriteMan.position.x, this.phSpriteMan.position.y);
        var bombName = 'bomb_x_' + tile.x + '_y_' + tile.y;
        //
        //check if bomb exists
        if (this.phBombGroup.getByName(bombName) != null)
            return;
        //create bomb
        var bomb = this.createSprite('bomb');
        bomb.name = bombName;
        bomb.animations.play('default', 3, true);
        //
        this.phBombGroup.add(bomb);
        bomb.body.immovable = true;
        //
        this.positionSpriteAtTile(bomb, tile.x, tile.y);
        //start the bomb event
        this.phGame.time.events.add(3000, function () {
            this.createExplosion(bomb.x, bomb.y);
            bomb.destroy();
        }, this);
        //
        //console.log(this.phBombGroup.children.length);
    };
    Bomberman.prototype.getAngleFromDirection = function (direction) {
        switch (direction) {
            case this.DIRECTION_N:
                return 270;
            case this.DIRECTION_S:
                return 90;
            case this.DIRECTION_E:
                return 0;
            case this.DIRECTION_W:
                return 180;
        }
        if (direction == this.DIRECTION_NE ||
            direction == (this.DIRECTION_NE.charAt(1) + (this.DIRECTION_NE.charAt(0)))) {
            return 315;
        }
        if (direction == this.DIRECTION_SE ||
            direction == (this.DIRECTION_SE.charAt(1) + (this.DIRECTION_SE.charAt(0)))) {
            return 45;
        }
        if (direction == this.DIRECTION_SW ||
            direction == (this.DIRECTION_SW.charAt(1) + (this.DIRECTION_SW.charAt(0)))) {
            return 135;
        }
        if (direction == this.DIRECTION_NW ||
            direction == (this.DIRECTION_NW.charAt(1) + (this.DIRECTION_NW.charAt(0)))) {
            return 225;
        }
        return 0;
    };
    Bomberman.prototype.isBlock = function (tile) {
        if (!tile)
            return false;
        if (tile.index == this.KEY_TILED_BLOCK)
            return true;
        return false;
    };
    Bomberman.prototype.isBrick = function (tile) {
        if (!tile)
            return false;
        if (tile.index == this.KEY_TILED_BRICK)
            return true;
        return false;
    };
    Bomberman.prototype.moveSpriteBodyFromDirection = function (sprite, direction, speed) {
        if (speed === void 0) { speed = 60; }
        //get movement angle from direction
        var movementAngle = this.getAngleFromDirection(direction);
        if (direction.length == 0) {
            sprite.body.velocity.set(0, 0);
        }
        else {
            this.phGame.physics.arcade.velocityFromAngle(movementAngle, speed, sprite.body.velocity);
        }
    };
    Bomberman.prototype.positionSpriteAtTile = function (sprite, xInTiles, yInTiles, ignoreBricks) {
        if (ignoreBricks === void 0) { ignoreBricks = false; }
        //
        var phTileLayerBase = this.phMap.getTile(xInTiles, yInTiles, this.phLayerBase);
        var phTileLayerLevel = this.phMap.getTile(xInTiles, yInTiles, this.phLayerLevel);
        //
        if (this.isBlock(phTileLayerBase)) {
            return false;
        }
        else if (this.isBrick(phTileLayerLevel) && ignoreBricks == false) {
            return false;
        }
        else {
            sprite.position.set(phTileLayerBase.worldX + phTileLayerBase.centerX, phTileLayerBase.worldY + phTileLayerBase.centerY);
            return true;
        }
    };
    Bomberman.prototype.setRandomEnemyMovement = function (sprite) {
        var direction = Phaser.ArrayUtils.getRandomItem([
            this.DIRECTION_N,
            this.DIRECTION_S,
            this.DIRECTION_E,
            this.DIRECTION_W
        ]);
        this.moveSpriteBodyFromDirection(sprite, direction);
        sprite.animations.play(direction, 10, true);
    };
    Bomberman.prototype.updateManMovement = function () {
        //get direction string
        var direction = "";
        direction += (this.keySequence.list[this.keySequence.list.length - 1]) || '';
        direction += (this.keySequence.list[this.keySequence.list.length - 2]) || '';
        //
        this.moveSpriteBodyFromDirection(this.phSpriteMan, direction);
        //update sprite animation
        if (this.keySequence.list.length > 0) {
            this.phSpriteMan.animations.play(this.keySequence.list[this.keySequence.list.length - 1], 20, true);
        }
        else {
            this.phSpriteMan.animations.stop();
        }
    };
    return Bomberman;
}());
///<reference path='../lib/phaser.comments.d.ts'/>
var PhaserGameTest = (function () {
    function PhaserGameTest() {
        //1:
        //new Phaser.Game();
        //6:
        this.DIRECTION_N = "n";
        this.DIRECTION_S = "s";
        this.DIRECTION_E = "e";
        this.DIRECTION_W = "w";
        this.DIRECTION_SE = "se";
        this.DIRECTION_SW = "sw";
        this.DIRECTION_NW = "nw";
        this.DIRECTION_NE = "ne";
        this.spritesData = [
            {
                name: 'man',
                frame: 1,
                animations: [
                    {
                        name: this.DIRECTION_S,
                        frames: [0, 1, 2]
                    },
                    {
                        name: this.DIRECTION_E,
                        frames: [4, 5, 6]
                    },
                    {
                        name: this.DIRECTION_N,
                        frames: [8, 9, 10]
                    },
                    {
                        name: this.DIRECTION_W,
                        frames: [12, 13, 14]
                    },
                    {
                        name: 'destroy',
                        frames: [16, 17, 18, 20, 21, 22, 23, 3]
                    }
                ]
            },
            {
                name: 'enemy',
                frame: 24,
                animations: [
                    {
                        name: this.DIRECTION_W,
                        frames: [24, 25, 26]
                    },
                    {
                        name: this.DIRECTION_E,
                        frames: [28, 29, 30]
                    },
                    {
                        name: 'destroy',
                        frames: [32, 33, 34, 36, 37]
                    }
                ]
            },
            {
                name: 'bomb',
                frame: 40,
                animations: [
                    {
                        name: 'default',
                        frames: [40, 41, 42]
                    }
                ]
            },
            {
                name: 'explosion-top',
                frame: 56,
                animations: [
                    {
                        name: 'default',
                        frames: [56, 57, 58, 57, 56, 3]
                    }
                ]
            },
            {
                name: 'explosion-bottom',
                frame: 60,
                animations: [
                    {
                        name: 'default',
                        frames: [60, 61, 62, 61, 60, 3]
                    }
                ]
            },
            {
                name: 'explosion-left',
                frame: 64,
                animations: [
                    {
                        name: 'default',
                        frames: [64, 65, 66, 65, 64, 3]
                    }
                ]
            },
            {
                name: 'explosion-right',
                frame: 68,
                animations: [
                    {
                        name: 'default',
                        frames: [68, 69, 70, 69, 68, 3]
                    }
                ]
            },
            {
                name: 'explosion-center',
                frame: 72,
                animations: [
                    {
                        name: 'default',
                        frames: [72, 73, 74, 73, 72, 3]
                    }
                ]
            },
            {
                name: 'brick',
                frame: 45,
                animations: [
                    {
                        name: 'destroy',
                        frames: [48, 49, 50, 51, 52, 53, 54]
                    }
                ]
            },
            {
                name: 'button',
                frame: 46
            }
        ];
        //2:
        /*
        new Phaser.Game(500, 500, Phaser.AUTO, document.getElementById('container'), {
            preload:function(){
                console.log('preload state');
            },
            create:function(){
                console.log('create state');
            },
            update:function(){
                //console.log('update state');
            },
            render:function(){
                //console.log('render state');
            }
        });*/
        //3:
        /*
        var game:Phaser.Game=new Phaser.Game(300, 300, Phaser.AUTO, document.getElementById('container'), {
            preload:function(){
                game.load.image('my-image', './assets/bomberman_spritesheet.png');
            }
        });
        */
        //4:		
        /*
        var game:Phaser.Game=new Phaser.Game(336, 176, Phaser.AUTO, document.getElementById('container'), {
            preload:function(){
                //load tilemap
                game.load.tilemap('my-tilemap', './assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);

                //load image
                game.load.image('my-image', './assets/bomberman_spritesheet.png');
            },
            create:function(){
                game.stage.backgroundColor='#008000';
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                //Phaser.Canvas.setImageRenderingCrisp(game.canvas);

                //init tilemap object
                var map:Phaser.Tilemap=game.add.tilemap('my-tilemap', 16, 16);
                map.addTilesetImage('bomberman_spritesheet', 'my-image');
                map.createLayer('base');
            }
        });*/
        //5:
        /*
        var game:Phaser.Game=new Phaser.Game(336, 176, Phaser.AUTO, document.getElementById('container'), {
            preload:function(){
                //load spritesheet
                game.load.spritesheet('my-spritesheet', './assets/bomberman_spritesheet.png', 16, 16, 4 * 21, 0, 1);
            },
            create:function(){
                game.stage.backgroundColor='#008000';
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                Phaser.Canvas.setImageRenderingCrisp(game.canvas);

                //
                var man:Phaser.Sprite=game.add.sprite(50, 50, 'my-spritesheet', 0);
                man.animations.add('walking', [4, 5, 6]);
                man.animations.play('walking', 10, true);
            }
        });*/
        //6:
        /*var _this=this;
        var game:Phaser.Game=new Phaser.Game(336, 176, Phaser.AUTO, document.getElementById('container'), {
            preload:function(){
                //load spritesheet
                game.load.spritesheet('my-spritesheet', './assets/bomberman_spritesheet.png', 16, 16, 4 * 21, 0, 1);
            },
            create:function(){
                game.stage.backgroundColor='#008000';
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                Phaser.Canvas.setImageRenderingCrisp(game.canvas);

                //man
                var man1:Phaser.Sprite=_this.createSprite(game, 'man');
                var man2:Phaser.Sprite=_this.createSprite(game, 'man');
                var man3:Phaser.Sprite=_this.createSprite(game, 'man');
                var man4:Phaser.Sprite=_this.createSprite(game, 'man');
                var man5:Phaser.Sprite=_this.createSprite(game, 'man');
                man1.position.set(30, 30);
                man2.position.set(30, 60);
                man3.position.set(30, 90);
                man4.position.set(30, 120);
                man5.position.set(30, 150);
                man1.animations.play('n', 20, true);
                man2.animations.play('s', 20, true);
                man3.animations.play('e', 20, true);
                man4.animations.play('w', 20, true);
                man5.animations.play('destroy', 8, true);
                //enemy
                var enemy1:Phaser.Sprite=_this.createSprite(game, 'enemy');
                var enemy2:Phaser.Sprite=_this.createSprite(game, 'enemy');
                var enemy3:Phaser.Sprite=_this.createSprite(game, 'enemy');
                enemy1.position.set(60, 30);
                enemy2.position.set(60, 60);
                enemy3.position.set(60, 90);
                enemy1.animations.play('e', 10, true);
                enemy2.animations.play('w', 10, true);
                enemy3.animations.play('destroy', 8, true);
                //bomb
                var bomb:Phaser.Sprite=_this.createSprite(game, 'bomb');
                bomb.position.set(90, 30);
                bomb.animations.play('default', 3, true);
                //brick
                var brick:Phaser.Sprite=_this.createSprite(game, 'brick');
                brick.position.set(90, 60);
                brick.animations.play('destroy', 10, true);
                //explosion
                var explosion1:Phaser.Sprite=_this.createSprite(game, 'explosion-center');
                var explosion2:Phaser.Sprite=_this.createSprite(game, 'explosion-top');
                var explosion3:Phaser.Sprite=_this.createSprite(game, 'explosion-bottom');
                var explosion4:Phaser.Sprite=_this.createSprite(game, 'explosion-left');
                var explosion5:Phaser.Sprite=_this.createSprite(game, 'explosion-right');
                explosion1.position.set(130, 60);
                explosion2.position.set(130, 60 - 16);
                explosion3.position.set(130, 60 + 16);
                explosion4.position.set(130 - 16, 60);
                explosion5.position.set(130 + 16, 60);
                explosion1.animations.play('default', 8, true);
                explosion2.animations.play('default', 8, true);
                explosion3.animations.play('default', 8, true);
                explosion4.animations.play('default', 8, true);
                explosion5.animations.play('default', 8, true);

            }
        });*/
        //7:
        /*var _this=this;
        var man:Phaser.Sprite;
        var game:Phaser.Game=new Phaser.Game(336, 176, Phaser.AUTO, document.getElementById('container'), {
            preload:function(){
                //load tilemap
                game.load.tilemap('my-tilemap', './assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);

                //load image
                game.load.spritesheet('my-spritesheet', './assets/bomberman_spritesheet.png', 16, 16, 4 * 21, 0, 1);
            },
            create:function(){
                game.stage.backgroundColor='#008000';
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                Phaser.Canvas.setImageRenderingCrisp(game.canvas);

                //init tilemap object
                var map:Phaser.Tilemap=game.add.tilemap('my-tilemap', 16, 16);
                map.addTilesetImage('bomberman_spritesheet', 'my-spritesheet');
                map.createLayer('base');

                //init man
                man=_this.createSprite(game, 'man');
                man.position.set(24, 24);
            },
            update:function(){
                //using WSAD as arrow keys
                if( game.input.keyboard.isDown(Phaser.KeyCode.D) ){
                    man.x++;
                    man.animations.play('e', 20, true);
                }else if( game.input.keyboard.isDown(Phaser.KeyCode.A) ){
                    man.x--;
                    man.animations.play('w', 20, true);
                }else if( game.input.keyboard.isDown(Phaser.KeyCode.W) ){
                    man.y--;
                    man.animations.play('n', 20, true);
                }else if( game.input.keyboard.isDown(Phaser.KeyCode.S) ){
                    man.y++;
                    man.animations.play('s', 20, true);
                }else{
                    man.animations.stop();
                }
            }
        });*/
        //8:
        var _this = this;
        var map;
        var layer;
        var man;
        var game = new Phaser.Game(336, 176, Phaser.AUTO, document.getElementById('container'), {
            preload: function () {
                //load tilemap
                game.load.tilemap('my-tilemap', './assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
                //load image
                game.load.spritesheet('my-spritesheet', './assets/bomberman_spritesheet.png', 16, 16, 4 * 21, 0, 1);
            },
            create: function () {
                game.stage.backgroundColor = '#008000';
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                Phaser.Canvas.setImageRenderingCrisp(game.canvas);
                //init tilemap object
                map = game.add.tilemap('my-tilemap', 16, 16);
                map.addTilesetImage('bomberman_spritesheet', 'my-spritesheet');
                layer = map.createLayer('base');
                //set block to collide
                map.setCollision(45, true, layer);
                //init man
                man = _this.createSprite(game, 'man');
                man.position.set(24, 24);
                //set man to collide
                game.physics.enable(man);
            },
            update: function () {
                //check collision
                game.physics.arcade.collide(man, layer);
                if (game.input.keyboard.isDown(Phaser.KeyCode.D)) {
                    //move by angle
                    game.physics.arcade.velocityFromAngle(0, 60, man.body.velocity);
                    //man.x++;
                    man.animations.play('e', 20, true);
                }
                else if (game.input.keyboard.isDown(Phaser.KeyCode.A)) {
                    //move by angle
                    game.physics.arcade.velocityFromAngle(180, 60, man.body.velocity);
                    //man.x--;
                    man.animations.play('w', 20, true);
                }
                else if (game.input.keyboard.isDown(Phaser.KeyCode.W)) {
                    //move by angle
                    game.physics.arcade.velocityFromAngle(270, 60, man.body.velocity);
                    //man.y--;
                    man.animations.play('n', 20, true);
                }
                else if (game.input.keyboard.isDown(Phaser.KeyCode.S)) {
                    //move by angle
                    game.physics.arcade.velocityFromAngle(90, 60, man.body.velocity);
                    //man.y++;
                    man.animations.play('s', 20, true);
                }
                else {
                    man.body.velocity.set(0, 0);
                    man.animations.stop();
                }
            }
        });
        //9:
        /*var _this=this;
        var map:Phaser.Tilemap;
        var layer:Phaser.TilemapLayer;
        var man:Phaser.Sprite;
        var enemy:Phaser.Sprite;
        var manIsDead:boolean=false;
        var game:Phaser.Game=new Phaser.Game(336, 176, Phaser.AUTO, document.getElementById('container'), {
            preload:function(){
                //load tilemap
                game.load.tilemap('my-tilemap', './assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);

                //load image
                game.load.spritesheet('my-spritesheet', './assets/bomberman_spritesheet.png', 16, 16, 4 * 21, 0, 1);
            },
            create:function(){
                game.stage.backgroundColor='#008000';
                game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                Phaser.Canvas.setImageRenderingCrisp(game.canvas);

                //init tilemap object
                map=game.add.tilemap('my-tilemap', 16, 16);
                map.addTilesetImage('bomberman_spritesheet', 'my-spritesheet');
                layer=map.createLayer('base');


                //init man
                man=_this.createSprite(game, 'man');
                man.position.set(24, 24);
                //set man to collide
                game.physics.enable(man);

                //init enemy
                enemy=_this.createSprite(game, 'enemy');
                enemy.position.set(168, 24);
                //set enemy to collide
                game.physics.enable(enemy);

            },
            update:function(){
                //check collision
                game.physics.arcade.collide(man, enemy, function(){
                    manIsDead=true;
                    man.animations.play('destroy', 8, false, true);
                    enemy.body.velocity.set(0, 0);
                }, null, this);

                if(manIsDead == false){
                    game.physics.arcade.moveToObject(man, enemy);
                    man.animations.play('e', 20, true);
                }
            }
        });*/
    }
    //6:
    PhaserGameTest.prototype.createSprite = function (game, name, nameSuffix) {
        if (nameSuffix === void 0) { nameSuffix = ""; }
        //get the data object
        var data;
        for (var i = 0; i < this.spritesData.length; i++) {
            if (this.spritesData[i].name == name) {
                data = this.spritesData[i];
                break;
            }
        }
        if (data == undefined)
            return null;
        //
        var sprite = game.add.sprite(0, 0, 'my-spritesheet', data.frame);
        sprite.anchor.set(0.5);
        sprite.name = name + nameSuffix;
        //animations
        if (data.animations) {
            for (var i = 0; i < data.animations.length; i++) {
                sprite.animations.add(data.animations[i].name, data.animations[i].frames);
            }
        }
        //
        return sprite;
    };
    return PhaserGameTest;
}());
