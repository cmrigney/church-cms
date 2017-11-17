import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';

export interface NavMenuProps {
  logout: (ev: React.MouseEvent<HTMLAnchorElement>) => void;
  userName?: string;
}

export class NavMenu extends React.Component<NavMenuProps, {}> {
  public render() {
    return <div className='row'>
      {this.props.userName && <h5 className="user-name">{this.props.userName}</h5>}
      <ul className="nav nav-pills flex-column">
        <li className="nav-item">
          <NavLink to={'/'} exact activeClassName='active' className='nav-link'>
            <span className='fa fa-home'></span> Home
          </NavLink>
          <NavLink to={'/pagetemplates'} activeClassName='active' className='nav-link'>
            <span className='fa fa-file'></span> Page Templates
          </NavLink>
          <NavLink to={'/pages'} activeClassName='active' className='nav-link'>
            <span className='fa fa-file-text-o'></span> Pages
          </NavLink>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#" onClick={this.props.logout}><span className="fa fa-sign-out"></span> Log out</a>
        </li>
      </ul>
    </div>;
  }
}