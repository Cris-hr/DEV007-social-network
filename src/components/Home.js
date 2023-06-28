import { auth, db } from '../firebase';
import { agregarUnNuevoPost } from '../lib';
import { onGetTask } from '../lib';
import { deletePost } from '../lib';

export const Home = (onNavigate) => {
  const HomeDiv = document.createElement('div');
  HomeDiv.classList.add('HomeDiv');

  const headerHomepage = document.createElement('div');
  headerHomepage.classList.add('headerHomepage');
  headerHomepage.innerHTML += `
    <div class="leftHome">
      <img src= "./imagenes/logoFinal.png" class="logoHome" alt="logo">
    </div>
    <div class="rightHome">
      <button type="button" id="HomeResumePageBtn">
        cerrar sesión
      </button>
    </div>
  `;

  const bottomHomePage = document.createElement('div');
  bottomHomePage.classList.add('bottomHomePage');

  const postPublicar = document.createElement('section');
  postPublicar.classList.add('postPublicar');

  const publicarButton = document.createElement('button');
  publicarButton.classList.add('publicarButton');
  publicarButton.textContent = '¿Qué estás pensando?';

  publicarButton.addEventListener('click', function () {
    document.querySelector('.modalHome').style.display = 'flex';
  });

  const modalHome = document.createElement('div');
  modalHome.classList.add('modalHome');

  const modalContentHome = document.createElement('div');
  modalContentHome.classList.add('modalContentHome');
  modalContentHome.setAttribute('id', 'modalPeageHome');

  const labelModal = document.createElement('label');
  labelModal.classList.add('labelModal');

  const textareaModal = document.createElement('textarea');
  textareaModal.classList.add('textAreaModal');

  const modalBtnHome = document.createElement('button');
  modalBtnHome.classList.add('modalBtnHome');
  modalBtnHome.textContent = 'Publicar';

  const endModalHome = document.createElement('span');
  endModalHome.classList.add('endModalHome');
  endModalHome.innerHTML = '&times;';

  endModalHome.addEventListener('click', function () {
    document.querySelector('.modalHome').style.display = 'none';
  });

  const sectionPost = document.createElement('section');
  sectionPost.classList.add('sectionPost');

  

   modalBtnHome.addEventListener('click', () => {
    agregarUnNuevoPost(textareaModal.value, db, auth)
      .then(() => {
        textareaModal.value = '';
        modalHome.style.display = 'none';
        sectionPost.innerHTML = '';
        getData();
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /*---------------mostrar post---------------- */
  window.addEventListener('DOMContentLoaded', async () => {
    sectionPost.innerHTML = '';
    getData();
  });

  const getData = () => {     //función que crea el post y su contenedor y recorre el array de los post//
    onGetTask((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const post = doc.data();
        const postId = doc.id;

        const postContainer = document.createElement('div');
        postContainer.setAttribute('id', 'postContainer');

        const topPost = document.createElement('section');
        topPost.classList.add('topPost');

        const postContent = document.createElement('div');
        postContent.classList.add('postContent');
        postContent.setAttribute('id', postId);
        postContent.innerHTML = `
        <header>${post.usuario}</header>
        <p>${post.contenido}</p>
        `;

        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('buttonEdit');
        buttonEdit.textContent = 'Editar';
        //buttonEdit.setAttribute('data-id', doc.id);

      /*--------------borrar post----------------- */
        const buttonErase = document.createElement('button');
        buttonErase.classList.add('buttonErase');
        buttonErase.textContent = 'Borrar';
        buttonErase.setAttribute('data-id', doc.id);
        buttonErase.addEventListener('click', () => {
          const postId = buttonErase.getAttribute('data-id');
          deletePost(postId)
            .then(() => {
              sectionPost.innerHTML = '';
              getData();
            })
            .catch((error) => {
              console.log('Error al borrar el post:', error);
            });
    
        });

        const bottomPost = document.createElement('section');
        bottomPost.classList.add('bottomPost');


        topPost.appendChild(postContent);

        bottomPost.appendChild(buttonEdit);
        bottomPost.appendChild(buttonErase);
        
        postContainer.insertAdjacentElement('afterbegin', topPost);
        postContainer.appendChild(bottomPost);
        sectionPost.appendChild(postContainer);
    
      });
    })
  };


  postPublicar.appendChild(publicarButton);

  bottomHomePage.appendChild(postPublicar);
  bottomHomePage.appendChild(sectionPost);

  modalContentHome.appendChild(labelModal);
  modalContentHome.appendChild(textareaModal);
  modalContentHome.appendChild(modalBtnHome);
  modalContentHome.appendChild(endModalHome);
  modalHome.appendChild(modalContentHome);

  HomeDiv.appendChild(modalHome);
  HomeDiv.appendChild(headerHomepage);
  HomeDiv.appendChild(bottomHomePage);

  return HomeDiv;
}