import fetchJsonp from 'fetch-jsonp';
import { isValidZip, showAlert } from './validate';

const petForm = document.querySelector('#pet-form');

petForm.addEventListener('submit', fetchAnimals);

// Fetch Animals From API
function fetchAnimals(e) {
  e.preventDefault();

  // Get User Input
  const animal = document.querySelector('#animal').value;
  const zip = document.querySelector('#zip').value;

  // Validate Zip
  if (!isValidZip(zip)) {
    showAlert('Please enter a valid zipcode.', 'danger');
    return;
  }

  // Fetch Animals
  fetchJsonp(
    `http://api.petfinder.com/pet.find?format=json&key=45ef2c7f014a3096fc3c7f4fc4dc2144&animal=${animal}&location=${zip}&callback=callback`,
    {
      jsonpCallbackFunction: 'callback'
    }
  )
    .then(res => res.json())
    .then(data => showAnimals(data.petfinder.pets.pet))
    .catch(err => console.log(err));
}

// Show Listing of Animals
function showAnimals(pets) {
  const results = document.querySelector('#results');

  // Clear First
  results.innerHTML = '';
  // Loop Through Pets
  pets.forEach(pet => {
    console.log(pet);
    const div = document.createElement('div');
    div.classList.add('card', 'card-body', 'mb-3');
    div.innerHTML = `
      <div class="row">
        <div class="col-sm-6">
          <h4>${pet.name.$t}</h4>
          ${
            pet.breeds.breed.$t
              ? `<p style="margin-bottom:0;" class="text-secondary">Breed: ${
                  pet.breeds.breed.$t
                }</p>`
              : ``
          }
          ${
            pet.sex.$t
              ? `<p style="margin-bottom:0;" class="text-secondary">Gender: ${
                  pet.sex.$t
                }</p>`
              : ``
          }
          ${
            pet.age.$t ? `<p class="text-secondary">Age: ${pet.age.$t}</p>` : ``
          }
          ${
            pet.contact.address1.$t
              ? `<p>${pet.contact.address1.$t} ${pet.contact.city.$t} ${
                  pet.contact.state.$t
                } ${pet.contact.zip.$t}</p>`
              : `<p>${pet.contact.city.$t} ${pet.contact.state.$t} ${
                  pet.contact.zip.$t
                }</p>`
          }
          ${
            pet.description.$t
              ? `<details style="margin-bottom:1.5rem;"><summary>More Info</summary><p>${
                  pet.description.$t
                }</p></details>`
              : ``
          }
 
          <ul class="list-group">
          ${
            pet.contact.phone.$t
              ? `<li class="list-group-item">Phone: ${
                  pet.contact.phone.$t
                }</li>`
              : ``
          }
            ${
              pet.contact.email.$t
                ? `<li class="list-group-item">Email: ${
                    pet.contact.email.$t
                  }</li>`
                : ``
            }
            <li class="list-group-item">Shelter ID: ${pet.shelterId.$t}</li>
          </ul>
        </div>
        <div class="col-sm-6 text-center">
          <img class="img-fluid rounded-circle mt-2" src="${
            pet.media.photos.photo[3].$t
          }">
        </div>
      </div>
    `;
    results.appendChild(div);
  });
}
