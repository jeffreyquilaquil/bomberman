///<reference path='../lib/phaser.comments.d.ts'/>

class PhaserGameTest{

	//6:
	DIRECTION_N:string="n";
	DIRECTION_S:string="s";
	DIRECTION_E:string="e";
	DIRECTION_W:string="w";
	DIRECTION_SE:string="se";
	DIRECTION_SW:string="sw";
	DIRECTION_NW:string="nw";
	DIRECTION_NE:string="ne";	
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
	
	

	constructor(){		

		//1:
		//new Phaser.Game();


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
		
		var _this=this;
		var map:Phaser.Tilemap;
		var layer:Phaser.TilemapLayer;
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
				map=game.add.tilemap('my-tilemap', 16, 16);
				map.addTilesetImage('bomberman_spritesheet', 'my-spritesheet');
				layer=map.createLayer('base');
				//set block to collide
				map.setCollision(45, true, layer);


				//init man
				man=_this.createSprite(game, 'man');
				man.position.set(24, 24);
				//set man to collide
				game.physics.enable(man);

			},
			update:function(){
				//check collision
				game.physics.arcade.collide(man, layer);

				if( game.input.keyboard.isDown(Phaser.KeyCode.D) ){
					//move by angle
					game.physics.arcade.velocityFromAngle(0, 60, man.body.velocity);
					//man.x++;
					man.animations.play('e', 20, true);
				}else if( game.input.keyboard.isDown(Phaser.KeyCode.A) ){
					//move by angle
					game.physics.arcade.velocityFromAngle(180, 60, man.body.velocity);
					//man.x--;
					man.animations.play('w', 20, true);
				}else if( game.input.keyboard.isDown(Phaser.KeyCode.W) ){
					//move by angle
					game.physics.arcade.velocityFromAngle(270, 60, man.body.velocity);
					//man.y--;
					man.animations.play('n', 20, true);
				}else if( game.input.keyboard.isDown(Phaser.KeyCode.S) ){
					//move by angle
					game.physics.arcade.velocityFromAngle(90, 60, man.body.velocity);
					//man.y++;
					man.animations.play('s', 20, true);
				}else{
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
	createSprite(game:Phaser.Game, name:string, nameSuffix:string=""):Phaser.Sprite{
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
		let sprite:Phaser.Sprite=game.add.sprite(0, 0, 'my-spritesheet', data.frame);
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
	


}