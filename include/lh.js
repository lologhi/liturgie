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

// ces fonctions nécessitent le chargement préalable du fichier :
// lh-psaumes.js
// lh-calendrier.js

// dates min/max Cendres / Pâques / Pentecôte
	// 7 février 2103 / 25 mars / 13 mai
	// 10 mars 2038 / 25 avril / 13 juin

function Nom_du_jour (jour) {

	switch(jour) {
		case 0:
			return 'Dimanche';
			break;
		case 1:
			return 'Lundi';
			break;
		case 2:
			return 'Mardi';
			break;
		case 3:
			return 'Mercredi';
			break;
		case 4:
			return 'Jeudi';
			break;
		case 5:
			return 'Vendredi';
			break;
		case 6:
			return 'Samedi';
			break;
	}
} // fin de la fonction Nom_du_jour()

function Commun_description (communs) {
	// cette fonction traduit le nom court en description explicite
	// pour les communs

	switch(communs) {
		case "dedicace":
			return "Dédicace";
			break;
		case "marie":
			return "Marie";
			break;
		case "apotres":
			return "Apôtres";
			break;
		case "martyrs":
			return "Plrs. martyrs";
			break;
		case "martyr":
			return "Un martyr";
			break;
		case "pasteurs":
			return "Pasteurs";
			break;
		case "docteurs1":
			return "Docteurs-Pasteurs";
			break;
		case "docteurs2":
			return "Docteurs-Saints";
			break;
		case "docteurs3":
			return "Docteurs-Vierges";
			break;
		case "docteurs4":
			return "Docteurs-Saintes";
			break;
		case "vierges":
			return "Vierges";
			break;
		case "saints":
			return "Saints";
			break;
		case "saintes":
			return "Saintes";
			break;
		case "religieux":
			return "Religieux";
			break;
		case "religieuses":
			return "Religieuses";
			break;
		case "caritatifm":
			return "Act. caritative (M)";
			break;
		case "caritatiff":
			return "Act. caritative (F)";
			break;
		case "educateur":
			return "Éducateur";
			break;
		case "defunts":
			return "Défunts";
			break;
	}
	return;

} // fin de la fonction // Commun_description

function Romain(nombre) { // convertit le numéro de semaine en nombre romain

	var nb_romain = "";
	for (var i=1; i <= nombre; i++) {
		nb_romain = nb_romain+'I';
	}
	if (nombre==4)
		nb_romain = 'IV';
	return nb_romain;

} // fin de la fonction Romain()

function Sleep(milliSeconds){
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
} //fin de la fonction Sleep()

function TailleTexte(valeur, sens) {
	// cette fonction renvoi un tableau avec la taille du texte
	// inférieure (sens=-1) / supérieure (sens=1) à la valeur fournie.

	var taille=[90, 100, 110, 120, 140, 160, 200];
	valeur = parseInt (valeur);

	var i=0;
	while (i<6) {
		if (valeur==taille[i]) {
			break;}
		i++;
	}
	if (i>0 && sens==-1) {
		i--;}
	if (i<6 && sens==1) {
		i++;}

	return taille[i]+'%';

} // fin de la fonction TailleTexte()

function AgrandirTexte() {
	var taille_texte = document.body.style.fontSize;
	taille_texte = TailleTexte (taille_texte, 1);
	localStorage.setItem('taille_texte', taille_texte);
	$("body").css('font-size', taille_texte);
}

function RetrecirTexte() {
	var taille_texte = document.body.style.fontSize;
	taille_texte = 	TailleTexte (taille_texte, -1);
	localStorage.setItem('taille_texte', taille_texte);
	$("body").css('font-size', taille_texte);
}

function Semaine_psautier (semaine) {
	// renvoie la semaine du psautier
	// Rq : si semaine=0, on renvoit 4 (ce qui est normal,
	// c'est le cas des jours juste après les Cendres ou Noël)

	var semaine_p = semaine % 4;
	if (semaine_p == 0) {
		semaine_p = 4;
	}
	return semaine_p;
} // fin de la fonction Semaine_psautier()

function Antienne_temps_pascal(label) {
	// Cette fonction ajoute un 'b' à la fin du label quand le label est une antienne
	// et que nous sommes dans le temps pascal. Elle sert pour le sanctoral, pour
	// sélectionner les antiennes avec/sans alléluia, selon qu'on est dans le TP ou non.
	var suffixe = '';
	if (sessionStorage.temps_liturgique == 5) {
		suffixe = 'b';
	}
	var label2 = label;
	if (label2.search('antienne')>-1) {
		label2 = label + suffixe;
	}
	return label2;
}

function Date_du_jour (date_jour) {
	// renvoie une chaîne de caractère avec la date du jour
	// au format jour n° mois année (eg. Lundi 2 février 2016)

	date_str = date_jour.toLocaleDateString("fr", {weekday: "long", year: "numeric",
		month: "long", day: "numeric"});
	if (date_jour.getDate() ==1) // le premier du mois on ajoute le "er" à 1 !
		date_str = date_str.replace(" 1 ", " 1er ");
	return date_str[0].toUpperCase() + date_str.slice(1);;

} // fin de la fonction Date_du_jour()

function Titre_secondaire (annee, temps, semaine, semaine_p, date_jour) {
	// renvoi le texte à afficher dans le div #?_titre_secondaire
	// ie la semaine et le temps liturgique, l'année et la semaine du psautier
	// (eg. 12e semaine du temps ordinaire - Année A - sem. ps. IV)
	var temps_lit = Array();
	temps_lit [1] = 'de l\'Avent';
	temps_lit [2] = 'de la Nativit&eacute;';
	temps_lit [3] = 'ordinaire';
	temps_lit [4] = 'du Car&ecirc;me';
	temps_lit [5] = 'de P&acirc;ques';

	if (semaine == 1) {
		semaine = semaine + '<sup>re</sup>';
	} else {
		semaine = semaine + '<sup>e</sup>';
	}
	if (temps==2) { // pendant le temps de Noël il n'y a pas la notion de semaine
		return '<p><i><b>Temps '+temps_lit[temps]+'</b><br>(Ann&eacute;e '+annee+' - sem. ps. '+Romain(semaine_p)+')</i></p>';

	} else if (temps==4) { // Carême - le Mercredi des Cendres et les jours suivants
		var cendres = Nb_jours(Cendres(date_jour.getFullYear()), date_jour);
		if (cendres < 4) {
			switch(cendres) {
				case 0:
					return '<p><b><i>Mercredi des Cendres</i></b></p>';
					break;
				case 1:
					return '<p><b><i>Jeudi après les Cendres</i></b></p>';
					break;
				case 2:
					return '<p><b><i>Vendredi après les Cendres</i></b></p>';
					break;
				case 3:
					return '<p><b><i>Samedi après les Cendres</i></b></p>';
					break;
			}
		}
		if (semaine === '6<sup>e</sup>') {
			return '<p><i><b>Semaine Sainte</b><br>(Ann&eacute;e '+annee+' - sem. ps. '+Romain(semaine_p)+')</i></p>';
		}
	} else if (temps==5) {
		if (semaine === '1<sup>re</sup>') {
			return '<p><i><b>Octave de Pâques</b><br>(Ann&eacute;e '+annee+' - sem. ps. '+Romain(semaine_p)+')</i></p>';
		}
	}

	return '<p><i>'+semaine+' semaine du <b>temps '+temps_lit[temps]+'</b><br>(Ann&eacute;e '+annee+' - sem. ps. '+Romain(semaine_p)+')</i></p>';

} // fin de la fonction Titre_secondaire()

