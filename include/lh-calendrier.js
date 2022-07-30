/*
Copyright Père Philoux - septembre 2016
lh@philoux.eu

Ce logiciel comporte essentiellement des scripts servant à afficher la liturgie
des heures en français, soit, en application web - soit en application native
pour les système mobile (en particulier Android).

Ce logiciel est régi par la licence CeCILL soumise au droit français et
respectant les principes de diffusion des logiciels libres. Vous pouvez
utiliser, modifier et/ou redistribuer ce programme sous les conditions
de la licence CeCILL telle que diffusée par le CEA, le CNRS et l'INRIA 
sur le site "http://www.cecill.info".

En contrepartie de l'accessibilité au code source et des droits de copie,
de modification et de redistribution accordés par cette licence, il n'est
offert aux utilisateurs qu'une garantie limitée.  Pour les mêmes raisons,
seule une responsabilité restreinte pèse sur l'auteur du programme,  le
titulaire des droits patrimoniaux et les concédants successifs.

A cet égard  l'attention de l'utilisateur est attirée sur les risques
associés au chargement,  à l'utilisation,  à la modification et/ou au
développement et à la reproduction du logiciel par l'utilisateur étant 
donné sa spécificité de logiciel libre, qui peut le rendre complexe à 
manipuler et qui le réserve donc à des développeurs et des professionnels
avertis possédant  des  connaissances  informatiques approfondies.  Les
utilisateurs sont donc invités à charger  et  tester  l'adéquation  du
logiciel à leurs besoins dans des conditions permettant d'assurer la
sécurité de leurs systèmes et ou de leurs données et, plus généralement, 
à l'utiliser et l'exploiter dans les mêmes conditions de sécurité. 

Le fait que vous puissiez accéder à cet en-tête signifie que vous avez 
pris connaissance de la licence CeCILL, et que vous en avez accepté les
termes.
 */

function Liste_propres_nationaux () {
	return ['afriquen', 'belgique', 'canada', 'europe', 'france', 'luxembourg', 'suisse'];
}

function Liste_propres_dioceses () {
	return ['lille', 'lyon', 'paris'];
}

function Date_choisie() {
	// renvoie la date demandée (variable de session) la date courante à défaut
	// la date de l'URL doit être au format YYYY-MM-DD
	var date;
	if (sessionStorage.getItem("date_c") === null) {
		date = Date.now();
		sessionStorage.setItem("date_c", date);
	} else {
		date = sessionStorage.getItem("date_c");
	}
	return new Date (date);
}

function Nb_jours (date1, date2) {
	// positif si date 2 est postérieur à date1, négatif sinon
	return Math.round((date2-date1)/(3600*1000*24)); // on calcule l'arrondi à cause des changements d'heure possible
}

function Nb_semaines(date1, date2) {
	var nb_sem = Math.floor(Nb_jours(date1,date2) / 7);
	return nb_sem;
}

function Noel (year) {
	// renvoi la date de Noël
	return new Date (year, 11, 25);
}

function Avent(year) {
	// renvoi la date du premier dimanche de l'Avent
	// on commence par calculer le timestamp du jour de Noël
	var noel = Noel (year);
	// decallage est le nombre de jour séparant Noël du dimanche précédent ie du 4e dimanche de l'Avent
	var decallage = noel.getDay(); // jour de la semaine pour Noël
	if (decallage==0)     // si Noël est un dimanche, alors, 7 jours avant
		decallage=7;
	// le premier dimanche de l'Avent est 3 semaines (21 jours) avant le 4e dimanche de l'Avent
	return new Date (year, 11, 25-21-decallage); // ! en js, janvier est le mois 0
}

function Epiphanie(year) {
	var nouvel_an = new Date(year, 0, 1);
	var nouvel_an_jour_s = nouvel_an.getDay();
	var epiphanie_jour = 8-nouvel_an_jour_s;   // l'Epiphanie est le premier dimanche après le 1er jan (soit le 8 si c'est un dimanche...)
	return new Date(year, 0, epiphanie_jour);
}

function Bapteme(year)	{
	// renvoi la date de la solennité du Baptême du Seigneur
	var epiphanie_date = Epiphanie(year);
	var epiphanie_jour = epiphanie_date.getDate();

	if (epiphanie_jour >= 7) {	// si l'épiphanie tombe le 7 ou 8 janvier, le baptême est le lendemain
		return new Date(year, 0, epiphanie_jour + 1);
	} else {		// sinon, c'est le dimanche suivant
		return new Date (year, 0, epiphanie_jour + 7);
	}
}

function Deuxieme_dimanche_to(year)	{
	// renvoi la date du deuxième dimanche du temps ordinaire
	var epiphanie_date = Epiphanie(year);
	var epiphanie_jour = epiphanie_date.getDate();
	if (epiphanie_jour >= 7) {	// si l'épiphanie tombe le 7 ou 8 janvier, le deuxième dimanche TO est le suivant
		return new Date (year, 0, epiphanie_jour + 7);
	} else {		// sinon, c'est deux semaines plus tard (le dimanche suivant étant le Baptême)
		return new Date (year, 0, epiphanie_jour + 14);
	}
}

function Easter_date(year) {
	var C = Math.floor(year/100);
	var N = year - 19*Math.floor(year/19);
	var K = Math.floor((C - 17)/25);
	var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
	I = I - 30*Math.floor((I/30));
	I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
	var J = year + Math.floor(year/4) + I + 2 - C + Math.floor(C/4);
	J = J - 7*Math.floor(J/7);
	var L = I - J;
	var M = 3 + Math.floor((L + 40)/44);
	var D = L + 28 - 31*Math.floor(M/4);
	return new Date (year,M-1,D);
}

function Cendres(annee) {
	// renvoi la date du mercredi des cendres (47 jours avant Pâques)
	var cendres=Easter_date(annee);
	cendres.setDate(cendres.getDate()-46);
	return cendres;
}

function Rameaux(year) {
	// renvoi la date du dimanche des Rameaux (7 jours avant Pâques)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()-7);
}

function Ascension(year) {
	// renvoi la date de l'Ascension (40 jours après Pâques)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()+39);
}

function Pentecote(year) {
	// renvoi la date de la Pentecote (50 jours après Pâques)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()+49);
}

function Trinite(year) {
	// renvoi la date de la Trinité (7 jours après la pentecôte)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()+56);
}

function SaintSacrement(year) {
	// renvoi la date de la solennité du saint sacrement (14 jours après la pentecôte)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()+63);
}

function SacreCoeur(year) {
	// renvoi la date de la solennité du saint sacrement (14 jours après la pentecôte)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()+68);
}

