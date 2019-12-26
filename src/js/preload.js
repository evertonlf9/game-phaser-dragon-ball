/**
 * Created by everton.ferreira on 26/10/2017.
 */
Game.Preload = function Preload(game){};

Game.Preload.prototype = {

    preload: function(){

        Game.Stage = this.game.cache.getJSON('stage1');

        var stage = Game.Stage;
        var map = stage.map, propertiesPlayer = stage.player, playerName = stage.player.name;
        var loadingBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY,"loading");

        loadingBar.anchor.setTo(0.5,0.5);
        this.load.setPreloadSprite(loadingBar);

        this.game.load.tilemap(map.name, map.url, null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image(map.spriteSheet.name, map.spriteSheet.url);

        // personagem
        this.game.load.spritesheet(playerName, propertiesPlayer.url, propertiesPlayer.width, propertiesPlayer.height);
        // virtualjoystick
        this.game.load.atlas('arcade', 'images/virtualjoystick/skins/arcade-joystick.png', 'images/virtualjoystick/skins/arcade-joystick.json');

        this.loadImg();
        this.loadAudios();
        this.loadVideos();

        // carrega
        this.loadElements(stage['npcs']);
        this.loadElements(stage['elements']);

    },

    loadImg: function(){

        this.game.load.spritesheet('kaboom', 'images/explode.png', 128, 128);
        this.game.load.spritesheet('energia', 'images/energia1.png', 64, 76);

        this.game.load.image('weapon', 'images/tiro1.png');

        this.game.load.spritesheet('buttons', 'images/button-start-spritesheet.png', 200, 72);
        //this.game.load.spritesheet('buttons', 'images/number-buttons-90x90.png',90,90);
        this.game.load.image('bgStartGame', 'images/options-bg.jpg');
        this.game.load.image('bgGameOver', 'images/gameOver.jpg');
    },

    loadVideos: function(){
        this.game.load.video('space', 'videos/wormhole.mp4')
    },

    loadAudios: function () {
        this.game.load.audio('mp3StartGame', ['audios/Dangerous.mp3']);
        this.game.load.audio('mp3Game', ['audios/Exit the Premises.mp3']);

        this.game.load.audiosprite('sfx', 'audios/fx_mixdown.mp3', null, audioJSON);
    },

    loadFonts: function () {
    },

    loadJsons: function(){
    },

    loadElements: function(elements){

        for (var el in elements) {

            if (elements.hasOwnProperty(el)) {
                this.game.load.spritesheet(
                    elements[el].name,
                    elements[el].url,
                    elements[el].width,
                    elements[el].height
                );
            }
        }
    },

    create: function() {
        this.game.state.start("Catisine");
        //this.game.state.start("Game");
    }
};

var audioJSON = {
    spritemap: {
        'alien death': {
            start: 1,
            end: 2,
            loop: false
        },
        'boss hit': {
            start: 3,
            end: 3.5,
            loop: false
        },
        'escape': {
            start: 4,
            end: 7.2,
            loop: false
        },
        'meow': {
            start: 8,
            end: 8.5,
            loop: false
        },
        'numkey': {
            start: 9,
            end: 9.1,
            loop: false
        },
        'ping': {
            start: 10,
            end: 11,
            loop: false
        },
        'death': {
            start: 12,
            end: 16.2,
            loop: false
        },
        'shot': {
            start: 17,
            end: 18,
            loop: false
        },
        'squit': {
            start: 19,
            end: 19.3,
            loop: false
        }
    }
};
