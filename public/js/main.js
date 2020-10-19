let target = document.querySelector("#dyname");
let bar = document.querySelector("#header");
var flip = document.querySelector("#container");
var home = document.querySelector("#home");
var me = document.querySelector("#about_me");
var works = document.querySelector("#works");
var connect = document.querySelector("#connect");
var menu = document.querySelector("#menu");
var nav = document.querySelector("#nav");
var card = document.querySelector("#mycard");
var currentScrollValue = 0;
var befor = 0;
var btn = 0;
var evn = 0;
var auto = 1;
var evnbtn = 0;
var curren = 2;

card.onclick = function(){
    card.classList.toggle("flipped");
};

test();

function test(){
    home.style.transform =" perspective(0) scale(1) translate3d(0, 0, 0) rotate3d(0, 0, 0, 0)";
    home.style.display = "flex";
    me.style.transform =" perspective(1000px) scale(0) translate3d(0px, 42vh, 0px) rotate3d(1, 0, 0, 72deg)";
    me.style.display = "none";
    works.style.transform =" perspective(1000px) scale(0) translate3d(0px, 42vh, 0px) rotate3d(1, 0, 0, 72deg)";
    works.style.display = "none";
    connect.style.transform =" perspective(1000px) scale(0) translate3d(0px, 42vh, 0px) rotate3d(1, 0, 0, 72deg)";
    connect.style.display = "none";
}

// 화면 이벤트
function Evnmid(evn){
    if(evn==1){
        home.style.transform = "perspective(0) scale(1) translate3d(0,0,0) rotate3d(0,0,0,0)"
    }else if(evn==2){      
        me.style.transform = "perspective(0) scale(1) translate3d(0,0,0) rotate3d(0,0,0,0)"
    }else if(evn==3){      
        works.style.transform = "perspective(0) scale(1) translate3d(0,0,0) rotate3d(0,0,0,0)"
    }else if(evn==4){      
        connect.style.transform = "perspective(0) scale(1) translate3d(0,0,0) rotate3d(0,0,0,0)"
    }
}

function Evnin(evn, evnbtn){
    if (evnbtn == 1){
        if(evn == 1){
            home.style.display = "none";
        }else if(evn == 2){
            me.style.display = "none";
        }else if(evn == 3){
            works.style.display = "none";
        }else if(evn == 4){
            connect.style.display = "none";
        }
        home.style.display = "flex";
        setTimeout(function(){Evnmid(evnbtn);},300);
    }else if (evnbtn == 2){
        if(evn == 1){
            home.style.display = "none";
        }else if(evn == 2){
            me.style.display = "none";
        }else if(evn == 3){
            works.style.display = "none";
        }else if(evn == 4){
            connect.style.display = "none";
        }
        me.style.display = "flex";
        setTimeout(function(){Evnmid(evnbtn);},300);
    }else if (evnbtn == 3){
        if(evn == 1){
            home.style.display = "none";
        }else if(evn == 2){
            me.style.display = "none";
        }else if(evn == 3){
            works.style.display = "none";
        }else if(evn == 4){
            connect.style.display = "none";
        }
        works.style.display = "flex";
        setTimeout(function(){Evnmid(evnbtn);},300);
    }else if (evnbtn == 4){
        home.style.display = "none";
        me.style.display = "none";
        works.style.display = "none";
    
        connect.style.display = "flex";
        setTimeout(function(){Evnmid(evnbtn);},300);
    }
}
function Evnout(evn, evnbtn){
    if (evn == 1){
        home.style.transform = "perspective(1000px) scale(0) translate3d(0,42vh,0) rotate3d(1,0,0,72deg)";
        me.style.display = "none";
        works.style.display = "none";
        connect.style.display = "none";
        setTimeout(function(){ Evnin(evn, evnbtn); },1000);
    }else if (evn == 2){
        me.style.transform = "perspective(1000px) scale(0) translate3d(0,42vh,0) rotate3d(1,0,0,72deg)";
        home.style.display = "none";
        works.style.display = "none";
        connect.style.display = "none";
        setTimeout(function(){ Evnin(evn, evnbtn); },1000);
    }else if (evn == 3){
        works.style.transform = "perspective(1000px) scale(0) translate3d(0,42vh,0) rotate3d(1,0,0,72deg)";
        home.style.display = "none";
        me.style.display = "none";
        connect.style.display = "none";
        setTimeout(function(){ Evnin(evn, evnbtn); },1000);
    }else if (evn == 4){
        connect.style.transform = "perspective(1000px) scale(0) translate3d(0,42vh,0) rotate3d(1,0,0,72deg)";
        home.style.display = "none";
        me.style.display = "none";
        works.style.display = "none";
        setTimeout(function(){ Evnin(evn, evnbtn); },1000);
    }
}

