const club = {
  name: "Newton United FC",
  colors: {
    primary: "maroon",
    secondary: "white",
    accent: "black"
  },
  stadium: "Newton Borough Ground",
  capacity: 3000,
  nickname: "The Newtonians",
  level: 8,
  money: 50000
};

function startGame() {
  localStorage.setItem("career", JSON.stringify(club));
  alert("Career started with " + club.name + " at Level " + club.level);
}
