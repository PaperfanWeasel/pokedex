// DOM Objects 
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeShinyImage = document.querySelector('.poke-shiny-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListitems = document.querySelectorAll('.list-item');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const aButton = document.querySelector('.a_button');
const bButton = document.querySelector('.b_button');

// Constansts and Variables
const TYPES = [
    'normal', 'fighting', 'flying',
    'poison', 'ground', 'rock',
    'bug', 'ghost', 'steel',
    'fire', 'water', 'grass',
    'electric', 'psychic', 'ice',
    'dragon', 'dark', 'fairy'
];
let currId = null;
let prevUrl = null;
let nextUrl = null;
let isShiny = false;

// Functions
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

HTMLElement.prototype.removeClass = function(remove) {
    var newClassName = "";
    var i;
    var classes = this.className.split(" ");
    for(i = 0; i < classes.length; i++) {
        if(classes[i] !== remove) {
            newClassName += classes[i] + " ";
        }
    }
    this.className = newClassName;
};

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES) {
        mainScreen.removeClass(type); // using removeClass function added to all HTMLElements
        //mainScreen.classList.remove(type); // old
    }
};

const refreshLeftScreen = () => {
    fetchPokeData(currId);
}

const handleLeftButtonClick = () => {
    if (prevUrl) {
        fetchPokeList(prevUrl);
    }
};

const handleRightButtonClick = () => {
    if (nextUrl) {
        fetchPokeList(nextUrl);
    }
};

const handleAButtonClick = () => {
    if (isShiny) {
        isShiny = false;
        pokeShinyImage.classList.add('hide');
    } else {
        isShiny = true;
        pokeShinyImage.classList.remove('hide');
    }
    refreshLeftScreen();
};

const handleBButtonClick = () => {
    // not thought of a use for this yet
};

const handleListItemClick = (e) => {
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
};

// get data for right side of screen
const fetchPokeList = url => {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const { results, previous, next } = data;
        prevUrl = previous;
        nextUrl = next;
    
        for (let i = 0; i < pokeListitems.length; i++) {
            const pokeListitem = pokeListitems[i];
            const resultData = results[i];
    
            if (resultData) {
                const { name, url } = resultData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2];
                pokeListitem.textContent = id + '. ' + capitalize(name);
            } else {
                pokeListitem.textContent = '';
            }
        }
    });
}

// get data for left side of screen
const fetchPokeData = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
            resetScreen();
            currId = id;

            const dataTypes = data['types'];
            const dataFirstType = dataTypes[0];
            const dataSecondType = dataTypes[1];

            pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
            if (dataSecondType) {
                pokeTypeTwo.classList.remove('hide');
                pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
            } else {
                pokeTypeTwo.classList.add('hide');
                pokeTypeTwo.textContent = ''
            }

            mainScreen.classList.add(dataFirstType['type']['name']);

            pokeName.textContent = capitalize(data['name']);
            pokeId.textContent = '#' + data['id'].toString().padStart(3,'0');
            pokeWeight.textContent = data['weight'];
            pokeHeight.textContent = data['height'];

            if (!isShiny) {
                pokeFrontImage.src = data['sprites']['front_default'] || '';        
                pokeBackImage.src = data['sprites']['back_default'] || '';
            } else { 
                pokeFrontImage.src = data['sprites']['front_shiny'] || '';        
                pokeBackImage.src = data['sprites']['back_shiny'] || '';
            }
        });
};

// end of Functions

// adding event listeners
leftButton.addEventListener('click', handleLeftButtonClick);
rightButton.addEventListener('click', handleRightButtonClick);
aButton.addEventListener('click', handleAButtonClick);
bButton.addEventListener('click', handleBButtonClick);
for (const pokeListitem of pokeListitems) {
    pokeListitem.addEventListener('click', handleListItemClick);
};


// initialise App
fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');