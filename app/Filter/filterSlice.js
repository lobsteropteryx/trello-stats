import { createSlice } from '@reduxjs/toolkit';
import ApiClient from '../Trello/ApiClient';
import { actionsToCards } from '../Trello/actionParser';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    apiKey: 'e052546597a829919aae4fbd2a6e4095',
    boards: [],
    selectedBoard: {},
    startColumn: { id: null, name: null },
    endColumn: { id: null, name: null },
    columns: [],
    cards: []
  },
  reducers: {
    fetchPending: state => {
        state.isFetching = true;
    },
    fetchComplete: state => {
        state.isFetching = false;
    },
    setTrelloToken: (state, action) => {
        state.token = action.payload;
    },
    setBoards: (state, action) => {
        state.boards = action.payload;
    },
    selectBoard: (state, action) => {
        state.selectedBoard = action.payload;
        state.startColumn = { id: null, name: null };
        state.endColumn = { id: null, name: null };
    },
    setColumns: (state, action) => {
        state.columns = action.payload;
    },
    setStartColumn: (state, action) => {
        state.startColumn = {
            id: action.payload.value,
            name: action.payload.label
        };
    },
    setEndColumn: (state, action) => {
        state.endColumn = {
            id: action.payload.value,
            name: action.payload.label
        }
    },
    setCards: (state, action) => {
        state.cards = action.payload;
    },
    setStartDate: (state, action) => {
        state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
        state.endDate = action.payload;
    }
  }
});

export const { 
    fetchPending,
    fetchComplete,
    setTrelloToken,
    setBoards,
    selectBoard,
    setColumns,
    setStartColumn,
    setEndColumn,
    setCards,
    setStartDate,
    setEndDate 
} = filterSlice.actions;

const buildApiClient = (filter) => {
    return new ApiClient(filter.apiKey, filter.token);
}

export const fetchBoards = () => async (dispatch, getState) => {
    const client = buildApiClient(getState().filter);
    dispatch(fetchPending());
    dispatch(setBoards(await client.getBoards()));
    dispatch(fetchComplete());
}

export const fetchColumnsForBoard = (boardId) => async (dispatch, getState) => {
    const client = buildApiClient(getState().filter);
    dispatch(fetchPending());
    dispatch(setColumns(await client.getColumnsForBoard(boardId)));
    dispatch(fetchComplete());
}

export const fetchActionsForBoard = (boardId) => async (dispatch, getState) => {
    const client = buildApiClient(getState().filter);
    dispatch(fetchPending());
    const actions = await client.getActionsForBoard(boardId);
    const cards = actionsToCards(actions);
    dispatch(setCards(cards));
    dispatch(fetchComplete());
}

export default filterSlice.reducer;