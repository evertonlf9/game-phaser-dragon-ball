/**
 * Created by everton on 23/08/2017.
 */

'use strict';

function CreateNpcs (_this, data ){

    this.context = _this;
    this.game = _this.game;
    this.elementsNpcs = data.npcs;
    this.spriteSheet = data.map.spriteSheet;
    this.groups = _this.groups;
    this.groupCollideNpcs = _this.groupCollideNpcs;
    this.tileSize = _this.tileSize;

    this.npcsNames = [];
    this.positions = null;
    this.enemy = {};

    this.create();
}

CreateNpcs.prototype.create = function __create(){

    var properties = null,
        positions = null;

    for (var el in this.elementsNpcs) {

        if (this.elementsNpcs.hasOwnProperty(el)) {

            positions = this.elementsNpcs[el].positions;

            for (var thing in positions) {

                if (positions.hasOwnProperty(thing)) {

                    // se o elemento tiver um ID
                    if (positions[thing]['id']) {

                        properties = positions[thing];

                        this.groups[properties.group] =  this.groupCollideNpcs;

                        // cria e armazena o elemento (npc, animal, objeto)
                        this.enemy[properties['id']] = this.groups[properties.group].create(
                                                                        properties['posCol'] * this.spriteSheet.tileWidth,
                                                                        properties['posRow'] * this.spriteSheet.tileHeight,
                                                                        this.elementsNpcs[el].name
                                                                    );
                        this.addProperties(properties);
                    }
                }
            }
        }
    }

    this.groupCollideNpcs.setAll('body.collideWorldBounds', true);
    this.groupCollideNpcs.setAll('body.immovable', true);
};

CreateNpcs.prototype.addProperties = function (properties){

    // verifica se precisa definir novas áreas de colisões
    if (properties.hasOwnProperty('sizeCollide')) {
        this.setSizeCollide(this.enemy[properties.id], properties['sizeCollide']);
    }

    // // verifica se renderiza ou não os objetos na tela
    if (properties.hasOwnProperty('renderable')) {
        this.enemy[properties.id].renderable = properties.renderable;
    }

    if (properties.hasOwnProperty('axisX')) {
        this.enemy[properties.id].body.velocity.x = properties['speed'] * properties['axisX'];
    }

    if (properties.hasOwnProperty('axisY')) {
        this.enemy[properties.id].body.velocity.y = properties['speed'] * properties['axisY'];
    }

    if (properties.hasOwnProperty('animatorName')) {
        this.enemy[properties.id].animatorName = properties['animatorName'];
    }

    if (properties.hasOwnProperty('speed')) {
        this.enemy[properties.id].speed = properties['speed'];
    }

    if (properties.hasOwnProperty('range')) {
        this.enemy[properties.id].range = properties['range'];
    }

    if (properties.hasOwnProperty('weapon')) {
        this.enemy[properties.id].weapon = new Weapon.SingleBullet(this.context);
    }

    if (properties.hasOwnProperty('item')) {
        this.enemy[properties.id].item = properties.item;
    }

    if (properties.hasOwnProperty('life')) {
        this.enemy[properties.id].life = properties.life;
    }

    if (properties.hasOwnProperty('delayWeapon')) {
        this.enemy[properties.id].delayWeapon = properties.delayWeapon;
    }

    if (properties.hasOwnProperty('group')) {
        this.enemy[properties['id']].typGroup = properties.group;
    }

    // informações adicionais
    this.enemy[properties.id].id = properties['id'];

    this.npcsNames.push(properties['id']);

    // se tiver diálogo
    if (properties['triggerDialog']) {
        this.enemy[properties.id].triggerDialog = properties['triggerDialog'];
    }

    this.createLifeBar(this.enemy[properties.id]);

    mediator.emit('ANIMATOR.CREATE_SPRITE_ANIMATOR', this.enemy[properties.id], properties['animations']);
};