function Fichier_sanctoral (date_jour, office, preseance, premieres_vepres) {
	// renvoi le chemin vers le fichier du sanctoral, pour la date et l'office demandés
	// ne sert que pour les fetes mobiles
	// office : lectures; laudes; milieu; vepres.

	var annee=date_jour.getFullYear();
	var mois=date_jour.getMonth()+1;
	if (mois<10) {
		mois='0'+mois;
	}
	var jour_du_mois=date_jour.getDate();
	if (jour_du_mois<10) {
		jour_du_mois='0'+jour_du_mois;
	}

	if (premieres_vepres) {
		office = office + '0';
	}

	if (preseance==2)  {
		// Epiphanie
		if (Nb_jours(date_jour, Epiphanie(annee)) == 0) {
			return 'sanctoral/01/E-'+office+'.html';
		}
	}

	if (preseance==3.1) { // on fête une solennité mobile
		// Saint Joseph
		if (Nb_jours(date_jour, SaintJoseph(annee)) == 0) {
			return 'sanctoral/03/19-'+office+'.html';
		}
		// Annociation
		if (Nb_jours(date_jour, Annonciation(annee)) == 0) {
			return 'sanctoral/03/25-'+office+'.html';
		}
		// Trinité
		if (Nb_jours(date_jour, Trinite(annee)) == 0) {
			return 'sanctoral/paques/ST-'+office+'.html';
		}
		// Saint Sacrement
		if (Nb_jours(date_jour, SaintSacrement(annee)) == 0) {
			return 'sanctoral/paques/SS-'+office+'.html';
		}
		// Sacré Coeur
		if (Nb_jours(date_jour, SacreCoeur(annee)) == 0) {
			return 'sanctoral/paques/SC-'+office+'.html';
		}
		// Christ-Roi
		if (Nb_jours(date_jour, ChristRoi(annee)) == 0) {
			return 'sanctoral/11/CR-'+office+'.html';
		}
		// Immanculée Conception
		if (Nb_jours(date_jour, ImmaculeeConception(annee)) == 0) {
			return 'sanctoral/12/08-'+office+'.html';
		}
	}
	if (preseance==3.2) {
		// Saint Jean-Baptiste
		if (Nb_jours(date_jour, SaintJeanB(annee)) == 0) {
			return 'sanctoral/06/24-'+office+'.html';
		}
		// Saints Pierre & Paul
		if (Nb_jours(date_jour, SaintPierrePaul(annee)) == 0) {
			return 'sanctoral/06/29-'+office+'.html';
		}
	} // fin des solennités mobiles

	if (preseance==5.1) { // on a une fête mobile (Sainte Famille)
		// Sainte Famille
		if (Nb_jours(date_jour, SteFamille(annee)) == 0) {
			return 'sanctoral/12/SF-'+office+'.html';
		}
		// Baptême du Seigneur
		if (Nb_jours(date_jour, Bapteme(annee)) == 0) {
			return 'sanctoral/01/B-'+office+'.html';
		}
	} // fin des fêtes mobiles

	// Diocèse de Lille : ND de la Treille
	if (sessionStorage.sanctoral_local === '_lille') {
		if (preseance == 8.1) {
			return 'sanctoral/05/NDT-'+office+'_lille.html';
		}
	}

	// Diocèse de Lyon : ND de Fourvière
	if (sessionStorage.sanctoral_local === '_lyon') {
		if (preseance == 8.1) {
			return 'sanctoral/05/NDF-'+office+'_lyon.html';
		}
	}

	// on gère maintenant les mémoires mobiles
	if (preseance==9.9) {
		// Coeur immaculée de Marie
		if (Nb_jours(date_jour, SacreCoeur(annee)) == -1) {
			return 'sanctoral/paques/CI-'+office+'.html';
		}
		// Marie Mère de l'Eglise
		if (Nb_jours(date_jour, Pentecote(annee)) == -1) {
			return 'sanctoral/paques/MME-'+office+'.html';
		}
	}

	return 'sanctoral/'+mois+'/'+jour_du_mois+'-'+office+sessionStorage.sanctoral_local+'.html';
} // fin de la fonction Fichier_sanctoral()

function Charge_fichier(label, fichier) {
	// Cette fonction charge le fichier spécifié en paramètre
	// dans le div dont l'id est spécifié dans label (#id)
	// elle détecte automatiquement une antienne et la répète si nécessaire

	$(label).load(fichier);
	repeter = (localStorage.getItem("repeter_antiennes") === 'true');
	if (label.search('antienne')>-1 && repeter) { // on repète l'antienne si nécessaire
		$(label+'b').load(fichier);
	}
}	// fin de la fonction Charge_fichier()

function Charge_label_txt(label) {
	// Remplit la div correspondant au label avec le code html
	// contenu dans la variable de session correspondante.

	$('#'+label).html(sessionStorage.getItem(label));

} // fin de la fonction Charge_label_txt()

function Charge_hymne(office) {
	// Remplit la div de l'hymne en détectant si l'on affiche simplement
	// une hymne où s'il faut afficher l'interface de sélection des hymnes
	// en dehors du temps ordinaire.

	var fichier = sessionStorage.getItem(office+'hymne');

	if (fichier.search('select')>-1) {
		var suffixe = fichier.substr(7);

		$('#'+office+'hymne').html('');
		$('#'+office+'select-hymne-div').show();
		$('#'+office+'select-hymne').load('hymnes/hymnes_'+suffixe+'.html', function() {
		});
		var hymne="";
		$('#'+office+'select-hymne').val(hymne).attr('selected', 'selected');
		$('#'+office+'select-hymne').bind('change', function (event) {
			hymne=$('#'+office+'select-hymne option:selected').val();
			localStorage.setItem('select-hymne', hymne);
			$('#'+office+'hymne').load('hymnes/'+hymne+'.html');
		});
	} else {
		$('#'+office+'select-hymne-div').hide();
		Charge_label(office+'hymne');
	}

} // fin de la fonction Charge_hymne()

function Charge_label(label) {
	// Remplit la div correspondant au label avec le fichier
	// indiqué dans la variable de session correspondante.
	// elle détecte automatiquement une antienne et la répète si nécessaire
	// elle intégre l'affichage du titre du psaume

	var fichier = sessionStorage.getItem(label);

	// on insère le titre automatiquement pour Ps et Ct (ça simplifie le code pour le sanctoral)
	if (label.search('psaume')>-1) {
		var label_titre = label.replace("psaume", "titre_psaume");
		if (fichier.length>0) {
			$('#'+label_titre).load('psaumes/psaume' + fichier + '_titre.html');
			fichier = 'psaumes/psaume'+fichier+'.html';
		} else {
			$('#'+label_titre).html('');
		}
	}
	if (label === 'la_cantique') {
		if (fichier.length>0) {
			$('#la_titre_cantique').load('cantiques/AT' + fichier + '_titre.html');
			fichier = 'cantiques/AT'+fichier+'.html';
		} else {
			$('#la_titre_cantique').html('');
		}
	}
	if (label === 'v_cantique') {
		if (fichier.length>0) {
			$('#v_titre_cantique').load('cantiques/NT' + fichier + '_titre.html');
			fichier = 'cantiques/NT'+fichier+'.html';
		} else {
			$('#v_titre_cantique').html('');
		}
	}

	if (fichier === '') {
		fichier = 'empty.html';
	}

	$('#'+label).load(fichier);

	repeter = (localStorage.getItem("repeter_antiennes") === 'true');
	if (label.search('antienne')>-1 && repeter) { // on repète l'antienne si nécessaire
		$('#'+label+'b').load(fichier);
	}
	if (label.search('tedeum')>-1) {
		if (sessionStorage.l_tedeum.length > 0) {
			$('#l_tedeum_div').show();
		} else {
			$('#l_tedeum_div').hide();
		}
	}

} // fin de la fonction Charge_label()

function Prefixe_office(office) {
	// renvoie le préfixe des labels pour l'office demandé

	switch(office) {
		case 'lectures':
			return 'l_';
			break;
		case 'laudes':
			return 'la_';
			break;
		case 'milieu':
			return 'm_';
			break;
		case 'vepres':
			return 'v_';
			break;
		case 'complies':
			return 'c_';
			break;
	}
} // fin de la fonction Prefixe_office()

function Labels_office(office) {
	// renvoie un tableau avec la liste des noms des labels
	// à compléter pour l'office demandé en paramètre

	switch(office) {
		case 'lectures':
			return ['titre_sanctoral', 'introduction', 'hymne', 'antienne_1', 'psaume_1', 'antienne_2', 'psaume_2', 'antienne_3', 'psaume_3',
				'verset', 'lecture', 'patristique', 'tedeum', 'oraison', 'temporal'];
			break;
		case 'laudes':
			return ['titre_sanctoral', 'introduction', 'antienne_inv', 'hymne', 'antienne_1', 'psaume_1','antienne_2', 'psaume_2', 'antienne_cantique', 'cantique',
				'capitule', 'repons', 'antienne_ev', 'antienne_ev2', 'titre_cantique_ev', 'cantique_ev',
				'intercession', 'oraison', 'temporal', 'sanctoral'];
			break;
		case 'milieu':
			return ['titre_sanctoral', 'introduction', 'antienne_1', 'psaume_1', 'antienne_2', 'psaume_2', 'antienne_3', 'psaume_3',
				'capitule1', 'repons1', 'oraison1', 'capitule2', 'repons2', 'oraison2', 'capitule3',
				'repons3', 'oraison3', 'temporal', 'sanctoral'];
			break;
		case 'vepres':
			return ['titre_sanctoral', 'introduction', 'hymne', 'antienne_1', 'psaume_1', 'antienne_2', 'psaume_2', 'antienne_cantique', 'cantique',
				'capitule', 'repons', 'antienne_ev', 'antienne_ev2', 'titre_cantique_ev', 'cantique_ev',
				'intercession', 'oraison', 'temporal', 'sanctoral'];
			break;
		case 'complies':
			return ['hymne', 'introduction', 'antienne_1', 'psaume_1', 'antienne_2', 'psaume_2', 'capitule','repons',
				'titre_cantique_ev', 'antienne_ev', 'cantique_ev', 'oraison', 'benediction'];
			break;
	}
} // fin de la fonction Labels_office()

function Init_formulaire (office) {
	// efface les variable asssociées au formulaire de l'office

	var prefixe = Prefixe_office(office);
	var labels_communs = ['titre_principal', 'titre_secondaire'];
	var labels_office = Labels_office(office);

	for (var i=0; i < labels_communs.length; i++) {
		sessionStorage.setItem(prefixe + labels_communs[i], '');
	}
	for (var i=0; i <labels_office.length; i++) {
		sessionStorage.setItem(prefixe + labels_office[i], '');
	}
	// on efface alors toutes les données précédentes
	Charge_tout(office);

} // fin de la fonction Init_formulaire()

