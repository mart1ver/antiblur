class Individual {
    constructor(width, height, dna = null) {
        this.width = width;
        this.height = height;
        this.fitness = 0;

        // L'ADN est un tableau de pixels RGB
        // Chaque pixel a 3 valeurs (R, G, B)
        if (dna) {
            this.dna = dna;
        } else {
            // Créer un ADN aléatoire
            this.dna = new Array(width * height * 4); // RGBA
            for (let i = 0; i < this.dna.length; i += 4) {
                this.dna[i] = Math.floor(Math.random() * 256);     // R
                this.dna[i + 1] = Math.floor(Math.random() * 256); // G
                this.dna[i + 2] = Math.floor(Math.random() * 256); // B
                this.dna[i + 3] = 255; // Alpha toujours à 255
            }
        }

        this.image = null;
    }

    // Calculer le fitness en comparant avec l'image cible
    calculateFitness(targetPixels) {
        let totalDiff = 0;
        let pixelCount = 0;

        // Comparer chaque pixel avec l'image cible
        for (let i = 0; i < this.dna.length; i += 4) {
            // Calculer la différence absolue pour chaque canal
            let dr = Math.abs(this.dna[i] - targetPixels[i]);
            let dg = Math.abs(this.dna[i + 1] - targetPixels[i + 1]);
            let db = Math.abs(this.dna[i + 2] - targetPixels[i + 2]);

            // Somme des différences pour ce pixel (Manhattan distance)
            // Plus simple et plus efficace que la distance euclidienne
            totalDiff += dr + dg + db;
            pixelCount++;
        }

        // Différence maximale possible = 255 * 3 par pixel (R+G+B)
        let maxPossible = pixelCount * 255 * 3;

        // Fitness = 100% * (1 - différence_réelle / différence_max)
        // 100% = image identique, 0% = image complètement différente
        this.fitness = 100 * (1 - (totalDiff / maxPossible));
        return this.fitness;
    }

    // Créer une image p5.js à partir de l'ADN
    createImage(p) {
        this.image = p.createImage(this.width, this.height);
        this.image.loadPixels();

        for (let i = 0; i < this.dna.length; i++) {
            this.image.pixels[i] = this.dna[i];
        }

        this.image.updatePixels();
        return this.image;
    }

    // Afficher l'individu avec son score de fitness
    display(p, x, y) {
        if (!this.image) {
            this.createImage(p);
        }
        p.image(this.image, x, y);
    }

    // Mutation: modifier aléatoirement certains pixels
    mutate(mutationRate) {
        for (let i = 0; i < this.dna.length; i += 4) {
            if (Math.random() < mutationRate) {
                // 20% de chance de muter tout le pixel (exploration)
                // 80% de chance de muter un seul canal (ajustement fin)
                if (Math.random() < 0.2) {
                    // Muter tout le pixel avec des valeurs complètement aléatoires
                    this.dna[i] = Math.floor(Math.random() * 256);     // R
                    this.dna[i + 1] = Math.floor(Math.random() * 256); // G
                    this.dna[i + 2] = Math.floor(Math.random() * 256); // B
                } else {
                    // Muter un seul canal RGB
                    let channel = Math.floor(Math.random() * 3);
                    this.dna[i + channel] = Math.floor(Math.random() * 256);
                }
            }
        }
        this.image = null; // Invalider l'image pour qu'elle soit recréée
    }

    // Crossover: combiner l'ADN de deux parents
    // Utilise un crossover uniforme au niveau des pixels (pas des canaux individuels)
    // pour mieux préserver la cohérence des couleurs
    static crossover(parent1, parent2) {
        let childDNA = new Array(parent1.dna.length);

        // Crossover uniforme : pour chaque pixel, choisir aléatoirement un parent
        // On itère par blocs de 4 (RGBA) pour garder les pixels intacts
        for (let i = 0; i < parent1.dna.length; i += 4) {
            // 50% de chance de prendre le pixel du parent1, 50% du parent2
            if (Math.random() < 0.5) {
                // Prendre le pixel complet du parent1
                childDNA[i] = parent1.dna[i];         // R
                childDNA[i + 1] = parent1.dna[i + 1]; // G
                childDNA[i + 2] = parent1.dna[i + 2]; // B
                childDNA[i + 3] = parent1.dna[i + 3]; // A
            } else {
                // Prendre le pixel complet du parent2
                childDNA[i] = parent2.dna[i];         // R
                childDNA[i + 1] = parent2.dna[i + 1]; // G
                childDNA[i + 2] = parent2.dna[i + 2]; // B
                childDNA[i + 3] = parent2.dna[i + 3]; // A
            }
        }

        return new Individual(parent1.width, parent1.height, childDNA);
    }

    // Cloner un individu
    clone() {
        return new Individual(this.width, this.height, [...this.dna]);
    }
}
