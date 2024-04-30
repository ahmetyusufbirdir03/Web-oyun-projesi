const canvas = document.querySelector('#mycanvas'); // ana canvas
canvas.width= 1024;
canvas.height = 500;

const cground = document.querySelector('#ground'); // zemin canvası
cground.width= 1024;
cground.height = 50;

const ctx = canvas.getContext('2d');
const cgr = cground.getContext('2d');

var fg = new Image(); // zemin resmi
fg.src="ground.jpg"

var bg = new Image();// arkaplan resmi
bg.src ="sky.jpg"

var skorum = document.querySelector('#skor') // ana ekranda gösterilecek skor

// gerekli değişkenler
var lastScore = 0
var jump = 0;
var frameNo = 0
const gravity = 0.1

// SINIFLAR
class Player{
    constructor(){
        this.position = {
            x: 100,
            y: 400
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 30
        this.height = 30

    }

    draw(){
        ctx.fillStyle='red'
        ctx.fillRect(this.position.x, this.position.y,
        this.width, this.height)
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y 
        if(this.position.y + this.height +this.velocity.y <= canvas.height){
            this.velocity.y += gravity }   
        else 
            this.velocity.y = 0  
    }
}

class Platforms{
    constructor(cx, cy, velocity_x){
        this.position = {
            x: cx,
            y: cy
        }
        this.velocity = {
            x: velocity_x
        }
        this.width = 150
        this.height = 20
    }

    draw(){
        ctx.fillStyle = 'green'
        ctx.fillRect(this.position.x, this.position.y,
        this.width, this.height)
    }

    update(){
        this.position.x += this.velocity.x
        this.draw()
    }
}

// PLATFORMLARI BAŞLATMAK İÇİN GEREKEN DEĞİŞKENLER
var pvelx = -1
const player = new Player()
var platforms = []
var platform_1 = new Platforms(1024, Math.floor(Math.random()*175)+300, pvelx)
platforms.push(platform_1)

var gap = 0

// TUŞ KONTROL DEĞİŞKENLERİ
const keys = {
    right:{
        pressed: false
    },
    left:{
        pressed: false
    },
    up: {
        pressed: false
    }
}

// KLAVYE DİNLEYİCİLER
window.addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        case 65: // A TUŞU
            keys.left.pressed = true
            break
        case 68: // D  TUŞU
            keys.right.pressed = true
            break
        case 87: // W TUŞU
            if(player.velocity.y == 0)
            {
                keys.up.pressed = true
                player.velocity.y -= 4 
            }    
            break
    }
})

window.addEventListener('keyup', ({keyCode}) => {
    switch(keyCode){
        case 65: // A TUŞU
            keys.left.pressed = false
            break
        case 68: // D  TUŞU
            keys.right.pressed = false
            break
        case 87: // W TUŞU
            keys.up.pressed = false
            break
    }
})

