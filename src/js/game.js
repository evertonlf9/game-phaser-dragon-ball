/**
 * Created by everton.ferreira on 26/10/2017.
 */
var self;
Game.Main = function Game(game){

    this.tileSize = 32;
    this.MAP = {};
    this.groups = {};
};

Game.Main.prototype = {

    mediatorAddEvent: function(){
        mediator.on('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_A', this.checkInterractionButtonA);
        mediator.on('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_B', this.checkInterractionButtonB);
        mediator.on('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_Z_DOWN', this.pressButtonInteractionDownZ);
        mediator.on('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_Z_UP', this.pressButtonInteractionUpZ);
    },
    mediatorRemoveEvent: function(){
        mediator.off('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_A', this.checkInterractionButtonA);
        mediator.off('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_B', this.checkInterractionButtonB);
        mediator.off('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_Z_DOWN', this.pressButtonInteractionDownZ);
        mediator.off('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_Z_UP', this.pressButtonInteractionUpZ);
    },

    create: function(){

        this.createSound();
        this.mediatorAddEvent();
        this.createPhysics();
        this.controlls = new CreateKeyboardEvents(this.game);
        this.createMap();
        this.createExplosion();
        this.createGroups();
        this.createElements();

        // subir a camada superior do mapa
        // TODO: encontrar como mudar o z-index
        if (this.MAP['layer1']) {
            this.game.world.bringToTop(this.MAP['layer1']);
        }

        self = this;
    },
    createSound: function(){

        if(Game.CurrentAudio)
            Game.CurrentAudio.destroy();

        Game.CurrentAudio =  this.game.add.audio('mp3Game');
        Game.CurrentAudio.play();
        Game.CurrentAudio.loopFull(1);
        Game.CurrentAudio.volume = 0.8;

        this.fx = this.game.add.audioSprite('sfx');
        this.fx.allowMultiple = true;
    },
    createElements:function(){

        this.elements = new CreateElements(this, Game.Stage);
        this.enemys = new CreateNpcs(this, Game.Stage);
        this.hiro = new CreatePlayer(this, Game.Stage);
        this.weapons = new Weapon.SingleBullet(this);

        this.game.world.bringToTop(this.groupCollideElements);
        this.game.world.bringToTop(this.groupCollideNpcs);
        this.game.world.bringToTop(this.groupCollidePlayer);
        this.game.world.bringToTop(this.explosions);

        this.player = this.hiro.player;
    },
    createPhysics: function(){
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.groupCollidePlayer = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.groupCollideNpcs = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.groupCollideElements = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
        this.groupCollidWeapons = this.game.add.physicsGroup(Phaser.Physics.ARCADE);
    },
    createMap: function(){

        var map = Game.Stage.map;

        this.MAP.ts = this.game.add.tilemap(map.name);
        this.MAP.ts.addTilesetImage(map.name, map.spriteSheet.name);

        for (var layer in map.layer) {
            if (map.layer.hasOwnProperty(layer)) {
                this.MAP[map.layer[layer].name] = this.MAP.ts.createLayer(map.layer[layer].name);
                this.MAP[map.layer[layer].name].visible = map.layer[layer].visible;

                this.MAP[map.layer[layer].name].resizeWorld();
            }
        }

        // tiles que não haverá colisão
        this.MAP.ts.setCollisionByExclusion([0]);

    },
    createGroups: function(){

        var stage = Game.Stage;

        for (var group in stage.groups) {
            if (stage.groups.hasOwnProperty(group)) {
                this.groups[stage.groups[group].type] = this.game.add.group();
                this.groups[stage.groups[group].type].enableBody = true;
            }
        }
    },
    createExplosion: function(){
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'kaboom');
        this.explosions.forEach(this.setupInvader, this);
    },
    setupInvader: function setupInvader (invader) {

        invader.anchor.x = 0.5;
        invader.anchor.y = 0.5;
        invader.animations.add('kaboom');

    },
    checkInterractionButtonA: function(){
        // NPC
        self.game.physics.arcade.overlap(self.groupCollideNpcs, self.groupCollidePlayer, self.checkInteractiveNpc, null, self);

        // ACHIEVEMENTS
        self.game.physics.arcade.overlap(self.groupCollideElements, self.groupCollidePlayer, self.getAchievement, null, self);
    },
    checkInterractionButtonB: function(){

        self.fx.play('shot');
        var name = self.player.animations.currentAnim.name;
        self.weapons.fire(self.player, name, 32, 10);
    },
    pressButtonInteractionDownZ: function(){
        self.hiro.playAnimate();
    },
    pressButtonInteractionUpZ: function(){
        self.hiro.stopAnimate();
    },
    checkColliders: function(){

        // colisões
        this.game.physics.arcade.collide(this.player, this.MAP['Collision']);
        this.game.physics.arcade.collide(this.groupCollideNpcs, this.MAP['Collision']);
        this.game.physics.arcade.collide(this.groupCollideNpcs,this. player);

        this.game.physics.arcade.collide(this.explosion, this.groupCollideNpcs, this.checkExplosionCollider, null, this);
        this.game.physics.arcade.collide(this.explosion, this.player, this.checkExplosionCollider, null, this);
        this.game.physics.arcade.collide(this.weapons, this.MAP['Collision'], this.checkWeaponsColliderMap, null, this);

        this.game.physics.arcade.overlap(this.weapons, this.groupCollideNpcs, this.checkKillEnemy, null, this);
        this.enemys.checkCollider(this.player);

    },
    checkWeaponsColliderMap: function(bullet1){
        bullet1.kill();
        this.playExplosion(bullet1);
    },
    checkExplosionCollider: function(explosion, npc){

        if(!explosion.isHit && npc == this.player) {
            npc.life = npc.life - explosion.hit;
            explosion.isHit = true;

            if(this.player.life <= 0){
                this.player.kill();
                this.game.state.start("GameOver");
            }
        }

    },
    checkKillEnemy: function(bullet, npc){

        this.playExplosion(npc);
        npc.life = npc.life - bullet.damage;
        bullet.kill();

        if(npc.life <= 0){

            var elem = self.elements[npc.item];

            if(elem) {
                elem.renderable = !elem.renderable;
                elem.position.x = npc.position.x;
                elem.position.y = npc.position.y;
            }

            self.fx.play('death');
            npc.bar.destroy();
            npc.destroy();
            delete  self.enemys.enemy[npc.id];
        }
    },
    getAchievement: function(element){
        element.renderable = element.renderable ? false : true;
        if(!element.renderable){
            element.destroy();
            self.fx.play('squit');
        }
    },
    checkInteractiveNpc: function(){
        if(_npc.typGroup == "interactive"){
            alert("oi")
        }
    },
    playExplosion: function(npc){
        this.explosion = this.explosions.getFirstExists(false);
        this.explosion.reset(npc.body.x + (this.tileSize / 2), npc.body.y);
        this.explosion.play('kaboom', 30, false, true);
        this.explosion.hit = 2;
        this.explosion.isHit = false;
        this.game.physics.arcade.enable(this.explosion);
    },
    update: function(){
        this.checkColliders();
        this.hiro.moveWalkPlayer();
    },
    render: function(){
    }
};