function Init_option (office) {
	// le paramètre est le nom de l'office
	// cette fonction réinitialise la sélection des options
	// pour les laudes et les vêpres (pour les mémoires)

	var prefixe = Prefixe_office(office);

	if (office === 'complies') { 
		// pour les complies, le contenu n'est pas dynamique, donc c'est plus simple
		// il suffit de masque l'affiche des options (ne sert qu'en temps de Noël)
		$('#'+prefixe+'option-div').hide();
	} else {
		// pour les laudes et les vêpres il faut vider le contenu du <select>
		$('#'+prefixe+'option-div').hide(); // on masque par défaut l'affichage des options
		$('#'+prefixe+'option').find('option').remove(); // on vide le contenu du select avant de mettre la valeur par défaut
		$('#'+prefixe+'option').append('<option value="0" selected=selected>Propre du sanctoral</option>');
	}

} // fin de la fonction Init_option()

function Affiche_option (office, communs) {

	var prefixe = Prefixe_office(office);

	// activer les options
	$('#'+prefixe+'option-div').show();

	if (office === 'complies') {
		$('#'+prefixe+'option').bind('change', function (event) {
			var jour = $('#'+prefixe+'option option:selected').val();
			Remplir_office(office);
		});
	} else {

		// TODO : pour l'instant, on ne gère que le cas où il n'y a qu'un saint proposé
		// on prend les valeurs du commun pour le premier saint, seulement
		for (var i = 0; i < communs[0].length; i++) {
			commun = communs[0][i];
			commun_desc = Commun_description(commun);
			$('#'+prefixe+'option').append('<option value="'+commun+'">Propre + commun ('+commun_desc+')</option>');
		}

		//		$('#'+prefixe+'option').selectmenu('refresh',true);

		$('#'+prefixe+'option').bind('change', function (event) {
			var commun = $('#'+prefixe+'option option:selected').val();
			if (commun === "0") {
				Remplir_office(office);	
			} else {
				if (office === 'laudes') { // il n'y a l'invitatoire que pour les laudes
					sessionStorage.setItem (prefixe+'antienne_inv', 'sanctoral/'+commun+'/'+prefixe+'antienne_inv.html');
				}
				sessionStorage.setItem (prefixe+'hymne', 'sanctoral/'+commun+'/'+prefixe+'hymne.html');
				sessionStorage.setItem (prefixe+'capitule',  'sanctoral/'+commun+'/'+prefixe+'capitule.html');
				sessionStorage.setItem (prefixe+'repons', 'sanctoral/'+commun+'/'+prefixe+'repons.html');
				sessionStorage.setItem (prefixe+'antienne_ev', 'sanctoral/'+commun+'/'+prefixe+'antienne_ev.html');
				sessionStorage.setItem (prefixe+'intercession', 'sanctoral/'+commun+'/'+prefixe+'intercession.html');
				Termine_office(office, true);
			}

		});
	}

} // fin de la fonction Affiche_option()

function Charge_tout (office) {
	// charge toutes les informations à partir des données présentes
	// dans les variables de session
	var prefixe = Prefixe_office(office);
	var labels_communs = ['titre_principal', 'titre_secondaire'];

	var labels_office = Labels_office(office);

	// les valeurs communes en premier
	for (var i=0; i < labels_communs.length; i++) {
		Charge_label_txt(prefixe + labels_communs[i]);
		if (office === 'vepres') {
			Charge_label_txt('v_premieres_vepres');
		}
	}
	// puis les valeurs de l'office
	for (var i=0; i < labels_office.length; i++) {
		if (labels_office[i] === 'hymne') {
			Charge_hymne(prefixe);
		} else {
			Charge_label(prefixe + labels_office[i]);
		}
	}
} // fin de la fonction Charge_tout()

function Termine_office (office, affiche_sanctoral) {
	// cette fonction permet de gérer le remplissage du formulaire des offices
	// elle gère surtout le chargement asynchrone des fichiers 'temporal'
	// (utilisés notamment pour les féries de l'Avent ou de Noël)
	// puis du sanctoral

	prefixe = Prefixe_office(office);

	// on charge le fichier temporal s'il y en a un...
	if (sessionStorage.getItem(prefixe+'temporal').length > 0) {
		$('#'+prefixe+'temporal').load(sessionStorage.getItem(prefixe+'temporal'), function() {Charge_tout(office);} );

		// puis, on superpose le sanctoral si nécessaire
		if (affiche_sanctoral) {
			$('#'+prefixe+'sanctoral').load(sessionStorage.getItem(prefixe+'sanctoral'), function() {Charge_tout(office);} );
		}

		// s'il n'y a pas de temporal, il suffit de charger le sanctoral
	} else if (affiche_sanctoral) {
		$('#'+prefixe+'sanctoral').load(sessionStorage.getItem(prefixe+'sanctoral'), function() {Charge_tout(office);} );

		// enfin, on charge simplement le formulaire s'il n'y a ni temporal, ni sanctoral
	} else {
		Charge_tout(office);
	}

} // fin de la fonction Termine()

function Formulaire_lectures (temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral) {
	var semaine_p = Semaine_psautier(semaine);
	// permet de garder la valeur initiale de semaine quand on effectura la modification semaine = semaine_p
	var semaine0 = semaine;
	var psaumes = Psaumes ('lectures', temps, semaine, jour, semaine_p);

	var affiche_sanctoral = false;
	if (preseance_sanctoral < preseance) {
		affiche_sanctoral = true;
	}

	// on commence par les deux lectures et l'oraison qui sont propres à la semaine	même en TO
	sessionStorage.l_lecture = 'lectures/lectures/lecture_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.l_patristique = 'lectures/patristiques/patristique_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.l_oraison = 'lectures/oraisons/oraison_'+temps+'_'+semaine+'_'+jour+'.html';

	if (temps==3) { // pour le TO, on utilise la semaine du psautier pour les autres valeurs
		semaine=semaine_p;
	}
	sessionStorage.l_hymne = 'lectures/hymnes/hymne_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.l_verset = 'lectures/versets/verset_'+temps+'_'+semaine+'_'+jour+'.html';

	// en Carême à partir de la deuxième semaine, la lecture patristique du dimanche dépend de l'année (A, B ou C)
	if ((temps==4) && (jour==0) && (semaine>2) && (semaine<6)) {
		sessionStorage.l_patristique = 'lectures/patristiques/patristique_'+temps+'_'+semaine+'_'+jour+annee+'.html';
	}
	// spécificité du Temps pascal, sauf Octave, Ascension et Pentecôte
	if (temps==5 && semaine >1 && !(semaine==2 && jour==0) && !(semaine==6 && jour==4) && !(semaine == 8)) {
		sessionStorage.l_verset = 'lectures/versets/verset_5_'+jour+'.html'; // on a le	même verset pour chaque semaine
	}

	for (var i=1; i <= 3; i++) { // on ajoute les psaumes et leur antienne
		sessionStorage.setItem('l_antienne_'+i, 'lectures/antiennes/antienne_'+temps+'_'+semaine+'_'+jour+'_'+i+'.html');
		sessionStorage.setItem('l_psaume_'+i, psaumes[i-1]);
	}

	// temps spécifique : cas particuliers
	if (temps==1) { // gestion des Féries de l'Avent
		if (mois==12 && jour_du_mois > 16) { // semaine avant Noël
			if (jour==0) {
				sessionStorage.l_lecture = 'sanctoral/12/F'+jour_du_mois+'-l_lecture.html';
				sessionStorage.l_patristique = 'sanctoral/12/F'+jour_du_mois+'-l_patristique.html';
			} else {
				sessionStorage.l_temporal = 'sanctoral/12/F'+jour_du_mois+'-lectures.html';
			}
		}
	}

	if (temps==2) { // gestion du temps de Noël
		if (mois==12 && jour_du_mois > 28) { // on est dans l'octave
			// le cas de la Sainte Famille est traité comme pour les solennités mobiles (IC, ...)
			sessionStorage.l_temporal = 'sanctoral/12/N'+jour_du_mois+'-lectures.html';
		} else if (mois == 1 && Nb_jours(date_jour, Epiphanie(date_jour.getFullYear())) > 0) { // jours avant l'Epiphanie
			sessionStorage.l_temporal = 'sanctoral/01/J'+jour_du_mois+'-lectures.html';
		}
	} // fin de la gestion du temps de Noël

	if (temps==4 && semaine==6) { // gestion de la Semaine Sainte
		sessionStorage.l_temporal = 'sanctoral/careme/S'+jour+'-lectures.html';
	}

	if (temps==5) { // gestion du temps pascal
		if (semaine==1 || (semaine==2 && jour==0)) { // gestion de l'octave pascale
			var jour_b = jour;
			if (semaine==2) {
				jour_b = 7;
			}
			sessionStorage.l_temporal = 'sanctoral/paques/O'+jour_b+'-lectures.html';
		}
		if (semaine==6 && jour==4) { // Ascension
			sessionStorage.l_temporal = 'sanctoral/paques/A-lectures.html';
		}
		if (semaine==8 && jour==0) { // Pentecôte
			sessionStorage.l_temporal = 'sanctoral/paques/P-lectures.html';
		}
	}

	// gestion de la selection des hymnes pour les temps particuliers
	if (temps!=3) {
		var tempsh = temps;
		if (temps == 2 && semaine0 >1) { // on est après l'Epiphanie (2e semaine)
			tempsh = '2b';
		}
		if (temps == 4 && semaine0 >4) { // on est dans le temps de la Passion
			tempsh = '4b';
		}
		if (temps==5 && date_jour>Ascension(date_jour.getFullYear())) { // hymnes à l'ES après l'Ascension
			tempsh = '5a';
		}
		sessionStorage.l_hymne = 'select_'+tempsh;
	}

	// on gère maintenant l'affichage du Te Deum

	if (date_jour==0) { // on est dans le cas où l'on demande un office personnalisé
		var tedeum = false;
		if (jour ==0) {
			tedeum = true;
		}
	} else {

		// on a le Te Deum à partir des fêtes (preseance <9, car il y a aussi des 8.1)
		var tedeum = (Math.min(preseance,preseance_sanctoral) < 9);
		// pas de Te Deum les dimanches de Carême et le jour des défunts (2 nov. si ça n'est pas un dimanche)
		// ou pour le Mercredi des cendres ou la Semaine Sainte
		if ((temps == 4 && jour ==0) || (date_jour.getDate()==2 && date_jour.getMonth()==10 && jour>0)
			|| (temps ==4 && semaine == 0 && jour ==3) || (temps==4 && semaine==6)) {
			tedeum = false;
		}
		// Te Deum pendant l'octave de Noël
		if (temps == 2 && mois == 12 ) {
			tedeum = true ;
		}
	}

	if (tedeum) {
		sessionStorage.l_tedeum = 'lectures/tedeum.html';
	}

	return affiche_sanctoral;

} // fin de la fonction Formulaire_lectures

