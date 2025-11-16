# Antiblur - Evolution Genetique d'Images

Projet d'algorithme genetique utilisant p5.js pour faire evoluer des images aleatoires vers une image cible.

## Fonctionnalites

- Chargement d'une image cible via URL
- Generation d'une population de 10 images completement aleatoires
- Calcul du score de fitness pour chaque individu (similarite avec l'image cible)
- Affichage de chaque individu avec son score de fitness

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
4. 10 individus avec des images completement aleatoires sont generes
5. Le score de fitness de chaque individu est affiche (0-100%, plus c'est eleve, plus c'est proche de l'image cible)

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

## Prochaines Etapes

Les fonctionnalites suivantes pourront etre ajoutees:
- Selection des meilleurs individus
- Crossover entre parents
- Mutation aleatoire
- Evolution generation par generation
- Bouton pour lancer l'evolution
- Affichage du numero de generation
