if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/roverui/sw.js', { scope: '/roverui/' })})}