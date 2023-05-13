export const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", reject);
      img.src = url;
    });
  };
  
  export const loadImages = async () => {
    const urls = ["https://mir-s3-cdn-cf.behance.net/project_modules/1400/d9d7ad104360973.5f6142500e188.png",
    "http://clipart-library.com/image_gallery/275522.png",
    "http://clipart-library.com/images/8T68RMeac.png",
    "http://cdn0.iconfinder.com/data/icons/alien-space/512/spiral_whirl_whirlpool_curve_rotate_alien-512.png",
    "https://freesvg.org/img/1537561674.png",
    "https://static.vecteezy.com/system/resources/thumbnails/009/385/490/small/ufo-spaceship-concept-clipart-design-illustration-free-png.png"];
    const imagePromises = urls.map((url) => loadImage(url));
    return Promise.all(imagePromises);
  };
  