window.addEventListener('load', async () => {

  //  Install a service worker, if you're not familiar you
  // could use dev tools > application panel to see what it
  // does
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  // The gallery show the next and previous image, it should
  // be clear that you can use touch to scroll to the next
  // image, if you don't have touch, this will create an
  // image that is clickable.
  if (!'ontouchstart' in window) {
    const gallery = document.querySelector('#gallery .g');
    gallery.classList.add('no-touch');
    const galleryImages = document.querySelectorAll('#gallery img');

    galleryImages.forEach(image => {

        image.addEventListener('click', function(event) {
          gallery.scrollLeft = event.target.offsetLeft;
        })

    });

  }

});