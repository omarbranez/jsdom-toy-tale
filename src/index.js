let toyCollection = document.querySelector("#toy-collection")

document.addEventListener("DOMContentLoaded", () => {
  let addToy = false;
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener("submit", e => {
        e.preventDefault()
        addNewToy(e.target)
      }) 
      toyFormContainer.reset();
      } else {
        toyFormContainer.style.display = "none";
    }
  })
})


function getToys() {
  return fetch('http://localhost:3000/toys') // dont forget return, in order to use it later!!
    .then(res => res.json())
};

function displayToys(toy) {  
    
  let toyName = document.createElement("h2")
  toyName.innerText = toy.name

  let toyImage = document.createElement("img")
  toyImage.src = toy.image
  toyImage.setAttribute("class", "toy-avatar")
    
  let toyLikes = document.createElement("p")
  toyLikes.innerText = `${toy.likes} Likes`

  let likeButton = document.createElement("button")
  likeButton.setAttribute("class", "like-btn")
  likeButton.setAttribute("id", toy.id)
  likeButton.innerText = "Like"
  likeButton.addEventListener("click", (e) => {
    addLike(e)
  })
    
  let newToy = document.createElement("div")
  newToy.setAttribute = ("class", "card")
  newToy.append(toyName, toyImage, toyLikes, likeButton)
  toyCollection.append(newToy)
};

function addLike(e) {
  e.preventDefault()
  let newLikes = parseInt(e.target.previousElementSibling.innerText) + 1
  return fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
  .then(res => res.json())
  .then(newObjectLikes => {
    e.target.previousElementSibling.innerText = `${newObjectLikes.likes} Likes`;
  
  })
}

function addNewToy(toy_form) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": toy_form.name.value,
      "image": toy_form.image.value,
      "likes" : 0
    })
  })
  .then(res => res.json())
  .then(toy_object => {
    displayToys(toy_object)
    document.querySelector(".add-toy-form").reset()
    // otherwise the data stays on the form
  })
}

getToys().then(toys => {
  toys.forEach(toy => {
    displayToys(toy)
  })
});