function Formulaire_laudes (temps, semaine, jour, annee, date_jour, mois, jour_du_mois,	preseance, preseance_sanctoral) {
	var semaine_p = Semaine_psautier(semaine);
	var semaine0 = semaine; // permet de garder la valeur de semaine quand semaine = semaine_p
	var psaumes = Psaumes ('laudes', temps, semaine, jour, semaine_p);

	var affiche_sanctoral = false;
	Init_option('laudes');

	// TODO : traiter le cas des mémoires facultatives (preseance 12)
	if (preseance_sanctoral < preseance && preseance_sanctoral<12) {
		affiche_sanctoral = true;
	}

	$('#la_psaume_inv94').load('psaumes/psaume94.html');
	$('#la_psaume_inv66').load('psaumes/psaume66.html');
	$('#la_psaume_inv99').load('psaumes/psaume99.html');
	$('#la_psaume_inv23').load('psaumes/psaume23.html');

	// on commence le temps ordinaire et ses spécificités (oraison et antienne du Benedictus propre à l'année
	if (temps==3) {
		if (jour==0) { // le dimanche, l'oraison est propre à la semaine et est commune à l'office des lectures
			sessionStorage.la_oraison = 'lectures/oraisons/oraison_'+temps+'_'+semaine+'_'+jour+'.html';
			// et on ajoute l'antienne du Benedictus propre à l'année
			if (!affiche_sanctoral) { // on n'affiche l'antienne propre que s'il n'y a pas une fête qui prime
				sessionStorage.la_antienne_ev2 = 'laudes/antiennes/antienne_'+temps+'_'+semaine+'_'+jour+'_ev'+annee+'.html';
			}
		} else {
			sessionStorage.la_oraison = 'laudes/oraisons/oraison_'+temps+'_'+semaine_p+'_'+jour+'.html';
		}
		// pour le reste, ça sera comme les autres temps, mais avec la semaine du psautier
		semaine = semaine_p;

	} else { // on renseigne maintenant l'oraison pour les autres temps
		sessionStorage.la_oraison = 'lectures/oraisons/oraison_'+temps+'_'+semaine+'_'+jour+'.html';
	}

	sessionStorage.la_antienne_inv = 'laudes/antiennes/antienne_'+temps+'_'+semaine+'_'+jour+'_inv.html';
	sessionStorage.la_hymne = 'laudes/hymnes/hymne_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.la_capitule = 'laudes/capitules/capitule_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.la_repons = 'laudes/repons/repons_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.la_antienne_ev = 'laudes/antiennes/antienne_'+temps+'_'+semaine+'_'+jour+'_ev.html';
	sessionStorage.la_titre_cantique_ev = 'cantiques/NT2_titre.html';
	sessionStorage.la_cantique_ev = 'cantiques/NT2.html';
	sessionStorage.la_intercession = 'laudes/intercessions/intercession_'+temps+'_'+semaine+'_'+jour+'.html';

	if (temps!=3) { // c'est le même invitatoire pour les temps spécifiques
		sessionStorage.la_antienne_inv = 'laudes/antiennes/antienne_'+temps+'_inv.html';
		if (temps==2 && date_jour>Epiphanie(date_jour.getFullYear())) { // Temps Noël, après l'Epiphanie
			sessionStorage.la_antienne_inv = 'laudes/antiennes/antienne_2b_inv.html';
		}
		if (temps==5 && date_jour>Ascension(date_jour.getFullYear())) { // Temps pascal, après l'Ascension
			sessionStorage.la_antienne_inv = 'laudes/antiennes/antienne_5b_inv.html';
		}
	}

	// spécificité du Temps pascal, sauf Octave, Ascension et Pentecôte
	if (temps==5 && semaine >1 && !(semaine==2 && jour==0) && !(semaine==6 && jour==4) && !(semaine == 8)) {
		sessionStorage.la_capitule = 'laudes/capitules/capitule_5_'+jour+'.html'; // on	a le même capitule pour chaque semaine du temps pascal
		sessionStorage.la_repons = 'laudes/repons/repons_5_'+jour+'.html'; // on a le même repons pour chaque semaine du temps pascal
	}

	// on renseigne maintenant les psaumes, le cantique AT et leurs antiennes
	var semaine_ant = semaine;
	// en temps de l'Avent, à partir du 17, on prend les antiennes de la 4e semaine
	if (temps==1 && semaine ==3 && jour_du_mois >16 && jour>0 && jour<6) {
		semaine_ant='3b';
	}
	for (var i=1; i <= 3; i++) { // on ajoute les psaumes et leur antienne
		if (i<3) { // les deux premières valeurs sont les psaumes
			sessionStorage.setItem('la_antienne_'+i, 'laudes/antiennes/antienne_'+temps+'_'+semaine_ant+'_'+jour+'_'+i+'.html');
			sessionStorage.setItem('la_psaume_'+i, psaumes[i-1]);
		} else {
			sessionStorage.setItem('la_antienne_cantique', 'laudes/antiennes/antienne_'+temps+'_'+semaine_ant+'_'+jour+'_ct.html');
			sessionStorage.setItem('la_cantique', psaumes[i-1]);
		}
	}

	if (temps==1) { // Féries de l'Avent
		if (mois==12 && jour_du_mois > 16) { // semaine avant Noël
			if (jour==0 && jour_du_mois <24) { // le dimanche, on ne prend au jour J que l'antienne	évangélique
				sessionStorage.la_antienne_ev = 'sanctoral/12/F'+jour_du_mois+'-la_antienne_ev.html';
			} else { // les autres jours, on charge le formulaire propre au jour J
				sessionStorage.la_temporal = 'sanctoral/12/F'+jour_du_mois+'-laudes.html';
			}
		}
	}

	if (temps==2) { // gestion du temps de Noël
		if (mois==12 && jour_du_mois > 28) { // on est dans l'octave
			// le cas de la Sainte Famille est traité comme pour les solennités mobiles (IC, ...)
			sessionStorage.la_temporal = 'sanctoral/12/N'+jour_du_mois+'-laudes.html';
		} else if (mois == 1 && Nb_jours(date_jour, Epiphanie(date_jour.getFullYear())) > 0) { // jours avant l'Epiphanie
			sessionStorage.la_temporal = 'sanctoral/01/J'+jour_du_mois+'-laudes.html';
		}
	} // fin de la gestion de l'octave de Noël


	if (temps==4 && semaine0==6) { // gestion de la Semaine Sainte
		sessionStorage.la_temporal = 'sanctoral/careme/S'+jour+'-laudes.html';
	}

	if (temps==5) { // gestion du temps pascal
		if (semaine==1 || (semaine==2 && jour==0)) { // gestion de l'octave pascale
			var jour_b = jour;
			if (semaine==2) {
				jour_b = 7;
			}
			sessionStorage.la_temporal = 'sanctoral/paques/O'+jour_b+'-laudes.html';
		}
		if (semaine==6 && jour==4) { // Ascension
			sessionStorage.la_temporal = 'sanctoral/paques/A-laudes.html';
		}
		if (semaine==8 && jour==0) { // Pentecôte
			sessionStorage.la_temporal = 'sanctoral/paques/P-laudes.html';
		}
	}

	if (temps!=3) { // gestion des hymnes des temps particuliers
		var tempsh = temps;
		if (temps == 2 && semaine0 >1) { // on est après l'Epiphanie (2e semaine)
			tempsh = '2b';
		}
		if (temps == 4 && semaine0 >4) { // on est dans le temps de la Passion
			tempsh = '4b';
		}
		if (temps==5 && date_jour>Ascension(date_jour.getFullYear())) { // hymnes à l'ES après l'Ascension
			tempsh = '5a';
		}
		sessionStorage.la_hymne = 'select_'+tempsh;
	}

	// On gère maintenant les options pour les mémoires obligatoires (TODO : mémoire facultative)
	if (preseance_sanctoral < preseance && preseance_sanctoral>9 && preseance_sanctoral <12 && affiche_sanctoral) {
		var communs = Sanctoral_defaut()[1][mois-1][jour_du_mois];
		// cas particulier du Cœur Immaculée de Marie et Marie, Mère de l'Eglise
		if (preseance_sanctoral == 9.9) {
			communs[0] = ['marie'];
		}
		if (communs[0][0].length > 0) {
			// on lance la fonction qui gère les options
			Affiche_option('laudes', communs);
		}
	}

	return affiche_sanctoral;

} // fin de la fonction Formulaire_laudes()

