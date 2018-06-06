/**
 * Created by Liranius on 2017/2/3.
 */
import * as DBJSN from "./debugJson";
import * as Defs from "./Definitions";
import {PokerCard} from "./Definitions";

export class Klondike {
    public cardPile: Array<PokerCard>;
    public abanCardPile: Array<PokerCard>;
    public coveredStacks: Array<Array<PokerCard>>;
    public finishStacks: Array<Array<PokerCard>>;
    // public draggedCard: HTMLElement;
    // public draggedOrigin: HTMLElement;
    // public selectedCard: Defs.PokerCard;

    private _bindings: { [index: string]: string } = {
        cardPileID: "",
        abanCardPileID: "",
        finishStackClass: "",
        coveredStackClass: "",
        cardClass: "",
        solveID: "",
        redealID: "",
        recallID: ""
    };

    private _eventType: string;
    private _draggedCardIndex: number;
    private _draggedType: string;
    private _draggedOrigClass: string;
    private _draggedOrigIndex: number;
    private _droppedDestClass: string;
    private _droppedDestIndex: number;

    private _uncoverTopCard(coveredStack: HTMLElement): void {
        if ((<HTMLElement>coveredStack.lastChild.lastChild).classList.contains("hide")) {
            (<HTMLElement>coveredStack.lastChild.lastChild).classList.remove("hide");
            this._toggleDraggable(<HTMLElement>coveredStack.lastChild);
        }
    }

    private _toggleDraggable(cardDiv: HTMLElement): void {
        (cardDiv.draggable) ? cardDiv.draggable = false : cardDiv.draggable = true;
    }

