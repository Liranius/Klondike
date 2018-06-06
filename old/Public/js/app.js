/**
 * Created by Liranius on 2017/2/5.
 */
var klondike;

// System.import("klondike.js").then(function(m) {
System.import("main").then(function(m) {
//     var klondike = new m.Klondike({
//     console.log(m);
    klondike = new m.Klondike({
        cardPileID: "card-pile",
        abanCardPileID: "abandoned-card-pile",
        finishStackClass: "finish-stack",
        coveredStackClass: "covered-stack",
        cardClass: "poker-card",
        solveID: "solve",
        redealID: "redeal",
        recallID: "recall"
    });
});