function Formulaire_milieu (temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral) {
	var semaine_p = Semaine_psautier(semaine);
	var semaine0 = semaine; // permet de garder la valeur de semaine quand semaine = semaine_p
	var psaumes = Psaumes ('milieu', temps, semaine, jour, semaine_p);

	var affiche_sanctoral = false;
	if (preseance_sanctoral < preseance) {
		affiche_sanctoral = true;
	}

	for (var j=1; j<4; j++) {  // on parcourt les 3 offices (tierce = 1 ; sexte = 2	; none = 3)

		// cas particulier de l'oraison du dimanche en temps ordinaire
		if (temps == 3) {
			if (jour == 0) {
				sessionStorage.setItem('m_oraison'+j, 'lectures/oraisons/oraison_'+temps+'_'+semaine0+'_'+jour+'.html');
			} else {
				sessionStorage.setItem('m_oraison'+j, 'milieu/oraisons/oraison'+j+'_'+temps+'_'+semaine_p+'_'+jour+'.html');
			}
			semaine = semaine_p; // pour les autres éléments, seule la semaine du psautier compte
		} else { // hors temps ordinaire, on prend l'oraison à l'office des lectures
			sessionStorage.setItem('m_oraison'+j, 'lectures/oraisons/oraison_'+temps+'_'+semaine+'_'+jour+'.html');
		}
		sessionStorage.setItem('m_hymne'+j, 'milieu/hymnes/hymne'+j+'_'+temps+'.html');
		sessionStorage.setItem('m_capitule'+j, 'milieu/capitules/capitule'+j+'_'+temps+'_'+semaine+'_'+jour+'.html');
		sessionStorage.setItem('m_repons'+j, 'milieu/repons/repons'+j+'_'+temps+'_'+semaine+'_'+jour+'.html');
	}

	// TODO : gérer les cas où l'on affiche les psaumes du graduel (psaumes différents selon l'heure)
	for (var i=1; i <= 3; i++) {
		sessionStorage.setItem('m_antienne_'+i, 'milieu/antiennes/antienne_'+temps+'_'+semaine+'_'+jour+'_'+i+'.html');
		sessionStorage.setItem('m_psaume_'+i, psaumes[i-1]);
	}

	// spécificité du Temps pascal, sauf Octave, Ascension et Pentecôte
	// le même répons chaque semaine
	if (temps==5 && semaine >1 && !(semaine==2 && jour==0) && !(semaine==6 && jour==4) && !(semaine == 8)) {
		for (var j=1; j<4; j++) {
			sessionStorage.setItem('m_repons'+j,'milieu/repons/repons'+j+'_5.html');
		}
	}

	if (temps==1) { // Féries de l'Avent
		if (mois==12 && jour_du_mois > 16) { // semaine avant Noël
			if (jour>0 || jour_du_mois == 24) { // même si c'est un dimanche, le 24, on prend la Férie
				sessionStorage.setItem('m_temporal', 'sanctoral/12/F'+jour_du_mois+'-milieu.html');
			}
		}
	}

	if (temps==2) { // gestion du temps de Noël
		if (mois==12 && jour_du_mois > 28) { // on est dans l'octave
			// le cas de la Sainte Famille est traité comme pour les solennités mobiles (IC, ...)
			sessionStorage.m_temporal = 'sanctoral/12/N'+jour_du_mois+'-milieu.html';
		} else if (mois == 1 && Nb_jours(date_jour, Epiphanie(date_jour.getFullYear())) > 0) { // jours avant l'Epiphanie
			sessionStorage.m_temporal = 'sanctoral/01/J'+jour_du_mois+'-milieu.html';
		}
	} // fin de la gestion de l'octave de Noël

	if (temps==4 && semaine0==6) { // gestion de la Semaine Sainte
		sessionStorage.m_temporal = 'sanctoral/careme/S'+jour+'-milieu.html';
	}

	if (temps==5) { // gestion du temps pascal
		if (semaine==1 || (semaine==2 && jour==0)) { // gestion de l'octave pascale
			var jour_b = jour;
			if (semaine==2) {
				jour_b = 7;
			}
			sessionStorage.m_temporal = 'sanctoral/paques/O'+jour_b+'-milieu.html';
		}
		if (semaine==6 && jour==4) { // Ascension
			sessionStorage.m_temporal = 'sanctoral/paques/A-milieu.html';
		}
		if (semaine==8 && jour==0) { // Pentecôte
			sessionStorage.m_temporal = 'sanctoral/paques/P-milieu.html';
		}
	}

	// on affiche l'hymne en fonction de l'horaire
	// avant 11h : Tierce ; de 11h à 13h : Sexte ; après 13h : None.
	var hours = new Date().getHours();
	var milieu_office = 2;
	if (hours < 11) {
		milieu_office = 1;
	}
	if (hours > 13) {
		milieu_office = 3;
	}
	$('#m_select_hymne').val(milieu_office).attr('selected', 'selected');
	$('#m_hymne').load(sessionStorage.getItem('m_hymne'+milieu_office));

	return affiche_sanctoral;

} // fin de la fonction Formulaire_milieu ()