    /* drop card call back */
    private _dropCardCallback = (target: HTMLElement, cardDiv: HTMLElement, stackDiv: HTMLElement): void => {
        /* catch double-clicked card and its origin */
        if (!cardDiv && !stackDiv) {
            cardDiv = target;
            stackDiv = <HTMLElement>(target.parentNode);
            this._eventType = "dblclick";

            (stackDiv.lastChild === cardDiv) ? this._draggedType = "card" : this._draggedType = "cardArray";
        }

        if (this._draggedType == "cardArray") {
            if (this._eventType == "dblclick")
                return;
            else
                for (let i=0; i<stackDiv.children.length; i++)
                    if (stackDiv.children[i] === cardDiv)
                        this._draggedCardIndex = i;
        }
        else
            this._draggedCardIndex = stackDiv.children.length - 1;
        this._draggedOrigClass = stackDiv.id.slice(0, -2);
        this._draggedOrigIndex = (stackDiv.id === "abandoned-card-pile") ?
            0 : parseInt(stackDiv.id.charAt(stackDiv.id.length - 1));
        if (this._eventType == "drag") {
            this._droppedDestClass = target.id.slice(0, -2);
            this._droppedDestIndex = parseInt(target.id.charAt(target.id.length - 1));

            target.classList.remove("high-light");
        }

        if (
            //data operation
            this._moveCardData()
        ) {
            //UI operation
            switch (this._draggedType) {
                case "cardArray":
                    let tempArr: HTMLElement = document.createElement("div");
                    for (let i=stackDiv.children.length-1; i>=this._draggedCardIndex; i--) {
                        tempArr.appendChild(<HTMLElement>stackDiv.children[i]);
                    }
                    // while (draggedStackDiv.children.length > rThis._draggedCardIndex) {
                    //     tempArr.push(<HTMLElement>draggedStackDiv.lastChild);
                    //     delete draggedStackDiv.lastChild;
                    // }
                    while (tempArr.children.length)
                        target.appendChild(tempArr.lastChild);
                    break;
                case "card":
                    if (this._eventType === "dblclick")
                        document.getElementsByClassName(this._droppedDestClass)[this._droppedDestIndex].appendChild(cardDiv);
                    else
                        target.appendChild(cardDiv);
                    break;
            }
            if (stackDiv.classList.contains("covered-stack") && stackDiv.children.length)
                this._uncoverTopCard(stackDiv);
        }

        /* if meet success condition, end game */
        this._endGameJudgement();
    };
    private _moveCardData = (): boolean => {
        let origin: PokerCard[], destiny: PokerCard[];

        /* locate origin and check value legality */
        switch (this._draggedOrigClass) {
            case "finish-stack":
                origin = this.finishStacks[this._draggedOrigIndex];
                break;
            case "covered-stack":
                origin = this.coveredStacks[this._draggedOrigIndex];
                break;
            case "abandoned-card-pi":
                origin = this.abanCardPile;
                break;
            default:
                try{ throw "Origin received unexpected class name."; }
                catch(e) { console.log(e); }
                return false;
        }

        /* locate destiny and check value legality */
        /* special for double-click event */
        if (this._eventType === "dblclick") {
            /* if origin card is Ace, find an empty finish stack for it */
            if (origin[origin.length - 1].card === 0) {
                for (let i=0; i<this.finishStacks.length; i++) {
                    if (!this.finishStacks[i].length) {
                        this._droppedDestClass = "finish-stack";
                        this._droppedDestIndex = i;
                        break;
                    }
                }
            }
            else {
                /* if origin card is not Ace, check if origin card has a legal position in finish stacks */
                for (let i=0; i<this.finishStacks.length; i++) {
                    if (!this.finishStacks[i].length)
                        continue;
                    if (
                        this.finishStacks[i][this.finishStacks[i].length-1].suit === origin[origin.length - 1].suit &&
                        this.finishStacks[i][this.finishStacks[i].length-1].card === origin[origin.length - 1].card - 1
                    ) {
                        this._droppedDestClass = "finish-stack";
                        this._droppedDestIndex = i;
                        break;
                    }
                }
                /* if unable to find a legal position in finish stacks, stop moving cards */
                if (!this._droppedDestClass)
                    return false;
            }
        }

        switch (this._droppedDestClass) {
            case "finish-stack":
                destiny = this.finishStacks[this._droppedDestIndex];

                /* value legality check */
                if (destiny === origin)
                    return false;
                else if (this._draggedType == "cardArray")
                    return false;
                else if (!destiny.length) {
                    if (origin[origin.length - 1].card) {
                        alert("First card of this slot must be an Ace!");
                        return false;
                    }
                }
                else {
                    if (origin[origin.length - 1].suit !== destiny[0].suit) {
                        alert("Suits of cards in this slot must be all the same!");
                        return false;
                    }
                    else if (origin[origin.length - 1].card !== destiny[destiny.length - 1].card + 1) {
                        alert("Card dropped on top of this slot must be 1 point larger than card below it!");
                        return false;
                    }
                }
                break;
            case "covered-stack":
                destiny = this.coveredStacks[this._droppedDestIndex];

                /* value legality check */
                if (destiny === origin)
                    return false;
                else if (this._draggedType == "cardArray") {
                    if (!destiny.length) {
                        if (origin[this._draggedCardIndex].card !== 12)
                            return false;
                    }
                    else if (Math.abs(origin[this._draggedCardIndex].suit % 2 - destiny[destiny.length - 1].suit % 2) !== 1) {
                        return false;
                    }
                    else if (origin[this._draggedCardIndex].card !== destiny[destiny.length - 1].card - 1) {
                        return false;
                    }
                }
                else if (!destiny.length) {
                    if (origin[origin.length - 1].card !== 12) {
                        alert("First card of this slot must be a King!");
                        return false;
                    }
                }
                else {
                    if (Math.abs(origin[origin.length - 1].suit % 2 - destiny[destiny.length - 1].suit % 2) !== 1) {
                        alert("Card dropped on top of this slot must be different color of card below it!");
                        return false;
                    }
                    else if (origin[origin.length - 1].card !== destiny[destiny.length - 1].card - 1) {
                        alert("Card dropped on top of this slot must be 1 point less than card below it!");
                        return false;
                    }
                }
                break;
            case "abandoned-card-pi":
                return false;
            default:
                try{ throw "Destiny received unexpected class name."; }
                catch(e) { console.log(e); }
                return false;
        }

        switch (this._draggedType) {
            case "cardArray":
                // console.log(destiny);
                let tempArr = Array<PokerCard>(0);
                for (let i=origin.length-1; i>=this._draggedCardIndex; i--)
                    tempArr.push(origin.pop());
                while (tempArr.length)
                    destiny.push(tempArr.pop());
                destiny = destiny.concat(origin.slice(this._draggedCardIndex, origin.length));
                // console.log(destiny);
                break;
            case "card":
                destiny.push(origin.pop());
                break;
            default:
                try{ throw "Unexpected draggedType value."; }
                catch(e) { console.log(e); }
                return false;
        }

        return true;
    };
    private _endGameJudgement = (): void => {
        if ((() => {
                for (let i=0; i<this.finishStacks.length; i++)
                    if (this.finishStacks[i].length !== 13)
                        return false;
                return true;
            })()) {
            /* disable drag property and show success message */
            for (let i=0; i<document.getElementsByClassName("poker-card").length; i++)
                (<HTMLElement>(document.getElementsByClassName("poker-card")[i])).draggable = false;
            alert("Congratulations! You have won the game!");
        }
    };

