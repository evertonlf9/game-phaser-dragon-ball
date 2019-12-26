'use strict';
var mediator = {

    events: {},

    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },

    off: function (eventName, fn) {
        if (this.events[eventName]) {

            var index = this.events[eventName].indexOf(fn);

            if (index !== -1) {
                this.events[eventName].splice(index, 1);
            }
        }
    },

    emit: function (eventName, arg1, arg2, arg3) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (fn) {
                fn(arg1, arg2, arg3);
            });
        }
    }
};