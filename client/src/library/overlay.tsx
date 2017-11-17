import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface OverlayProps {
    show: boolean;
}

export class Overlay extends React.Component<OverlayProps, {}> {
    constructor(props: any) {
        super(props);
    }

    getStyle() : React.CSSProperties {
        let style: React.CSSProperties = {
            position: "fixed",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 2,
        };

        if(this.props.show)
            style.display = "block";
        else
            style.display = "none";

        return style;
    }

    render() {
        return (<div className="text-center" style={this.getStyle()}>
            {this.props.children}
        </div>);
    }
}