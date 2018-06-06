/**
 * Created by Liranius on 2017/2/3.
 */

//Non-export
interface CreateStackFunc {
    (length?): Array<PokerCard>;
}

interface CreateStacksFunc {
    (length?): Array<PokerCard[]>;
}

function shuffle(arr: Array<any>) {
    for (let i = arr.length; i;) {
        let j: number, x: any;

        j = Math.floor(Math.random() * i);
        x = arr[--i];
        arr[i] = arr[j];
        arr[j] = x;
    }

    return arr;
}

let createCardStack: CreateStackFunc = (length: number) => {
    return new Array<PokerCard>(length);
};

//Exports
//basic data
export let suits: string[] = ["♠", "♥", "♣", "♦"];
export let cards: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export class PokerCard {
    private _suit: number;
    private _card: number;
    private _status: boolean = false;
    public cardElement: HTMLElement;

    constructor() {}

    public setCardElement = (): void => {
        this.cardElement = document.createElement("div");
        this.cardElement.className = "poker-card";
        this.cardElement.innerHTML =
            `<div class="card-wrapper ${ (this._suit % 2) ? "card-red" : "card-black" } hide">
                <p>${ cards[this._card] }</p>
                <h1>${ suits[this._suit] }</h1>
                <h1>${ suits[this._suit] }</h1>
                <p>${ cards[this._card] }</p>
            </div>`
    };

    //Suit getter and setter
    get suit(): number {
        return this._suit;
    }

    set suit(newSuit: number) {
        try {
            if (this._suit === undefined)
                this._suit = newSuit;
            else
                throw "Suit value has been set.";
        }
        catch(e) {
            console.log(e);
        }
    }

    //Card getter and setter
    get card(): number {
        return this._card;
    }

    set card(newCard: number) {
        try {
            if (this._card === undefined)
                this._card = newCard;
            else
                throw "Card value has been set.";
        }
        catch(e) {
            console.log(e);
        }
    }

    //Status getter and setter
    get status(): boolean {
        return this._status;
    }

    set status(newStatus: boolean) {
        this._status = newStatus;
    }
}

//functions
export let createDeck: CreateStackFunc = () => {
    let deck = new Array<PokerCard>(suits.length * cards.length);

    for (let i=0; i<deck.length; i++) {
        deck[i] = new PokerCard();
        deck[i].suit = Math.floor(i % deck.length / cards.length);
        deck[i].card = i % deck.length % cards.length;
        deck[i].setCardElement();
    }

    // return deck;
    return shuffle(deck);
};

export let createCoveredStacks: CreateStacksFunc = (length: number) => {
    let stack = new Array<PokerCard[]>(length);

    for (let i=0; i<length; i++) {
        stack[i] = createCardStack(i + 1);
    }

    return stack;
};

export let createFinishStacks: CreateStacksFunc = () => {
    let stack = new Array(suits.length);

    // for (let i=0; i<stack.length; i++) {
    //     stack[i] = createCardStack(cards.length);
    // }
    for (let i=0; i<stack.length; i++) {
        stack[i] = createCardStack(0);
    }

    return stack;
};

//amd export
// export = {suits, cards, PokerCard, createDeck, createCoveredStacks, createFinishStacks};