import { Component, OnInit } from '@angular/core';

import { Suit } from '../shared/data-models/card';
import { Points } from '../shared/data-models/card';

@Component({
    selector: 'kl-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    suit: Suit = Suit.Spade;
    points: Points = Points.King;
    flipped = false;
    position: Position;
    color: 'red' | 'black';

    Points = Points;

    constructor() {
    }

    ngOnInit() {
        this.color = this.suit === Suit.Spade || this.suit === Suit.Club ? 'black' : 'red';
    }

}