function Formulaire_vepres (temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral) {
	var semaine_p = Semaine_psautier(semaine);
	var semaine0 = semaine; // permet de garder la valeur de semaine quand semaine = semaine_p
	var preseance_jour = Math.min (preseance, preseance_sanctoral);

	// on a besoin de la date de lendemain, pour les samedis et les veilles de solennités
	// et les fêtes du Seigneur quand elles tombent un dimanche (02/02 ; 06/08 et 14/09)
	var lendemain = new Date (date_jour);
	lendemain.setDate(lendemain.getDate()+1);
	var tps_lit2 = Temps_liturgique(lendemain);
	var annee2 = tps_lit2[0];
	var temps2 = tps_lit2[1];
	var semaine2 = tps_lit2[2];
	var jour2 = tps_lit2[3];
	var preseance2 = tps_lit2[4];
	var semaine_p2 = Semaine_psautier(semaine2);
	var preseance_sanctoral2 = Sanctoral(lendemain);
	var preseance_jour2 = Math.min (preseance2, preseance_sanctoral2);

	Init_option('vepres');

	// Début du traitement des premières vêpres (temporal et sanctoral)
	///////////////////////////////////////////////////////////////////

	// on détermine si ce sont les premières vêpres du lendemain
	// (ie, dans tous les cas, il faut que le lendemain prime sur le jour même
	// ensuite, soit on est samedi, soit le lendemain est une solennité)
	var premieres_vepres = false;
	if ((preseance_jour2 < preseance_jour) && (jour==6 || preseance_jour2 < 6)) {
		premieres_vepres = true;
	}

	// 2e cas : le samedi si une fête du Seigneur qui tombe un dimanche
	if ((preseance_jour2<preseance_jour) && (jour==6) && preseance_jour2==5) {
		premieres_vepres = true;
	}

	// Fête de la sainte Famille (quand c'est un dimanche
	// donc si nous sommes le samedi après Noël si ce n'est pas le 31 ou le lendemain de Noël
	if (mois==12 && jour_du_mois > 25 && jour_du_mois <31 && jour==6) {
		premieres_vepres = true;
	}

	// Exceptions (Mercredi des Cendres et la Semaine Sainte)
	if (Nb_jours(lendemain, Cendres(date_jour.getFullYear())) == 0
		|| (temps==4 && semaine0==6)) {
		premieres_vepres = false;
	}

	var affiche_sanctoral = false;
	var preseance_s = preseance_sanctoral;

	if (premieres_vepres) { // on sait déjà qu'il y a des premières vêpres
		// donc ce qui compte, c'est les préseances du lendemain
		if (preseance_sanctoral2 < preseance2) {
			affiche_sanctoral = true;
			preseance_s = preseance_sanctoral2;
		}
	} else if (preseance_sanctoral < preseance && preseance_sanctoral<12) {
		// il n'y a pas de première vêpres,
		// donc c'est le jour j qui compte
		// TODO : gérer les mémoires facultatives
		affiche_sanctoral = true;
	}


	if (premieres_vepres && affiche_sanctoral) {
		var fichier_sanctoral = Fichier_sanctoral (lendemain, 'vepres', preseance_s, true);
		sessionStorage.setItem ('v_sanctoral', fichier_sanctoral);
	}

	// le samedi (s'il y a des premières vêpres, excep. du Samedi Saint),
	// on est déjà le lendemain (liturgiquement)
	// le cas des solennités /fêtes du Seigneur du sanctoral est traité
	// par Fichier_sanctoral qui renvoie sur le fichier *vepres0.html
	if (jour==6 && premieres_vepres) {
		annee=annee2;
		temps=temps2;
		semaine=semaine2;
		semaine0=semaine2;
		semaine_p=semaine_p2;
	}

	// fin du traitement des premières vêpres (temporal et sanctoral)
	///////////////////////////////////////////////////////////////////


	var psaumes = Psaumes ('vepres', temps, semaine, jour, semaine_p);

	// on commence le temps ordinaire et ses spécificités (oraison et antienne du Benedictus propre à l'année
	if (temps==3) {
		if (jour==0 || jour==6) { // le dimanche ou le samedi soir, l'oraison est propre à la semaine (on la prend aux lectures)
			sessionStorage.v_oraison = 'lectures/oraisons/oraison_'+temps+'_'+semaine+'_0.html';
			// et on ajoute l'antienne du Magnificat propre à l'année
			if (!affiche_sanctoral) { // on n'affiche l'antienne propre que s'il n'y a pas une fête qui prime
				sessionStorage.v_antienne_ev2 = 'laudes/antiennes/antienne_'+temps+'_'+semaine+'_0_ev'+annee+'.html';
			}
		} else {
			sessionStorage.v_oraison = 'vepres/oraisons/oraison_'+temps+'_'+semaine_p+'_'+jour+'.html';
		}
		// pour le reste, ça sera comme les autres temps, mais avec la semaine du psautier
		semaine = semaine_p;

	} else { // on renseigne maintenant l'oraison pour les autres temps
		if (jour==6) { // le samedi soir on prend l'oraison du dimanche aux lectures
			sessionStorage.v_oraison = 'lectures/oraisons/oraison_'+temps+'_'+semaine+'_0.html';
			if (temps==5 && semaine==1) { // samedi de l'octave de Pâques (on doit avancer d'une semaine)
				sessionStorage.v_oraison = 'lectures/oraisons/oraison_'+temps+'_'+(semaine+1)+'_0.html';
			}
		} else {
			sessionStorage.v_oraison = 'lectures/oraisons/oraison_'+temps+'_'+semaine+'_'+jour+'.html';
		}
	}

	sessionStorage.v_hymne = 'vepres/hymnes/hymne_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.v_capitule = 'vepres/capitules/capitule_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.v_repons = 'vepres/repons/repons_'+temps+'_'+semaine+'_'+jour+'.html';
	sessionStorage.v_antienne_ev = 'vepres/antiennes/antienne_'+temps+'_'+semaine+'_'+jour+'_ev.html';
	sessionStorage.v_titre_cantique_ev = 'cantiques/NT1_titre.html';
	sessionStorage.v_cantique_ev = 'cantiques/NT1.html';
	sessionStorage.v_intercession = 'vepres/intercessions/intercession_'+temps+'_'+semaine+'_'+jour+'.html';

	if (premieres_vepres) { // on écrase les valeurs des titres quand on se trouve dans les premières vêpres
		sessionStorage.setItem('v_titre_principal', '<h1>'+Date_du_jour(date_jour)+'</h1>');
		sessionStorage.setItem('v_titre_secondaire',Titre_secondaire(annee, temps, semaine0, semaine_p, date_jour));
		sessionStorage.setItem('v_premieres_vepres', '<p class="rouge"><i>Premières vêpres</i></p>');
	} else {
		sessionStorage.setItem('v_premieres_vepres', '');
	}

	// spécificité du Temps pascal, sauf Octave, Ascension et Pentecôte
	// le même capitule, répons chaque semaine
	if (temps==5 && semaine >1 && !(semaine==2 && jour==0) && date_jour<Ascension(date_jour.getFullYear())) {
		sessionStorage.v_capitule = 'vepres/capitules/capitule_5_'+jour+'.html';
		sessionStorage.v_repons = 'vepres/repons/repons_5_'+jour+'.html';
	}

	// on renseigne maintenant les psaumes, le cantique NT et leurs antiennes
	var semaine_ant = semaine;
	// en temps de l'Avent, à partir du 17, on prend les antiennes de la 4e semaine
	if (temps==1 && semaine ==3 && jour_du_mois >16 && jour>0 && jour<6) {
		semaine_ant='3b';
	}
	for (var i=1; i <= 3; i++) {
		if (i==3) {
			sessionStorage.v_antienne_cantique = 'vepres/antiennes/antienne_'+temps+'_'+semaine_ant+'_'+jour+'_ct.html';
			sessionStorage.v_cantique = psaumes[i-1];
		} else {
			sessionStorage.setItem('v_antienne_'+i, 'vepres/antiennes/antienne_'+temps+'_'+semaine_ant+'_'+jour+'_'+i+'.html');
			sessionStorage.setItem('v_psaume_'+i, psaumes[i-1]);
		}
	}


	// Gestion des temps spécifiques :
	// Octave de Noël / férie de l'Avent / Semaine Sainte ...
	/////////////////////////////////////////////////////////

	if (temps==1) { // Férie de l'Avent
		if (mois==12 && jour_du_mois > 16) { // semaine avant Noël
			if (jour==0 || jour==6) {
				sessionStorage.v_antienne_ev = 'sanctoral/12/F'+jour_du_mois+'-v_antienne_ev.html';
			} else {
				sessionStorage.v_temporal = 'sanctoral/12/F'+jour_du_mois+'-vepres.html';
			}
		}
	}

	if (temps==2) { // gestion du temps de Noël
		if (mois==12 && jour_du_mois > 28) { // on est dans l'octave
			// le cas de la Sainte Famille est traité comme pour les solennités mobiles (IC, ...)
			sessionStorage.v_temporal = 'sanctoral/12/N'+jour_du_mois+'-vepres.html';
		} else if (mois == 1 && Nb_jours(date_jour, Epiphanie(date_jour.getFullYear())) > 0) { // jours avant l'Epiphanie
			sessionStorage.v_temporal = 'sanctoral/01/J'+jour_du_mois+'-vepres.html';
		}
	} // fin de la gestion de l'octave de Noël

	if (temps==4 && semaine0==6) { // gestion de la Semaine Sainte
		sessionStorage.v_temporal = 'sanctoral/careme/S'+jour+'-vepres.html';
		if (premieres_vepres) {
			sessionStorage.v_temporal = 'sanctoral/careme/S0-vepres0.html';
		}
	}

	if (temps==5) { // gestion du temps pascal
		if (semaine==1 || (semaine==2 && jour==0)) { // gestion de l'octave pascale
			var jour_b = jour;
			if (semaine==2) {
				jour_b = 7;
			}
			sessionStorage.v_temporal = 'sanctoral/paques/O'+jour_b+'-vepres.html';
		}
		if (semaine==6 && jour==3) { // Ascension (premières vêpres)
			sessionStorage.v_temporal = 'sanctoral/paques/A-vepres0.html';
		}
		if (semaine==6 && jour==4) { // Ascension
			sessionStorage.v_temporal = 'sanctoral/paques/A-vepres.html';
		}
		if (semaine==8 && jour==6) { // Pentecôte (premières vêpres)
			sessionStorage.v_temporal = 'sanctoral/paques/P-vepres0.html';
		}
		if (semaine==8 && jour==0) { // Pentecôte
			sessionStorage.v_temporal = 'sanctoral/paques/P-vepres.html';
		}
	}

	if (temps!=3) { // Sélection des hymnes pour les temps particuliers
		var tempsh = temps;
		if (temps == 2 && semaine0 >1) { // on est après l'Epiphanie (2e semaine)
			tempsh = '2b';
		}
		if (temps == 4 && semaine0 >4) { // on est dans le temps de la Passion
			tempsh = '4b';
		}
		if (temps==5 && date_jour>Ascension(date_jour.getFullYear())) { // hymnes à l'ES après l'Ascension
			tempsh = '5b';
		}
		sessionStorage.v_hymne = 'select_'+tempsh;
	}

	// On gère maintenant les options pour les mémoires obligatoires (TODO : mémoire facultative)
	// on n'affiche rien s'il n'y a pas le sanctoral ou si ce sont des premières vêpres
	if (preseance_sanctoral < preseance && preseance_sanctoral>9 && preseance_sanctoral <12
		&& affiche_sanctoral && !premieres_vepres) {
		var communs = Sanctoral_defaut()[1][mois-1][jour_du_mois];
		// cas particulier du Cœur Immaculée de Marie et Marie, Mère de l'Eglise
		if (preseance_sanctoral == 9.9) {
			communs[0] = ['marie'];
		}
		if (communs[0][0].length > 0) {
			// on lance la fonction qui gère les options
			Affiche_option('vepres', communs);
		}
	}

	return affiche_sanctoral;

} // fin de la fonction Formulaire_vepres()

