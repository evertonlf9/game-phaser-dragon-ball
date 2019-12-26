/**
 * Created by everton.ferreira on 26/10/2017.
 */
(function (){
    'use strict';

    var game = {};
    var setup = {WIDTH: 900, HEIGHT: 500};

    function main(){

        game = new Phaser.Game(setup.WIDTH, setup.HEIGHT, Phaser.AUTO, "game");

        game.state.add("Boot",Game.Boot);
        game.state.add("Preload",Game.Preload);
        game.state.add("Catisine",Game.Catisine);
        game.state.add("StartGame",Game.StartGame);
        game.state.add("Menu",Game.Menu);
        game.state.add("Game",Game.Main);
        game.state.add("GameOver",Game.GameOver);
        game.state.start("Boot");
    }

    main();

})();

/*
http://www.emanueleferonato.com/2014/08/28/phaser-tutorial-understanding-phaser-states/
this.game.state.start("GameOver",true,false,score);

Esta é a primeira vez que eu estou chamando o estado com todos os seus argumentos, então vamos dar uma olhada neles:

GameOver é o nome do estado para começar

O segundo argumento é chamado clearWorld , padrão em true e limpa a lista de exibição do Mundo totalmente (mas não o Stage, então, se você adicionou seus próprios objetos ao Stage eles precisarão gerenciar diretamente).

O terceiro argumento é chamado clearCache , o padrão em falso e limpa todos os ativos carregados. Você não usará isso muitas vezes enquanto queremos manter ativos carregados.

Todos os outros parâmetros do quarto são variáveis ​​que serão passadas para a função init (se tiver uma). Então, eu vou passar a pontuação para o estado GameOver , dê uma olhada em gameover.js :
*/