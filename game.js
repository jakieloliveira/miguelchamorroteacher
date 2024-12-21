document.addEventListener('DOMContentLoaded', () => {
    // Random Background Logic
    const backgroundImages = [
        'aimages/bg1.webp',
        'aimages/bg2.webp',
        'images/bg3.webp',
        'images/bg4.webp',
        'images/bg5.webp'
    ];
    const randomBg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    document.body.style.backgroundImage = `url('${randomBg}')`;

    // Define image names at the top to ensure it's accessible everywhere
    const imageNames = [
        "Adjustablespanner_MonkeyWrench",
        "Bradawl",
        "Chisel",
        "Coppingsaw",
        "Drill",
        "File",
        "Hacksaw",
        "Hammer",
        "Handsaw",
        "Ladder",
        "Mallet",
        "Nails",
        "Pairofscissors",
        "Pincers",
        "Plane",
        "Pliers",
        "Pocketknife_Penknife",
        "Sandpaper",
        "Screwdriver",
        "Screws",
        "Spanner_Wrench",
        "Spiritlevel",
        "Stepladder",
        "Tapemeasure",
        "Toolbox",
        "Vise"
    ];

    // Memory Game Logic
    const grid = document.querySelector('.grid');
    const counterElement = document.getElementById('counter');

    if (!grid || !counterElement) {
        console.error("Error: Grid or Counter element not found in the DOM. Check your HTML structure.");
        return;
    }

    let moveCount = 0; // Initialize the move counter

    // Generate cards
    const cardsArray = generateCardsArray(14); // Generate 14 pairs of cards
    shuffleArray(cardsArray); // Shuffle the cards

    // Append each card to the grid
    cardsArray.forEach(item => {
        const card = createCardElement(item.name, item.isName);
        grid.appendChild(card);
    });

    // Helper functions
    function generateCardsArray(pairsNeeded) {
        const selectedPairs = imageNames.sort(() => 0.5 - Math.random()).slice(0, pairsNeeded);
        const cardsArray = selectedPairs.flatMap(name => [
            { name, isName: false },
            { name, isName: true }
        ]);
        return cardsArray;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }

    function createCardElement(baseName, isName) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');

        // Card back (visible initially)
        const cardBackElement = document.createElement('img');
        cardBackElement.src = 'assets/images/cardback_unflipped.png';
        cardBackElement.classList.add('card-image', 'card-back');
        cardElement.appendChild(cardBackElement);

        // Card front (hidden until flipped)
        const imageName = isName ? `${baseName}_name.png` : `${baseName}.png`;
        const cardFrontElement = document.createElement('img');
        cardFrontElement.src = `assets/images/${imageName}`;
        cardFrontElement.classList.add('card-image', 'card-front', 'hidden');
        cardElement.setAttribute('data-name', baseName);
        cardElement.setAttribute('data-isname', isName.toString());
        cardElement.appendChild(cardFrontElement);

        // Add click event listener for flipping the card
        cardElement.addEventListener('click', () => flipCard(cardElement));

        return cardElement;
    }

    function flipCard(card) {
        if (card.classList.contains('flipped') || card.classList.contains('match')) return; // Ignore already flipped or matched cards

        const flippedCards = document.querySelectorAll('.card.flipped:not(.match)');
        if (flippedCards.length < 2) {
            card.classList.add('flipped');
            card.querySelector('.card-back').classList.add('hidden');
            card.querySelector('.card-front').classList.remove('hidden');

            // Increment move counter
            moveCount++;
            counterElement.textContent = `Moves: ${moveCount}`;
        }
        if (flippedCards.length === 1) {
            setTimeout(checkForMatch, 500); // Add slight delay before checking for a match
        }
    }

    function checkForMatch() {
        const flippedCards = Array.from(document.querySelectorAll('.card.flipped:not(.match)'));
        if (flippedCards.length === 2) {
            const firstCard = flippedCards[0];
            const secondCard = flippedCards[1];

            if (firstCard.getAttribute('data-name') === secondCard.getAttribute('data-name')) {
                // It's a match
                firstCard.classList.add('match');
                secondCard.classList.add('match');

                // Make matched cards invisible
                setTimeout(() => {
                    firstCard.style.visibility = 'hidden';
                    secondCard.style.visibility = 'hidden';
                }, 500);
            } else {
                // Not a match
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    firstCard.querySelector('.card-back').classList.remove('hidden');
                    firstCard.querySelector('.card-front').classList.add('hidden');
                    secondCard.querySelector('.card-back').classList.remove('hidden');
                    secondCard.querySelector('.card-front').classList.add('hidden');
                }, 1000);
            }
        }
    }
});
