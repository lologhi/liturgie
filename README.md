# Notice explicative du fonctionnement interne

## 1 Fonctionnement général
### 1.1 Squelette et variables de session
Tous les offices s’appuient sur un squelette dédié au format html. Chaque partie de l’office est insérée dans un `<div>` dont l’identifiant est unique. Vous trouverez en annexe les différentes parties pour les différents offices. Ces squelettes se trouvent à la racine de l’application et portent un nom explicite : `lectures.html`, `laudes.html`, `milieu.html`, `vepres.html`, `complies.html`.

Toutes les parties de l’office sont présentes dans des fichiers différents. Le programme détermine les bons fichiers en fonction du temps liturgique et du calendrier de célébration des saints. Le principe est simple : pour chaque `<div>`, il existe une variable de session (cf. `sessionStorage` dans le DOM) où l’on renseigne le chemin d’accès au fichier requis.

Ex : l’antienne du premier psaume de l’office des lectures est spécifiée dans la variable de session : `sessionStorage.l_antienne_1`. Sa valeur pour le premier dimanche de l’Avent est : `'lectures/antiennes/antienne_1_1_0.html'`.

### 1.2 Temporal
La première étape consiste à déterminer les parties de l’office (en renseignant donc les bonnes variables de session), en ne tenant compte que du temporal.

Il y a des temps liturgiques particuliers qui nécessitent un traitement spécifique : les féries du temps de l’Avent, le temps de Noël, la semaine sainte, l’octave de Pâques, l’Ascension et la Pentecôte. Ces temps, on vient charger un fichier temporal, qui fonctionne globalement comme les fichiers du sanctoral (cf. supra pour la description de ce fonctionnement).

### 1.3 Sanctoral
Après la détermination des éléments de l’office du temporal, si l’on célèbre un saint, on vient écraser les valeurs des variables de session à l’aide des parties obligatoires spécifiées au propre du saint. Pour ce faire, on charge un fichier : `'sanctoral/MM/JJ-office.html'`[^1] qui ne contient que du code javascript.

*Attention, en ce qui concerne la possibilité d’afficher le commun à partir du capitule pour les mémoires, cette option est gérée par une fonction spécifique, mais aucunement dans le fichier sanctoral.*

[^1]: MM = mois (01, 02...) ; JJ = jour du mois (01, 02 ..., 31) ; office = lectures / laudes / milieu / vepres.

Exemple de fichier sanctoral pour une mémoire (Saint Stanislas, 11/04) :

```javascript
var path = 'sanctoral/04/11-';
var propre = ['la_antienne_ev'];
sessionStorage.setItem('la_titre_sanctoral', path+'titre.html');

for (var i=0; i < propre.length; i++) {
    sessionStorage.setItem(propre[i], path+propre[i]+'.html');
}

sessionStorage.setItem('la_oraison', path+'oraison.html');
```

→ on modifie 3 valeurs : le titre, l’oraison (toujours modifiés) et l’antienne évangélique dans ce cas précis.

Par convention, on utilise le même nom pour les fichiers à charger que pour les variables de session, avec le jour du mois comme préfixe et bien-sûr l’extention .html. Eg. pour la mémoire de S. Stanislas, le fichier de l’antienne évangélique des laudes, le fichier s’appelle : 11-la_antienne_ev.html. (voir le tableau en annexe pour la liste des parties de l’office).

Exemple de fichier sanctoral pour une fête (Saints Philippe et Jacques, 03/05) :

```javascript
var path_propre = 'sanctoral/05/03-';
var path_commun = 'sanctoral/apotres/';
var commun = [
    'la_antienne_inv',
    'la_hymne',
    'la_intercession'
];
var propre = [
    'la_antienne_1',
    'la_antienne_cantique',
    'la_antienne_2',
    'la_capitule',
    'la_repons',
    'la_antienne_ev'
];

sessionStorage.setItem('la_titre_sanctoral', path_propre+'titre.html');
sessionStorage.setItem('la_psaume_1', '62');
sessionStorage.setItem('la_cantique', '41');
sessionStorage.setItem('la_psaume_2', '149');

for (var i=0; i < propre.length; i++) {
    sessionStorage.setItem(propre[i], path_propre+propre[i]+'.html');
} 
for (var i=0; i < commun.length; i++) {
    sessionStorage.setItem(commun[i], path_commun+commun[i]+'.html');
} 
sessionStorage.setItem('la_oraison', path_propre+'oraison.html');
```
→ dans cet exemple, il y a plus de changements : toutes les parties sont modifiés, mais certaines sont prises au propre et d’autres au commun.

Noter la manière de changer la valeur d’un psaume : `sessionStorage.setItem('la_psaume_1', '62')`.

## 2 Cas particuliers 
### 2.1 Paramètres
Les paramètres de l’application sont gérées dans des variables locales (`localStorage` dans le DOM). Ce qui nous intéresse ici, ce sont propres régionaux.

### 2.2 Propres régionaux
Les valeurs possibles des propres régionaux sont les suivantes : `'afriquen'`, `'belgique'`, `'canada'`, `'europe'`, `'france'`, `'luxembourg'`, `'suisse'`.

La gestion des particularités régionales est assurée par le fonction Sanctoral_propre() du fichier lh-calendrier.js. Dans une telle situation, le programme cherchera non pas le fichier `'sanctoral/MM/JJ-office.html'`, mais le fichier : `'sanctoral/MM/JJ-office_region.html'`, où region vaut une des valeurs spécifiées ci-dessus.

### 2.3 Propre des diocèses
Les propres diocésains sont gérés de la même manière que les propres régionaux, la seule différence est qu’il ne peut y avoir qu’un seul diocèse sélectionné. Pour ajouter, les offices d’un diocèse, il suffit donc de me transmettre les fichiers suivants :
```
        JJ-office_diocese.html
        JJ-titre_diocese.html
        ... les fichiers spécifiques au diocèse.
```

Si un office n’est pas modifié (eg. milieu du jour pour une mémoire), dans ce cas, on ne met pas le fichier de l’office (cela générera un warning dans la console javascript, car on essaiera de charger le fichier quand même, mais cette erreur est sans incidence pour le fonctionnement du programme).