function Annonciation (year) {
	/* renvoi la date de l'annonciation (le 25 mars sauf :
		 quand elle tombe entre le dimanche des Rameaux ou après -> lundi après l'octave de pâques
		 quand elle tombe un autre dimanche de carême > le lundi suivant (donc le 26)*/

	var annonciation= new Date (year, 2, 25);
	var jour_semaine=annonciation.getDay();
	var rameaux = Rameaux(year);

	if (Nb_jours(rameaux, annonciation) >= 0) {	// ie si on est après le dimanche des Rameaux
		var jour_paques = Easter_date(year);
		annonciation = jour_paques;
		annonciation.setDate(jour_paques.getDate()+8); // l'annonciation est déplacée 8 jours après Pâques

	} else { // on ne déplace que si c'est un dimanche (nécessairement de Carême)
		if (jour_semaine==0) {
			annonciation = new Date (year, 2, 26);
		}
	}
	return annonciation;
} // fin de la fonction Annonciation()


function SaintJoseph (year) {
	/* renvoi la date de la Saint Joseph (fête avancée au samedi avant les Rameaux quand elle tombe pendant la Semaine Sainte
		 ou déplacée au lendemain suivant (donc au 20) quand elle tombe un dimanche de Carême autre que les Rameaux */

	var st_joseph = new Date (year, 2, 19); 
	var jour_semaine=st_joseph.getDay();
	var rameaux = Rameaux(year);

	if (st_joseph >= rameaux) { // on se trouve pendant la semaine sainte -> veille des Rameaux
		st_joseph = new Date (rameaux.setDate(rameaux.getDate()-1));
	} else if (jour_semaine==0) { // on est un dimanche de carême autre que les Rameaux
		st_joseph = new Date (year, 2, 20);
	}
	return st_joseph;
} // fin de la fonction SaintJoseph

function SaintPierrePaul (year) {
	/* renvoi la date des Saints Pierre et Paul
		 déplacée au lendemain quand elle tombe en même temps de la Sacré-Coeur */

	var saintpierrepaul = new Date (year, 5, 29);

	if (Nb_jours(saintpierrepaul, SacreCoeur(year))==0) {
		saintpierrepaul = new Date (year, 5, 30);
	}

	return saintpierrepaul;

} // fin de la fonction SaintPierrePaul

function SaintJeanB (year) {
	/* renvoi la date de la Saint Jean-Baptiste
		 déplacée au lendemain quand elle tombe en même temps de la Sacré-Coeur */

	var saintjeanb = new Date (year, 5, 24);

	if (Nb_jours(saintjeanb, SacreCoeur(year))==0) {
		saintjeanb = new Date (year, 5, 25);
	}

	return saintjeanb;

} // fin de la fonction SaintJeanB

function ImmaculeeConception (year) {
	/* renvoi la date de la Solennité de l'Immaculée Conception
		 déplacée au lundi suivant (donc au 9) quand elle tombe un dimanche de l'Avent */

	var immaculee= new Date (year, 11, 8);

	if (immaculee.getDay() == 0) {
		immaculee= new Date (year, 11, 9);
	}

	return immaculee;

} // fin de la fonction ImmaculeeConception

function ChristRoi (year) {
	// renvoi la date de la solennité du Christ-Roi (7 jours avant l'Avent)
	var avent=Avent(year);
	return new Date (year, avent.getMonth(), avent.getDate()-7);
}

function SteFamille (year) {
	// renvoi la date de la fête de la sainte Famille (le dimanche suivant Noël ou le 30 si Noël est un dimanche)
	var noel_jour_s = Noel(year).getDay();
	if (noel_jour_s == 0) {
		return new Date (year, 11, 30);
	} else {
		return new Date (year, 11, 25+7-noel_jour_s);
	}
}

// fête mobile des propres locaux

// Luxembourg ...
// TODO - fête mobile


// Lille - ND de la Treille
function NDTreille(year) {
	// renvoi la date de la fête lilloise de ND de la Treille (3e samedi après la Pentecôte)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()+69);
}

// Lyon - ND de Fourvière
function NDFourviere(year) {
	// renvoi la date de la fête Lyonnaise de ND de Fourvière (samedi suivant le deuxième dimanche de Pâques)
	var paques=Easter_date(year);
	return new Date (year, paques.getMonth(), paques.getDate()+13);
}

function Annee_liturgique(date) {
	// renvoi la lettre correspondant à l'année liturgique pour un jour donné
	// (l'an 1 est année A... il suffit de calculer avec le modulo 3)
	var year = date.getFullYear();
	if (date >= Avent(year))
		year++; // à partir du dimanche de l'Avent on est dans la nouvelle année
	if (year % 3 ==1)
		return "A";
	if (year % 3 ==2)
		return "B";
	return "C";
}

