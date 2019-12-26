/**
 * Created by everton.ferreira on 26/10/2017.
 */
var Game = {};

Game.Boot = function Boot(game){};

Game.Boot.prototype = {

    preload: function(){
        //this.game.load.image("loading","images/Loading-GIF-Image-21.gif");
        this.game.load.image("loading","images/loading.png");
        this.game.load.json('stage1', 'json/stage1.json');
    },
    create: function(){
        var self  = this;
        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        ////this.scale.setScreenSize();
        self.game.state.start("Preload");
    }
};