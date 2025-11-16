let targetImage = null;
let targetPixels = null;
let population = [];
let populationSize = 10;
let canvases = [];
let targetCanvas = null;
let imageWidth = 0;
let imageHeight = 0;
let isImageLoaded = false;
let generationNumber = 0;
let autoEvolveInterval = null;
let isAutoEvolving = false;

// Initialiser les event listeners pour les sliders
window.addEventListener('DOMContentLoaded', function() {
    const mutationRateSlider = document.getElementById('mutationRate');
    const mutationRateValue = document.getElementById('mutationRateValue');
    const eliteCountSlider = document.getElementById('eliteCount');
    const eliteCountValue = document.getElementById('eliteCountValue');
    const autoSpeedSlider = document.getElementById('autoSpeed');
    const autoSpeedValue = document.getElementById('autoSpeedValue');

    mutationRateSlider.addEventListener('input', function() {
        const value = (parseFloat(this.value) * 100).toFixed(1);
        mutationRateValue.textContent = `${value}%`;
    });

    eliteCountSlider.addEventListener('input', function() {
        eliteCountValue.textContent = this.value;
    });

    autoSpeedSlider.addEventListener('input', function() {
        autoSpeedValue.textContent = `${this.value}ms`;
        // Si l'évolution auto est en cours, redémarrer avec la nouvelle vitesse
        if (isAutoEvolving) {
            stopAutoEvolution();
            startAutoEvolution();
        }
    });
});

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
                    generationNumber = 0;
                    updateGenerationLabel();

                    document.getElementById('loadBtn').disabled = false;
                    document.getElementById('loadBtn').textContent = 'Charger l\'image';
                    document.getElementById('target-container').style.display = 'block';
                    document.getElementById('evolution-controls').style.display = 'block';

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
    // Supprimer l'ancien sketch si il existe
    if (targetCanvas) {
        // Le targetCanvas est en fait un p5.Renderer, on doit supprimer le sketch parent
        // On va simplement recréer le conteneur
    }

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
    // IMPORTANT: Supprimer les anciens sketches p5 pour éviter les fuites mémoire
    for (let i = 0; i < canvases.length; i++) {
        if (canvases[i]) {
            canvases[i].remove();
        }
    }

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

// Mettre à jour le label de génération
function updateGenerationLabel() {
    document.getElementById('generation-label').textContent = `Generation: ${generationNumber}`;
}

// Créer la prochaine génération
function nextGeneration() {
    if (!isImageLoaded) {
        return;
    }

    // Désactiver le bouton pendant le traitement (seulement si pas en mode auto)
    if (!isAutoEvolving) {
        document.getElementById('nextGenBtn').disabled = true;
        document.getElementById('nextGenBtn').textContent = 'Calcul en cours...';
    }

    // Récupérer les paramètres
    const mutationRate = parseFloat(document.getElementById('mutationRate').value);
    const eliteCount = parseInt(document.getElementById('eliteCount').value);

    // Les 2 meilleurs individus (la population est déjà triée par fitness)
    const parent1 = population[0];
    const parent2 = population[1];

    // Créer une nouvelle population
    const newPopulation = [];

    // Étape 1: Élitisme - Garder les meilleurs individus intacts
    for (let i = 0; i < eliteCount && i < population.length; i++) {
        // Cloner les élites pour qu'ils ne soient pas modifiés
        newPopulation.push(population[i].clone());
    }

    // Étape 2: Créer le reste de la population via crossover + mutation
    const remainingSlots = populationSize - eliteCount;
    for (let i = 0; i < remainingSlots; i++) {
        // Créer un enfant par crossover des 2 meilleurs parents
        const child = Individual.crossover(parent1, parent2);

        // Appliquer la mutation
        child.mutate(mutationRate);

        // Calculer le fitness de l'enfant
        child.calculateFitness(targetPixels);

        newPopulation.push(child);
    }

    // Remplacer l'ancienne population
    population = newPopulation;

    // Trier par fitness décroissant
    population.sort((a, b) => b.fitness - a.fitness);

    // Incrémenter le numéro de génération
    generationNumber++;
    updateGenerationLabel();

    // Afficher la nouvelle population
    displayPopulation();

    // Réactiver le bouton (seulement si pas en mode auto)
    if (!isAutoEvolving) {
        document.getElementById('nextGenBtn').disabled = false;
        document.getElementById('nextGenBtn').textContent = 'Prochaine Generation';
    }
}

// Démarrer l'évolution automatique
function startAutoEvolution() {
    const autoSpeed = parseInt(document.getElementById('autoSpeed').value);
    isAutoEvolving = true;

    // Désactiver le bouton manuel
    document.getElementById('nextGenBtn').disabled = true;

    // Créer un intervalle pour générer automatiquement
    autoEvolveInterval = setInterval(function() {
        nextGeneration();
    }, autoSpeed);
}

// Arrêter l'évolution automatique
function stopAutoEvolution() {
    isAutoEvolving = false;

    // Arrêter l'intervalle
    if (autoEvolveInterval) {
        clearInterval(autoEvolveInterval);
        autoEvolveInterval = null;
    }

    // Réactiver le bouton manuel
    document.getElementById('nextGenBtn').disabled = false;
}

// Toggle l'évolution automatique
function toggleAutoEvolution() {
    if (!isImageLoaded) {
        return;
    }

    const autoEvolveBtn = document.getElementById('autoEvolveBtn');

    if (isAutoEvolving) {
        // Arrêter l'évolution automatique
        stopAutoEvolution();
        autoEvolveBtn.textContent = 'Demarrer Evolution Auto';
        autoEvolveBtn.style.backgroundColor = '#2196F3';
    } else {
        // Démarrer l'évolution automatique
        startAutoEvolution();
        autoEvolveBtn.textContent = 'Arreter Evolution Auto';
        autoEvolveBtn.style.backgroundColor = '#f44336';
    }
}