function Temps_liturgique(date) {

	/* renvoi un tableau avec :
	[l'année (A/B/C),
	le temps liturgique, (1->avent; 2->noel; 3->to; 4->careme; 5->paques)
	la semaine, (dans le temps liturgique)
	le jour, (0 = dimanche ; 1 = lundi ...)
	la valeur du jour dans l'ordre de preseance des fêtes]
	*/

	var year = date.getFullYear();
	var preseance = 13;
	var date_noel = new Date (year, 11, 25); 

	var temps = 2; // temps de Noël par défaut et on remonte progressivement l'année civile
	if (Nb_jours(date, date_noel) > 0)
		temps=1; // l'Avent avant Noël
	if (Nb_jours(date, Avent(year)) > 0)
		temps=3; // temps ordinaire avant l'Avent
	if (Nb_jours(date, Pentecote(year)) >=0) // temps de Pâques avant la Pentecôte
		temps=5;
	if (Nb_jours(date, Easter_date(year)) > 0) // Carême avant Pâques
		temps=4;
	if (Nb_jours(date, Cendres(year)) >0) // temps ordinaire avant le Carême
		temps=3;
	if (Nb_jours(date, Bapteme(year))>=0)
		temps=2; // temps de Noël jusqu'au baptême du Seigneur

	var semaine=0;
	switch (temps) {
		case 1: // temps de l'Avent
			semaine=1 + Nb_semaines (Avent(year),date);
			if (Date.parse(date) >= Date.parse(year+'-12-17')) { // pendant les feries du 17 au 24 déc.
				preseance = 9;
			}
			if (date.getDay()==0) {
				preseance = 2.1;
			}
			break;

		case 2: // temps de Noël (il n'y a pas vraiment de notion de semaine, mais trois temps : octave, avant/après l'Epiphanie
			// avant la Sainte Famille, on est en semaine 0 (psautier IV)
			if (date.getMonth()==11) { // octave de Noël
				if (date.getDay() >= date_noel.getDay()) {
					// nous sommes avant le premier dimanche suivant Noël
					semaine = 0;
				} else {
					semaine = 1;
				}
				// pendant l'octave de Noël, les mémoires sont toutes facultatives
				preseance = 9;
				// (la préseance de Noël et de l'Epiphanie sont gérés dans le sanctoral)
			}

			// on ne s'occupe pas des dimanches, soit c'est l'Epiphanie
			// soit c'est la Ste Famille / le Baptême et ces cas sont gérés dans le sanctoral,
			// car ces fêtes ne sont pas toujours un dimanche
			if (date.getMonth()==0) { // janvier : post-octave de Noël
				var date_epiphanie = Epiphanie(year);

				if (Nb_jours(date, date_epiphanie) > 0) { 
					// jusqu'à l'Epiphanie, on est en semaine 1
					semaine = 1;
				} else {
					// après l'Epiphanie, on est en semaine 2
					semaine = 2;
				}
			}
			break;

		case 3: //temps ordinaire
			if (date < Cendres(year)) { // début de l'année
				semaine =2 + Nb_semaines(Deuxieme_dimanche_to(year), date);
				//on a recours à cette fonction car le baptême peut ne pas tomber un dimanche
				// pour la première semaine, Nb_semaines doit renvoyer -1
			} else { // fin de l'année liturgique
				semaine = 34 - Nb_semaines(date, Avent(year)-(3600*24*1000));
				// Nb_semaines est positif, on compte le nombre de semaine qui nous sépare de l'Avent pour arriver à 34
			}
			if (date.getDay()==0) {
				preseance = 6;
			}
			// il manque les solennités mobiles du temps ordinaire sont traités comme
			// exceptions dans le sanctoral
			break;

		case 4: // Carême
			// On compte à rebours à partir de Pâques, la Semaine Sainte est la 6e semaine,
			// et du mercredi des cendres au samedi, c'est la semaine 0.
			semaine = 6 - Nb_semaines(date, Easter_date(year)-(3600*24*1000));
			if (semaine <6) { // jour du Carême

				preseance = 9;
				if (date.getDay() == 0) { // les dimanches de Carême
					preseance = 2 ;
				}
				if (date.getDay() == 3 && semaine == 0) { // mercredi des Cendres
					preseance = 2;
				}

			} else if (date.getDay()<4) { // jours de la semaine sainte avant le Jeudi Saint
				preseance = 2;
			} else { // on est au Triduum
				preseance = 1;
			}

			break;

		case 5: // Temps pascal
			semaine = 1 + Nb_semaines(Easter_date(year), date);
			if (semaine == 1) { // octave de Pâques
				preseance = 2;
			} else {
				preseance = 13 // ferie de temps pascal
				if (date.getDay()==0) { // dimanche du temps pascal
					preseance = 2;
				}
				if (semaine==6 && date.getDay()==4) { // Ascension
					preseance =2;
				}
			}
			break;
	} // fin du switch

	var annee = Annee_liturgique(date);
	var jour = date.getDay();

	sessionStorage.temps_liturgique=temps;
	return Array(annee, temps, semaine, jour, preseance);

} // fin de la fonction Temps_liturgique

