var score = 0

var highscore = localStorage.getItem("highscore");


var lives = localStorage.getItem("lives")


const canvas=document.querySelector('canvas');
const c = canvas.getContext('2d')
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }


canvas.width = window.innerWidth
canvas.height = window.innerHeight


const gravity= 0.8

class Healthbar{
    constructor(length,color) {
        this.length = length
        this.color = color
    }

    draw() {
        c.beginPath()
        c.rect(100,100, this.length, 10);
        c.fillStyle=this.color
        c.fill();
    }
    update() {
        this.length+=20
        this.draw()
    }

}

class Spike{
    constructor(x,color) {
        this.x = x 
        this.color
    }

    draw() {
        c.beginPath()
        c.moveTo(this.x, 0);
        c.lineTo(this.x+50, 0);
        c.lineTo((2*this.x+50)/2, 50);
        c.fillStyle=this.color
        c.fill()
    }
}

class Health{
    constructor(x,y,radius,color,yVelocity) {
        this.x = x 
        this.y = y
        this.radius = radius
        this.color = color
        this.yVelocity = yVelocity
    }

    draw() {
        
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle=this.color
        c.fill()
    }
    update() {
        this.draw()
        this.y -= 7
        
    }
}

class Player{
    constructor(x,y,radius,color,xVelocity,yVelocity) {
        this.x = x 
        this.y = y
        this.radius = radius
        this.color = color
        this.xVelocity = xVelocity
        this.yVelocity = yVelocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle=this.color
        c.fill()
    }

    update() {
        this.y += this.yVelocity
        this.x += this.xVelocity
        this.draw()
        this.yVelocity+=gravity;
        
    }
}




class Platform{
    constructor(x,y,yVelocity){
        this.x = x
        this.y = y
        this.width = Math.random()*200 + 200
        this.height = 15
        this.yVelocity=7
        this.color = 'black'
    }

    draw() {
        c.beginPath()
        c.rect(this.x,this.y, this.width, this.height);
        c.fillStyle=this.color
        c.fill();
    }

    update() {
        this.y = this.y - this.yVelocity
        this.draw()
    }
}

const x=canvas.width/2;
const y=canvas.height/3;
const spikes=[]
let j=0
for(let i=0; i<=canvas.width; i+=50)
{
spikes[j] = new Spike(i,'red')
j+=1
}

const lengthH = lives*20+20


var playersize = 20


const player = new Player(x,y,playersize,'blue',0,0)
const healthBar = new Healthbar(lengthH, 'red')

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
const platforms=[]
const health=[]

function spawnPlatforms() {
    
    platforms.push(new Platform(canvas.width/2-canvas.width/6,canvas.height/1.3,5))
    setInterval(() => {
        
        const num =  getRandomArbitrary(0,0.7)
        const x = getRandomArbitrary(0,0.7)*canvas.width
        
        const y = canvas.height
        const yVelocity = 20
    

        platforms.push(new Platform(x,y,yVelocity))
        let m = Math.random()
        if(m<0.05){
            
            health.push(new Health(x+canvas.width/8,y-22,15,'red',yVelocity))
            
        }
        score+=10
        
    
        
    },750 ) 


}


function animate(){

    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    
    spikes.forEach(spike => {
        spike.draw()
    })

    player.update()
    

    healthBar.draw()

    health.forEach((healt, index) => {
        healt.update()

        const dist=Math.hypot(player.x-healt.x,player.y-healt.y)
        

        if(dist - player.radius - healt.radius < 1)
        {
            health.splice(index, 1)
            lives++
            healthBar.update()
        }
    })
    
    

   

    if (keys.right.pressed){
        player.xVelocity = 15
    }
    else if (keys.left.pressed){
        player.xVelocity = -15
    }
    else{
    player.xVelocity = 0
    }

    platforms.forEach(platform => {
        
        platform.update()
           if(player.x <= platform.x + platform.width && player.x >= platform.x && platform.y <= player.y + player.radius  && player.y - player.radius <= platform.y + platform.height )
            { 
                player.yVelocity=-platform.yVelocity-1
            }
            
    })

   

   



    // lose condition
   
    
    if(player.y - 2*player.radius > canvas.height || player.y-player.radius < 40){
        
        if(highscore !== null){
            if (score > highscore) {
                localStorage.setItem("highscore", score);     
            }
        }
        else{
            localStorage.setItem("highscore", score);
        }

    


        location.reload()
        
        if(lives==0)
        {
        alert("game over score = "+ score +" m\n"+"highscore = "+localStorage.getItem("highscore")+" m")
        localStorage.setItem("lives", 2);
        localStorage.setItem("score", 0);
        
        }
        else{
            localStorage.setItem("lives",lives-1)
            alert("score = "+score)
            localStorage.setItem("score", scoreKeep);
           
        }
        
       
        
    } 

    /*if(player.y-player.radius < 40)
    { 
        if(highscore !== null){
            if (score > highscore) {
                localStorage.setItem("highscore", score);      
            }
        }
        else{
            localStorage.setItem("highscore", score);
        }
                //c.clearRect(0,0,canvas.width,canvas.height)
                console.log("you lose")
                location.reload()
                if(lives==0)
                {
                alert("game over score = "+ score+" m\n"+"highscore = "+localStorage.getItem("highscore")+" m")
                }
                else{
                alert("life gone")
                console.log(lives)
                lives--
                }       
    }
    */
    

    
}
spawnPlatforms()
animate()



addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        case 37:
            
            keys.left.pressed=true
            break

        case 39:
            
            keys.right.pressed=true
            break
        
    }
  
})

addEventListener('touchstart', (event) => {
    
    var x = event.touches[0].clientX;
    if(x<canvas.width/2)
    {
        keys.left.pressed=true
    }
    else if(x>canvas.width/2)
    {
        keys.right.pressed=true
    }
})

addEventListener('keyup', ({keyCode}) => {
    //console.log(keyCode)
    switch(keyCode){
        case 37:
            
            keys.left.pressed=false
            break

        case 39:
            
            keys.right.pressed=false
            break
        
    }
  
})

addEventListener('touchend', (event) => {
    
    keys.right.pressed = false
    keys.left.pressed = false
})
