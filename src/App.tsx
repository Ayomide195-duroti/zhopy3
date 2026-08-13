import React, { useState } from 'react';
import Auth from './Auth';
import Home from './Home';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) {
    return <Auth onComplete={() => setLoggedIn(true)} />;
  }

  return <Home onSignOut={() => setLoggedIn(false)} />;
}
