// Ekrana tıklayınca ses çalsın
document.body.addEventListener('click', () => {
    const audio = new Audio('assets/audio/ui_sounds/select.mp3');
    audio.play().catch(error => {
        console.error("Ses çalma hatası:", error);
    });
});

// Splash Screen Gösterimi
document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash');
    setTimeout(() => {
        splash.style.opacity = 0;
        setTimeout(() => {
            splash.style.display = 'none';
        }, 1000);
    }, 2000); // 2 saniye sonra splash ekranı kapanır
});

// Saati Güncelleme
function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}`;
}
setInterval(updateClock, 1000); // Her saniye saati günceller
updateClock(); // İlk başta çağır

// OpenWeatherMap API ile sıcaklık verisini alma
function updateTemperature() {
    const apiKey = '0d42289d2f77807c5cb20d6a2580e87d'; // API anahtarınızı buraya girin
    const city = 'Istanbul'; // Şehir ismini burada belirleyin (Örneğin: Istanbul)
    const units = 'metric'; // Dereceyi Celsius olarak almak için 'metric'

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const temp = data.main.temp; // Sıcaklık
            const tempElement = document.getElementById('temperature');
            const warningIcon = document.getElementById('warning');

            tempElement.textContent = `${temp}°C`;
            if (temp <= 5) {
                warningIcon.style.display = 'inline';
                playWarningSound();
                showMessage('Bisiklet bu havada kullanım için uygun değil!');
            } else {
                warningIcon.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('OpenWeatherMap API hatası:', error);
        });
}

// Sıcaklık simülasyonu (ilk başta 2 dk geçtikten sonra sıcaklık verisi güncelleniyor)
setInterval(updateTemperature, 120000); // Her 2 dakikada bir sıcaklık verisini günceller
updateTemperature(); // Başlangıçta sıcaklık verisini günceller

// Sesli Uyarı
function playWarningSound() {
    const sound = new Audio('assets/audio/critical/peugeot.mp3');
    sound.play();
}

// Mesaj Göster
function showMessage(message) {
    const messageBox = document.getElementById('message');
    messageBox.textContent = message;
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 4000);
}

// Ayarlar Menüsü Göster/Kapat
function toggleSettingsMenu() {
    const menu = document.getElementById('settings-menu');
    menu.classList.toggle('open');
}

// Menü Toggle (Açma/Kapama)
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Mikrofon İzni İste
function requestMicrophonePermission() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(startVoiceRecognition)
        .catch(err => console.error('Mikrofon erişimi reddedildi', err));
}

// Sesli Komut Tanıma Başlat
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';

    recognition.onresult = event => {
        const transcript = event.results[0][0].transcript.trim().toLowerCase();
        if (transcript === 'ok peugeot') {
            showMessage('Sizi dinliyorum');
        }
    };

    recognition.start();
}

// Sayfa Yüklenince Yapılacaklar
window.onload = () => {
    updateClock();
    setInterval(updateClock, 1000); // Saati her saniye güncelle
    updateTemperature(); // Başlangıçta sıcaklık verisini güncelle
    setTimeout(hideSplashScreen, 1560); // Splash ekranını 3 saniye sonra gizle
    setTimeout(animateTopBar, 1900); // Top bar animasyonunu 5 saniye sonra başlat
    requestMicrophonePermission(); // Mikrofon izni iste
    getLocationAndSpeed(); // Konum ve hız bilgisini al
};

// Splash ekranını gizleme
function hideSplashScreen() {
    const splash = document.getElementById('splash');
    splash.style.opacity = 0;
    setTimeout(() => splash.style.display = 'none', 1000);
}

// Top Bar animasyonu
function animateTopBar() {
    const topBar = document.querySelector('.top-bar');
    topBar.classList.add('animate');
}

// Radyo göster/gizle
function toggleRadio() {
    const iframe = document.querySelector('.radio-iframe');
    iframe.classList.toggle('active');
}

// Konum bilgisi alma ve hız bilgisi gösterme
function getLocationAndSpeed() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const speed = position.coords.speed; // hızı alıyoruz
                const speedDisplay = document.getElementById('speed');
                if (speed !== null) {
                    speedDisplay.textContent = (speed * 3.6).toFixed(1); // m/s'yi km/h'ye çeviriyoruz
                } else {
                    speedDisplay.textContent = "0"; // Hız alınamazsa 0 km/h gösteriyoruz
                }
            },
            (error) => {
                console.error('Konum hatası:', error);
                alert("Konum verisi alınamadı.");
            },
            {
                enableHighAccuracy: true,
                maximumAge: 10000, // 10 saniye boyunca eski verileri alabilir
                timeout: 5000 // 5 saniye içinde yanıt alınmazsa hata verir
            }
        );
    } else {
        alert("Tarayıcınız Geolocation API'yi desteklemiyor.");
    }
}
