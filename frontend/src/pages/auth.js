
import React from 'react';

import AuthContext from '../context/auth-context';

import './auth.css';

export class AuthPage extends React.Component {

  state = {
    isLogin: true,
    loading: false
  };

  static contextType = AuthContext;

  emailRef = React.createRef();
  passwordRef = React.createRef();

  handleSubmit = (e) => {
    e.preventDefault();

    const email = this.emailRef.current.value;
    const password = this.passwordRef.current.value;

    if (!email || !password) {
      return;
    }

    const {
      isLogin
    } = this.state;

    const reqBody = isLogin
      ? {
          query: `query {
            login(email: "${email}", password: "${password}") {
              userId
              token
              tokenExpiration
            }
          }`
        }
      : {
          query: `
            mutation CeateUser($email: String!, $password: String!) {
              createUser(userInput:{ email: $email, password: $password }) {
                _id
                email
                password
              }
            }
          `,
          variables: {
            email: email,
            password: password
          }
        };

    this.setState({
      loading: true
    });

    fetch('http://localhost:4200/graphql', {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {

      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Faild!');
      }

      return res.json();
    })
    .then(res => {

      if (res.data.login.token) {

        const {
          token,
          userId,
          tokenExpiration
        } = res.data.login || {};

        this.context.login(token, userId, tokenExpiration);

        // this.setState({
        //   loading: false
        // });
        return;
      }

      this.setState({
        loading: false
      });
    })
    .catch(err => {

      this.setState({
        loading: false
      });

      console.error('auth.handleSubmit', err);
    });
  };

  toggleSignupSignin = () => {

    this.setState(state => ({
      isLogin: !state.isLogin
    }))
  };

  render = () => {

    const {
      isLogin,
      loading
    } = this.state;

    return (
      <div className='auth-page'>

        <form
          onSubmit={this.handleSubmit}
        >

          <h3>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h3>

          <div className='form-control'>
            <label htmlFor='email'>
              Email
            </label>
            <input
              id='email'
              type='email'
              ref={this.emailRef}
            />
          </div>

          <div className='form-control'>
            <label htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              ref={this.passwordRef}
            />
          </div>

          <div className='form-actions'>

            <button
              type='submit'
            >
              { loading
                ? 'Loading...'
                : isLogin
                  ? 'Sign in'
                  : 'Sign up'
              }
            </button>

            <button
              type='button'
              className='link'
              onClick={this.toggleSignupSignin}
            >
              {isLogin
                ? 'Don\'t have an account?'
                : 'Already have an account?'
              }
            </button>

          </div>

        </form>

        <pre>
          <code>
            { JSON.stringify(this.context, '', 2) }
          </code>
        </pre>

      </div>
    );
  }
}