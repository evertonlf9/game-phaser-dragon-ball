/**
 * Created by everton.ferreira on 26/10/2017.
 */
Game.GameOver = function GameOver(game){

};

Game.GameOver.prototype = {

    create: function(){

        // Display background
        this.bg= this.game.add.tileSprite(0, 0, this.game.stage.width, this.game.stage.height, 'bgGameOver');

        //x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame, group
        var playButton =  this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'buttons', this.reStartGame, this, 1, 0, 2);
        //playButton.setFrames(1, 0, 2);
        playButton.anchor.setTo(0.5,0.5);
    },
    reStartGame: function(){
        this.game.state.start("Game");
    }
};