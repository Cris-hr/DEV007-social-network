import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Home } from './components/Home.js';
import { Register } from './components/Register.js';
import { Login } from './components/Login.js';

const rootDiv = document.getElementById('root');

const routes = {
  '/': Login,
  '/register': Register,
  '/home': Home
};

export const onNavigate = (pathname) => {
  window.history.pushState({}, pathname, window.location.origin + pathname);

  while (rootDiv.firstChild) {
    rootDiv.removeChild(rootDiv.firstChild);
  }

  rootDiv.appendChild(routes[pathname](onNavigate));
};

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (window.location.pathname === '/register') { 
    onNavigate('/register');
  } 
  else if (!user && window.location.pathname !== '/register') {
    onNavigate('/');
  } else {
    onNavigate('/home');
 }
});

const component = routes[window.location.pathname];

window.onpopstate = () => {
  rootDiv.appendChild(component(onNavigate));
};

rootDiv.appendChild(component(onNavigate));
