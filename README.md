# Antiblur - Evolution Genetique d'Images

Projet d'algorithme genetique utilisant p5.js pour faire evoluer des images aleatoires vers une image cible.

## Fonctionnalites

- Chargement d'une image cible via URL
- Generation d'une population de 10 images completement aleatoires
- Calcul du score de fitness pour chaque individu (similarite avec l'image cible)
- Affichage de chaque individu avec son score de fitness
- Evolution par generation via crossover des 2 meilleurs individus
- Affichage du numero de generation actuel

## Structure du Projet

- `index.html` - Interface utilisateur
- `sketch.js` - Code principal p5.js
- `individual.js` - Classe Individual representant un individu de la population
- `package.json` - Dependances du projet

## Installation

```bash
npm install
```

## Lancement

```bash
npm start
```

Puis ouvrez votre navigateur a l'adresse affichee (generalement http://localhost:3000)

## Utilisation

1. Entrez l'URL d'une image cible dans le champ de texte
2. Cliquez sur "Charger l'image"
3. L'image cible s'affiche en haut
4. 10 individus avec des images completement aleatoires sont generes (Generation 0)
5. Le score de fitness de chaque individu est affiche (0-100%, plus c'est eleve, plus c'est proche de l'image cible)
6. Cliquez sur "Prochaine Generation" pour creer une nouvelle generation
7. La nouvelle generation est composee de 10 individus issus du crossover des 2 meilleurs individus
8. Le numero de generation s'incremente automatiquement

## Details Techniques

### ADN
L'ADN de chaque individu est un tableau de valeurs RGB correspondant a chaque pixel de l'image. La resolution de chaque individu est identique a celle de l'image cible.

### Calcul de Fitness
Le fitness est calcule en comparant chaque pixel de l'individu avec le pixel correspondant de l'image cible:
- Distance euclidienne dans l'espace RGB pour chaque pixel
- Score normalise sur 100% (100% = image identique)

### Population
- Taille: 10 individus
- Generation initiale: completement aleatoire
- Tri par fitness decroissant
- Chaque nouvelle generation est creee par crossover des 2 meilleurs individus

### Crossover
Pour creer une nouvelle generation:
1. Les 2 meilleurs individus sont selectionnes (fitness le plus eleve)
2. 10 nouveaux individus sont crees via crossover de ces 2 parents
3. Le crossover combine l'ADN des 2 parents a un point de coupure aleatoire
4. Chaque enfant herite d'une partie de l'ADN de chaque parent

## Prochaines Etapes

Les fonctionnalites suivantes pourront etre ajoutees:
- Mutation aleatoire pour introduire de la diversite
- Selection par tournoi ou roulette
- Elitisme (garder les meilleurs individus)
- Parametres configurables (taux de mutation, taille de population)
- Visualisation de l'evolution du meilleur fitness
