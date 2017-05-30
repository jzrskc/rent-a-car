const nav = document.querySelector('#main');
let topOfNav = nav.offsetTop;   //Vrh Nav-a

function fixNav() {
  // Kada scroll dode do vrha Nav, fiksirat Nav na stranicu, tako sto cemo body-u dodati 'fixed-nav'
  // class="" -> class="fixed-nav"
  if(window.scrollY >= topOfNav) {
    // style="padding-top: 77px;" Dodajemo ovaj style bodyu, tako da se glatko fiksira, da Nav ne 'poskace'
    document.body.style.paddingTop = nav.offsetHeight + 'px';
    document.body.classList.add('fixed-nav');
  } else {
    document.body.classList.remove('fixed-nav');
    document.body.style.paddingTop = 0;
  }
}

window.addEventListener('scroll', fixNav);


/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
