// define a new console
let consoleCounter = 0;
var console=(function(oldCons){
    return {
        log: function(...text){
            oldCons.log(consoleCounter++,...text);
            // Your code
        },
        info: function (...text) {
            oldCons.info(consoleCounter++,...text);
            // Your code
        },
        warn: function (...text) {
            oldCons.warn(consoleCounter++,...text);
            // Your code
        },
        error: function (...text) {
            oldCons.error(consoleCounter++,...text);
            // Your code
        }
    };
}(window.console));

//Then redefine the old console
window.console = console;