function Sanctoral_defaut () {
	// renvoie les valeurs de la préseance du jour du mois donnée
	// ainsi que les communs du ou des saints du jour.

	var liturgie = [];
	var communs = [];

	/* Le tableau sanctoral contient pour chaque [mois][jour] une liste d'information :
	le niveau de préséance liturgique de la fête (cf. fichier preseance.txt) ;
	on renseigne 13 pour les feries */

	// mois de janvier
	liturgie[0] = []; communs[0] = [];
	liturgie[0][1] = 3; communs[0][1] = [['marie']];
	liturgie[0][2] = 10; communs[0][2] = [['docteurs1', 'pasteurs']];
	liturgie[0][3] = 12; communs[0][3] = [['saintes']];
	liturgie[0][4] = 13; communs[0][4] = [['']];
	liturgie[0][5] = 13; communs[0][5] = [['']];
	liturgie[0][6] = 13; communs[0][6] = [['']];
	liturgie[0][7] = 12; communs[0][7] = [['pasteurs', 'saints']];
	liturgie[0][8] = 13; communs[0][8] = [['']];
	liturgie[0][9] = 13; communs[0][9] = [['']];
	liturgie[0][10] = 13; communs[0][10] = [['']];
	liturgie[0][11] = 13; communs[0][11] = [['']];
	liturgie[0][12] = 13; communs[0][12] = [['']];
	liturgie[0][13] = 12; communs[0][13] = [['docteurs1', 'pasteurs']];
	liturgie[0][14] = 13; communs[0][14] = [['']];
	liturgie[0][15] = 12; communs[0][15] = [['pasteurs']];
	liturgie[0][16] = 13; communs[0][16] = [['']];
	liturgie[0][17] = 10; communs[0][17] = [['saints']];
	liturgie[0][18] = 13; communs[0][18] = [['']];
	liturgie[0][19] = 13; communs[0][19] = [['']];
	liturgie[0][20] = 12; communs[0][20] = [['martyr', 'pasteurs']];
	liturgie[0][21] = 10; communs[0][21] = [['martyr', 'vierges']];
	liturgie[0][22] = 12; communs[0][22] = [['martyr']];
	liturgie[0][23] = 13; communs[0][23] = [['']];
	liturgie[0][24] = 10; communs[0][24] = [['docteurs1', 'pasteurs']];
	liturgie[0][25] = 7; communs[0][25] = [['apotres']];
	liturgie[0][26] = 10; communs[0][26] = [['pasteurs']];
	liturgie[0][27] = 12; communs[0][27] = [['vierges', 'saintes']];
	liturgie[0][28] = 10; communs[0][28] = [['docteurs2']];
	liturgie[0][29] = 13; communs[0][29] = [['']];
	liturgie[0][30] = 13; communs[0][30] = [['']];
	liturgie[0][31] = 10; communs[0][31] = [['pasteurs', 'saints']];

	// mois de février
	liturgie[1] = []; communs[1] = [];
	liturgie[1][1] = 13; communs[1][1] = [['']];
	liturgie[1][2] = 5; communs[1][2] = [['seigneur']];
	liturgie[1][3] = 12; communs[1][3] = [['martyr', 'pasteurs']];
	liturgie[1][4] = 13; communs[1][4] = [['']];
	liturgie[1][5] = 10; communs[1][5] = [['martyr', 'vierges']];
	liturgie[1][6] = 10; communs[1][6] = [['martyrs']];
	liturgie[1][7] = 13; communs[1][7] = [['']];
	liturgie[1][8] = 12; communs[1][8] = [['saints']];
	liturgie[1][9] = 13; communs[1][9] = [['']];
	liturgie[1][10] = 10; communs[1][10] = [['vierges']];
	liturgie[1][11] = 12; communs[1][11] = [['marie']];
	liturgie[1][12] = 13; communs[1][12] = [['']];
	liturgie[1][13] = 13; communs[1][13] = [['']];
	liturgie[1][14] = 10; communs[1][14] = [['pasteurs']];
	liturgie[1][15] = 13; communs[1][15] = [['']];
	liturgie[1][16] = 13; communs[1][16] = [['']];
	liturgie[1][17] = 12; communs[1][17] = [['saints']];
	liturgie[1][18] = 12; communs[1][18] = [['vierges', 'saintes']];
	liturgie[1][19] = 13; communs[1][19] = [['']];
	liturgie[1][20] = 13; communs[1][20] = [['']];
	liturgie[1][21] = 12; communs[1][21] = [['docteurs1', 'pasteurs']];
	liturgie[1][22] = 7; communs[1][22] = [['apotres']];
	liturgie[1][23] = 10; communs[1][23] = [['martyr', 'pasteurs']];
	liturgie[1][24] = 13; communs[1][24] = [['']];
	liturgie[1][25] = 13; communs[1][25] = [['']];
	liturgie[1][26] = 13; communs[1][26] = [['']];
	liturgie[1][27] = 13; communs[1][27] = [['']];
	liturgie[1][28] = 13; communs[1][28] = [['']];
	liturgie[1][29] = 13; communs[1][29] = [['']];

	// mois de mars
	liturgie[2] = []; communs[2] = [];
	liturgie[2][1] = 13; communs[2][1] = [['']];
	liturgie[2][2] = 13; communs[2][2] = [['']];
	liturgie[2][3] = 13; communs[2][3] = [['']];
	liturgie[2][4] = 12; communs[2][4] = [['saints']];
	liturgie[2][5] = 13; communs[2][5] = [['']];
	liturgie[2][6] = 13; communs[2][6] = [['']];
	liturgie[2][7] = 10; communs[2][7] = [['martyrs']];
	liturgie[2][8] = 12; communs[2][8] = [['saints']];
	liturgie[2][9] = 12; communs[2][9] = [['saintes']];
	liturgie[2][10] = 13; communs[2][10] = [['']];
	liturgie[2][11] = 13; communs[2][11] = [['']];
	liturgie[2][12] = 13; communs[2][12] = [['']];
	liturgie[2][13] = 13; communs[2][13] = [['']];
	liturgie[2][14] = 13; communs[2][14] = [['']];
	liturgie[2][15] = 13; communs[2][15] = [['']];
	liturgie[2][16] = 13; communs[2][16] = [['']];
	liturgie[2][17] = 12; communs[2][17] = [['pasteurs']];
	liturgie[2][18] = 12; communs[2][18] = [['docteurs1', 'pasteurs']];
	liturgie[2][19] = 13; communs[2][19] = [['']]; // la saint Joseph est traitée après (à la fin)
	liturgie[2][20] = 13; communs[2][20] = [['']];
	liturgie[2][21] = 13; communs[2][21] = [['']];
	liturgie[2][22] = 13; communs[2][22] = [['']];
	liturgie[2][23] = 12; communs[2][23] = [['pasteurs']];
	liturgie[2][24] = 13; communs[2][24] = [['']];
	liturgie[2][25] = 13; communs[2][25] = [['']]; // idem pour l'Annonciation
	liturgie[2][26] = 13; communs[2][26] = [['']];
	liturgie[2][27] = 13; communs[2][27] = [['']];
	liturgie[2][28] = 13; communs[2][28] = [['']];
	liturgie[2][29] = 13; communs[2][29] = [['']];
	liturgie[2][30] = 13; communs[2][30] = [['']];
	liturgie[2][31] = 13; communs[2][31] = [['']];

	// mois d'avril
	liturgie[3] = []; communs[3] = [];
	liturgie[3][1] = 13; communs[3][1] = [['']];
	liturgie[3][2] = 12; communs[3][2] = [['saints']];
	liturgie[3][3] = 13; communs[3][3] = [['']];
	liturgie[3][4] = 12; communs[3][4] = [['docteurs1', 'pasteurs']];
	liturgie[3][5] = 12; communs[3][5] = [['pasteurs']];
	liturgie[3][6] = 13; communs[3][6] = [['']];
	liturgie[3][7] = 10; communs[3][7] = [['pasteurs', 'saints']];
	liturgie[3][8] = 13; communs[3][8] = [['']];
	liturgie[3][9] = 13; communs[3][9] = [['']];
	liturgie[3][10] = 13; communs[3][10] = [['']];
	liturgie[3][11] = 10; communs[3][11] = [['martyr', 'pasteurs']];
	liturgie[3][12] = 13; communs[3][12] = [['']];
	liturgie[3][13] = 12; communs[3][13] = [['martyr', 'pasteurs']];
	liturgie[3][14] = 13; communs[3][14] = [['']];
	liturgie[3][15] = 13; communs[3][15] = [['']];
	liturgie[3][16] = 13; communs[3][16] = [['']];
	liturgie[3][17] = 13; communs[3][17] = [['']];
	liturgie[3][18] = 13; communs[3][18] = [['']];
	liturgie[3][19] = 13; communs[3][19] = [['']];
	liturgie[3][20] = 13; communs[3][20] = [['']];
	liturgie[3][21] = 12; communs[3][21] = [['docteurs1', 'pasteurs']];
	liturgie[3][22] = 13; communs[3][22] = [['']];
	liturgie[3][23] = 12; communs[3][23] = [['martyr']];
	liturgie[3][24] = 12; communs[3][24] = [['martyr', 'pasteurs']];
	liturgie[3][25] = 7; communs[3][25] = [['apotres']];
	liturgie[3][26] = 13; communs[3][26] = [['']];
	liturgie[3][27] = 13; communs[3][27] = [['']];
	liturgie[3][28] = 12; communs[3][28] = [['martyr', 'pasteurs']];
	liturgie[3][29] = 10; communs[3][29] = [['docteurs3', 'vierges']];
	liturgie[3][30] = 12; communs[3][30] = [['pasteurs']];

	// mois de mai
	liturgie[4] = []; communs[4] = [];
	liturgie[4][1] = 12; communs[4][1] = [['joseph']];
	liturgie[4][2] = 10; communs[4][2] = [['docteurs1', 'pasteurs']];
	liturgie[4][3] = 7; communs[4][3] = [['apotres']];
	liturgie[4][4] = 13; communs[4][4] = [['']];
	liturgie[4][5] = 13; communs[4][5] = [['']];
	liturgie[4][6] = 13; communs[4][6] = [['']];
	liturgie[4][7] = 13; communs[4][7] = [['']];
	liturgie[4][8] = 13; communs[4][8] = [['']];
	liturgie[4][9] = 13; communs[4][9] = [['']];
	liturgie[4][10] = 13; communs[4][10] = [['']];
	liturgie[4][11] = 13; communs[4][11] = [['']];
	liturgie[4][12] = 12; communs[4][12] = [['martyrs']];
	liturgie[4][13] = 12; communs[4][13] = [['apotres']];
	liturgie[4][14] = 7; communs[4][14] = [['']];
	liturgie[4][15] = 13; communs[4][15] = [['']];
	liturgie[4][16] = 13; communs[4][16] = [['']];
	liturgie[4][17] = 13; communs[4][17] = [['']];
	liturgie[4][18] = 12; communs[4][18] = [['martyr', 'pasteurs']];
	liturgie[4][19] = 12; communs[4][19] = [['pasteurs']];
	liturgie[4][20] = 12; communs[4][20] = [['pasteurs']];
	liturgie[4][21] = 12; communs[4][21] = [['martyrs']];
	liturgie[4][22] = 12; communs[4][22] = [['saintes']];
	liturgie[4][23] = 13; communs[4][23] = [['']];
	liturgie[4][24] = 13; communs[4][24] = [['']];
	liturgie[4][25] = 12; communs[4][25] = [['docteurs1', 'pasteurs']];
	liturgie[4][26] = 10; communs[4][26] = [['pasteurs', 'saints']];
	liturgie[4][27] = 12; communs[4][27] = [['pasteurs']];
	liturgie[4][28] = 13; communs[4][28] = [['']];
	liturgie[4][29] = 13; communs[4][29] = [['']];
	liturgie[4][30] = 13; communs[4][30] = [['']];
	liturgie[4][31] = 7; communs[4][31] = [['marie']];

	// mois de juin
	liturgie[5] = []; communs[5] = [];
	liturgie[5][1] = 10; communs[5][1] = [['martyr']];
	liturgie[5][2] = 12; communs[5][2] = [['martyrs']];
	liturgie[5][3] = 10; communs[5][3] = [['martyrs']];
	liturgie[5][4] = 12; communs[5][4] = [['saintes']];
	liturgie[5][5] = 10; communs[5][5] = [['martyr', 'pasteurs']];
	liturgie[5][6] = 12; communs[5][6] = [['pasteurs']];
	liturgie[5][7] = 13; communs[5][7] = [['']];
	liturgie[5][8] = 13; communs[5][8] = [['']];
	liturgie[5][9] = 12; communs[5][9] = [['docteurs2', 'saints']];
	liturgie[5][10] = 13; communs[5][10] = [['']];
	liturgie[5][11] = 10; communs[5][11] = [['apotres']];
	liturgie[5][12] = 13; communs[5][12] = [['']];
	liturgie[5][13] = 10; communs[5][13] = [['docteurs1', 'pasteurs']];
	liturgie[5][14] = 13; communs[5][14] = [['']];
	liturgie[5][15] = 13; communs[5][15] = [['']];
	liturgie[5][16] = 13; communs[5][16] = [['']];
	liturgie[5][17] = 13; communs[5][17] = [['']];
	liturgie[5][18] = 13; communs[5][18] = [['']];
	liturgie[5][19] = 12; communs[5][19] = [['saints']];
	liturgie[5][20] = 13; communs[5][20] = [['']];
	liturgie[5][21] = 10; communs[5][21] = [['saints']];
	liturgie[5][22] = 12; communs[5][22] = [['pasteurs']];
	liturgie[5][23] = 13; communs[5][23] = [['']];
	liturgie[5][24] = 13; communs[5][24] = [['']]; // S. JeanB traitée comme solennité mobile
	liturgie[5][25] = 13; communs[5][25] = [['']];
	liturgie[5][26] = 13; communs[5][26] = [['']];
	liturgie[5][27] = 12; communs[5][27] = [['docteurs1', 'pasteurs']];
	liturgie[5][28] = 10; communs[5][28] = [['martyr', 'pasteurs']];
	liturgie[5][29] = 13; communs[5][29] = [[]]; // S. Pierre & Paul traitée comme solennité mobile
	liturgie[5][30] = 12; communs[5][30] = [['martyrs']];

	// mois de juillet
	liturgie[6] = []; communs[6] = [];
	liturgie[6][1] = 13; communs[6][1] = [['']];
	liturgie[6][2] = 13; communs[6][2] = [['']];
	liturgie[6][3] = 7; communs[6][3] = [['apotres']];
	liturgie[6][4] = 12; communs[6][4] = [['saintes']];
	liturgie[6][5] = 12; communs[6][5] = [['pasteurs', 'saints']];
	liturgie[6][6] = 12; communs[6][6] = [['martyr', 'vierge']];
	liturgie[6][7] = 13; communs[6][7] = [['']];
	liturgie[6][8] = 13; communs[6][8] = [['']];
	liturgie[6][9] = 12; communs[6][9] = [['martyrs']];
	liturgie[6][10] = 13; communs[6][10] = [['']];
	liturgie[6][11] = 10; communs[6][11] = [['saints']];
	liturgie[6][12] = 13; communs[6][12] = [['']];
	liturgie[6][13] = 12; communs[6][13] = [['saints']];
	liturgie[6][14] = 12; communs[6][14] = [['pasteurs']];
	liturgie[6][15] = 10; communs[6][15] = [['docteurs1', 'pasteurs']];
	liturgie[6][16] = 12; communs[6][16] = [['marie']];
	liturgie[6][17] = 13; communs[6][17] = [['']];
	liturgie[6][18] = 13; communs[6][18] = [['']];
	liturgie[6][19] = 13; communs[6][19] = [['']];
	liturgie[6][20] = 12; communs[6][20] = [['martyr', 'pasteurs']];
	liturgie[6][21] = 12; communs[6][21] = [['docteurs1', 'pasteurs']];
	liturgie[6][22] = 7; communs[6][22] = [['saintes']];
	liturgie[6][23] = 12; communs[6][23] = [['saintes']];
	liturgie[6][24] = 12; communs[6][24] = [['pasteurs']];
	liturgie[6][25] = 7; communs[6][25] = [['apotres']];
	liturgie[6][26] = 10; communs[6][26] = [['saints']];
	liturgie[6][27] = 13; communs[6][27] = [['']];
	liturgie[6][28] = 13; communs[6][28] = [['']];
	liturgie[6][29] = 10; communs[6][29] = [['saintes']];
	liturgie[6][30] = 12; communs[6][30] = [['docteurs1', 'pasteurs']];
	liturgie[6][31] = 10; communs[6][31] = [['pasteurs', 'saints']];

	// mois d'août
	liturgie[7] = []; communs[7] = [];
	liturgie[7][1] = 10; communs[7][1] = [['docteurs1', 'pasteurs']];
	liturgie[7][2] = 12; communs[7][2] = [['pasteurs']];
	liturgie[7][3] = 13; communs[7][3] = [['']];
	liturgie[7][4] = 10; communs[7][4] = [['pasteurs']];
	liturgie[7][5] = 12; communs[7][5] = [['???']];
	liturgie[7][6] = 5; communs[7][6] = [['seigneur']];
	liturgie[7][7] = 12; communs[7][7] = [['pasteurs', 'saints']];
	liturgie[7][8] = 10; communs[7][8] = [['pasteurs', 'saints']];
	liturgie[7][9] = 12; communs[7][9] = [['martyr', 'vierge']];
	liturgie[7][10] = 7; communs[7][10] = [['martyr']];
	liturgie[7][11] = 10; communs[7][11] = [['vierges', 'saintes']];
	liturgie[7][12] = 12; communs[7][12] = [['martyrs', 'pasteurs']];
	liturgie[7][13] = 12; communs[7][13] = [['saints']];
	liturgie[7][14] = 10; communs[7][14] = [['martyr', 'pasteurs']];
	liturgie[7][15] = 3; communs[7][15] = [['marie']];
	liturgie[7][16] = 12; communs[7][16] = [['saints']];
	liturgie[7][17] = 13; communs[7][17] = [['']];
	liturgie[7][18] = 13; communs[7][18] = [['']];
	liturgie[7][19] = 12; communs[7][19] = [['pasteurs', 'saints']];
	liturgie[7][20] = 10; communs[7][20] = [['docteurs2', 'saints']];
	liturgie[7][21] = 10; communs[7][21] = [['pasteurs']];
	liturgie[7][22] = 10; communs[7][22] = [['marie']];
	liturgie[7][23] = 12; communs[7][23] = [['vierges', 'saintes']];
	liturgie[7][24] = 7; communs[7][24] = [['apotres']];
	liturgie[7][25] = 12; communs[7][25] = [['saints']];
	liturgie[7][26] = 12; communs[7][26] = [['pasteurs']];
	liturgie[7][27] = 10; communs[7][27] = [['saintes']];
	liturgie[7][28] = 10; communs[7][28] = [['docteurs1', 'pasteurs']];
	liturgie[7][29] = 10; communs[7][29] = [['martyr']];
	liturgie[7][30] = 13; communs[7][30] = [['']];
	liturgie[7][31] = 13; communs[7][31] = [['']];

	// mois de septembre
	liturgie[8] = []; communs[8] = [];
	liturgie[8][1] = 13; communs[8][1] = [['']];
	liturgie[8][2] = 13; communs[8][2] = [['']];
	liturgie[8][3] = 10; communs[8][3] = [['docteurs1', 'pasteurs']];
	liturgie[8][4] = 13; communs[8][4] = [['']];
	liturgie[8][5] = 13; communs[8][5] = [['']];
	liturgie[8][6] = 13; communs[8][6] = [['']];
	liturgie[8][7] = 13; communs[8][7] = [['']];
	liturgie[8][8] = 7; communs[8][8] = [['marie']];
	liturgie[8][9] = 13; communs[8][9] = [['']];
	liturgie[8][10] = 13; communs[8][10] = [['']];
	liturgie[8][11] = 13; communs[8][11] = [['']];
	liturgie[8][12] = 13; communs[8][12] = [['']];
	liturgie[8][13] = 10; communs[8][13] = [['docteurs1', 'pasteurs']];
	liturgie[8][14] = 5; communs[8][14] = [['seigneur']];
	liturgie[8][15] = 10; communs[8][15] = [['marie']];
	liturgie[8][16] = 10; communs[8][16] = [['martyrs', 'pasteurs']];
	liturgie[8][17] = 12; communs[8][17] = [['docteurs1', 'pasteurs']];
	liturgie[8][18] = 13; communs[8][18] = [['']];
	liturgie[8][19] = 12; communs[8][19] = [['martyr', 'pasteurs']];
	liturgie[8][20] = 10; communs[8][20] = [['martyrs']];
	liturgie[8][21] = 7; communs[8][21] = [['apotres']];
	liturgie[8][22] = 13; communs[8][22] = [['']];
	liturgie[8][23] = 10; communs[8][23] = [['pasteurs']];
	liturgie[8][24] = 13; communs[8][24] = [['']];
	liturgie[8][25] = 13; communs[8][25] = [['']];
	liturgie[8][26] = 12; communs[8][26] = [['martyrs']];
	liturgie[8][27] = 10; communs[8][27] = [['pasteurs', 'saints']];
	liturgie[8][28] = 12; communs[8][28] = [['martyr']];
	liturgie[8][29] = 7; communs[8][29] = [['']];
	liturgie[8][30] = 10; communs[8][30] = [['docteurs1', 'pasteurs']];

	// mois d'octobre
	liturgie[9] = []; communs[9] = [];
	liturgie[9][1] = 10; communs[9][1] = [['vierges', 'saintes']];
	liturgie[9][2] = 10; communs[9][2] = [['']];
	liturgie[9][3] = 13; communs[9][3] = [['']];
	liturgie[9][4] = 10; communs[9][4] = [['saints']];
	liturgie[9][5] = 13; communs[9][5] = [['']];
	liturgie[9][6] = 12; communs[9][6] = [['pasteurs', 'saints']];
	liturgie[9][7] = 10; communs[9][7] = [['marie']];
	liturgie[9][8] = 13; communs[9][8] = [['']];
	liturgie[9][9] = 12; communs[9][9] = [['martyrs']];
	liturgie[9][10] = 13; communs[9][10] = [['']];
	liturgie[9][11] = 13; communs[9][11] = [['']];
	liturgie[9][12] = 13; communs[9][12] = [['']];
	liturgie[9][13] = 13; communs[9][13] = [['']];
	liturgie[9][14] = 12; communs[9][14] = [['martyr', 'pasteur']];
	liturgie[9][15] = 10; communs[9][15] = [['docteurs3', 'vierges']];
	liturgie[9][16] = 12; communs[9][16] = [['saintes']];
	liturgie[9][17] = 10; communs[9][17] = [['martyr', 'pasteurs']];
	liturgie[9][18] = 7; communs[9][18] = [['apotres']];
	liturgie[9][19] = 12; communs[9][19] = [['martyrs', 'pasteurs']];
	liturgie[9][20] = 13; communs[9][20] = [['']];
	liturgie[9][21] = 13; communs[9][21] = [['']];
	liturgie[9][22] = 13; communs[9][22] = [['']];
	liturgie[9][23] = 12; communs[9][23] = [['pasteurs']];
	liturgie[9][24] = 12; communs[9][24] = [['pasteurs']];
	liturgie[9][25] = 13; communs[9][25] = [['']];
	liturgie[9][26] = 13; communs[9][26] = [['']];
	liturgie[9][27] = 13; communs[9][27] = [['']];
	liturgie[9][28] = 7; communs[9][28] = [['apotres']];
	liturgie[9][29] = 13; communs[9][29] = [['']];
	liturgie[9][30] = 13; communs[9][30] = [['']];
	liturgie[9][31] = 13; communs[9][31] = [['']];

	// mois de novembre
	liturgie[10] = []; communs[10] = [];
	liturgie[10][1] = 3; communs[10][1] = [['']];
	liturgie[10][2] = 3; communs[10][2] = [['']];
	liturgie[10][3] = 12; communs[10][3] = [['saints']];
	liturgie[10][4] = 10; communs[10][4] = [['pasteurs']];
	liturgie[10][5] = 13; communs[10][5] = [['']];
	liturgie[10][6] = 13; communs[10][6] = [['']];
	liturgie[10][7] = 13; communs[10][7] = [['']];
	liturgie[10][8] = 13; communs[10][8] = [['']];
	liturgie[10][9] = 7; communs[10][9] = [['dedicace']];
	liturgie[10][10] = 10; communs[10][10] = [['docteurs1', 'pasteurs']];
	liturgie[10][11] = 10; communs[10][11] = [['pasteurs']];
	liturgie[10][12] = 10; communs[10][12] = [['martyr', 'pasteurs']];
	liturgie[10][13] = 13; communs[10][13] = [['']];
	liturgie[10][14] = 13; communs[10][14] = [['']];
	liturgie[10][15] = 12; communs[10][15] = [['docteurs1', 'pasteurs']];
	liturgie[10][16] = 12; communs[10][16] = [['saintes']];
	liturgie[10][17] = 10; communs[10][17] = [['saintes']];
	liturgie[10][18] = 12; communs[10][18] = [['dedicace']];
	liturgie[10][19] = 13; communs[10][19] = [['']];
	liturgie[10][20] = 13; communs[10][20] = [['']];
	liturgie[10][21] = 10; communs[10][21] = [['marie']];
	liturgie[10][22] = 10; communs[10][22] = [['martyr', 'vierges']];
	liturgie[10][23] = 12; communs[10][23] = [['martyr', 'pasteurs']];
	liturgie[10][24] = 10; communs[10][24] = [['martyrs']];
	liturgie[10][25] = 12; communs[10][25] = [['martyr', 'vierges']];
	liturgie[10][26] = 13; communs[10][26] = [['']];
	liturgie[10][27] = 13; communs[10][27] = [['']];
	liturgie[10][28] = 13; communs[10][28] = [['']];
	liturgie[10][29] = 13; communs[10][29] = [['']];
	liturgie[10][30] = 7; communs[10][30] = [['apotres']];

	// mois de décembre
	liturgie[11] = []; communs[11] = [];
	liturgie[11][1] = 13; communs[11][1] = [['']];
	liturgie[11][2] = 13; communs[11][2] = [['']];
	liturgie[11][3] = 10; communs[11][3] = [['pasteurs']];
	liturgie[11][4] = 12; communs[11][4] = [['pasteurs']];
	liturgie[11][5] = 13; communs[11][5] = [['']];
	liturgie[11][6] = 12; communs[11][6] = [['pasteurs']];
	liturgie[11][7] = 10; communs[11][7] = [['pasteurs']];
	liturgie[11][8] = 13; communs[11][8] = [['']]; // le 8 décembre est traité après (Immaculée conception)
	liturgie[11][9] = 13; communs[11][9] = [['']];
	liturgie[11][10] = 13; communs[11][10] = [['']];
	liturgie[11][11] = 12; communs[11][11] = [['pasteurs']];
	liturgie[11][12] = 12; communs[11][12] = [['']];
	liturgie[11][13] = 10; communs[11][13] = [['martyr', 'vierges']];
	liturgie[11][14] = 10; communs[11][14] = [['docteurs1', 'pasteurs']];
	liturgie[11][15] = 13; communs[11][15] = [['']];
	liturgie[11][16] = 13; communs[11][16] = [['']];
	liturgie[11][17] = 13; communs[11][17] = [['']];
	liturgie[11][18] = 13; communs[11][18] = [['']];
	liturgie[11][19] = 13; communs[11][19] = [['']];
	liturgie[11][20] = 13; communs[11][20] = [['']];
	liturgie[11][21] = 12; communs[11][21] = [['docteurs1', 'pasteurs']];
	liturgie[11][22] = 13; communs[11][22] = [['']];
	liturgie[11][23] = 12; communs[11][23] = [['pasteurs']];
	liturgie[11][24] = 13; communs[11][24] = [['']];
	liturgie[11][25] = 2; communs[11][25] = [['']];
	liturgie[11][26] = 7; communs[11][26] = [['']];
	liturgie[11][27] = 7; communs[11][27] = [['']];
	liturgie[11][28] = 7; communs[11][28] = [['']];
	liturgie[11][29] = 12; communs[11][29] = [['martyr', 'pasteurs']];
	liturgie[11][30] = 13; communs[11][30] = [['']];
	liturgie[11][31] = 12; communs[11][31] = [['pasteurs']];

	return Array (liturgie,communs);

} // fin de la fonction Sanctoral_defaut()

