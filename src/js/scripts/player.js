 /**
  * Created by everton on 22/08/2017.
  */
'use strict';
function CreatePlayer(_this, data ) {

    this.context = _this;
    this.game = _this.game;
    this.elementsPlayer = data.player;
    this.spriteSheet = data.map.spriteSheet;
    this.groups = _this.groups;
    this.groupCollidePlayer = _this.groupCollidePlayer;
    this.controlls = _this.controlls;

    this.playerName = data.player.name;
    this.turbo = 0;
    this.currAnim = "";

    this.create();
}

CreatePlayer.prototype.create = function __create() {

    this.groups[this.elementsPlayer.group] = this.groupCollidePlayer;

    this.player = this.groups[this.elementsPlayer.group].create(
                                this.elementsPlayer.posCol * this.spriteSheet.tileWidth,
                                this.elementsPlayer.posRow * this.spriteSheet.tileHeight,
                                this.playerName
                            );

    this.player.life = 100;

    // animações
    mediator.emit('ANIMATOR.CREATE_SPRITE_ANIMATOR', this.player, this.elementsPlayer.animations);

    // redefinindo área de colisão
    this.setSizeCollide(this.player, this.elementsPlayer['sizeCollide']);
    // não permitindo sair do mapa
    this.groupCollidePlayer.setAll('body.collideWorldBounds', true);
    this.groupCollidePlayer.setAll('body.immovable', true);

    // camera acompanhar o personagem
    this.game.camera.follow(this.player);

    this.player.controlls = this.controlls;
    this.moveWalkPlayer = this.walkPlayer;

    //criando carregamento de energia
    this.energia = this.game.add.group();
    this.energia.createMultiple(1, 'energia');
    this.energia.forEach(this.setupInvader, this);

};

CreatePlayer.prototype.setupInvader = function __setupInvader(invader){
    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('energia');
};

CreatePlayer.prototype.stopAnimate = function __stopAnimate(){
    this.carregando.kill();
    this.carregando = null;
};

CreatePlayer.prototype.playAnimate = function __playAnimate(){

    this.carregando = this.energia.getFirstExists(false);
    this.carregando.reset(this.player.body.x + (this.context.tileSize / 2), this.player.body.y - 8);
    this.carregando.play('energia', 5, true, true);
};

CreatePlayer.prototype.createLifeBar = function __createLifeBar(player){

    this.bmd = this.game.add.bitmapData(player.life, 10);

    this.bmd.ctx.beginPath();
    this.bmd.ctx.rect(0, 0, player.life, 10);
    this.bmd.ctx.fillStyle = '#ff0000';
    this.bmd.ctx.strokeRect( 0, 0,  100, 5 );
    this.bmd.ctx.fill();

    if(player.bar) player.bar.kill();

    player.bar = this.game.add.sprite(player.body.position.x + (this.context.tileSize / 2), player.body.position.y - 10, this.bmd);
    player.bar.anchor.setTo(0.5, 0.5);

};

/**
  * Redefinie área de colisão
  * @param {object}               _element                  Elemento a ser manipulado
  * @param {object}               _bounds                   {width, height, x, y}
  */
CreatePlayer.prototype.setSizeCollide =  function __setSizeCollide(_element, _bounds) {
    _element.body.setSize(_bounds.width, _bounds.height, _bounds.offsetWidth, _bounds.offsetHeight);
};

CreatePlayer.prototype.walkPlayer = function __walkPlayer() {

    if(!this.carregando) {

        this.velocity = this.player.body.velocity;
        this.animations = this.player.animations;

        this.velocity.x = 0;
        this.velocity.y = 0;

        if (this.controlls.shift && this.controlls.shift.isDown && this.game.input.enabled) {
            this.turbo = 100;
        } else {
            this.turbo = 0;
        }

        if (this.controlls.isMobile && this.controlls.isDown) {
            this.joystickArcade();
        } else if (!this.controlls.isMobile && (this.controlls.dir.right.isDown || this.controlls.dir.left.isDown ||
            this.controlls.dir.up.isDown || this.controlls.dir.down.isDown)) {
            this.keyboarEvents();
        } else {
            this.animations.stop(this.currAnim, true);
        }

        this.createLifeBar(this.player);
    }
};

CreatePlayer.prototype.keyboarEvents = function __keyboarEvents() {

    if (this.controlls.dir.left.isDown && this.game.input.enabled) {
        this.buttonPressLeft();
    } else if (this.controlls.dir.right.isDown && this.game.input.enabled) {
        this.buttonPressRight();
    } else if (this.controlls.dir.up.isDown && this.game.input.enabled) {
        this.buttonPressUp();
    } else if (this.controlls.dir.down.isDown && this.game.input.enabled) {
        this.buttonPressDown();
    }
};

CreatePlayer.prototype.joystickArcade = function __joystickArcade() {
    //direita
    if ((this.controlls.rotation >= -0.78 && this.controlls.rotation <= 0.0) ||
        (this.controlls.rotation >= 0.0 && this.controlls.rotation <= 0.78)) {
        this.buttonPressRight();
    }else
    //baixo
    if ((this.controlls.rotation >= 0.78 && this.controlls.rotation <= 1.56) ||
        (this.controlls.rotation >= 1.56 && this.controlls.rotation <= 2.34)) {
        this.buttonPressDown();
    }else
    //esquerda
    if ((this.controlls.rotation >= 2.34 && this.controlls.rotation <= 3.2) ||
        (this.controlls.rotation >= -3.2 && this.controlls.rotation <= -2.34)) {
        this.buttonPressLeft();
    }else
    //cima
    if ((this.controlls.rotation >= -2.34 && this.controlls.rotation <= -1.56) ||
        (this.controlls.rotation >= -1.56 && this.controlls.rotation <= -0.78)) {
        this.buttonPressUp();
    }
};

// function joystickEvents() {
    // if (stick.direction === Phaser.LEFT && game.input.enabled) {
    //     buttonPressLeft(velocity, animations, turbo);
    // } else if (stick.direction === Phaser.RIGHT && game.input.enabled) {
    //     buttonPressRight(velocity, animations, turbo);
    // } else if (stick.direction === Phaser.UP && game.input.enabled) {
    //     buttonPressUp(velocity, animations, turbo);
    // } else if (stick.direction === Phaser.DOWN && game.input.enabled) {
    //     buttonPressDown(velocity, animations, turbo);
    // }
// }

CreatePlayer.prototype.buttonPressLeft = function __buttonPressLeft() {
    this.velocity.x = ( this.elementsPlayer.speed + this.turbo) * -1;
    this.animations.play('left');
    this.currAnim = 'left';
};

CreatePlayer.prototype.buttonPressRight = function __buttonPressRight() {
    this.velocity.x =  this.elementsPlayer.speed + this.turbo;
    this.animations.play('right');
    this.currAnim = 'right';
};

CreatePlayer.prototype.buttonPressUp = function __buttonPressUp() {
    this.velocity.y = ( this.elementsPlayer.speed + this.turbo) * -1;
    this.animations.play('up');
    this.currAnim = 'up';
};

CreatePlayer.prototype.buttonPressDown = function __buttonPressDown() {
    this.velocity.y =  this.elementsPlayer.speed + this.turbo;
    this.animations.play('down');
    this.currAnim = 'down';
};