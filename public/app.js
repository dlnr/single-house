window.addEventListener('load', async () => {

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }

  // const lazyImages = document.querySelectorAll('img[data-srcset]');

  // const galleryWatch = new IntersectionObserver(
  //   loadimage => {
  //     loadimage[0].target.classList.add('ld');
  //     loadimage[0].target.setAttribute('srcset', loadimage[0].target.dataset.srcset);
  //     galleryWatch.unobserve(loadimage[0].target);
  //   },
  //   {
  //     root: document.querySelector('#gallery .g'),
  //     threshold: 0
  //   }
  // )

  // lazyImages.forEach(image => {
  //   galleryWatch.observe(image);
  // });

});