function Sanctoral (date) {
	// cette fonction renvoie l'ordre du préséance du sanctoral

	sessionStorage.sanctoral_local='';
	var jour = date.getDate();
	var mois = date.getMonth();
	var annee =date.getFullYear();

	// on commence par le cas des solennités
	// et fêtes du Seigneur mobiles

	// Fête de l'Epiphanie du Seigneur
	if (Nb_jours(date, Epiphanie(annee)) == 0) {
		return 2;
	}

	// Annonciation
	if (Nb_jours(date, Annonciation(annee)) == 0) {
		return 3.1;
	}

	// Saint Joseph
	if (Nb_jours(date, SaintJoseph(annee)) == 0) {
		return 3.1;
	}

	// Immaculée conception
	if (Nb_jours(date, ImmaculeeConception(annee)) == 0) {
		return 3.1;
	}

	// Trinité
	if (Nb_jours(date, Trinite(annee)) == 0) {
		return 3.1;
	}

	// Saint Sacrement
	if (Nb_jours(date, SaintSacrement(annee)) == 0) {
		return 3.1;
	}

	// Sacré Coeur
	if (Nb_jours(date, SacreCoeur(annee)) == 0) {
		return 3.1;
	}

	// Saints Pierre & Paul
	if (Nb_jours(date, SaintPierrePaul(annee)) == 0) {
		return 3.2;
	}

	// Saint Jean-Baptiste
	if (Nb_jours(date, SaintJeanB(annee)) == 0) {
		return 3.2;
	}

	// Fête du Christ Roi
	if (Nb_jours(date, ChristRoi(annee)) == 0) {
		return 3.1;
	}

	// Fête de la sainte Famille
	if (Nb_jours(date, SteFamille(annee)) == 0) {
		preseance = 5.1;
	}

	// Fête du Baptême du Seigneur
	if (Nb_jours(date, Bapteme(annee)) == 0) {
		preseance = 5.1;
	}


	// initialise la variable liturgie
	var liturgie = Sanctoral_defaut()[0];
	var preseance = liturgie[mois][jour];

	// Cœur Immaculé de Marie
	if (Nb_jours(date, SacreCoeur(annee)) == -1) {
		if (preseance >= 10) { // cette mémoire prime sur les mémoires seulement
			preseance = 9.9;
		}
	}
	// Marie Mère de l'Eglise
	if (Nb_jours(date, Pentecote(annee)) == -1) {
		if (preseance >= 10) { // cette mémoire prime sur les mémoires seulement
			preseance = 9.9;
		}
	}

	// on gère maintenant les fêtes des propres nationaux :
	liste_propres = Liste_propres_nationaux();
	for (var i=0; i < liste_propres.length; i++) {
		if (localStorage.getItem(liste_propres[i]) === 'true')  {
			var preseance_locale = Sanctoral_propre(date, liste_propres[i]);
			if (preseance_locale<preseance) {
				preseance = preseance_locale;
				sessionStorage.sanctoral_local='_'+liste_propres[i];
			}
		}
	}

	// on gère maintenant les fêtes des propres diocésains :
	var	diocese = localStorage.diocese;
	if (diocese.length >0)  {
		var preseance_diocese = Sanctoral_diocese(date, diocese);
		if (preseance_diocese<preseance) {
			preseance = preseance_diocese;
			sessionStorage.sanctoral_local='_'+diocese;
		}
	}

	return preseance;

} // fin de la fonction Sanctoral