    constructor(bindings: { [index: string]: string }) {
        this.cardPile = Defs.createDeck();
        this.abanCardPile = new Array(0);
        this.coveredStacks = Defs.createCoveredStacks(7);
        this.finishStacks = Defs.createFinishStacks();

        this._bindings = bindings;

        /* deal */
        this.dealCards();

        /* click card pile */
        this.onClickCardPile();

        this.dragCard();
        this.dbClickCard();

        /* auxiliary functions */
        this.hint();
        this.solve();
        this.redeal();
        this.recall();
    }

    /* deal card */
    public dealCards(): void {
        let cardPileDiv: HTMLElement = document.getElementById(this._bindings["cardPileID"]);
        let coveredStackDivs: HTMLCollection = document.getElementsByClassName(this._bindings["coveredStackClass"]);

        for (let i=0; i<this.coveredStacks.length; i++)
            for (let j=0; j<this.coveredStacks[i].length; j++)
                this.coveredStacks[i][j] = this.cardPile.pop();

        /* card pile */
        for (let i=0; i<this.cardPile.length; i++)
            cardPileDiv.appendChild(this.cardPile[i].cardElement);

        /* covered stack */
        for (let i=0; i<this.coveredStacks.length; i++) {
            for (let j=0; j<this.coveredStacks[i].length; j++)
                coveredStackDivs[i].appendChild(this.coveredStacks[i][j].cardElement);
            this._uncoverTopCard(<HTMLElement>coveredStackDivs[i]);
        }
    }

    /* click for a new card */
    public onClickCardPile(): void {
        let rThis = this;
        let cardPileDiv: HTMLElement = document.getElementById(this._bindings["cardPileID"]);
        let abanCardPileDiv: HTMLElement = document.getElementById(this._bindings["abanCardPileID"]);

        /* bind to mouseup event to prevent colision with dblclick event */
        cardPileDiv.addEventListener("mouseup", function() {
            if (this.children.length) {
                //* create a temp element to filtrate inherited event */
                // let tempElement = document.createElement("div");
                // tempElement.className = (<HTMLElement>this.lastChild).className;
                // tempElement.innerHTML = (<HTMLElement>this.lastChild).innerHTML;

                //UI operation
                // this.removeChild(this.lastChild);
                // (<HTMLElement>tempElement.lastChild).className =
                //     (<HTMLElement>tempElement.lastChild).className.replace(" hide", "");
                // rThis.toggleDraggable(tempElement);
                // abanCardPileDiv.appendChild(tempElement);
                (<HTMLElement>this.lastChild.lastChild).classList.remove("hide");
                rThis._toggleDraggable(<HTMLElement>this.lastChild);
                abanCardPileDiv.appendChild(this.lastChild);

                //data operation
                rThis.abanCardPile.push(rThis.cardPile.pop());
            }
            /* action if click empty card pile */
            else {
                while(abanCardPileDiv.children.length) {
                    //UI operation
                    // console.log((<HTMLElement>abanCardPileDiv.lastChild.lastChild).className);
                    this.appendChild(abanCardPileDiv.lastChild);
                    rThis._toggleDraggable(<HTMLElement>this.lastChild);
                    (<HTMLElement>this.lastChild.lastChild).classList.add("hide");

                    //data operation
                    rThis.cardPile.push(rThis.abanCardPile.pop());
                }
            }
        });
    }

