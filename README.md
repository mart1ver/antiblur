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
- Distance de Manhattan (somme des differences absolues) pour chaque canal RGB
- Formule: pour chaque pixel, diff = |R1-R2| + |G1-G2| + |B1-B2|
- Somme totale divisee par la difference maximale possible (pixels × 255 × 3)
- Score normalise sur 100%: fitness = 100 × (1 - diff_totale / diff_max)
- 100% = image parfaitement identique
- 0% = image completement differente
- Avantage sur la distance euclidienne: plus rapide et tout aussi efficace

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
2. Nouveaux individus crees via crossover uniforme de ces 2 parents
3. Le crossover uniforme au niveau des pixels:
   - Pour chaque pixel, 50% de chance de venir du parent1 ou du parent2
   - Le pixel complet (RGB) est pris d'un parent (pas de melange de canaux)
   - Preserve la coherence des couleurs de chaque parent
4. Avantages sur le crossover a un point:
   - Meilleure diversite genetique
   - Pas de coupure au milieu d'un pixel
   - Convergence beaucoup plus rapide (peut atteindre >90% de fitness)

### Mutation
La mutation introduit de la diversite genetique et permet d'explorer de nouvelles solutions:
- Chaque individu nouvellement cree subit une mutation
- Pour chaque pixel ayant la probabilite de muter (taux de mutation):
  - 20% de chance: mutation complete du pixel (R, G, B tous changes) - exploration
  - 80% de chance: mutation d'un seul canal RGB - ajustement fin
- Les canaux mutes prennent des valeurs aleatoires entre 0 et 255
- Taux de mutation configurable de 0% a 10% (par defaut: 1%)
- Un taux faible preserve la convergence, un taux eleve augmente l'exploration
- La mutation hybride permet a la fois exploration (nouveau pixel) et exploitation (ajustement)

### Elitisme
L'elitisme preserve les meilleurs individus d'une generation a l'autre:
- Configurable de 0 a 10 individus (par defaut: 2)
- Les elites sont clones sans modification dans la nouvelle generation
- Le reste de la population est cree par crossover + mutation
- Avantages:
  - Garantit que le meilleur fitness ne diminue jamais
  - Accelere la convergence
  - Preserve les bonnes solutions trouvees
- Avec 0 elite: exploration maximale, convergence plus lente
- Avec 5-10 elites: convergence rapide, risque de stagnation (utile pour grandes populations)

### Evolution Automatique
Mode pour faire evoluer la population automatiquement:
- Vitesse reglable de 100ms a 2000ms entre chaque generation
- Bouton pour demarrer/arreter l'evolution
- Le bouton manuel est desactive pendant l'evolution automatique
- Permet d'observer l'evolution en temps reel
- Utile pour faire evoluer rapidement sur de nombreuses generations

### Optimisations et Performances

#### Gestion memoire
Le projet a ete optimise pour eviter les fuites memoire:
- Les sketches p5.js sont correctement supprimes entre chaque generation
- Utilisation de `remove()` sur les anciens sketches avant d'en creer de nouveaux
- Cela permet de faire evoluer la population pendant des centaines de generations sans ralentissement
- Pour les tres grandes images (>500x500px), l'evolution peut etre plus lente en mode automatique

#### Ameliorations algorithmiques
Version optimisee avec crossover uniforme et mutation hybride:
- **Probleme resolu**: Le crossover a un point unique limitait le fitness a ~55%
- **Solution**: Crossover uniforme au niveau des pixels + mutation hybride
- **Resultats**: Convergence beaucoup plus rapide, peut atteindre >90% de fitness
- Le crossover uniforme melange mieux les caracteristiques des deux parents
- La mutation hybride equilibre exploration (nouveaux pixels) et exploitation (ajustements fins)

Recommandations:
- Pour une experience optimale, utilisez des images cibles de taille raisonnable (100x100 a 300x300px)
- En mode automatique, si le navigateur ralentit, augmentez la vitesse (temps entre generations)
- Pour de grandes populations (>20), envisagez d'utiliser des images plus petites ou une vitesse d'evolution plus lente
- La taille de population peut etre ajustee a tout moment (cliquez sur "Reinitialiser" apres modification)
- Le projet peut maintenant evoluer indefiniment sans planter le navigateur
- Avec le nouveau crossover, vous devriez voir des ameliorations significatives des la generation 50-100

## Prochaines Etapes

Les fonctionnalites suivantes pourront etre ajoutees:
- Selection par tournoi ou roulette
- Selection de plus de 2 parents pour le crossover
- Visualisation de l'evolution du meilleur fitness au fil des generations
- Graphique montrant la progression du fitness moyen et meilleur
- Export de la meilleure image en PNG
- Sauvegarde/chargement de l'etat de la population
- Differentes strategies de crossover (uniform, multi-point, etc.)
