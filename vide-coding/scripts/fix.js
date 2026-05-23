const fs = require('fs');

let content = fs.readFileSync('arrodz.html', 'utf8');

// Fix broken CSS and JS links
content = content.replace(/href="https:\/\/css\//g, 'href="https://cdn.prod.website-files.com/697b8432e6e6f25d089e5c95/css/');
content = content.replace(/src="https:\/\/js\//g, 'src="https://cdn.prod.website-files.com/697b8432e6e6f25d089e5c95/js/');

// Fix double https://
content = content.replace(/https:\/\/https:\/\//g, 'https://');

// Fix video URL if it was mangled
// The original video was: https://cdn.prod.website-files.com/697b8432e6e6f25d089e5c95%2F69a1b56c9e63f5f277bd98e4_ARRODZ-Video_mp4.mp4
// In replace.js I replaced that exact string with the mixkit URL, so it shouldn't be mangled.

fs.writeFileSync('arrodz.html', content, 'utf8');
console.log('Fixed broken URLs.');
