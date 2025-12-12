import './styles/style.css'


 const myButton = document.getElementById("bouton");
 let game = document.getElementById("experience-test");
 let mainMenu = document.getElementById("hero-wrapper");
 
 myButton.addEventListener("click", showGame); 


  function showGame() {
    game.style.display = "block";
    mainMenu.style.display = "none";
  }