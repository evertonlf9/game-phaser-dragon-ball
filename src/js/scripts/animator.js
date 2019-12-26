/**
 * Created by everton on 19/08/2017.
 */
(function () {
    
    'use strict';
    
    var elements = {};

    function initalize() {
        mediator.on('ANIMATOR.SET_ELEMENTS', setElements);
        mediator.on('ANIMATOR.CREATE_SPRITE_ANIMATOR', createSpriteAnimations);
        mediator.on('ANIMATOR.ANIMATOR_ELEMENT', animatorElement);
        mediator.on('ANIMATOR.START_ANIMATOR', startAnimator);
    }
    
    function setElements(_elements) {
        elements = _elements;
    }

    /**
     * Obrigatório manter estrutura name, frames, fps e loop
     * @param {object}              _obj                Elemento a ser animado
     * @param {Array}               _animations         Array com todas animações do elemento
     * */
    function createSpriteAnimations(_obj, _animations) {

        for (var anima in _animations) {

            if (_animations.hasOwnProperty(anima)) {

                _obj.animations.add(
                    _animations[anima].name,
                    _animations[anima].frames,
                    _animations[anima].fps,
                    _animations[anima].loop
                );
            }
        }
    }

    /**
     * Muda animação e as posições x e y dos npcs
     * @param {Object} - _npc
     */
    function animatorElement( _npc ){

        var i, elem, max = _npc.length;
        for(i = 0; i < max; i++){
            elem = _npc[i];
            elements[elem.id].animations.play(elem.idAnimate);
            elements[elem.id].position.x += elem.posX;
            elements[elem.id].position.y += elem.posY;
        }
    }


    /**
     * Cria e inicia a animação
     * @param {object}                      _object                     Estrutura de configuração do elemento
     * @param {object}                      _elem                       Elemento a ser animado
     */
    function startAnimator(_object, _elem) {

        // se houver animações
        if (_object.animations) {
            
            createSpriteAnimations(_object, _object.animations);

            setTimeout(function (stateAnima) {
                    _object.animations.play(stateAnima);

                }.bind(_object, _elem['stateAnima']),

                _elem['delayAnima']
            );
        }
    }

    initalize();
})();