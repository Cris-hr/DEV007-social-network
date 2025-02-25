import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy
} from 'firebase/firestore';

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';

import { auth, db } from '../firebase';

/*
------------- para el registro--------------- 
*/
export function crearUsuarioConCorreoYContraseña(email, contraseña) {
  return createUserWithEmailAndPassword(auth, email, contraseña);
}

/*
------------- para el login(iniciar sesion)--------------- 
*/
export const iniciarSesionConCorreoYContraseña = (email, contraseña) =>
  signInWithEmailAndPassword(auth, email, contraseña);

/*
------------- para iniciar sesion con google--------------- 
GoogleAuthProvider = nueva instancia para autenticar con el proveedor de google
*/
export const initSessionsWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

/*
------------- para agregar un post y guardarlo en firestore--------------- 
*/
export function agregarUnNuevoPost(contenido) {
  return addDoc(collection(db, 'post'), {
    contenido,
    usuario: auth.currentUser.email,
    datetime: new Date(),
    likes: []
  });
}

/*
----------  PARA ENLISTAR Y MOSTRAR LOS POST----------
*/
export const getTask = () => getDocs(collection(db, 'post'));

export const onGetTask = (callback) =>
  onSnapshot(
    query(collection(db, 'post'), orderBy('datetime', 'desc')),
    callback
  );

/*
----------  FUNCIONES PARA BORRAR POST----------
*/
export const deletePost = (postId) => {
  const postRef = doc(db, 'post', postId);
  return deleteDoc(postRef);
};

/*
---------- FUNCION PARA EDITAR POST ---------
*/
export const editPost = async (textAreaModal, id) => {
  const docRef = doc(db, 'post', id);
  await updateDoc(docRef, {
    contenido: `${textAreaModal}`
  });
};
/*
---------- PARA DAR LIKE ----------
si la long.de los likes = 0, o si el correo del ususario actual no tenga like incluidos en el array de like
entonces se ejecuta el metodo updateDoc(actulaiza el doc, agregando el like del ususario)
*/
export const addLike = (id, likes) => {
  if (likes.length === 0 || !likes.includes(auth.currentUser.email)) {
    updateDoc(doc(db, 'post', id), {
      likes: arrayUnion(auth.currentUser.email)
    }).catch((error) => error);
  }
};

/*
---------- PARA QUITAR LIKE ----------
*/

export const removeLike = (id) =>
  updateDoc(doc(db, 'post', id), {
    likes: arrayRemove(auth.currentUser.email)
  })
    .then((res) => console.log(res))
    .catch((error) => error);

/*
  ---------- PARA CERRAR SESIÓN ----------
*/

export const logOut = () => signOut(auth);
