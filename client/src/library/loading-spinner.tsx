import * as React from 'react';

export interface LoadingSpinnerProps {
    show: boolean;
}

export class LoadingSpinner extends React.Component<LoadingSpinnerProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (<div style={ { display: this.props.show ? "block" : "none" } } className="loading-spinner-container text-center">
            <i className="fa fa-spinner fa-spin fa-4x top-margin-50"></i>
        </div>);
    }
}