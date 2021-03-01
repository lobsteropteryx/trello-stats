import moment from 'moment';
import { 
    Card as TrelloCard, 
    Action as TrelloAction,
    CreateAction as TrelloCreateAction,
    UpdateAction as TrelloUpdateAction,
    Label as TrelloLabel,
    ActionType
} from "./types";
import { Card, Action, Label } from "../card";

export function parseTrelloCards(trelloCards: TrelloCard[]) {
    return trelloCards.map(parseTrelloCard);
}

function parseTrelloCard(trelloCard: TrelloCard): Card {
    return {
        id: trelloCard.id,
        name: trelloCard.name,
        labels: trelloCard.labels.map(parseTrelloLabel),
        actions: trelloCard.actions.map(parseTrelloAction)
    }
}

function parseTrelloLabel(trelloLabel: TrelloLabel): Label {
    return trelloLabel;
}

function parseTrelloAction(trelloAction: TrelloAction): Action {
    if (trelloAction.type === ActionType.UpdateCard) {
        return parseUpdateCardAction(trelloAction as TrelloUpdateAction);
    } else {
        return parseCreateCardAction(trelloAction as TrelloCreateAction);
    }
}

function parseUpdateCardAction(trelloAction: TrelloUpdateAction): Action {
    return {
        type: trelloAction.type,
        startColumn: {
            id: trelloAction.data.listBefore.id,
            name: trelloAction.data.listBefore.name
        },
        endColumn: {
            id: trelloAction.data.listAfter.id,
            name: trelloAction.data.listAfter.name
        },
        date: moment(trelloAction.date)
    }
}

function parseCreateCardAction(trelloAction: TrelloCreateAction): Action {
    return {
        type: trelloAction.type,
        startColumn: {
            id: trelloAction.data.list.id,
            name: trelloAction.data.list.name
        },
        endColumn: {
            id: null,
            name: null
        },
        date: moment(trelloAction.date)
    }
}