function Sanctoral_propre (date, propre) {

	// Cette fonction renvoie la présance pour le sanctoral européen

	var jour = date.getDate();
	var mois = date.getMonth();
	// on initialise tout à 13 (préséance minimale)
	var preseance = Array(12);
	for (var i=0; i<12; i++) {
		preseance[i] = Array(31);
		for (var j=1; j<=31; j++) {
			preseance[i][j] = 13;
		}
	}
	switch(propre) {
		case 'afriquen':
			// Félicité et Perpétue
			preseance[2][7]=8;
			// Monique
			preseance[7][27]=8;
			// Augustin
			preseance[7][28]=8;
			// Cyprien
			preseance[8][16]=4;
			break;
		case 'belgique':
			// Hubert
			preseance[10][3]=10;
			//			communs[10][3] = [['pasteurs']];
			break;
		case 'canada':
			// Ste Anne
			preseance[6][26]=8;
			// Jean de Brébeuf
			preseance[9][19]=10;
			break;
		case 'europe':
			// Cyrille et Méthode
			preseance[1][14]=8;
			// Catherine de Sienne
			preseance[3][29]=8;
			// Benoît
			preseance[6][11]=8;
			// Brigitte
			preseance[6][23]=8;
			// Thérèse Bénédicte de la + 
			preseance[7][9]=8;
			break;
		case 'france':
			// Jeanne d'Arc
			preseance[4][30]=10;
			break;
		case 'luxembourg':
			// S. Willibrord
			preseance[10][7]=8;
			break;
		case 'suisse':
			break;
	}

	return preseance[mois][jour];

} // fin de la fonction Santoral_propre()

