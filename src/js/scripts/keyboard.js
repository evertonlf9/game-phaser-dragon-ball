/**
 * Created by everton.ferreira on 26/10/2017.
 */

'use strict';
function CreateKeyboardEvents (_game){

    this.game = _game;
    this.keys = {};
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return this.addEvents();
}

CreateKeyboardEvents.prototype.addEvents = function __addEvents(){

    if(this.isMobile) return this.createJoystick();
    else return this.addInputEvents();

};

/**
 * Adiciona todos os eventos do game
 * */
CreateKeyboardEvents.prototype.addInputEvents = function addInputEvents() {

    // direcionais para movimentar o personagem
    this.keys.dir = this.game.input.keyboard.createCursorKeys();

    // turbo
    this.keys.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

    // interação
    this.keys.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.keys.space.onDown.add(this.pressButtonInteractionB, this);

    this.keys.A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.keys.A.onDown.add(this.pressButtonInteractionA, this);

    this.keys.Z = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.keys.Z.onDown.add(this.pressButtonInteractionDownZ, this);
    this.keys.Z.onUp.add(this.pressButtonInteractionUpZ, this);

    // não propagar os eventos ao navegador
    this.game.input.keyboard.addKeyCapture([this.keys.dir, this.keys.shift, this.keys.space]);

    this.keys.isMobile = this.isMobile;
    this.game.controlls = this.keys;

    return this.game.controlls;
};


CreateKeyboardEvents.prototype.createJoystick = function __createJoystick () {

    this.game.keys = null;
    this.game.pad = this.game.plugins.add(Phaser.VirtualJoystick);

    this.stick = this.game.pad.addStick(0, 0, 100, 'arcade');
    this.stick.alignBottomLeft(-60);

    this.buttonA = this.game.pad.addButton(750, 450, 'arcade', 'button1-up', 'button1-down');
    this.buttonA.onDown.add(this.pressButtonInteractionA, this.game);

    this.buttonB = this.game.pad.addButton(850, 450, 'arcade', 'button2-up', 'button2-down');
    this.buttonB.onDown.add(this.pressButtonInteractionB, this.game);

    this.stick.scale = 0.6;
    this.buttonA.scale = 0.7;
    this.buttonB.scale = 0.7;

    this.stick.isMobile = this.isMobile;
    this.game.controlls = this.stick;
    this.stick.on;
    return this.game.controlls;
};

/**
 * Verifica se houve alguma interação válida com elementos do cenário*
 * NPC ou Achiviements
 */
CreateKeyboardEvents.prototype.pressButtonInteractionA = function __pressButtonInteractionA() {
    mediator.emit('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_A');
};

CreateKeyboardEvents.prototype.pressButtonInteractionB = function __pressButtonInteractionB() {
    mediator.emit('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_B');
};

CreateKeyboardEvents.prototype.pressButtonInteractionDownZ = function __pressButtonInteractionDownZ() {
    mediator.emit('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_Z_DOWN');
};

CreateKeyboardEvents.prototype.pressButtonInteractionUpZ = function __pressButtonInteractionUpZ() {
    mediator.emit('GAME.ADD_EVENTS_INTERACTIVE_BUTTON_Z_UP');
};