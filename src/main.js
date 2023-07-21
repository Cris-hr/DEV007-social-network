import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Home } from './components/Home.js';
import { Register } from './components/Register.js';
import { Login } from './components/Login.js';
/*
---------crear la constante rootDiv que utiliza el id=root del div de html
*/
const rootDiv = document.getElementById('root');
/*
-----crea la constante rutas con los componentes importados-------
*/
const routes = {
  '/': Login,
  '/register': Register,
  '/home': Home
};
/*
-------la funcion onNavigate se utiliza para navegar a una nueva ruta en la aplicacion---------
*/
export const onNavigate = (pathname) => {
  window.history.pushState({}, pathname, window.location.origin + pathname);
  /*
-----pushState es un metodo de del objeto histry que permite cambiar de rjuta sin que se recargue la pagina-----
*/

  /*
------el while limpia el contenido anterior y prepara el contenedor para el nuevo contenido------------
*/
  while (rootDiv.firstChild) {
    rootDiv.removeChild(rootDiv.firstChild);
  }
  /*
----------trae el nuevo contenido de la ruta a la que se quiere entrar-----------
*/
  rootDiv.appendChild(routes[pathname](onNavigate));
};
/*
-----------para el deslogueo-- el onAuthStateChanget(metodo de firebase) escucha el cambio de estado de autenticacion
*/
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (window.location.pathname === '/register') {
    onNavigate('/register');
  } else if (!user && window.location.pathname !== '/register') {
    onNavigate('/');
  } else {
    onNavigate('/home');
  }
});

const component = routes[window.location.pathname];
/*
el window.onpopstate agrega al componente correspondiente a la ruta actual----------
*/
window.onpopstate = () => {
  rootDiv.appendChild(component(onNavigate));
};
/*
-----------el contenido del componente se imprime en el area rootDiv indicada------------
*/
rootDiv.appendChild(component(onNavigate));
