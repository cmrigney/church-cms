import { getParameterByName } from '../helpers/params-helper';
import { TaskButton } from '../library/task-button';
import * as React from 'react';
import * as $ from 'jquery';
import axios from 'axios';

export interface LoginFormProps {
    loginCallback: () => void|Promise<void>;
}

interface LoginFormState {
    email: string;
    password: string;
    error?: string;
}

export class LoginForm extends React.Component<LoginFormProps, LoginFormState> {
    constructor(props: any) {
        super(props);

        
        let emailParam = getParameterByName('email') || '';

        this.state = {
            email: emailParam,
            password: ''
        };
    }

    componentDidMount() {
        let focusOn;
        if(this.state.email) {
            focusOn = $("#password");
        }
        else {
            focusOn = $("#email");
        }

        focusOn.focus();
    }

    doLogin = async (ev: React.MouseEvent<HTMLButtonElement>) => {
        try {
            let result = await axios.post('/admin/login', { username: this.state.email, password: this.state.password});
            this.setState({
                error: ''
            });
            
            let cbResult = this.props.loginCallback();
            if(cbResult instanceof Promise)
                await cbResult;
        }
        catch(e) {
            let msg;
            if(e.response && e.response.data && e.response.data.error)
                msg = e.response.data.error;
            else
                msg = "An unknown error occurred";

            this.setState({
                error: msg
            });
        }
    }

    render() {
        return (<div className="vertical-offset-50">
                <div className="row text-center">
                    <h2 className="col-12">Church CMS Admin</h2>
                </div>
                <div className="row vertical-offset-20">
    	<div className="col-md-4 offset-md-4">
    		<div className="card">
			  	<div className="card-header">
			    	<h5 className="card-title">Please sign in</h5>
			 	</div>
			  	<div className="card-body">
			    	<form role="form">
                    <fieldset>
			    	  	<div className="form-group">
			    		    <input className="form-control" id="email" placeholder="E-mail" name="email" type="text" defaultValue={this.state.email} onChange={(ev) => this.setState({ email: ev.target.value })} />
			    		</div>
			    		<div className="form-group">
			    			<input className="form-control" id="password" placeholder="Password" name="password" type="password" onChange={(ev) => this.setState({ password: ev.target.value })} />
			    		</div>
			    		<div className="checkbox">
			    	    	<label>
			    	    		<input name="remember-me" type="checkbox" value="Remember Me" /> Remember Me
			    	    	</label>
			    	    </div>
                        <TaskButton type="submit" className="btn-primary btn-lg btn-block" onClick={this.doLogin}>Login</TaskButton>
                        {this.state.error && (<p className="text-center text-danger" style={{ paddingTop: 10 }}>{this.state.error}</p>)}
                    </fieldset>
			      	</form>
			    </div>
			</div>
		</div>
	</div>
                {/* <div className="row text-center">
                <form className="col-md-6 offset-md-3">
                    <h4 className="text-center col-12">Log in to your account</h4>
                    <div className="form-group">
                        <input id="email" className="form-control" type="email" placeholder="Email" defaultValue={this.state.email} onChange={(ev) => this.setState({ email: ev.target.value })} />
                    </div>
                    <div className="form-group">
                        <input id="password" className="form-control" type="password" placeholder="Password" onChange={(ev) => this.setState({ password: ev.target.value })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="remember-me">Remember Me
                        <input id="remember-me" className="form-control" type="checkbox" value="false" />
                        </label>
                    </div>
                    <TaskButton type="submit" className="btn-primary btn-lg btn-block" onClick={this.doLogin}>Log in</TaskButton>
                    {this.state.error && (<p className="text-center text-red">{this.state.error}</p>)}
                    <p className="text-center"><a href="#" onClick={(ev) => { ev.preventDefault(); alert('Not implemented yet') } }>Forgot your password?</a></p>
                </form>
            </div> */}
        </div>);
    }
}