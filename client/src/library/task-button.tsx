import { CancellablePromise, makeCancelable, catchCancelNoOp } from '../helpers/promise-helpers';
import * as React from 'react';

export interface TaskButtonProps {
    onClick: (ev: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
    className?: string;
    type?: string;
    disabled?: boolean;
}

interface TaskButtonState {
    working: boolean;
}

export class TaskButton extends React.Component<TaskButtonProps, TaskButtonState> {
    private task?: CancellablePromise<void>;

    constructor(props: any) {
        super(props);

        this.state = {
            working: false
        };
    }

    componentWillUnmount() {
        if(this.task)
            this.task.cancel();
    }

    doTask = (ev: React.MouseEvent<HTMLButtonElement>) => {
        ev.preventDefault();

        this.setState({
            working: true
        });

        this.task = makeCancelable(this.props.onClick(ev));
        this.task.promise.then(this.resetState)
                         .catch(catchCancelNoOp)
                         .catch((err: Error) => { //reset the state and pass error along
                             this.resetState();
                             return Promise.reject(err);
                         });
    }

    resetState = () => {
        this.setState({
            working: false
        });
    }

    getClassName() {
        return "btn " + (this.props.className || '');
    }

    getButtonType() {
        return this.props.type || 'button';
    }

    render() {
        return (<button type={this.getButtonType()} className={this.getClassName()} disabled={this.state.working || this.props.disabled} onClick={this.doTask}>{this.state.working && <span><i className="fa fa-spin fa-spinner"></i> </span>}{this.props.children}</button>);
    }
}