CreateNpcs.prototype.createLifeBar = function __createLifeBar(npc){

    this.bmd = this.game.add.bitmapData(npc.life, 10);

    this.bmd.ctx.beginPath();
    this.bmd.ctx.rect(0, 0, npc.life, 10);
    this.bmd.ctx.fillStyle = '#ff0000';
    this.bmd.ctx.strokeRect( 0, 0,  100, 5 );
    this.bmd.ctx.fill();

    if(npc.bar) npc.bar.kill();

    npc.bar = this.game.add.sprite(npc.body.position.x + (this.tileSize / 2), npc.body.position.y - 10, this.bmd);
    npc.bar.anchor.setTo(0.5, 0.5);

};

CreateNpcs.prototype.checkCollider = function __checkCollider(_player){
    this.player = _player;
    this.game.physics.arcade.collide(this.groupCollideNpcs, this.groupCollideNpcs);
    this.game.physics.arcade.overlap(this.groupCollideNpcs, this.groupCollideNpcs, this.checksCollisionBetweenNpcs, null, this);
    this.walkNpcs();
};

CreateNpcs.prototype.checksCollisionBetweenNpcs = function __checksCollisionBetweenNpcs(npc1, npc2){
    if(!this.colliderNpc) {
        this.colliderNpc = true;
        this.changeDirection(npc1.id, npc2.id);
    }
};

/**
 * Redefinie área de colisão
 * @param {object}               npc                  Elemento a ser manipulado
 * @param {object}               _bounds                   {width, height, x, y}
 */
CreateNpcs.prototype.setSizeCollide = function __setSizeCollide(npc, _bounds) {
    npc.body.setSize(_bounds.width, _bounds.height, _bounds.offsetWidth, _bounds.offsetHeight);
};

CreateNpcs.prototype.changeDirection = function __changeDirection(name1, name2){

    var npc1 = this.enemy[name1],
        npc2 = this.enemy[name2];

    if(npc1.body.velocity.x > 0 && npc2.body.velocity.x < 0){

        npc1.animatorName = 'left';
        npc1.body.velocity.x = this.npc.speed * -1;
        npc1.body.velocity.y = 0;

        npc2.animatorName = 'right';
        npc2.body.velocity.x = this.npc.speed * 1;
        npc2.body.velocity.y = 0;
    }else  if(npc1.body.velocity.y > 0 && npc2.body.velocity.y < 0){

        npc1.animatorName = 'up';
        npc1.body.velocity.x = 0;
        npc1.body.velocity.y = this.npc.speed * -1;

        npc2.animatorName = 'down';
        npc2.body.velocity.x = 0;
        npc2.body.velocity.y = this.npc.speed * 1;
    }
};

CreateNpcs.prototype.walkNpcs = function __walkNpcs(){

    Object.keys(this.enemy).forEach(function(name){
        this.npc = this.enemy[name];
        this.npc.animations.play(this.npc.animatorName);
        if(this.npc.range) this.chasingPlayer(this.npc);
        this.checkCollideWorldBounds();
        this.game.physics.arcade.collide(this.npc.weapon, this.context.MAP['Collision'], this.checkWeaponsColliderMap, null, this);

    }, this);



};

CreateNpcs.prototype.checkWeaponsColliderMap = function __checkWeaponsColliderMap(bullet1){
    bullet1.kill();
    this.context.playExplosion(bullet1);
};

