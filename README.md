# Antiblur - Evolution Genetique d'Images

Projet d'algorithme genetique utilisant p5.js pour faire evoluer des images aleatoires vers une image cible.

## Fonctionnalites

- Chargement d'une image cible via URL
- Generation d'une population d'images completement aleatoires
- Taille de population configurable (5 a 30 individus, defaut: 10)
- Calcul du score de fitness pour chaque individu (similarite avec l'image cible)
- Affichage de chaque individu avec son score de fitness
- Evolution par generation via crossover des 2 meilleurs individus
- Mutation aleatoire configurable pour introduire de la diversite genetique
- Elitisme configurable (preservation des meilleurs individus)
- Mode evolution automatique avec vitesse reglable
- Affichage du numero de generation actuel
- Bouton de reinitialisation pour regenerer la population avec une nouvelle taille
- Controle de la taille de population via un slider (5 a 30)
- Controle du taux de mutation via un slider (0% a 10%)
- Controle du nombre d'elites via un slider (0 a 10)
- Controle de la vitesse d'evolution automatique (100ms a 2000ms)

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
4. Une population d'images completement aleatoires est generee (Generation 0)
5. Le score de fitness de chaque individu est affiche (0-100%, plus c'est eleve, plus c'est proche de l'image cible)
6. Ajustez les parametres d'evolution:
   - Taille de population (5-30, par defaut: 10)
   - Taux de mutation (par defaut: 1%)
   - Nombre d'elites (par defaut: 2)
   - Vitesse d'evolution auto (par defaut: 500ms)
7. **Reinitialiser**: Cliquez sur "Reinitialiser" apres avoir change la taille de population pour regenerer une nouvelle population aleatoire
8. **Mode manuel**: Cliquez sur "Prochaine Generation" pour creer une nouvelle generation manuellement
9. **Mode automatique**: Cliquez sur "Demarrer Evolution Auto" pour faire evoluer automatiquement
   - Cliquez sur "Arreter Evolution Auto" pour arreter
10. Les elites (meilleurs individus) sont preserves intacts dans chaque generation
11. Le reste de la population est cree par crossover des 2 meilleurs + mutation
12. Le numero de generation s'incremente automatiquement

## Details Techniques

### ADN
L'ADN de chaque individu est un tableau de valeurs RGB correspondant a chaque pixel de l'image. La resolution de chaque individu est identique a celle de l'image cible.

### Calcul de Fitness
Le fitness est calcule en comparant chaque pixel de l'individu avec le pixel correspondant de l'image cible:
- Distance euclidienne dans l'espace RGB pour chaque pixel
- Score normalise sur 100% (100% = image identique)

### Population
- Taille configurable: 5 a 30 individus (par defaut: 10)
- Generation initiale: completement aleatoire
- Tri par fitness decroissant apres chaque generation
- Chaque nouvelle generation est creee par crossover des 2 meilleurs individus
- Impact de la taille:
  - Petite population (5-10): Evolution rapide, convergence plus rapide, risque de minimum local
  - Moyenne population (10-15): Bon equilibre vitesse/diversite (recommande)
  - Grande population (15-30): Plus de diversite, convergence plus lente, calculs plus lents

### Crossover
Pour creer une nouvelle generation:
1. Les 2 meilleurs individus sont selectionnes (fitness le plus eleve)
2. 10 nouveaux individus sont crees via crossover de ces 2 parents
3. Le crossover combine l'ADN des 2 parents a un point de coupure aleatoire
4. Chaque enfant herite d'une partie de l'ADN de chaque parent

### Mutation
La mutation introduit de la diversite genetique et permet d'explorer de nouvelles solutions:
- Chaque individu nouvellement cree subit une mutation
- Pour chaque pixel, il y a une probabilite (taux de mutation) de modifier un canal RGB
- Le canal mute prend une valeur aleatoire entre 0 et 255
- Taux de mutation configurable de 0% a 10% (par defaut: 1%)
- Un taux faible preserve la convergence, un taux eleve augmente l'exploration

### Elitisme
L'elitisme preserve les meilleurs individus d'une generation a l'autre:
- Configurable de 0 a 5 individus (par defaut: 2)
- Les elites sont clones sans modification dans la nouvelle generation
- Le reste de la population est cree par crossover + mutation
- Avantages:
  - Garantit que le meilleur fitness ne diminue jamais
  - Accelere la convergence
  - Preserve les bonnes solutions trouvees
- Avec 0 elite: exploration maximale, convergence plus lente
- Avec 5 elites: convergence rapide, risque de stagnation

### Evolution Automatique
Mode pour faire evoluer la population automatiquement:
- Vitesse reglable de 100ms a 2000ms entre chaque generation
- Bouton pour demarrer/arreter l'evolution
- Le bouton manuel est desactive pendant l'evolution automatique
- Permet d'observer l'evolution en temps reel
- Utile pour faire evoluer rapidement sur de nombreuses generations

### Optimisations et Performances
Le projet a ete optimise pour eviter les fuites memoire:
- Les sketches p5.js sont correctement supprimes entre chaque generation
- Utilisation de `remove()` sur les anciens sketches avant d'en creer de nouveaux
- Cela permet de faire evoluer la population pendant des centaines de generations sans ralentissement
- Pour les tres grandes images (>500x500px), l'evolution peut etre plus lente en mode automatique

Recommandations:
- Pour une experience optimale, utilisez des images cibles de taille raisonnable (100x100 a 300x300px)
- En mode automatique, si le navigateur ralentit, augmentez la vitesse (temps entre generations)
- Pour de grandes populations (>20), envisagez d'utiliser des images plus petites ou une vitesse d'evolution plus lente
- La taille de population peut etre ajustee a tout moment (cliquez sur "Reinitialiser" apres modification)
- Le projet peut maintenant evoluer indefiniment sans planter le navigateur

## Prochaines Etapes

Les fonctionnalites suivantes pourront etre ajoutees:
- Selection par tournoi ou roulette
- Selection de plus de 2 parents pour le crossover
- Visualisation de l'evolution du meilleur fitness au fil des generations
- Graphique montrant la progression du fitness moyen et meilleur
- Export de la meilleure image en PNG
- Sauvegarde/chargement de l'etat de la population
- Differentes strategies de crossover (uniform, multi-point, etc.)
