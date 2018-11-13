import React from 'react';
import ReactDOM from 'react-dom';

export class AuthPortal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.containerEl = null;
        this.externalWindow = null;
    }

    getAuthorizationWindow() {
        const width = 420;
        const height = 470;
        const left = window.screenX + (window.innerWidth - width) / 2;
        const top = window.screenY + (window.innerHeight - height) / 2;
        const origin = /^[a-z]+:\/\/[^\/]*/.exec(location)[0];
        const authUrl = `https://trello.com/1/authorize?return_url=${origin}&callback_method=postMessage&expiration=never&name=Project&key=${this.props.apiKey}`;
        return window.open(authUrl, 'trello', `width=${width},height=${height},left=${left},top=${top}`);
    };

    componentDidMount() {
        // STEP 1: Create a new window, a div, and append it to the window. The div
        // *MUST** be created by the window it is to be appended to (Edge only)
        this.externalWindow = this.getAuthorizationWindow(this.props.apiKey);
        this.containerEl = this.externalWindow.document.createElement('div');
        this.externalWindow.document.body.appendChild(this.containerEl);
    }

    componentWillUnmount() {
        // STEP 2: This will fire when this.state.showWindowPortal in the parent component
        // becomes false so we tidy up by just closing the window
        this.externalWindow.close();
    }

    render() {
        // STEP 3: The first render occurs before componentDidMount (where we open the
        // new window) so container may be null, in this case render nothing.
        if (!this.containerEl) {
            return null;
        }

        console.log('render!');
        // STEP 4: Append props.children to the container <div> in the new window
        return ReactDOM.createPortal(this.props.children, this.containerEl);
    }
}
