///<reference path='../lib/phaser.comments.d.ts'/>

class Bomberman{
	//
	DIRECTION_N:string="n";
	DIRECTION_S:string="s";
	DIRECTION_E:string="e";
	DIRECTION_W:string="w";
	DIRECTION_SE:string="se";
	DIRECTION_SW:string="sw";
	DIRECTION_NW:string="nw";
	DIRECTION_NE:string="ne";

	//
	KEY_TILEMAP:string='tilemap';
	KEY_TILESET:string='bomberman_spritesheet';
	KEY_SPRITESHEET:string="spritesheet-main";
	//
	KEY_TILED_BLOCK:number=45;
	KEY_TILED_BRICK:number=46;
	
	//
	COLOR_GROUND:string='#008000';

	//
	spritesData:Array<any>=[
		{
			name:'man',
			frame:1,
			animations:[
				{
					name:this.DIRECTION_S,
					frames:[0, 1, 2]
				},
				{
					name:this.DIRECTION_E,
					frames:[4, 5, 6]
				},
				{
					name:this.DIRECTION_N,
					frames:[8, 9, 10]
				},
				{
					name:this.DIRECTION_W,
					frames:[12, 13, 14]
				},
				{
					name:'destroy',
					frames:[16, 17, 18, 20, 21, 22, 23, 3]
				}
			]
		},
		{
			name:'enemy',
			frame:24,
			animations:[
				{
					name:this.DIRECTION_W,
					frames:[24, 25, 26]
				},
				{
					name:this.DIRECTION_E,
					frames:[28, 29, 30]
				},
				{
					name:'destroy',
					frames:[32, 33, 34, 36, 37]
				}
			]
		},
		{
			name:'bomb',
			frame:40,
			animations:[
				{
					name:'default',
					frames:[40, 41, 42]
				}
			]
		},
		{
			name:'explosion-top',
			frame:56,
			animations:[
				{
					name:'default',
					frames:[56, 57, 58, 57, 56, 3]
				}
			]

		},
		{
			name:'explosion-bottom',
			frame:60,
			animations:[
				{
					name:'default',
					frames:[60, 61, 62, 61, 60, 3]
				}
			]

		},
		{
			name:'explosion-left',
			frame:64,
			animations:[
				{
					name:'default',
					frames:[64, 65, 66, 65, 64, 3]
				}
			]

		},
		{
			name:'explosion-right',
			frame:68,
			animations:[
				{
					name:'default',
					frames:[68, 69, 70, 69, 68, 3]
				}
			]

		},
		{
			name:'explosion-center',
			frame:72,
			animations:[
				{
					name:'default',
					frames:[72, 73, 74, 73, 72, 3]
				}
			]

		},
		{
			name:'brick',
			frame:45,
			animations:[
				{
					name:'destroy',
					frames:[48, 49, 50, 51, 52, 53, 54]
				}
			]
		},
		{
			name:'button',
			frame:46
		}
	];

	//
	tileSize:number=16;
	tileCount:number=19;
	tileCountWidth:number=21;
	tileCountHeight:number=11;
	bombJustDeployed:boolean=false;
	isManDead:boolean=false;


	//
	phGame:Phaser.Game;
	phMap:Phaser.Tilemap;
	phLayerBase:Phaser.TilemapLayer;
	phLayerLevel:Phaser.TilemapLayer;
	//
	phSpriteMan:Phaser.Sprite;
	//
	phEnemyGroup:Phaser.Group;
	phBombGroup:Phaser.Group;
	phExplosionGroup:Phaser.Group;


	//
	keySequence:Phaser.ArraySet;

	
	constructor(){
		//
		this.phGame=new Phaser.Game(
			this.tileSize * this.tileCountWidth, 
			this.tileSize * this.tileCountHeight, 
			Phaser.AUTO, 
			document.getElementById('container'), 
			this, false, false);
		console.log("dasd");

	}

	//PHASER main state functions ---------------------------------------------------------------------------
	preload(){
		console.log('state preload');

		//load tilemap
		this.phGame.load.tilemap(this.KEY_TILEMAP, './assets/tilemap.json?date=' + new Date(), null, Phaser.Tilemap.TILED_JSON);

		//load spritesheets
		this.phGame.load.spritesheet(this.KEY_SPRITESHEET, './assets/bomberman_spritesheet.png', 16, 16, 4 * 21, 0, 1);
	}