// FONKSİYONLAR
function animate(){ // Görüntüyü oynatan fonksiyon 
    requestAnimationFrame(animate);
    switch(lastScore){ // skor ilerledikçe platformları hızlandırır ve oyun zorlaşır
        case 200:
            pvelx = -1.3
            platforms.forEach(platform=>{
                platform.velocity.x = pvelx;
            })
            break
        case 400:
            pvelx = -1.7
            platforms.forEach(platform=>{
                platform.velocity.x = pvelx;
            })
            break
        case 600:
            pvelx = -2
            platforms.forEach(platform=>{
                platform.velocity.x = pvelx;
            })
            break
    }
    cgr.drawImage(fg,0,0);  // zemini canvası
    cgr.drawImage(fg,50,0); // zemini canvası
    ctx.drawImage(bg,0,0,1024,500)

    frameNo += 1 // skoru oynatılan kareye göre saymak için tutulan değişken
    lastScore = Math.floor(frameNo/40) // kullanıcının aktif skoru
    skorum.innerHTML = 'Score: ' + lastScore

    gap = Math.floor(Math.random()*151)-75 // platformlar arası ratgele oluşan boşluk
    
     // canvas arka planı

    player.update(); // ana karakterimizi yenileyen class fonksiyonu
    var npx = 1024 // sıradaki platformun x konumu

    for(var i = 0 ; i < platforms.length; i++){ // rastgele platformları oluşturan döngü
        platforms[i].update();
        if(platforms[platforms.length-1].position.x + gap + 
            platforms[platforms.length-1].width <= 1024){
                platforms.push(new Platforms(npx, Math.floor(Math.random()*125)+350, pvelx))
        }
    }
    
    // tuş kontrolü
    if(keys.right.pressed)    
        player.velocity.x = 2  // D tuşuna basılması halinde sağa gitme  
    else if(keys.left.pressed)
        player.velocity.x = -2 // A tuşuna basılması halinde sola gitme 
    else player.velocity.x = 0

    for(var i = 0 ; i < platforms.length; i++){ 
        // Platform ve karaktern temasını anlayan döngü
        if (player.position.y + player.height <= platforms[i].position.y
        && player.position.y + player.height + player.velocity.y  >= platforms[i].position.y 
        && player.position.x + player.width >= platforms[i].position.x
        && player.position.x <= platforms[i].position.x + platforms[i].width) 
            // karakter platformun üstündeyse aşağı düşmeyi keser
            player.velocity.y = 0 

        if (player.position.y + player.height >= platforms[i].position.y
            && player.position.y  + player.velocity.y + 1 <= platforms[i].position.y + platforms[i].height
            && player.position.x + player.width  >= platforms[i].position.x
            && player.position.x -1<= platforms[i].position.x + platforms[i].width 
            && player.position.y + player.height +player.velocity.y <= canvas.height)
                // karakter platforma alltan çarparsa geri seker ve düşmeye başlar
                player.velocity.y = gravity 

        if(player.position.x + player.width <= platforms[i].position.x
            && player.position.x + player.width + player.velocity.x +1 >= platforms[i].position.x 
            && player.position.y + player.height >= platforms[i].position.y
            && player.position.y <= platforms[i].position.y + platforms[i].height)
                // karakter platforma sağdan çarparsa platform onu sürükler
                // karakter paltformu hareket ettiremez böyelece platformlardan kaçınmalı
                player.velocity.x = platforms[i].velocity.x

        if(player.position.x >= platforms[i].position.x + platforms[i]. width
            && platforms[i].position.x + platforms[i].width +0.5>= player.position.x + player.velocity.x
            && player.position.y + player.height >= platforms[i].position.y
            && player.position.y <= platforms[i].position.y + platforms[i].height)
                // karakter platforma soldan çarparsa geri seker ve durur
                player.velocity.x = 0.1
    }
    if(player.position.x <= 0) // oyunun bitme durumu
    // eğer karakter canvas dışına çıkarsa oyun biter
    {
        gameOver()
    }
}       

function buttonOyna(){ // oyunu başlatır
    var popup = document.getElementById('popup');
    popup.style.display = 'none';
    animate()
}
function buttonOynanış(){ // oynanış sekmesini açar
    var giris = document.getElementById('giris');
    var kurallar = document.getElementById('kurallar');

    giris.style.display = 'none';
    kurallar.style.display = 'block';
}
function buttonGeri(){ // ana sekmeye geri döner
    var giris = document.getElementById('giris');
    var kurallar = document.getElementById('kurallar');
    
    kurallar.style.display = 'none';
    giris.style.display = 'grid';
}
function gameOver(){ // oyunu bitirir.
    var popup2 = document.getElementById('popup2')
    var skor = document.getElementById('sonSkor')
    canvas.style.display ='none'
    cground.style.display ='none'
    skorum.style.display='none'
    popup2.style.display = 'block';
}