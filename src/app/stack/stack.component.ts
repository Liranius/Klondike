import { Component, OnInit } from '@angular/core';
import { Stack } from '../shared/data-models/stack';

@Component({
    selector: 'kl-stack',
    templateUrl: './stack.component.html',
    styleUrls: ['./stack.component.scss']
})
export class StackComponent implements OnInit {
    Stack = Stack;
    type: Stack = Stack.CoveredDeck;

    constructor() {
    }

    ngOnInit() {
    }
}
