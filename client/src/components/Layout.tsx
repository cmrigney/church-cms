import { LoadingOverlay } from '../library/loading-overlay';
import * as React from 'react';
import { NavMenu } from './NavMenu';
import { User } from '../models/user';
import { Router } from "react-router";
import { getUser, logout } from '../services/user-helper';
import { LoginForm } from './Login';

export interface LayoutProps {
    children?: React.ReactNode;
}

export interface LayoutState {
    loading: boolean;
    showSpinnerOverlay: boolean;
    user?: User|null;
    error?: string;
}

export class Layout extends React.Component<LayoutProps, LayoutState> {
    constructor(props: LayoutProps) {
        super(props);

        this.state = {
            loading: true,
            showSpinnerOverlay: false,
        };
    }

    componentDidMount() {
        if(window.location.pathname.toLowerCase().startsWith("/admin/login")) {
            this.setState({ loading: false });
        }
        else {
            this.loginCallback();
        }
    }

    gotUser = (user: User|null) => {
        this.setState({
            user: user,
            loading: false,
        });
    }

    failedGetUser = (err: Error) => {
        this.setState({
            error: "An error has occurred: " + err.message,
            loading: false,
        })
    }

    loginCallback = () => {
        if(window.location.pathname.toLowerCase().startsWith("/admin/login")) {
            window.location.href = "/admin";
            return new Promise<void>((resolve) => setTimeout(resolve, 15000));
        }
        else {
            return getUser().then(this.gotUser).catch(this.failedGetUser);
        }
    }

    logoutClicked = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        this.logout();
    }
    
    logout = () => {
        this.setState({
            showSpinnerOverlay: true
        });
    
        logout().then(() => window.location.href = "/admin/login");
    }

    public render() {
        if(this.state.loading) {
            return <div>
                <LoadingOverlay show={true} />
            </div>;
        }
        else if(this.state.error) {
            return <div>
                <h4>{ this.state.error }</h4>
            </div>;
        }
        else if(!this.state.user) {
            return <LoginForm loginCallback={this.loginCallback} />
        }

        return <div className='row'>
                <div className='col-3'>
                    <NavMenu logout={this.logoutClicked} userName={this.state.user && this.state.user.username} />
                </div>
                <div className='col-9'>
                    { this.props.children }
                </div>
            <LoadingOverlay show={this.state.showSpinnerOverlay} />
        </div>;
    }
}