    public dragCard(): void {
        let rThis = this;//rename this of class itself to prevent collision with this of event listener callback function
        let cardDivs: HTMLCollection = document.getElementsByClassName(this._bindings["cardClass"]);
        let finishStackDivs: HTMLCollection = document.getElementsByClassName(this._bindings["finishStackClass"]);
        let coveredStackDivs: HTMLCollection = document.getElementsByClassName(this._bindings["coveredStackClass"]);

        let draggedCardDiv: HTMLElement;
        let draggedStackDiv: HTMLElement;

        /* enable drag over event for screen */
        document.addEventListener("dragover", (evt) => { evt.preventDefault(); });
        document.addEventListener("drop", (evt) => { evt.preventDefault(); });//special for firefox to prevent jump to a new URL

        /* catch dragged card and its origin */
        for (let i=0; i<cardDivs.length; i++) {
            cardDivs[i].addEventListener("dragstart", function(evt: DragEvent) {
                evt.dataTransfer.setData("text/plain", "zero");//special for firefox, ff can't excute drag when receiving zero-length dataTransfer obj

                draggedCardDiv = this;
                draggedStackDiv = this.parentNode;
                rThis._eventType = "drag";

                (draggedStackDiv.lastChild === draggedCardDiv) ? rThis._draggedType = "card" : rThis._draggedType = "cardArray";
            });
            cardDivs[i].addEventListener("dragend", function() {
                // this.style = undefined;
            });
        }

        /* drop card to finish stack */
        for (let i=0; i<this.finishStacks.length; i++) {
            /* highlight targeted position */
            finishStackDivs[i].addEventListener("dragenter", function() {
                //UI operation
                this.classList.add("high-light");
            });

            /* remove highlight if drag away */
            finishStackDivs[i].addEventListener("dragleave", function(evt) {
                //UI operation
                evt.stopPropagation();
                if (this === evt.target)
                    this.classList.remove("high-light");
            }, true);//use capture and stopPropagation to prevent children from response the event

            /* drop card to finish stack */
            finishStackDivs[i].addEventListener("drop", function() {
                rThis._dropCardCallback(this, draggedCardDiv, draggedStackDiv);
            });
        }
        /* drop card to covered stack */
        for (let i=0; i<this.coveredStacks.length; i++)
            coveredStackDivs[i].addEventListener("drop", function() {
                rThis._dropCardCallback(this, draggedCardDiv, draggedStackDiv);
            });
    }

    public dbClickCard(): void {
        let rThis = this;
        let abanCardPileDiv: HTMLElement = document.getElementById(this._bindings["abanCardPileID"]);
        let coveredStackDivs: HTMLCollection = document.getElementsByClassName(this._bindings["coveredStackClass"]);

        let dblClkdCardDiv: HTMLElement;
        let dblClkdStackDiv: HTMLElement;

        /* drop card */
        function listener(): void {
            rThis._dropCardCallback(this.lastChild, dblClkdCardDiv, dblClkdStackDiv);
        }

        abanCardPileDiv.addEventListener("dblclick", listener);
        for (let i=0; i<coveredStackDivs.length; i++)
            coveredStackDivs[i].addEventListener("dblclick", listener);
    };

    public hint(): void {
        let rThis = this;

        document.addEventListener("keydown", function(evt) {
            if (evt.keyCode === 72) {
                //TODO
            }
        });
    }

    public solve(): void {
        let rThis = this;

        document.getElementById(this._bindings["solveID"]).addEventListener("click", function() {
            //TODO
        });
    }

    public redeal(): void {
        let rThis = this;

        document.getElementById(this._bindings["redealID"]).addEventListener("click", function() {
            //TODO
        });
    }

    public recall(): void {
        let rThis = this;

        document.getElementById(this._bindings["recallID"]).addEventListener("click", function() {
            recallCallback();
        });
        document.addEventListener("keydown", function(evt) {
            if (evt.keyCode === 90 && evt.ctrlKey) {
                recallCallback();
            }//TODO
        });

        function recallCallback() {
            //TODO
        }
    }
}