import React from 'react';
import PropTypes from 'prop-types';
import ExportButton from '../ExportButton/ExportButton';
import spinner from '../../../images/spinner.svg';

const SubmitButton = (props) => {
    return (
        <div className='submitButton'>
            <button onClick={props.onSubmit}>Submit</button>
            <ExportButton 
                enabled={props.exportEnabled} 
                content={props.exportContent} 
                url={props.exportUrl} filename={props.exportFilename} 
            />
            <img className={props.spinnerClass} src={spinner} />
        </div>
    );
};

SubmitButton.propTypes = {
    onSubmit: PropTypes.func.isRequired
};

export default SubmitButton;