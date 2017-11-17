import * as React from 'react';
import { Overlay } from "./overlay";

export interface LoadingOverlayProps {
    show: boolean;
}

export class LoadingOverlay extends React.Component<LoadingOverlayProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <Overlay show={this.props.show}><i className="fa fa-spinner fa-spin fa-4x" style={{ marginTop: 100 }}></i></Overlay>;
    }
}