function Formulaire_complies (temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral) {
	var preseance_jour = Math.min (preseance, preseance_sanctoral);

	// on a besoin des infos du lendemain, pour déterminer si on est une veille de solennités
	var lendemain = new Date (date_jour);
	lendemain.setDate(lendemain.getDate()+1);
	var tps_lit2 = Temps_liturgique(lendemain);
	var annee2 = tps_lit2[0];
	var temps2 = tps_lit2[1];
	var semaine2 = tps_lit2[2];
	var jour2 = tps_lit2[3];
	var preseance2 = tps_lit2[4];
	var semaine_p2 = Semaine_psautier(semaine2);
	var preseance_sanctoral2 = Sanctoral(lendemain);
	var preseance_jour2 = Math.min (preseance2, preseance_sanctoral2);
	var jour0 = jour; // permet de conserver l'information du jour de la semaine

	Init_option('complies');
	sessionStorage.c_titre_principal = '<h1>'+Date_du_jour(date_jour)+'</h1>';
	document.title=Date_du_jour(date_jour)+' - Office des Complies';

	// les jours de solennité qui ne tombe pas un dimanche, on prend les complies
	// du dimanche mais avec le formulaire des solennités (jour = 8)
	// sauf pour le jour de défunt et Mercredi des Cendres
	// et la Semaine Sainte, mais oui pendant le Triduum
	if (preseance_jour <= 4 && (mois!=11 || jour_du_mois!=2) && (Nb_jours(date_jour,
		Cendres(date_jour.getFullYear()))!=0) && !(temps==4 && semaine==6 && jour0<4)) {
		if (jour >0) {
			jour = 8;
		}
	}
	// si le lendemain est une solennité et si le lendemain est plus important que le	jour j, on prend les complies
	// du samedi mais avec le formulaire de la veille des solennités (jour = 7)
	if (preseance_jour2 <=4 && preseance_jour2<preseance_jour && (Nb_jours(date_jour,
		Cendres(date_jour.getFullYear()))!=1) && !(temps==4 && semaine==6)) {
		// sauf pour les Cendres (pas de problème pour les défunts, la Toussaint prime
		// et la Semaine Sainte
		if (jour<6) {
			jour = 7;
		}
	}

	// on gère les cas des samedis et veille d'une solennité
	// (on est déjà le lendemain en ce qui concerne le temps liturgique)
	if (jour==6 || jour==7) { // on est samedi ou la veille d'une solennité
		temps = temps2;
		sessionStorage.setItem('c_titre_secondaire',Titre_secondaire(annee2, temps2, semaine2, semaine_p2, date_jour));
	}

	// Pendant l'octave de Noël et de Pâques, on prend l'office du samedi ou du dimanche
	if ((temps==2 && mois==12) || (temps==5 && semaine==1 && jour0>0)) {
		Affiche_option ('complies','');
		jour = $('#c_option option:selected').val();
		// on prend le formulaire des solennités de semaine
		// sauf si c'est un dimanche (resp. un samedi) et que l'on a choisi dimanche (resp. samedi)
		if (jour0==0 && jour==8) {
			jour=0;
		}
		if (jour0==6 && jour==7) {
			jour=6;
		}
	}

	sessionStorage.c_hymne = 'complies/hymne_'+jour+'.html';
	sessionStorage.c_capitule = 'complies/capitule_'+jour+'.html';
	sessionStorage.c_repons = 'complies/repons_'+jour+'.html';
	sessionStorage.c_titre_cantique_ev = 'cantiques/NT3_titre.html';
	sessionStorage.c_antienne_ev = 'complies/antienne_ev.html';
	sessionStorage.c_cantique_ev = 'cantiques/NT3.html';
	sessionStorage.c_oraison = 'complies/oraison_'+jour+'.html';
	sessionStorage.c_benediction = 'complies/benediction_'+jour+'.html';

	// pendant le temps pascal, les répons sont modifiés, ainsi
	// que l'antienne du cantique de Siméon
	if (temps==5) {
		sessionStorage.c_repons = 'complies/repons_'+jour+'_tp.html';
		sessionStorage.c_antienne_ev = 'complies/antienne_ev_tp.html';
	}

	// on réinitialise le deuxième psaume et son antienne :
	sessionStorage.c_psaume_2 = 0;

	// Gestion de l'antienne du Nunc dimitis
	// en dehors du temps ordinaire : les samedis et dimanches,
	// on remplace le "sauve-nous" par un antienne propre au temps.
	if ((temps!=3) && ((jour==0) || (jour>=6))) {
		sessionStorage.c_antienne_ev = 'complies/antienne_ev_'+temps+'.html';
	}

	// Pendant le Triduum pascal, le répons est modifié
	if (temps==4 && semaine==6) {
		if (jour0==4) { // Jeudi Saint
			sessionStorage.c_repons = 'complies/repons_JS.html';
		}
		if (jour0==5) { // Vendredi Saint
			sessionStorage.c_repons = 'complies/repons_VS.html';
		}
		if (jour0==6) { // Samedi Saint
			sessionStorage.c_repons = 'complies/repons_SS.html';
		}
	}

	// pendant tout l'octave de Pâques, on utilise un répons propre
	if (temps==5 && (semaine==1 || (semaine==2 && jour==0))) {
		sessionStorage.c_repons = 'complies/repons_octave_'+jour0+'.html';
	}

	var psaumes = [['90'], ['85'], ['142'], ['30-I','129'], ['15'], ['87'], ['4','133'], ['4','133'], ['90']];

	// on réinitialise le 2e psaume et son antienne
	sessionStorage.setItem('c_antienne_2', '');
	sessionStorage.setItem('c_psaume_2', '');

	for (var i=1; i <= psaumes[jour].length; i++) {
		sessionStorage.setItem('c_antienne_'+i, 'complies/antienne_'+temps+'_'+jour+'_'+i+'.html');
		sessionStorage.setItem('c_psaume_'+i, psaumes[jour][i-1]);
	}

	// on charge la liste des antiennes mariales
	// (les options du <select>)
	var marie = 'complies/marie.html';
	// pendant le temps pascal, on a le Regina Coeli uniquement
	if (temps>3) {
		marie = 'complies/marie_'+temps+'.html'
	}
	$('#c_select_marie').load(marie, function() {
		var antienne_mariale=$('#c_select_marie option:selected').val();
		$('#c_marie').load('complies/'+antienne_mariale+'.html');
	});

} // fin de la fonction Formulaire_complies()

function Remplir_office(office) {
	// Cette fonction remplit le template de l'office spécifié en paramètre
	// la date de l'office est prise à partir de la variable de session date_c
	// les options sont également prises dans les variables de session / locales

	var date_jour = Date_choisie();
	var repeter_antiennes = (localStorage.getItem("repeter_antiennes") === 'true');
	// temps = temps liturgique : 1-avent, 2-noel, 3-to, 4-careme, 5-paques
	// jour = 0-dimanche ... 6-samedi
	// annee = année liturgique, donc 'A' ou 'B' ou 'C'
	// Paramètres
	var prefixe = Prefixe_office (office);
	var labels_office = Labels_office(office);
	var tps_lit = Temps_liturgique(date_jour);
	var annee = tps_lit[0];
	var temps = tps_lit[1];
	var semaine = tps_lit[2];
	var jour = tps_lit[3];

	var year=date_jour.getFullYear();
	var mois=date_jour.getMonth()+1;
	var jour_du_mois=date_jour.getDate();
	var preseance = tps_lit[4];
	var preseance_sanctoral = Sanctoral(date_jour);

	var semaine_p = Semaine_psautier(semaine);

	var affiche_sanctoral = false;

	Init_formulaire (office);

	sessionStorage.setItem(prefixe + 'titre_principal', '<h1>'+Date_du_jour(date_jour)+'</h1>');
	sessionStorage.setItem(prefixe + 'titre_secondaire',Titre_secondaire(annee, temps, semaine, semaine_p, date_jour));
	document.title=Date_du_jour(date_jour)+' - '+office;

	// On insère l'introduction de l'office
	//(spécifique en Carême, car pas d'alléluia ou pour les laudes)
	sessionStorage.setItem (prefixe + 'introduction', 'hymnes/introduction.html');
	if (temps == 4) {
		sessionStorage.setItem (prefixe + 'introduction', 'hymnes/introduction_careme.html');
	}
	if (office === 'laudes') {
		sessionStorage.setItem (prefixe + 'introduction', 'hymnes/introduction_laudes.html');
	}


	// on calcule le nom du fichier pour le sanctoral, le chargement ou non de ce fichier
	// est géré à l'aide des fonctions formulaires
	var fichier_sanctoral = Fichier_sanctoral (date_jour, office , preseance_sanctoral,	false);
	sessionStorage.setItem (prefixe + 'sanctoral', fichier_sanctoral);

	switch(office) {
		case 'lectures':
			affiche_sanctoral = Formulaire_lectures(temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral);
			Termine_office('lectures', affiche_sanctoral);
			break;
		case 'laudes':
			affiche_sanctoral = Formulaire_laudes(temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral);
			Termine_office('laudes', affiche_sanctoral);
			break;
		case 'milieu':
			affiche_sanctoral = Formulaire_milieu(temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral);
			Termine_office('milieu', affiche_sanctoral);
			break;
		case 'vepres':
			affiche_sanctoral = Formulaire_vepres(temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral);
			Termine_office('vepres', affiche_sanctoral);
			break;
		case 'complies':
			Formulaire_complies(temps, semaine, jour, annee, date_jour, mois, jour_du_mois, preseance, preseance_sanctoral);
			Charge_tout('complies');
			break;
	}

} // fin de la fonction Remplir_office()

