let targetImage = null;
let targetPixels = null;
let population = [];
let populationSize = 10;
let canvases = [];
let targetCanvas = null;
let imageWidth = 0;
let imageHeight = 0;
let isImageLoaded = false;

// Fonction appelée depuis le bouton HTML
function loadTargetImage() {
    const url = document.getElementById('imageUrl').value;
    if (!url) {
        alert('Veuillez entrer une URL d\'image');
        return;
    }

    document.getElementById('loadBtn').disabled = true;
    document.getElementById('loadBtn').textContent = 'Chargement...';

    // Créer un sketch temporaire pour charger l'image
    const tempSketch = function(p) {
        p.setup = function() {
            p.noCanvas();
        };

        p.preload = function() {
            p.loadImage(url,
                function(img) {
                    // Image chargée avec succès
                    targetImage = img;
                    imageWidth = img.width;
                    imageHeight = img.height;

                    // Extraire les pixels de l'image cible
                    img.loadPixels();
                    targetPixels = img.pixels;

                    // Initialiser la population
                    initializePopulation();

                    // Afficher l'image cible
                    displayTargetImage();

                    // Afficher la population
                    displayPopulation();

                    isImageLoaded = true;

                    document.getElementById('loadBtn').disabled = false;
                    document.getElementById('loadBtn').textContent = 'Charger l\'image';
                    document.getElementById('target-container').style.display = 'block';

                    // Nettoyer le sketch temporaire
                    p.remove();
                },
                function() {
                    // Erreur de chargement
                    alert('Erreur lors du chargement de l\'image. Vérifiez l\'URL et les permissions CORS.');
                    document.getElementById('loadBtn').disabled = false;
                    document.getElementById('loadBtn').textContent = 'Charger l\'image';
                    p.remove();
                }
            );
        };
    };

    new p5(tempSketch);
}

// Initialiser la population avec des images aléatoires
function initializePopulation() {
    population = [];
    for (let i = 0; i < populationSize; i++) {
        let individual = new Individual(imageWidth, imageHeight);
        individual.calculateFitness(targetPixels);
        population.push(individual);
    }

    // Trier par fitness décroissant
    population.sort((a, b) => b.fitness - a.fitness);
}

// Afficher l'image cible
function displayTargetImage() {
    // Nettoyer le conteneur
    const container = document.getElementById('target-canvas');
    container.innerHTML = '';

    // Créer un nouveau sketch p5 pour l'image cible
    const targetSketch = function(p) {
        p.setup = function() {
            targetCanvas = p.createCanvas(imageWidth, imageHeight);
            targetCanvas.parent('target-canvas');
            p.noLoop();
        };

        p.draw = function() {
            p.image(targetImage, 0, 0);
        };
    };

    new p5(targetSketch);
}

// Afficher la population
function displayPopulation() {
    // Nettoyer le conteneur
    const container = document.getElementById('canvas-container');
    container.innerHTML = '';
    canvases = [];

    // Créer un canvas pour chaque individu
    for (let i = 0; i < population.length; i++) {
        const individualDiv = document.createElement('div');
        individualDiv.className = 'individual-container';
        individualDiv.id = `individual-${i}`;

        const title = document.createElement('div');
        title.textContent = `Individu ${i + 1}`;
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '5px';
        individualDiv.appendChild(title);

        const canvasDiv = document.createElement('div');
        canvasDiv.id = `canvas-${i}`;
        individualDiv.appendChild(canvasDiv);

        const fitnessDiv = document.createElement('div');
        fitnessDiv.className = 'fitness-score';
        fitnessDiv.id = `fitness-${i}`;
        fitnessDiv.textContent = `Fitness: ${population[i].fitness.toFixed(2)}%`;
        individualDiv.appendChild(fitnessDiv);

        container.appendChild(individualDiv);

        // Créer un sketch p5 pour cet individu
        const individual = population[i];
        const individualSketch = function(p) {
            p.setup = function() {
                const canvas = p.createCanvas(imageWidth, imageHeight);
                canvas.parent(`canvas-${i}`);
                p.noLoop();
            };

            p.draw = function() {
                individual.display(p, 0, 0);
            };
        };

        canvases.push(new p5(individualSketch));
    }
}

// Fonction pour évoluer la population (à implémenter plus tard)
function evolvePopulation() {
    if (!isImageLoaded) {
        return;
    }

    // Sélection, crossover, mutation...
    // À implémenter dans une prochaine étape
}
