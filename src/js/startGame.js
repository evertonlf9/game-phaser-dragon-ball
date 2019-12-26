/**
 * Created by everton.ferreira on 26/10/2017.
 */
Game.StartGame = function StartGame(game){

};

Game.StartGame.prototype = {
    create: function(){

        this.game.stage.backgroundColor = "#4488AA";

        // Display background
        this.bg= this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.stage.height, 'bgStartGame');

        //x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group
        var playButton =  this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttons', this.playGame, this, 1, 0, 2);
        //playButton.setFrames(1, 0, 2);
        playButton.anchor.setTo(0.5,0.5);

        if(Game.CurrentAudio)
            Game.CurrentAudio.pause();

        Game.CurrentAudio =  this.game.add.audio('mp3StartGame');
        Game.CurrentAudio.play();
        Game.CurrentAudio.loopFull(1);
    },
    playGame: function(){
        this.game.state.start("Game");
    }
};

