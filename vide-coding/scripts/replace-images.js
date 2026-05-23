const fs = require('fs');

let content = fs.readFileSync('arrodz.html', 'utf8');

const replacements = [
    // Hero A Image
    ['https://cdn.prod.website-files.com/697b8432e6e6f25d089e5c95/6984892b6f5c0cf53d6b88af_A_Arrodz.svg', ''],
    
    // Services images
    // Architectural Design image (was Chef)
    ['698de7d25f403eb0046c7e99_image00001.avif', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=1000'],
    ['698de7d25f403eb0046c7e99_image00001-p-500.avif', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=500'],
    
    // Commercial Construction image (was Hotel exterior)
    ['698de7d208be4dc9a0b214fc_image00002.avif', 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=1000'],
    ['698de7d208be4dc9a0b214fc_image00002-p-500.avif', 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=500'],
    ['698de7d208be4dc9a0b214fc_image00002-p-800.avif', 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=800'],
    
    // Infrastructure image (was cocktail)
    ['6980d92ee6854e3ac63760ae_image-2.avif', 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=1000'],
    
    // Case Studies Covers
    // 1
    ['699479435924e0859cc912d3_cover-orient-express.jpg', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600'],
    ['699479435924e0859cc912d3_cover-orient-express-p-500.jpg', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=500'],
    ['699479435924e0859cc912d3_cover-orient-express-p-800.jpg', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'],
    ['699479435924e0859cc912d3_cover-orient-express-p-1080.jpg', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1080'],
    ['699479435924e0859cc912d3_cover-orient-express-p-1600.jpg', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600'],
    ['699479435924e0859cc912d3_cover-orient-express-p-2000.jpg', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000'],
    
    // 2
    ['6994630f9952bc32013b2547_cover-chef%20(1).jpg', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1600'],
    ['6994630f9952bc32013b2547_cover-chef%20(1)-p-500.jpg', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=500'],
    ['6994630f9952bc32013b2547_cover-chef%20(1)-p-800.jpg', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'],
    ['6994630f9952bc32013b2547_cover-chef%20(1)-p-1080.jpg', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1080'],
    ['6994630f9952bc32013b2547_cover-chef%20(1)-p-1600.jpg', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1600'],
    ['6994630f9952bc32013b2547_cover-chef%20(1)-p-2000.jpg', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000'],
    
    // 3
    ['699479710c2f571584f08a79_cover-imperial.jpg', 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=1600'],
    ['699479710c2f571584f08a79_cover-imperial-p-500.jpg', 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=500'],
    ['699479710c2f571584f08a79_cover-imperial-p-800.jpg', 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=800'],
    ['699479710c2f571584f08a79_cover-imperial-p-1080.jpg', 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=1080'],
    ['699479710c2f571584f08a79_cover-imperial-p-1600.jpg', 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=1600'],
    ['699479710c2f571584f08a79_cover-imperial-p-2000.jpg', 'https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?auto=format&fit=crop&q=80&w=2000'],

    // Also replace the entire URL if the image string didn't have the cdn prefix
    ['https://cdn.prod.website-files.com/697b8432e6e6f25d089e5c95/', 'https://'],
    ['https://cdn.prod.website-files.com/697b8432e6e6f25d089e5ca3/', 'https://'],
    
    // More Case Studies
    ['698210ad2223cc8748a6f146_img.avif', 'images.unsplash.com/photo-1508450859948-4e04fabaa4ea?auto=format&fit=crop&q=80&w=600'],
    ['6982108b92271f905f5ded42_img-1.avif', 'images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=600'],
    ['6982108b35787cc3e943b9cf_img-2.avif', 'images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&q=80&w=600'],
    ['6982108bd52cb45c968b687d_img-4.avif', 'images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=600'],
    ['6982108ba436501f456552d1_img-5.avif', 'images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=600'],
    
    // Hero team image
    ['69a1c068aab08eee2aa0808a_image00001-2%20(1).avif', 'images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1600'],
    ['69a1c068aab08eee2aa0808a_image00001-2%20(1)-p-500.avif', 'images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=500'],
    ['69a1c068aab08eee2aa0808a_image00001-2%20(1)-p-800.avif', 'images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800'],
    ['69a1c068aab08eee2aa0808a_image00001-2%20(1)-p-1080.avif', 'images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1080'],
];

for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
}

fs.writeFileSync('arrodz.html', content, 'utf8');
console.log('Image replacements completed.');
