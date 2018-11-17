import nock from 'nock';
import { mockStore } from '../mockStore';

import {
    INITIALIZE_DATA,
    initializeData,
    SET_TRELLO_TOKEN,
    setTrelloToken,
    GET_BOARDS,
    getBoards,
    SET_BOARD,
    setBoard,
    SELECT_BOARD,
    selectBoard,
    FETCH_BOARDS,
    fetchBoards,
    GET_COLUMNS,
    getColumns,
    FETCH_COLUMNS,
    fetchColumns,
    SELECT_STARTING_COLUMN,
    selectStartingColumn,
    SELECT_ENDING_COLUMN,
    selectEndingColumn,
    SET_START_DATE,
    setStartDate,
    SET_END_DATE,
    setEndDate
} from '../../app/Trello/actions';


describe("Trello Auth", () => {
    it("sets a trello token", () => {
        expect(setTrelloToken('abc')).toEqual({
            type: SET_TRELLO_TOKEN, token: 'abc'
        });
    });

    it("initializes data", async () => {
        const boards = [{id: 1, name: 'my board'}];
        const token = 'abc';
        const store = mockStore({trello: {}});

        nock('https://api.trello.com')
            .get('/1/members/me/boards')
            .query(true)
            .reply(200, boards);

        await store.dispatch(initializeData(token));
        const actions = store.getActions();

        expect(actions[0]).toEqual({type: SET_TRELLO_TOKEN, token: token});
        expect(actions[1]).toEqual({type: GET_BOARDS, boards});
    });
});

describe("Trello Boards", () => {
    it("gets a list of trello boards", () => {
        const boards = [];
        expect(getBoards(boards)).toEqual({
            type: GET_BOARDS, boards
        });
    });

    it("sets a board", () => {
        const board = {name: 'myBoard'};
        expect(setBoard(board)).toEqual({
            type: SET_BOARD, board
        });
    });

    it("selects a board", async () => {
        const board = {value: 'boardId', label: 'my board'};
        const columns = [{id: 1, name: 'my column'}];
        const store = mockStore({trello: {
            apiKey: 'apiKey',
            token: 'token',
            selectedBoard: board
        }});

        nock('https://api.trello.com')
            .get('/1/boards/boardId/lists')
            .query(true)
            .reply(200, columns);

        await store.dispatch(selectBoard(board));
        const actions = store.getActions();

        expect(actions[0]).toEqual({type: SET_BOARD, board});
        expect(actions[1]).toEqual({type: GET_COLUMNS, columns});
    });

    it("requests boards", async () => {
        const boards = [{id: 1, name: 'my board'}];

        const store = mockStore();

        nock('https://api.trello.com')
            .get('/1/members/me/boards')
            .query(true)
            .reply(200, boards);

        await store.dispatch(fetchBoards('apiKey', 'token'));
        const actions = store.getActions();
        expect(actions[0]).toEqual({type: GET_BOARDS, boards});
    });
});

describe("Trello Columns", () => {
    it("gets a list of trello columns", () => {
        const columns = [];
        expect(getColumns(columns)).toEqual({
            type: GET_COLUMNS, columns
        });
    });

    it("requests columns", async () => {
        const columns = [{id: 1, name: 'my list'}];

        const store = mockStore();

        nock('https://api.trello.com')
            .get('/1/boards/abc/lists')
            .query(true)
            .reply(200, columns);

        await store.dispatch(fetchColumns('apiKey', 'token', 'abc'));
        const actions = store.getActions();
        expect(actions[0]).toEqual({type: GET_COLUMNS, columns});
    });

    it("sets the starting column", () => {
        const column = {name: 'myColumn'};
        expect(selectStartingColumn(column)).toEqual({
            type: SELECT_STARTING_COLUMN, column
        });
    });

    it("sets the ending column", () => {
        const column = {name: 'myColumn'};
        expect(selectEndingColumn(column)).toEqual({
            type: SELECT_ENDING_COLUMN, column
        });
    });
});

describe("Filtering by Date", () => {
    it("sets the start date", () => {
        const date = new Date('Jan 1, 2000');
        expect(setStartDate(date)).toEqual({
            type: SET_START_DATE, date
        });
    });

    it("sets the end date", () => {
        const date = new Date('Jan 1, 2000');
        expect(setEndDate(date)).toEqual({
            type: SET_END_DATE, date
        });
    });
});