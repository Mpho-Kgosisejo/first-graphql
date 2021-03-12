import React from 'react';

export default React.createContext({
  user: {
    id: null,
    token: null,
    isLoggedIn: false
  },
  login: (token, userId, tokenExpiration) => {},
  logout: () => {}
});