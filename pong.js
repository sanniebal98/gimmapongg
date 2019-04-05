// selecteer canvas element
const canvas = document.getElementById("pong");

// methods en properties om het canvas te wijzigen
const ctx = canvas.getContext('2d');

let hoogtepaddleuser = 175;
let hoogtepaddlecom = 175;

// de bal
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 15,
    color : "#"+((1<<24)*Math.random()|0).toString(16)
}
// WALL
// const wall = {
//     x : canvas.width/2,
//     y : (canvas.height - 940),
//     width : 10,
//     height : 940,
//     color : "#"+((1<<24)*Math.random()|0).toString(16)
// }// WALL
// const wall2 = {
//     x : canvas.width/3,
//     y : (canvas.height - 940),
//     width : 10,
//     height : 940,
//     color : "#"+((1<<24)*Math.random()|0).toString(16)
// }
// Linker speler (persoon)
const user = {
    x : 50, // left side of canvas
    y : (canvas.height - 125)/2, // the height of paddle
    width : 15,
    height : hoogtepaddleuser,
    score : 0,
    color : "#"+((1<<24)*Math.random()|0).toString(16)
}

// Rechter speler (computer)
const com = {
    x : canvas.width - 50, // width of paddle
    y : (canvas.height - 125)/2, // the height of paddle
    width : 15,
    height : hoogtepaddlecom,
    score : 0,
    color : "#"+((1<<24)*Math.random()|0).toString(16)
}

// het net
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "#"+((1<<24)*Math.random()|0).toString(16)
}

// teken een rechthoek (spelers)
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// teken een cirkel (de bal)
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// de positie van de muis
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    
    user.y = evt.clientY - rect.top - user.height/2;
}

// wanneer er gescoord wordt, word de snelheid van de bal en positie gereset)
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 15;
    user.height = hoogtepaddleuser;
    com.height = hoogtepaddlecom;
}

// tekent het net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

let color = "#"+((1<<24)*Math.random()|0).toString(16);
// tekent de scores (random kleuren)
function drawText(text,x,y){
    ctx.fillStyle = color;
    ctx.font = "75px arial";
    ctx.fillText(text, x, y);
}

// checkt voor collision tussen objecten
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update functie
function update(){
    
    // Als er gescoord word, verandert de richting van de bal afhankelijk van wie er scoort
    if( ball.x - ball.radius < 0 ){
        com.score++;
        resetBall();
        hoogtepaddleuser += 10;
        hoogtepaddlecom -= 10;
        console.log(hoogtepaddleuser);
    }else if( ball.x + ball.radius > canvas.width){
        user.score++;
        resetBall();
        hoogtepaddleuser -= 10;
        hoogtepaddlecom += 10;
        console.log(hoogtepaddleuser);
    }
    
    // de snelheid van de bal
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // simple AI
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;
    
    // wanneer de bal iets raakt wordt de velocity omgedraait om hem de andere kant op te sturen
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
    }

    // check welke player er wordt geraakt door de bal
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // als de bal een panel raakt word er gekeken naar
    if(collision(ball,player)){
        // waar de panel word geraakt
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        
        // verandert de richtingshoek van de bal na collision
        let angleRad = (Math.PI/4) * collidePoint;
        
        // verandert de richting van de bal
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // de bal word met x aantal keer versneld na collision
        ball.speed += 1;
    }
}
    // WALL
    // let muur = (ball.x + ball.radius < canvas.width/2) ? wall : wall2;
    // if(collision(ball, muur)) {
    //     let collidePoint = (ball.y - (muur.y + muur.height - 800));
    //     collidePoint = collidePoint / (muur.height - 800/2);
    //
    //     // Changes the balls angle after collision
    //     let angleRad = (Math.PI/4) * collidePoint;
    //
    //     // change the X and Y direction
    //     let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
    //     ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    //     ball.velocityY = ball.speed * Math.sin(angleRad);
    // }

// deze functie rendert de game
function render(){

    // maakt de canvas schoon
    drawRect(0, 0, canvas.width, canvas.height, "#000");

    // tekent de score aan de linker kant
    drawText(user.score,canvas.width/4,canvas.height/5);

    // tekent de score aan de rechter kant
    drawText(com.score,3*canvas.width/4,canvas.height/5);

    // tekent het net
    drawNet();

    // tekent de linker speler
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // tekent de rechter speler
    drawRect(com.x, com.y, com.width, com.height, com.color);

    // tekent de bal
    drawArc(ball.x, ball.y, ball.radius, ball.color);

    // WALL
    // drawRect(wall.x, wall.y, wall.width, wall.height, wall.color);
    // drawRect(wall2.x, wall2.y, wall2.width, wall2.height, wall2.color);
}
function game(){
    update();
    render();
}
// frames per seconde
let framePerSecond = 50;

//roept de game functie 50 keer iedere seconde
let loop = setInterval(game,1000/framePerSecond);

