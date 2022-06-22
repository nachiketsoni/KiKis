const scroll = new LocomotiveScroll({
      el: document.querySelector('#main'),
      smooth: true
  });

var cards = document.querySelectorAll('.cards')
var sticker = document.querySelectorAll('.sticker')
let flag =  0
let i =0
while(i < cards.length){
    console.log(i)
    let b = i
    cards[b].addEventListener('mouseover', function(e){
    

            cards[b].style.transform = "scale(1.2)"
    })
    cards[b].addEventListener('mouseout', function(e){
                
        
        cards[b].style.transform = "scale(1)"
        
    })
    i++
}
      