function Sanctoral_diocese (date, diocese) {

	// Cette fonction renvoie la présance pour le sanctoral du diocese

	var jour = date.getDate();
	var mois = date.getMonth();
	var annee = date.getFullYear();
	// on initialise tout à 13 (préséance minimale)
	var preseance = Array(12);
	for (var i=0; i<12; i++) {
		preseance[i] = Array(31);
		for (var j=1; j<=31; j++) {
			preseance[i][j] = 13;
		}
	}
	switch(diocese) {
		case 'lille':
			// S Thomas Becket
			preseance[0][4]=11;
			// S Remy
			preseance[0][15]=11;
			// S Piat
			preseance[9][3]=11;
			// Tous les saints du diocèse
			preseance[10][8]=11;
			//ND de la Treille
      var NDTreilleDate = NDTreille(annee);
      preseance[NDTreilleDate.getMonth()][NDTreilleDate.getDate()]=8.1;
			break;
		case 'lyon':
			// S François de Sales
			preseance[0][24]=9.99;
			// S Polycarpe
			preseance[1][23]=9.99;
			// S Jean-Louis Bonnard
			preseance[4][4]=11;
			// S Pothin et Co
			preseance[5][2] = 8;
			// S Irénée
			preseance[5][28] = 4;
			// S Bonaventure
//			preseance[6][15] = 9.99;
			// S Jean-Marie Vianney
			preseance[7][4] = 8;
			// S Jacques-Jules Bonnaud
			preseance[8][1] = 11;
			// Bx Antoine Chevrier
			preseance[9][3] = 11;
			// Dédicace primatiale
			preseance[9][24] = 8;
			// Tous les saints évêques du diocèse
			preseance[10][5] = 11;
			// Tous les saints du diocèse
			preseance[10][8] = 11;
			// ND de Fourvière
			var NDFDate = NDFourviere(annee);
			preseance[NDFDate.getMonth()][NDFDate.getDate()]=8.1;
			break;
		case 'paris':
			// Ste Geneviève
			preseance[0][3]=4;
			// S. Germain
			preseance[4][28]=11;
			// Ste Clotilde
			preseance[5][4]=11;
			// Dédicace ND Paris
			preseance[5][16]=8;
			// S. Louis
			preseance[7][25]=11;
			// Bx Martyrs de Paris
			preseance[8][2]=11;
			// S. Vincent de Paul
			preseance[8][27]=8;
			// S. Denis
			preseance[9][9]=8;
			// S. Marcel
			preseance[10][3]=11;
			// S. diocèse
			preseance[10][8]=11;
			break;
	}

	return preseance[mois][jour];

} // fin de la fonction Santoral_diocese()
