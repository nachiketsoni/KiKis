var cards = document.querySelectorAll('.cards')
var sticker = document.querySelectorAll('.sticker')
let flag =  0
let b = 0
for(let i = 0; i < cards.length; i++){
    console.log(i)
    b = i
    cards[b].addEventListener('mouseover', function(e){
    

            sticker[b].style.transform = "scale(1.5)"
    })
    // cards[i].addEventListener('mouseout', function(e){
    

    //         sticker[i].style.transform = "scale(1)"
        
    // })
}
    const scroll = new LocomotiveScroll({
          el: document.querySelector('#main'),
          smooth: true
      });
      