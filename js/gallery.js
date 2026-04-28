const images = [
      {
        preview:
          'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820__480.jpg',
        original:
          'https://cdn.pixabay.com/photo/2019/05/14/16/43/rchids-4202820_1280.jpg',
        description: 'Hokkaido Flower',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2019/05/14/22/05/container-4203677_1280.jpg',
        description: 'Container Haulage Freight',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2019/05/16/09/47/beach-4206785_1280.jpg',
        description: 'Aerial Beach View',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2016/11/18/16/19/flowers-1835619_1280.jpg',
        description: 'Flower Blooms',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2018/09/13/10/36/mountains-3674334_1280.jpg',
        description: 'Alpine Mountains',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2019/05/16/23/04/landscape-4208571_1280.jpg',
        description: 'Mountain Lake Sailing',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2019/05/17/09/27/the-alps-4209272_1280.jpg',
        description: 'Alpine Spring Meadows',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2019/05/16/21/10/landscape-4208255_1280.jpg',
        description: 'Nature Landscape',
      },
      {
        preview:
          'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843__340.jpg',
        original:
          'https://cdn.pixabay.com/photo/2019/05/17/04/35/lighthouse-4208843_1280.jpg',
        description: 'Lighthouse Coast Sea',
      },
    ];
    
const gallery = document.querySelector('.gallery');

const galleryMarkup = images
  .map(
    ({ preview, original, description }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${original}">
          <img
            class="gallery-image"
            src="${preview}"
            data-source="${original}"
            alt="${description}"
          />
        </a>
      </li>
    `
  )
  .join('');
    
gallery.insertAdjacentHTML('beforeend', galleryMarkup);
    

let currentImageIndex = 0;
let lightboxInstance = null;

gallery.addEventListener('click', event => {
  const clickedElement = event.target;

  if (!clickedElement.classList.contains('gallery-image')) {
    return;
  }

  event.preventDefault();

  currentImageIndex = images.findIndex(
    image => image.original === clickedElement.dataset.source
  );

  const { original, description } = images[currentImageIndex];

  lightboxInstance = basicLightbox.create(
    `
      <div class="modal">
        <button class="modal-close" type="button">×</button>
        <p class="modal-counter">${currentImageIndex + 1}/${images.length}</p>

        <button class="modal-arrow modal-arrow-left" type="button">‹</button>

        <div class="modal-content">
          <img class="modal-image" src="${original}" alt="${description}" />
          <p class="modal-caption">${description}</p>
        </div>

        <button class="modal-arrow modal-arrow-right" type="button">›</button>
      </div>
    `,
    {
      onShow: instance => {
        const modal = instance.element();

        modal
          .querySelector('.modal-close')
          .addEventListener('click', () => instance.close());

        modal
          .querySelector('.modal-arrow-left')
          .addEventListener('click', showPreviousImage);

        modal
          .querySelector('.modal-arrow-right')
          .addEventListener('click', showNextImage);

        document.addEventListener('keydown', onModalKeydown);
      },

      onClose: () => {
        document.removeEventListener('keydown', onModalKeydown);
      },
    }
  );

  lightboxInstance.show();
});

function showPreviousImage() {
  currentImageIndex =
    currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;

  updateModalImage();
}

function showNextImage() {
  currentImageIndex =
    currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;

  updateModalImage();
}

function updateModalImage() {
  const modalImage = document.querySelector('.modal-image');
  const modalCaption = document.querySelector('.modal-caption');
  const modalCounter = document.querySelector('.modal-counter');

  const { original, description } = images[currentImageIndex];

  modalImage.classList.add('is-changing');

  setTimeout(() => {
    modalImage.src = original;
    modalImage.alt = description;
    modalCaption.textContent = description;
    modalCounter.textContent = `${currentImageIndex + 1}/${images.length}`;

    setTimeout(() => {
      modalImage.classList.remove('is-changing');
    }, 100);
  }, 250);
}

function onModalKeydown(event) {
  if (event.key === 'ArrowLeft') {
    showPreviousImage();
  }

  if (event.key === 'ArrowRight') {
    showNextImage();
  }

  if (event.key === 'Escape') {
    lightboxInstance.close();
  }
}