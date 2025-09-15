const videos = [
    '1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4',
    '6.mp4', '7.mp4', '8.mp4', '9.mp4', '10.mp4'
];

let currentVideoSrc = '';
let userName = '';

document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const inputScreen = document.getElementById('inputScreen');
    const videoScreen = document.getElementById('videoScreen');
    const bgVideo = document.getElementById('bgVideo');
    const nameOverlay = document.getElementById('nameOverlay');
    const shareBtn = document.getElementById('shareBtn');
    const restartBtn = document.getElementById('restartBtn');

    nameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const name = this.value.trim();
            if (name) {
                startBirthdayVideo(name);
            }
        }
    });

    shareBtn.addEventListener('click', shareVideo);
    restartBtn.addEventListener('click', restartExperience);

    function startBirthdayVideo(name) {
        userName = name;
        
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        currentVideoSrc = randomVideo;
        
        bgVideo.src = randomVideo;
        nameOverlay.textContent = "Happy Birthday " + name + " 🎂";
        
        inputScreen.style.display = 'none';
        videoScreen.style.display = 'block';
        
        bgVideo.play().catch(function(error) {
            console.log('خطأ في تشغيل الفيديو:', error);
        });
        
        createConfetti();
        
        bgVideo.addEventListener('ended', function() {
            bgVideo.play();
        });
    }

    function shareVideo() {
        if (navigator.share) {
            navigator.share({
                title: 'Happy bithday' + userName,
                text: 'look at this nigga ' + userName + ' 🎉',
                url: window.location.href + '?video=' + currentVideoSrc + '&name=' + encodeURIComponent(userName)
            }).catch(function(error) {
                copyToClipboard();
            });
        } else {
            copyToClipboard();
        }
    }

    function copyToClipboard() {
        const url = window.location.href + '?video=' + currentVideoSrc + '&name=' + encodeURIComponent(userName);
        navigator.clipboard.writeText(url).then(function() {
            showNotification('تم نسخ الرابط! 🎉');
        }).catch(function() {
            prompt('انسخ هذا الرابط:', url);
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            z-index: 1000;
            font-size: 1.2em;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function restartExperience() {
        bgVideo.pause();
        bgVideo.src = '';
        inputScreen.style.display = 'flex';
        videoScreen.style.display = 'none';
        nameInput.value = '';
        nameInput.focus();
    }

    function createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        
        for (let i = 0; i < 80; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animation = 'confetti-fall ' + (Math.random() * 3 + 2) + 's linear forwards';
                confetti.style.animationDelay = Math.random() * 2 + 's';
                
                if (Math.random() > 0.5) {
                    confetti.style.borderRadius = '50%';
                }
                
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 5000);
            }, i * 50);
        }
    }

    function loadSharedContent() {
        const params = new URLSearchParams(window.location.search);
        const sharedName = params.get('name');
        const sharedVideo = params.get('video');
        
        if (sharedName && sharedVideo) {
            nameInput.value = sharedName;
            setTimeout(() => {
                startBirthdayVideo(sharedName);
                bgVideo.src = sharedVideo;
                currentVideoSrc = sharedVideo;
            }, 500);
        }
    }

    loadSharedContent();
});

window.addEventListener('beforeunload', function() {
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo) {
        bgVideo.pause();
    }
});