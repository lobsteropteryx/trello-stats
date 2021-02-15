import { connect } from 'react-redux';
import { ApiClient } from '../../../Trello/ApiClient';
import { fetchActionsForBoard } from '../queryFilterSlice';
import { getExportParameters } from '../csvExporter';

import QueryControls from './QueryControls';    

const mapStateToProps = state => {
    return {
        apiKey: state.queryFilter.apiKey,
        token: state.queryFilter.token,
        selectedBoard: state.queryFilter.selectedBoard,
        spinnerClass: state.queryFilter.isFetching ? 'spinner-enabled' : 'spinner-disabled',
        exportEnabled: state.queryFilter.exportEnabled,
        exportContent: state.queryFilter.csvData.content,
        exportUrl: state.queryFilter.csvData.url,
        exportFilename: state.queryFilter.csvData.filename,
        cards: state.localFilter.cards
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSubmit: (event, apiClient, selectedBoard) => {
            dispatch(fetchActionsForBoard(apiClient, selectedBoard));
        }
    }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
    const apiClient = new ApiClient(stateProps.apiKey, stateProps.token);
    return {
        spinnerClass: stateProps.spinnerClass,
        exportEnabled: stateProps.exportEnabled,
        exportContent: stateProps.exportContent,
        exportUrl: stateProps.exportUrl,
        exportFilename: stateProps.exportFilename,
        onSubmit: (event) => {
            dispatchProps.onSubmit(
                event, 
                apiClient,
                stateProps.selectedBoard
            )
        }
    }
}

const QueryControlsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(QueryControls);

export default QueryControlsContainer;