function Efface_commun () {

	var labels_commun = ['introduction', 'antienne_inv', 'hymne',
		'titre_psaume_1', 'antienne_1', 'psaume_1', 'antienne_1b',
		'titre_psaume_2', 'antienne_2', 'psaume_2', 'antienne_2b',
		'titre_psaume_3', 'antienne_3', 'psaume_3', 'antienne_3b', 'verset',
		'lecture_1_titre', 'lecture_2_titre', 'lecture_3_titre',
		'lecture_1', 'repons_1', 'lecture_2', 'repons_2', 'lecture_3', 'repons_3',
		'titre_cantique_ev', 'antienne_ev', 'cantique_ev', 'antienne_evb',
		'intercession', 'tedeum', 'oraison'];
	for (var i=0; i < labels_commun.length; i++) {
		$('#'+labels_commun[i]).html('');
	}


} // fin de la fonction Efface_commun()

function Affiche_commun () {

	var commun = $('#select-commun option:selected').val();
	var office = $('#select-office option:selected').val();
	localStorage.setItem('commun',commun);
	Efface_commun();

	$(titre_commun).load('sanctoral/communs/titre_'+commun+'.html');

	// gestion de la sélection l'invitatoire pour les laudes
	// on affiche le psaume 94 par défaut
	if (office === 'laudes') {
		$('#select_inv').val(94).attr('selected', 'selected');
		$('#psaume_inv').load('psaumes/psaume94.html');
		$('#select_inv').bind('change', function (event) {
			var psaume=$('#select_inv option:selected').val();
			$('#psaume_inv').load('psaumes/psaume'+psaume+'.html');
		});
	}

	$(titre_commun_office).load('sanctoral/communs/'+office+'.html');

} // fin de la fonction Affiche_commun

function Affiche_psaume () {

	var categorie = $('#select-categorie option:selected').val();
	var psaume_choisi = $("#nombre").val();
	if (categorie === 'PS') {
		Charge_fichier('#ps_titre_principal', 'psaumes/psaume'+psaume_choisi+'_titre.html');
		Charge_fichier('#ps_psaume', 'psaumes/psaume'+psaume_choisi+'.html');
	} else {
		Charge_fichier('#ps_titre_principal', 'cantiques/'+categorie+psaume_choisi+'_titre.html');
		Charge_fichier('#ps_psaume', 'cantiques/'+categorie+psaume_choisi+'.html');
	}

} // fin de la fonction Affiche_psaume

function Psaume_et_cantique() {
	// Fonction qui s'exécute à la fin du chargement de la page
	// permettant d'afficher un psaume ou un cantique
	// affiche le psaume 1 au chargement de la page

	var slider = document.getElementById('ps_slider');
	var input = document.getElementById('nombre');

	noUiSlider.create(slider, {
		start: 1,
		range: {'min':1, 'max':150},
		step: 1,
		connect: 'upper',
	});

	Affiche_psaume ();

	$('#select-categorie').bind('change', function (event) {
		var categorie = $('#select-categorie option:selected').val();
		if (categorie === 'PS') {
			slider.noUiSlider.updateOptions({range: {'min': 1, 'max': 150}});
		}
		if (categorie === 'AT') {
			slider.noUiSlider.updateOptions({range: {'min': 1, 'max': 44}});
		}
		if (categorie === 'NT') {
			slider.noUiSlider.updateOptions({range: {'min': 1, 'max': 12}});
		}
		Affiche_psaume();
	});

	slider.noUiSlider.on('update', function(value) {
		value = Math.round(value);
		$('#nombre').val(value);
	});
	slider.noUiSlider.on('change', function(value) {
		Affiche_psaume();
	});
	$('#nombre').on('change', function(){
		slider.noUiSlider.set(this.value);
		Affiche_psaume();
	});


} // fin de la fonction Psaume_et_cantique()


function Communs() {
	// Fonction qui s'exécute à la fin du chargement de la page
	// lance l'affiche des communs à chaque modification de la sélection

	$('#select-commun').bind('change', function (event) {
		Affiche_commun ();
	});

	$('#select-office').bind('change', function (event) {
		Affiche_commun ();
	});

	Affiche_commun ();

} // fin de la fonction Communs()


function Initialisation_parametres() {
	// le nom de la fonction est explicite

	if (localStorage.getItem("taille_texte") === null) {
		localStorage.setItem('taille_texte',"110%");
	}
	if (localStorage.getItem("ouverture") === null) {
		localStorage.setItem('ouverture',"office");
	}
	if (localStorage.getItem("repeter_antiennes") === null) {
		localStorage.setItem('repeter_antiennes',true);
	}
	if (localStorage.getItem("onglets") === null) {
		localStorage.setItem('onglets',true);
	}
	if (localStorage.getItem("mode_nuit") === null) {
		localStorage.setItem('mode_nuit',false);
	}
	// nécessaire pour assurer la transition depuis les anciennes versions
	// où les valeurs pour les repeter... étaient '0' ou '1'
	if (localStorage.getItem('repeter_antiennes') === '1') {
		localStorage.setItem('repeter_antiennes',true);
	} 
	if (localStorage.getItem('repeter_antiennes') === '0') {
		localStorage.setItem('repeter_antiennes',false);
	} 
	liste_propres = Liste_propres_nationaux();
	for (var i=0; i < liste_propres.length; i++) {
		if (localStorage.getItem(liste_propres[i]) === null) {
			localStorage.setItem(liste_propres[i],false);
		}
		// nécessaire pour assurer la transition depuis les anciennes versions
		// où les valeurs pour les propres étaient '0' ou '1'
		if (localStorage.getItem(liste_propres[i]) === '1') {
			localStorage.setItem(liste_propres[i],true);
		} 
		if (localStorage.getItem(liste_propres[i]) === '0') {
			localStorage.setItem(liste_propres[i],false);
		}
	}
	if (localStorage.getItem("diocese") === null) {
		localStorage.setItem('diocese',"");
	}
	var taille_texte = localStorage.getItem("taille_texte");
	$("body").css('font-size', taille_texte);
	//repeter_antiennes=(localStorage.getItem("repeter_antiennes") === 'true');
	//diocese=localStorage.getItem("diocese");
	//mode_nuit=(localStorage.getItem("mode_nuit") === 'true');

	Mode_nuit();

} // fin de la fonction Initialisation_parametres()

function Validation_parametres() {

	var taille_texte = localStorage.getItem('taille_texte');
	$('#taille-txt').val(taille_texte).attr('selected', 'selected');
	$('#taille-txt').bind('change', function (event) { 
		taille_texte=$('#taille-txt option:selected').val();
		localStorage.setItem('taille_texte', taille_texte);
		$("body").css('font-size', taille_texte);
	});

	var ouverture = localStorage.getItem('ouverture');
	$('#ouverture').val(ouverture).attr('selected', 'selected');
	$('#ouverture').bind('change', function (event) { 
		ouverture=$('#ouverture option:selected').val();
		localStorage.setItem('ouverture', ouverture);
	});

	var repeter_antiennes = localStorage.getItem('repeter_antiennes') === 'true';
	$('#repeter-ant').attr('checked', repeter_antiennes); 
	$('#repeter-ant').bind('change', function (event) {
		localStorage.setItem('repeter_antiennes', document.getElementById('repeter-ant').checked);
	});

	var onglets = localStorage.getItem('onglets') === 'true';
	$('#onglets').attr('checked', onglets); 
	$('#onglets').bind('change', function (event) {
		localStorage.setItem('onglets', document.getElementById('onglets').checked);
	});

	var mode_nuit = localStorage.getItem('mode_nuit') === 'true';
	$('#mode_nuit').attr('checked', mode_nuit); 
	$('#mode_nuit').bind('change', function (event) {
		localStorage.setItem('mode_nuit', document.getElementById('mode_nuit').checked);
		Mode_nuit();
	});

	liste_propres = Liste_propres_nationaux();
	for (var i=0; i < liste_propres.length; i++) {
		propre=liste_propres[i];
		var propre_val=(localStorage.getItem(liste_propres[i]) === "true");
		$('#'+propre).attr('checked', propre_val);
		$('#'+propre).bind('change', {value : propre}, function (event) { 
			propre=event.data.value;
			propre_val=document.getElementById(propre).checked;
			localStorage.setItem(propre, propre_val);
		});
	}

	var diocese = localStorage.getItem('diocese')
	$('#diocese').val(diocese).attr('selected', 'selected');
	$('#diocese').bind('change', function (event) { 
		diocese=$('#diocese option:selected').val();
		localStorage.setItem('diocese', diocese);
	});

} // fin de la fonction Validation_parametres()
