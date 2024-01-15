document.addEventListener('DOMContentLoaded', function(){
    // Where I will append the lists of characters at
    const ul = document.getElementById('animal-list')

    // function to render each character
    function renderOneCharacter(character) {
        // Where I will be appending each data
        const li = document.createElement('li');

        // The class name of the li element
        li.className = "list-of-characters"

        // The content that will be displayed in the 'li' element
        li.innerHTML = `
        <h2>${character.name}</h2>
        <button id="vote-button-${character.id}" class="btn vote-button">vote</button>
        <button id="reset-button-${character.id}" class="btn reset-button">Reset</button>
        `;
        // Where the li elements will be appended
        ul.appendChild(li);

        const voteButton = li.querySelector(`#vote-button-${character.id}`);
        const resetButton = li.querySelector(`#reset-button-${character.id}`);
        
        // Adding event listeners for vote and reset buttons

        voteButton.addEventListener('click', function() {
            voteAddition(character.id);
        });
    
        resetButton.addEventListener('click', function() {
            resetVotes(character.id);
        });

        // What to happen when the name is clicked
        const clickableName = li.querySelector('h2');

        clickableName.addEventListener('click', function() {
            // Creating an img element
            const imageElement = document.createElement('img');
            imageElement.src = character.image;
            imageElement.alt = character.name;

            // Creating a div element to append the img element
            const characterDetails = document.createElement('div');
            characterDetails.appendChild(imageElement);
            characterDetails.innerHTML += `<p>Name: ${character.name}</p>`;
            characterDetails.innerHTML += `<p>Votes: ${character.votes}</p>`;

            li.appendChild(characterDetails);
        });
    }

    // updates character votes on the server
    function updateCharacterVotes(characterId, votes) {
        fetch(`http://localhost:3000/characters/${characterId}`, {
            // Using PATCH since it is just a small update on the votes
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ votes: votes })
        })
            .then(response => response.json())
            .then(updatedCharacter => {
                const buttonForVoting = document.getElementById(`vote-button-${characterId}`);
                buttonForVoting.textContent = `vote ${updatedCharacter.votes}`;
            });
    }
    // vote increment function
    function voteAddition(characterId) {
        fetch(`http://localhost:3000/characters/${characterId}`)
            .then(response => response.json())
            .then(character => {
                character.votes++;
                updateCharacterVotes(characterId, character.votes);
            });
    }

    function resetVotes(characterId) {
        fetch(`http://localhost:3000/characters/${characterId}`)
            .then(response => response.json())
            .then(character => {
                character.votes = 0;
                updateCharacterVotes(characterId, character.votes);
            });
    }

    // Getting the form using dom so as to handle the submit
    const form = document.getElementById("character-form");

    form.addEventListener('submit', handleSubmit)

    function handleSubmit(event) {
        event.preventDefault();

        let characterObj = {
            name: event.target.name.value,
            image: event.target.image_url.value,
            votes: 0
        };

        renderOneCharacter(characterObj);
        addCharacter(characterObj);
    }

    // funciton that will add a character from the form to the web page
    function addCharacter(characterObj) {
        fetch('http://localhost:3000/characters', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(characterObj)
        })
        .then (response => response.json())
        .then(character => console.log(character))
    }

    // Fetching the characters data in the db.json file
    function getAllCharacters() {
        fetch(' http://localhost:3000/characters')
            // making the data that is fetched to be in json format
            .then(function (response) {
                return (response.json())
            })
            .then (characters => characters.forEach(character => renderOneCharacter(character)))
    }

    function initialize() {
        getAllCharacters();
    }

    initialize();
});
