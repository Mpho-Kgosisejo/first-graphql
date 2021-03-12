
import React from 'react';

import {
  Route,
  Switch,
  Redirect,
  BrowserRouter
} from 'react-router-dom';

import {
  AuthPage,
  EventPage,
  BookingsPage
} from './pages';

import {
  MainNav
} from './components';

import AuthContext from './context/auth-context';

import './App.css';

export default class App extends React.Component {

  state = {
    user: {
      id: null,
      token: null,
      isLoggedIn: false
    }
  };

  login = (token, userId, tokenExpiration) => {

    this.setState({
      user: {
        id: userId,
        token: token,
        isLoggedIn: !!(userId && token)
      }
    });
  };

  logout = () => {

    this.setState({
      user: {
        is: null,
        token: null,
        isLoggedIn: false
      }
    });
  };

  render = () => {

    const {
      user
    } = this.state;

    return (
      <AuthContext.Provider
        value={{
          user: user,
          login: this.login,
          logout: this.logout
        }}
      >
        <div className='app'>
          <BrowserRouter>
            <>

            <MainNav />

            <main>
              <Switch className='lol'>

                { user.isLoggedIn &&

                  <Redirect
                    exact
                    from='/'
                    to={'/events'}
                  />
                }

                { user.isLoggedIn &&

                  <Redirect
                    exact
                    from='/auth'
                    to={'/events'}
                  />
                }

                { !user.isLoggedIn &&

                  <Route
                    path='/auth'
                    component={AuthPage}
                  />
                }

                <Route
                  path='/events'
                  component={EventPage}
                />

                { user.isLoggedIn &&

                <Route
                  path='/bookings'
                  component={BookingsPage}
                />
                }

                { !user.isLoggedIn &&

                  <Redirect
                    exact
                    to={'/auth'}
                  />
                }

              </Switch>
            </main>

            </>
          </BrowserRouter>
        </div>
      </AuthContext.Provider>
    );
  }
}