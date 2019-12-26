/**
 * Created by everton.ferreira on 27/10/2017.
 */
Game.Catisine = function Catisine(game){};

Game.Catisine.prototype = {

    create: function(){

        var video = this.game.add.video('space');
        video.play(true);
        //  x, y, anchor x, anchor y, scale x, scale y
        video.addToWorld(400, 300, 0.5, 0.5);

        video.loop = false;
        video.onComplete.add(this.onCompleteVideo, this);
    },

    onCompleteVideo: function(){
        this.game.state.start("StartGame");
    }
};