
    function changeColors() {
        const paragraphs = document.querySelectorAll('.modal-content p');
        const colors = ['#26cb37', '#000d03'];

        paragraphs.forEach(function (paragraph) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            paragraph.style.color = randomColor;
        });
    }

    setInterval(changeColors, 2000);

    let currentPage = 1;
    let totalPages = 1;
    const cardsPerPage = 8;

    function searchCharacters() {
        const searchInput = document.getElementById('searchInput').value;
        const apiUrl = `https://rickandmortyapi.com/api/character?name=${searchInput}`;

        axios.get(apiUrl)
            .then(function (response) {
                const characters = response.data.results;
                totalPages = Math.ceil(characters.length / cardsPerPage);
                displayCharacters(characters);
                updateCounts();
                updatePagination();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function displayCharacters(characters) {
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '';

        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const charactersToDisplay = characters.slice(startIndex, endIndex);

        charactersToDisplay.forEach(function (character) {
            const card = document.createElement('article');
            card.classList.add('card');

            const image = document.createElement('img');
            image.src = character.image;
            image.alt = character.name;
            card.appendChild(image);

            const cardText = document.createElement('div');
            cardText.classList.add('card-text');

            const name = document.createElement('h2');
            name.textContent = character.name;
            cardText.appendChild(name);

            const status = document.createElement('h4');
            status.innerHTML = `<span class="circle ${getStatusColor(character.status)}"></span>${character.status} - ${character.species}`;
            cardText.appendChild(status);

            const lastLocationLabel = document.createElement('p');
            lastLocationLabel.textContent = 'Última localização conhecida:';
            cardText.appendChild(lastLocationLabel);

            const lastLocation = document.createElement('p');
            axios.get(character.location.url)
                .then(function (response) {
                    lastLocation.textContent = response.data.name;
                })
                .catch(function (error) {
                    console.log(error);
                });
            cardText.appendChild(lastLocation);

            const lastSeenLabel = document.createElement('p');
            lastSeenLabel.textContent = 'Visto a última vez em:';
            cardText.appendChild(lastSeenLabel);

            const lastSeen = document.createElement('p');
            axios.get(character.episode[character.episode.length - 1])
                .then(function (response) {
                    lastSeen.textContent = response.data.name;
                })
                .catch(function (error) {
                    console.log(error);
                });
            cardText.appendChild(lastSeen);

            card.appendChild(cardText);
            cardContainer.appendChild(card);

            card.addEventListener('click', function () {
                openModal(character);
            });
        });
    }

    function openModal(character) {
        const modal = document.getElementById('characterModal');
        const modalData = document.getElementById('modalData');
        modalData.innerHTML = '';

        const name = document.createElement('h2');
        name.textContent = character.name;
        modalData.appendChild(name);

        const image = document.createElement('img');
        image.src = character.image;
        image.alt = character.name;
        modalData.appendChild(image);

        const status = document.createElement('h4');
        status.innerHTML = `<span class="circle ${getStatusColor(character.status)}"></span>${character.status} - ${character.species}`;
        modalData.appendChild(status);

        const lastLocationLabel = document.createElement('p');
        lastLocationLabel.textContent = 'Última localização conhecida:';
        modalData.appendChild(lastLocationLabel);

        const lastLocation = document.createElement('p');
        axios.get(character.location.url)
            .then(function (response) {
                lastLocation.textContent = response.data.name;
            })
            .catch(function (error) {
                console.log(error);
            });
        modalData.appendChild(lastLocation);

        const lastSeenLabel = document.createElement('p');
        lastSeenLabel.textContent = 'Visto a última vez em:';
        modalData.appendChild(lastSeenLabel);

        const lastSeen = document.createElement('p');
        axios.get(character.episode[character.episode.length - 1])
            .then(function (response) {
                lastSeen.textContent = response.data.name;
            })
            .catch(function (error) {
                console.log(error);
            });
        modalData.appendChild(lastSeen);

        modal.style.display = 'block';

        const closeButton = document.getElementsByClassName('close')[0];
        closeButton.addEventListener('click', function () {
            closeModal();
        });

        window.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    function closeModal() {
    const modal = document.getElementById('characterModal');
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.add('fade-out');
    setTimeout(() => {
    modal.style.display = 'none';
    modalContent.classList.remove('fade-out');
  }, 300);
}

    function updateCounts() {
        axios.all([
            axios.get('https://rickandmortyapi.com/api/character'),
            axios.get('https://rickandmortyapi.com/api/location'),
            axios.get('https://rickandmortyapi.com/api/episode')
        ])
            .then(axios.spread(function (characterResponse, locationResponse, episodeResponse) {
                const characterCount = characterResponse.data.info.count;
                const locationCount = locationResponse.data.info.count;
                const episodeCount = episodeResponse.data.info.count;

                document.getElementById('characterCount').textContent = `PERSONAGENS: ${characterCount}`;
                document.getElementById('locationCount').textContent = `LOCALIZAÇÕES: ${locationCount}`;
                document.getElementById('episodeCount').textContent = `EPISÓDIOS: ${episodeCount}`;
            }))
            .catch(function (error) {
                console.log(error);
            });
    }

    updateCounts();

    function getStatusColor(status) {
        switch (status) {
            case 'Alive':
                return 'green';
            case 'Dead':
                return 'red';
            default:
                return 'gray';
        }
    }

    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page;
            searchCharacters();
        }
    }

    function updatePagination() {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (totalPages > 1) {
            const previousButton = createPaginationButton('Anterior', currentPage - 1);
            pagination.appendChild(previousButton);

            for (let i = 1; i <= totalPages; i++) {
                const pageButton = createPaginationButton(i, i);
                if (i === currentPage) {
                    pageButton.classList.add('active');
                }
                pagination.appendChild(pageButton);
            }

            const nextButton = createPaginationButton('Próxima', currentPage + 1);
            pagination.appendChild(nextButton);
        }
    }

    function createPaginationButton(text, page) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', function () {
            goToPage(page);
        });
        return button;
    }

    window.addEventListener('scroll', function() {
    const scrollButton = document.getElementById('scrollButton');
    if (document.documentElement.scrollTop > 200) {
        scrollButton.classList.add('show');
    } else {
        scrollButton.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}
    function getRandomCharacters() {
        const randomPage = Math.floor(Math.random() * totalPages) + 1;
        const apiUrl = `https://rickandmortyapi.com/api/character?page=${randomPage}`;

        axios.get(apiUrl)
            .then(function (response) {
                const characters = response.data.results;
                displayCharacters(characters);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getRandomCharacters();