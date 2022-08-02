
(function startup () {
    let tl = gsap.timeline()
    tl
    .from('#rec1',{
    y: 500,
    x: -500,
    duration:.8,
    },'a')
    .from('#rec2',{
    y: -500,
    x: 500,
    duration:.8,
    },'a')
    .from('#rec3',{
    y: -500,
    x: -500,
    duration:.8,
    },'a')
    .from('#rec4',{
    y: -500,
    x: -500,
    duration:.8,
    },'a')
    .from('#rec5',{
    y: 500,
    x: 500,
    duration:.8,
    },'a')
    
    .from('.fadeUp',{
    y: 40,
    stagger:.2,
    opacity: 0,
    duration:.5,
    },'a')
    

})();

(function login () {
    var cross = document.querySelector('.close');
    var cross2 = document.querySelector('#cross2');
    var log = document.querySelector('#log');
    var sign = document.querySelector('#sign');
    var log1 = document.querySelector('#log1');
    var span1 = document.querySelector('#span1');
    var span2 = document.querySelector('#span2');
    var log2 = document.querySelector('#log2');
    var order = document.querySelector('#order');

sign.addEventListener("click",function(elem){
let tl = gsap.timeline()
    
  tl
  .to(log,{
      display: 'initial',
    //   stagger: -1,
    })
    .to(log1,{
        delay:-.4,
        x:0,
        ease: Power3.easeInOut,
    })
    
})
order.addEventListener("click",function(elem){
let tl = gsap.timeline()
    
  tl
  .to(log,{
      display: 'initial',
    //   stagger: -1,
    })
    .to(log1,{
        delay:-.4,
        x:0,
        ease: Power3.easeInOut,
    })
    
})

cross.addEventListener('click', function(){
    let tl = gsap.timeline()
    
    tl
    .to(log1,{
        x:'100%',
        ease: Power3.easeInOut,
        
    },'a')
    .to(log,{
        display: 'none',
        
    },'a')
    
});

    
span1.addEventListener('click', function(){
        log2.style.display = "block";
      

        
    });
    span2.addEventListener('click', function(){
        log2.style.display = "none";

    });

        

cross2.addEventListener('click', function(){
    let tl = gsap.timeline()
    
    tl
    .to(log1,{
        x:'100%',
        ease: Power3.easeInOut,
    },'a')
    .to(log2,{
        x:'100%',
        ease: Power3.easeInOut,
    },'a')
    
    .to(log,{
        display: 'none',
        
    },'b')
    
});
})()


    var $ = (s, o = document) => o.querySelector(s);
    var $$ = (s, o = document) => o.querySelectorAll(s);
    
    $(".password-input").addEventListener("input", value, false);
    window.addEventListener("load", value, false);
    
    function value() { 
      $(".password-text").textContent = $(".password-input").value;
      charming($(".password-text"));
      $(".password-dots").textContent = $(".password-input").value;
      charming($(".password-dots"));
    };
    
    $(".monkey").addEventListener("click", function() {
      $(".password").classList.toggle("show");
    });
    
    $(".password-input").addEventListener("focusin", function() {
      $$(".password-text, .password-dots").forEach(el => el.classList.add('cursor'))
    });
    
    $(".password-input").addEventListener("focusout", function() {
      $$(".password-text, .password-dots").forEach(el => el.classList.remove('cursor'))
    });
    
    
    


