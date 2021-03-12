
import React from 'react';

import {
  NavLink
} from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './mainNav.css';

export class MainNav extends React.Component {

  static contextType = AuthContext;

  render = () => {

    const {
      user
    } = this.context;

    return (
      <header className='main-nav'>

        <div className='logo'>
          <h1>
            Easy Event
          </h1>
        </div>

        <nav className='items'>

          <ul>

            { !user.isLoggedIn &&

              <li>
                <NavLink
                  to={'/auth'}
                >
                  Auth
                </NavLink>
              </li>
            }

            <li>
              <NavLink
                to={'/events'}
              >
                Events
              </NavLink>
            </li>

            { user.isLoggedIn &&

              <li>
                <NavLink
                  to={'/bookings'}
                >
                  Bookings
                </NavLink>
              </li>
            }

            { user.isLoggedIn &&

              <li className='logout'>
                <NavLink
                  to={'#'}
                  onClick={this.context.logout}
                >
                  Logout
                </NavLink>
              </li>
            }

          </ul>

        </nav>

      </header>
    );
  }
}