CreateNpcs.prototype.chasingPlayer = function __chasingPlayer(enemy){

    var posY =  Math.pow(enemy.body.position.y - this.player.body.position.y, 2 );
    var posX =  Math.pow(enemy.body.position.x - this.player.body.position.x, 2 );
    var renge = Math.sqrt( posY + posX );

    this.createLifeBar(enemy);

    //verifica se o player esta no range de perseguição do enemy
    if ( renge > this.tileSize && renge < enemy.range ) {

        //verifica se o personagem e o inimigo estão no mesmo eixo X
        if (enemy.body.position.x > (this.player.body.position.x - this.tileSize ) && enemy.body.position.x < (this.player.body.position.x + this.tileSize )) {
            if (enemy.weapon)this.weaponFire(enemy);

            if (enemy.body.position.y > this.player.body.position.y) {
                this.up();
            } else if (enemy.body.position.y < this.player.body.position.y) {
                this.down();
            }//else
        } else

        //verifica se o personagem e o inimigo estão no mesmo eixo Y
        if (enemy.body.position.y > (this.player.body.position.y - this.tileSize ) && enemy.body.position.y < (this.player.body.position.y + this.tileSize )) {
            if (enemy.weapon)this.weaponFire(enemy);
            if (enemy.body.position.x > this.player.body.position.x) {
                this.left();
            } else if (enemy.body.position.x < this.player.body.position.x) {
                this.right();
            }//else
        }//if


    }else  if ( renge < this.tileSize){

        if (enemy.weapon)this.weaponFire(enemy);

        this.npc.body.velocity.x = 0;
        this.npc.body.velocity.y = 0;

        if(enemy.body.position.x < this.player.body.position.x && ((enemy.body.position.y - 5.5) == this.player.body.position.y || (enemy.body.position.y + 5.5) == this.player.body.position.y)){
            this.npc.animatorName = 'right';
            return;
        }else if(enemy.body.position.x > this.player.body.position.x && ((enemy.body.position.y - 5.5) == this.player.body.position.y || (enemy.body.position.y + 5.5) == this.player.body.position.y)){
            this.npc.animatorName = 'left';
            return
        }

        if(enemy.body.position.y < this.player.body.position.y){
            this.npc.animatorName = 'down';
        }else if(enemy.body.position.y  > this.player.body.position.y){
            this.npc.animatorName = 'up';
        }

    }
};

CreateNpcs.prototype.checkCollideWorldBounds = function __checkCollideWorldBounds(){

    if(this.npc.body.position.y == 0 && this.npc.body.velocity.y < 0){
       this.down();
    }else  if(this.npc.body.position.x == 0 && this.npc.body.velocity.x < 0){
        this.right();
    }else if(this.npc.body.position.y == (this.game.world.height - this.tileSize) && this.npc.body.velocity.y > 0){
        this.up();
    }else if(this.npc.body.position.x == (this.game.world.width - this.tileSize) && this.npc.body.velocity.x > 0){
        this.left();

    }else if(this.npc.animatorName == "left" && this.npc.body.velocity.x == 0){
        this.right();
    }else if(this.npc.animatorName == "rigth" && this.npc.body.velocity.x == 0){
        this.left();
    }else if(this.npc.animatorName == "up" && this.npc.body.velocity.y == 0){
        this.down();
    }else if(this.npc.animatorName == "down" && this.npc.body.velocity.y == 0){
        this.up();
    }

};

CreateNpcs.prototype.down = function __down(){
    this.npc.animatorName = 'down';
    this.npc.body.velocity.x = 0;
    this.npc.body.velocity.y = this.npc.speed * 1;
};

CreateNpcs.prototype.up = function __up(){
    this.npc.animatorName = 'up';
    this.npc.body.velocity.x = 0;
    this.npc.body.velocity.y = this.npc.speed * -1;
};

CreateNpcs.prototype.left = function __left(){
    this.npc.animatorName = 'left';
    this.npc.body.velocity.x = this.npc.speed * -1;
    this.npc.body.velocity.y = 0;
};

CreateNpcs.prototype.right = function __right(){
    if(this.npc) {
        this.npc.animatorName = 'right';
        this.npc.body.velocity.x = this.npc.speed * 1;
        this.npc.body.velocity.y = 0;
    }
};

CreateNpcs.prototype.weaponFire = function __weaponFire(npc){

    this.game.physics.arcade.overlap(npc.weapon, this.player, this.checkKillPlayer, null, this);

    if (npc.time < npc.delayWeapon) {
        npc.time += 1;
        return;
    }
    this.context.fx.play('shot');
    npc.time = 0;
    npc.weapon.fire(npc, npc.animations.currentAnim.name, 32, 10);
};

CreateNpcs.prototype.checkKillPlayer = function __checkKillPlayer(player, bullet){

    this.context.playExplosion(player);
    player.life = player.life - bullet.damage;
    bullet.kill();

};