	create(){
		console.log('state create');

		//
		this.phGame.stage.backgroundColor=this.COLOR_GROUND;

		//
		this.phGame.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Phaser.Canvas.setImageRenderingCrisp(this.phGame.canvas); 

		//
		this.initTilemap();

		//
		this.initGame();

		//
		this.createRandomEnemies();
	}

	update(){

		//if man is dead
		if(this.isManDead == false){
			//
			this.checkKeyboardInput();

			//
			this.updateManMovement();
		}


		//man vs tiles, bomb
		this.phGame.physics.arcade.collide(this.phSpriteMan, [this.phLayerBase, this.phLayerLevel, this.phBombGroup]);

		//man vs explosion
		this.phGame.physics.arcade.collide(this.phSpriteMan, this.phExplosionGroup, 
			function(){

				this.isManDead=true;
				this.phSpriteMan.body.velocity.set(0, 0);
				this.phSpriteMan.animations.play('destroy', 8, false, true);

			}, null, this);

		//enemy vs tiles, bomb
		this.phGame.physics.arcade.collide(this.phEnemyGroup, [this.phLayerBase, this.phLayerLevel, this.phBombGroup],
			function(object1, object2){

				this.setRandomEnemyMovement(object1);

			}, null, this);

		//enemy vs explosion
		this.phGame.physics.arcade.collide(this.phEnemyGroup, this.phExplosionGroup, 
			function(object1, object2){

				let enemy:Phaser.Sprite=object1;
				enemy.body.velocity.set(0, 0);
				enemy.animations.play('destroy', 8, false, true);

			}, null, this);

		//explosion vs bricks
		this.phGame.physics.arcade.overlap(this.phExplosionGroup, this.phLayerLevel, 
			function(object1, object2){

				if(this.isBrick(object2)){
					//create brick sprite
					let brick:Phaser.Sprite=this.createSprite('brick');
					this.positionSpriteAtTile(brick, object2.x, object2.y, true);
					brick.animations.play('destroy', 20, false, true);

					//remove collided tile
					this.phMap.removeTile(object2.x, object2.y, this.phLayerLevel);
				}

			}, null, this);
		
		
		//man vs enemy
		this.phGame.physics.arcade.collide(this.phSpriteMan, this.phEnemyGroup, 
			function(){

				//do nothing

			}, function(){

				this.isManDead=true;
				this.phSpriteMan.body.velocity.set(0, 0);
				this.phSpriteMan.animations.play('destroy', 8, false, true);
				return false;

			}, this);

	}

	render(){
		//this.phGame.debug.body(this.phSpriteMan);
		//this.phGame.debug.pointer(this.phGame.input.mousePointer);
	}


	//INITS -------------------------------------------------------------------------------
	initGame(){
		//tiles physics
		this.phMap.setCollision(this.KEY_TILED_BLOCK, true, this.phLayerBase);
		this.phMap.setCollision(this.KEY_TILED_BRICK, true, this.phLayerLevel);
		//this.phLayerBase.debug=true;

		//
		this.phEnemyGroup=this.phGame.add.group();
		this.phEnemyGroup.enableBody=true;

		//
		this.phBombGroup=this.phGame.add.group();
		this.phBombGroup.enableBody=true;

		//
		this.phExplosionGroup=this.phGame.add.group();
		this.phExplosionGroup.enableBody=true;

		//
		this.phSpriteMan=this.createSprite('man');
		this.phSpriteMan.crop(new Phaser.Rectangle(2, 0, 12, 16), false);
		this.positionSpriteAtTile(this.phSpriteMan, 1, 1);
		this.phGame.physics.enable(this.phSpriteMan);

		//init vars
		this.keySequence=new Phaser.ArraySet([]);
	}

	initTilemap(){
		//create the tilemap
		this.phMap=this.phGame.add.tilemap(this.KEY_TILEMAP, this.tileSize, this.tileSize);
		this.phMap.addTilesetImage(this.KEY_TILESET, this.KEY_SPRITESHEET);

		//create the map layers
		this.phLayerBase=this.phMap.createLayer('base');
		this.phLayerLevel=this.phMap.createLayer('level_1');
	}


