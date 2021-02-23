import { createSelector } from "reselect";
import percentile from 'percentile';
import { cardToWorkItem } from "../workItem";
import { filterWorkItemByDate, filterCardByLabel } from "../filters";

const getCards = state => state.localFilter.cards;
const getSelectedLabels = state => state.localFilter.selectedLabels;
const getStartColumn = state => state.localFilter.startColumn.id;
const getEndColumn = state => state.localFilter.endColumn.id;
const getStartDate = state => state.date.startDate;
const getEndDate = state => state.date.endDate;

export const getPercentiles = createSelector(
    [getCards, getSelectedLabels, getStartColumn, getEndColumn, getStartDate, getEndDate],
    (cards, selectedLabels, startColumn, endColumn, startDate, endDate) => {
        const durations = cards
            .filter(card => filterCardByLabel(card, selectedLabels))
            .map(card => cardToWorkItem(card, startColumn, endColumn))
            .filter(card => filterWorkItemByDate(card, startDate, endDate))
            .map(card => card.duration.asDays());
        
        return {
            n: durations.length,
            fifty: Math.ceil(percentile(50, durations)) || 0,
            seventyFive: Math.ceil(percentile(75, durations)) || 0,
            eightyFive: Math.ceil(percentile(85, durations)) || 0,
            ninetyFive: Math.ceil(percentile(95, durations)) || 0
        }
    }
);