// navbar
document.addEventListener('scroll', function() {
    currentScrollValue = document.documentElement.scrollTop;
    nav.style.top = currentScrollValue +'px' ;
});

// 버튼
function btntest(btn){
    if(btn==1)
    {
        home.style.transform = "perspective(1000px) scale(1) translate3d(0,42vh,0) rotate3d(1,0,0,72deg)";
        home.style.opacity = "0.5";
        home.style.display = "flex";
        nav.style.display = "none";
        menu.style.display = "flex";
    }
    else if(btn==2){
        if(home.style.display=="flex"){
            setTimeout(function(){ Evnout(1, btn); },300);
        }else if(me.style.display=="flex"){
            setTimeout(function(){ Evnout(2, btn); },300);
        }else if(works.style.display=="flex"){
            setTimeout(function(){ Evnout(3, btn); },300);
        }else if(connect.style.display=="flex"){
            setTimeout(function(){ Evnout(4, btn); },300);
        }
        menu.style.display = "none";
        nav.style.display = "flex";
    }
    else if(btn==3){
        if(home.style.display=="flex"){
            setTimeout(function(){ Evnout(1, btn); },300);
        }else if(me.style.display=="flex"){
            setTimeout(function(){ Evnout(2, btn); },300);
        }else if(works.style.display=="flex"){
            setTimeout(function(){ Evnout(3, btn); },300);
        }else if(connect.style.display=="flex"){
            setTimeout(function(){ Evnout(4, btn); },300);
        }
        menu.style.display = "none";
        nav.style.display = "flex";
    }
    else if(btn==4){
        if(home.style.display=="flex"){
            setTimeout(function(){ Evnout(1, btn); },300);
        }else if(me.style.display=="flex"){
            setTimeout(function(){ Evnout(2, btn); },300);
        }else if(works.style.display=="flex"){
            setTimeout(function(){ Evnout(3, btn); },300);
        }else if(connect.style.display=="flex"){
            setTimeout(function(){ Evnout(4, btn); },300);
        }
        menu.style.display = "none";
        nav.style.display = "flex";
    }else if(btn == 5){
        home.style.opacity = "1";
        home.style.transform = "perspective(0) scale(1) translate3d(0,0,0) rotate3d(0,0,0,0)"
        nav.style.display = "none";
        menu.style.display = "none";
    }else if(btn == 6){
        if(home.style.display=="flex"){
            setTimeout(function(){ Evnout(1, 1); },300);
        }else if(me.style.display=="flex"){
            setTimeout(function(){ Evnout(2, 1); },300);
        }else if(works.style.display=="flex"){
            setTimeout(function(){ Evnout(3, 1); },300);
        }else if(connect.style.display=="flex"){
            setTimeout(function(){ Evnout(4, 1); },300);
        }
        home.style.opacity = "1";
        nav.style.display = "none";
        menu.style.display = "none";
    }
}
function autopage(){
    auto++;
    btntest(auto);
    if(auto<=4){ 
        setTimeout(function(){
            autopage();
        }, 5000); 
    }else{
        btntest(6);
        auto=1;
    }
}
// 큰 글씨
function randomString(){
    // let stringArr = ["Learn to HTML", "Learn to CSS", "Learn to Javascript", "Learn to Python", "Learn to Ruby"];
    let stringArr = ["이호윤의 포트폴리오 입니다."]
    let selectString = stringArr[Math.floor(Math.random() * stringArr.length)];
    let selectStringArr = selectString.split("");
    return selectStringArr;
}

function resetTyping(){
    target.textContent = "";
    dyname(randomString());
}

function dyname(randomArr){
    if(randomArr.length > 0){
        target.textContent +=randomArr.shift();
        setTimeout(function(){
            dyname(randomArr);
        }, 160);
    }else{
        setTimeout(resetTyping, 3000);
    }
}

dyname(randomString());

function blink(){
    target.classList.toggle("active");
}
setInterval(blink, 500);