	//FUNCTIONS ---------------------------------------------------------------------------
	checkKeyboardInput(){
		//north
		if(this.phGame.input.keyboard.isDown(Phaser.KeyCode.W)){
			this.keySequence.add(this.DIRECTION_N);			
		}else{
			this.keySequence.remove(this.DIRECTION_N);
		}
		//south
		if(this.phGame.input.keyboard.isDown(Phaser.KeyCode.S)){
			this.keySequence.add(this.DIRECTION_S);
		}else{
			this.keySequence.remove(this.DIRECTION_S);
		}
		//east
		if(this.phGame.input.keyboard.isDown(Phaser.KeyCode.D)){
			this.keySequence.add(this.DIRECTION_E);
		}else{
			this.keySequence.remove(this.DIRECTION_E);
		}
		//west
		if(this.phGame.input.keyboard.isDown(Phaser.KeyCode.A)){
			this.keySequence.add(this.DIRECTION_W);
		}else{
			this.keySequence.remove(this.DIRECTION_W);
		}

		//bomb
		if(this.phGame.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR)){
			if(this.bombJustDeployed == false){
				this.deployBomb();
				this.bombJustDeployed=true;	
			}
		}else{
			this.bombJustDeployed=false;
		}

		//console.log(this.keySequence.list);
		//console.log(this.bombJustDeployed);
	}

	createExplosion(x:number, y:number){
		//
		let tileCenter:Phaser.Tile=this.phMap.getTileWorldXY(x, y, this.tileSize, this.tileSize, this.phLayerBase);
		let tileTop:Phaser.Tile=this.phMap.getTile(tileCenter.x, tileCenter.y - 1, this.phLayerBase);
		let tileBottom:Phaser.Tile=this.phMap.getTile(tileCenter.x, tileCenter.y + 1, this.phLayerBase);
		let tileLeft:Phaser.Tile=this.phMap.getTile(tileCenter.x - 1, tileCenter.y, this.phLayerBase);
		let tileRight:Phaser.Tile=this.phMap.getTile(tileCenter.x + 1, tileCenter.y, this.phLayerBase);


		//center
		this.createExplosionChildren('explosion-center', tileCenter.x, tileCenter.y);
		//
		if(this.isBlock(tileTop) == false){
			this.createExplosionChildren('explosion-top', tileTop.x, tileTop.y);
		}
		//
		if(this.isBlock(tileBottom) == false){
			this.createExplosionChildren('explosion-bottom', tileBottom.x, tileBottom.y);
		}
		//
		if(this.isBlock(tileLeft) == false){
			this.createExplosionChildren('explosion-left', tileLeft.x, tileLeft.y);
		}
		//
		if(this.isBlock(tileRight) == false){
			this.createExplosionChildren('explosion-right', tileRight.x, tileRight.y);
		}
	}

	createExplosionChildren(name:string, xInTiles:number, yInTiles:number):Phaser.Sprite{
		let explosion:Phaser.Sprite=this.createSprite(name);
		//
		this.phExplosionGroup.add(explosion);
		explosion.body.immovable=true;

		//
		this.positionSpriteAtTile(explosion, xInTiles, yInTiles, true);
		explosion.animations.play('default', 15, false, true);

		//
		return explosion;
	}

	createRandomEnemies(){
		for(let i=0; i < 10; i++){
			let enemy:Phaser.Sprite=this.createSprite('enemy', '_' + i);
			this.phEnemyGroup.add(enemy);

			//position randomly			
			while( this.positionSpriteAtTile(
				enemy, 
				Math.floor( Math.random() * this.tileCountWidth ), 
				Math.floor( Math.random() * this.tileCountHeight )) == false );

			//set initial movement
			this.setRandomEnemyMovement(enemy);
		}
	}

	createSprite(name:string, nameSuffix:string=""):Phaser.Sprite{
		//get the data object
		let data;
		for(let i=0; i < this.spritesData.length; i++){
			if(this.spritesData[i].name == name){
				data=this.spritesData[i];
				break;
			}
		}
		if(data == undefined) return null;

		//
		let sprite:Phaser.Sprite=this.phGame.add.sprite(0, 0, this.KEY_SPRITESHEET, data.frame);
		sprite.anchor.set(0.5);
		sprite.name=name + nameSuffix;

		//animations
		if(data.animations){
			for(let i=0; i < data.animations.length; i++){
				sprite.animations.add( data.animations[i].name, data.animations[i].frames );
			}
		}

		//
		return sprite;
	}
	
	deployBomb(){
		//
		let tile:Phaser.Tile=this.phMap.getTileWorldXY(this.phSpriteMan.position.x, this.phSpriteMan.position.y);
		let bombName:string='bomb_x_' + tile.x + '_y_' + tile.y;

		//
		//check if bomb exists
		if( this.phBombGroup.getByName(bombName) != null ) return;

		//create bomb
		let bomb:Phaser.Sprite=this.createSprite('bomb');
		bomb.name=bombName;
		bomb.animations.play('default', 3, true);
		//
		this.phBombGroup.add(bomb);
		bomb.body.immovable=true;

		//
		this.positionSpriteAtTile(bomb, tile.x, tile.y);

		//start the bomb event
		this.phGame.time.events.add(3000, function(){
			this.createExplosion(bomb.x, bomb.y);
			bomb.destroy();
		}, this);


		//
		//console.log(this.phBombGroup.children.length);
	}

	getAngleFromDirection(direction:string):number{
		switch(direction){
			case this.DIRECTION_N:
				return 270;
			case this.DIRECTION_S:
				return 90;
			case this.DIRECTION_E:
				return 0;
			case this.DIRECTION_W:
				return 180;
		}
		if(	direction == this.DIRECTION_NE ||
			direction == (this.DIRECTION_NE.charAt(1) + (this.DIRECTION_NE.charAt(0))) ){
			return 315;
		}
		if(	direction == this.DIRECTION_SE ||
			direction == (this.DIRECTION_SE.charAt(1) + (this.DIRECTION_SE.charAt(0))) ){
			return 45;
		}
		if(	direction == this.DIRECTION_SW ||
			direction == (this.DIRECTION_SW.charAt(1) + (this.DIRECTION_SW.charAt(0))) ){
			return 135;
		}
		if(	direction == this.DIRECTION_NW ||
			direction == (this.DIRECTION_NW.charAt(1) + (this.DIRECTION_NW.charAt(0))) ){
			return 225;
		}

		return 0;
	}	

	isBlock(tile:Phaser.Tile):boolean{
		if(!tile) return false;
		if(tile.index == this.KEY_TILED_BLOCK) return true;
		return false;
	}

	isBrick(tile:Phaser.Tile):boolean{
		if(!tile) return false;
		if(tile.index == this.KEY_TILED_BRICK) return true;
		return false;	
	}

	moveSpriteBodyFromDirection(sprite:Phaser.Sprite, direction:string, speed:number=60){
		//get movement angle from direction
		let movementAngle:number=this.getAngleFromDirection(direction);
		if(direction.length == 0){
			sprite.body.velocity.set(0, 0);
		}else{
			this.phGame.physics.arcade.velocityFromAngle(movementAngle, speed, sprite.body.velocity);	
		}
	}

	positionSpriteAtTile(sprite:Phaser.Sprite, xInTiles:number, yInTiles:number, ignoreBricks:boolean=false):boolean{
		//
		let phTileLayerBase:Phaser.Tile=this.phMap.getTile(xInTiles, yInTiles, this.phLayerBase);
		let phTileLayerLevel:Phaser.Tile=this.phMap.getTile(xInTiles, yInTiles, this.phLayerLevel);

		//
		if(this.isBlock(phTileLayerBase)){
			return false;
		}else if(this.isBrick(phTileLayerLevel) && ignoreBricks == false){
			return false;
		}else{
			sprite.position.set(phTileLayerBase.worldX + phTileLayerBase.centerX, phTileLayerBase.worldY + phTileLayerBase.centerY);
			return true;
		}
	}

	setRandomEnemyMovement(sprite:Phaser.Sprite){
		let direction:string=Phaser.ArrayUtils.getRandomItem([
			this.DIRECTION_N,
			this.DIRECTION_S,
			this.DIRECTION_E,
			this.DIRECTION_W
		]);
		this.moveSpriteBodyFromDirection(sprite, direction);
		sprite.animations.play(direction, 10, true);
	}

	updateManMovement(){
		//get direction string
		let direction:string="";
		direction+=(this.keySequence.list[ this.keySequence.list.length - 1 ]) || '';
		direction+=(this.keySequence.list[ this.keySequence.list.length - 2 ]) || '';

		//
		this.moveSpriteBodyFromDirection(this.phSpriteMan, direction);

		
		//update sprite animation
		if(this.keySequence.list.length > 0){
			this.phSpriteMan.animations.play(this.keySequence.list[ this.keySequence.list.length - 1 ], 20, true);
		}else{
			this.phSpriteMan.animations.stop();
		}
	}

}