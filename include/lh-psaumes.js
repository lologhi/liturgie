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


function Psaumes (office, temps, semaine, jour, semaine_p) {

	// Cette fonction retourne un tableau avec les psaumes du temporal
	// pour l'office, le temps, la semaine et le jour spécifiés en paramètres
	// temps = temps liturgique : 1-avent, 2-noel, 3-to, 4-careme, 5-paques
	// semaine = semaine du psautier donc [1-4]
	// jour = 0-dimanche ... 6-samedi

	// initialisation de la variable psaumes
	var psaumes = new Array(4);
	for (var i=0; i <= 3; i++) {
		psaumes[i]= new Array (7);
	}
	if (office === 'lectures') {
		// 1ère ligne = semaine ; 2e = jour ; numéro des trois psaumes
		psaumes[0][0] = ['1', '2', '3'];
		psaumes[0][1] = ['6', '9A-I', '9A-II'];
		psaumes[0][2] = ['9B-I', '9B-II', '11'];
		psaumes[0][3] = ['17-I', '17-II', '17-III'];
		psaumes[0][4] = ['17-IV', '17-V', '17-VI'];
		psaumes[0][5] = ['34-I', '34-II', '34-III'];
		psaumes[0][6] = ['130', '131-I', '131-II'];
		psaumes[1][0] = ['103-I', '103-II', '103-III'];
		psaumes[1][1] = ['30-I', '30-II', '30-III'];
		psaumes[1][2] = ['36-I', '36-II', '36-III'];
		psaumes[1][3] = ['38-I', '38-II', '51'];
		psaumes[1][4] = ['43-I', '43-II', '43-III'];
		psaumes[1][5] = ['37-I', '37-II', '37-III'];
		psaumes[1][6] = ['135-I', '135-II', '135-III'];
		psaumes[2][0] = ['144-I', '144-II', '144-III'];
		psaumes[2][1] = ['49-I', '49-II', '49-III'];
		psaumes[2][2] = ['67-I', '67-II', '67-III'];
		psaumes[2][3] = ['88-I', '88-II', '88-III'];
		psaumes[2][4] = ['88-IV', '88-V', '89'];
		psaumes[2][5] = ['68-I', '68-II', '68-III'];
		psaumes[2][6] = ['106-I', '106-II', '106-III'];
		psaumes[3][0] = ['23', '65-I', '65-II'];
		psaumes[3][1] = ['72-I', '72-II', '72-III'];
		psaumes[3][2] = ['101-I', '101-II', '101-III'];
		psaumes[3][3] = ['102-I', '102-II', '102-III'];
		psaumes[3][4] = ['43-I', '43-II', '43-III'];
		psaumes[3][5] = ['54-I', '54-II', '54-III'];
		psaumes[3][6] = ['49-I', '49-II', '49-III'];

		if (temps!=3) {	// en dehors du temps ordinaire, changement des psaumes...
			psaumes[3][5] = ['77-I', '77-II', '77-III']; // vendredi IV
			psaumes[0][6] = ['104-I', '104-II', '104-III']; // samedi I
			psaumes[1][6] = ['105-I', '105-II', '105-III']; // samedi II
			psaumes[3][6] = ['77-IV', '77-V', '77-VI']; // samedi IV

		}

		if (temps==5 && (semaine==1 || (semaine==2 && jour==0))) {	// cas particulier de l'octave de Pâques
			psaumes[0][0] = ['0', '0', '0'];
			psaumes[0][1] = ['1', '2', '3'];
			psaumes[0][2] = ['23', '65-I', '65-II'];
			psaumes[0][3] = ['103-I', '103-II', '103-III'];
			psaumes[0][4] = ['117-I', '117-II', '117-III'];
			psaumes[0][5] = ['135-I', '135-II', '135-III'];
			psaumes[0][6] = ['144-I', '144-II', '144-III'];
			psaumes[1][0] = ['1', '2', '3'];
		}

	} // fin des psaumes pour l'office des lectures


	if (office === 'laudes') {

		// 1ère ligne = semaine ; 2e = jour ; numéro du Ps1, puis du Ps2, puis du cantique AT
		psaumes[0][0] = ['62', '149', '41'];
		psaumes[0][1] = ['5', '28', '4'];
		psaumes[0][2] = ['23', '32', '5'];
		psaumes[0][3] = ['35', '46', '7'];
		psaumes[0][4] = ['56', '47', '36'];
		psaumes[0][5] = ['50', '99', '27'];
		psaumes[0][6] = ['118-19', '116', '1'];
		psaumes[1][0] = ['117', '150', '40'];
		psaumes[1][1] = ['41', '18A', '15'];
		psaumes[1][2] = ['42', '64', '23'];
		psaumes[1][3] = ['76', '96', '3'];
		psaumes[1][4] = ['79', '80', '19'];
		psaumes[1][5] = ['50', '147', '43'];
		psaumes[1][6] = ['91', '8', '2'];
		psaumes[2][0] = ['92', '148', '41'];
		psaumes[2][1] = ['83', '95', '17'];
		psaumes[2][2] = ['84', '66', '20'];
		psaumes[2][3] = ['85', '97', '22'];
		psaumes[2][4] = ['86', '98', '25'];
		psaumes[2][5] = ['50', '99', '34'];
		psaumes[2][6] = ['118-19', '116', '10'];
		psaumes[3][0] = ['117', '150', '40'];
		psaumes[3][1] = ['89', '134-I', '26'];
		psaumes[3][2] = ['100', '143a', '39'];
		psaumes[3][3] = ['107', '145', '30'];
		psaumes[3][4] = ['142', '146', '32'];
		psaumes[3][5] = ['50', '147', '6'];
		psaumes[3][6] = ['91', '8', '38'];

		if (temps==5 && (semaine==1 || (semaine==2 && jour==0))) {	// cas particulier de l'octave de Pâques
			for (var j=1; j<=6; j++) {
				psaumes[0][j] = ['62', '149', '41'];
			}
				psaumes[1][0] = ['62', '149', '41'];
		}

	} // fin des psaumes pour l'office des laudes


	if (office === 'milieu') {

		// 1ère ligne = semaine ; 2e = jour ; numéro des trois psaumes
		psaumes[0][0] = ['117-I', '117-II', '117-III'];
		psaumes[0][1] = ['18B', '7-I', '7-II'];
		psaumes[0][2] = ['118-1', '12', '13'];
		psaumes[0][3] = ['118-2', '16-I', '16-II'];
		psaumes[0][4] = ['118-3', '24-I', '24-II'];
		psaumes[0][5] = ['118-4', '25', '27'];
		psaumes[0][6] = ['118-5', '33-I', '33-II'];
		psaumes[1][0] = ['22', '75-I', '75-II'];
		psaumes[1][1] = ['118-6', '39-I', '39-II'];
		psaumes[1][2] = ['118-7', '52', '53'];
		psaumes[1][3] = ['118-8', '54-I-II', '54-III'];
		psaumes[1][4] = ['118-9', '55', '56'];
		psaumes[1][5] = ['118-10', '58', '59'];
		psaumes[1][6] = ['118-11', '60', '63'];
		psaumes[2][0] = ['117-I', '117-II', '117-III'];
		psaumes[2][1] = ['118-12', '70-I', '70-II'];
		psaumes[2][2] = ['118-13', '73-I', '73-II'];
		psaumes[2][3] = ['118-14', '69', '74'];
		psaumes[2][4] = ['118-15', '78', '79'];
		psaumes[2][5] = ['21-I', '21-II', '21-III'];
		psaumes[2][6] = ['118-16', '33-I', '33-II'];
		psaumes[3][0] = ['22', '75-I', '75-II'];
		psaumes[3][1] = ['118-17', '81', '119'];
		psaumes[3][2] = ['118-18', '87-I', '87-II'];
		psaumes[3][3] = ['118-19', '93-I', '93-II'];
		psaumes[3][4] = ['118-20', '127', '128'];
		psaumes[3][5] = ['118-21', '132', '139'];
		psaumes[3][6] = ['118-22', '44-I', '44-II'];

		if (temps==5 && (semaine==1 || (semaine==2 && jour==0))) {	// cas particulier de l'octave de Pâques
			psaumes[0][1] = ['8', '18A', '18B'];
			psaumes[0][2] = ['118-1', '15', '22'];
			psaumes[0][3] = ['118-2', '27', '115'];
			psaumes[0][4] = ['118-3', '29-I', '29-II'];
			psaumes[0][5] = ['118-4', '75-I', '75-II'];
			psaumes[0][6] = ['118-5', '95-I', '95-II'];
			psaumes[1][0] = ['117-I', '117-II', '117-III'];
		}

	} // fin des psaumes pour l'office du milieu du jour


	if (office === 'vepres') {

		// 1ère ligne = semaine ; 2e = jour ; numéro du Ps1, puis du Ps2, puis du cantique NT
		// attention psaumes[0][6] désigne les premières vêpres du dimanche I ([0][0])
		psaumes[0][0] = ['109', '113A', '12'];
		psaumes[0][1] = ['10', '14', '4'];
		psaumes[0][2] = ['19', '20', '9'];
		psaumes[0][3] = ['26-I', '26-II', '6'];
		psaumes[0][4] = ['29', '31', '10'];
		psaumes[0][5] = ['40', '45', '11'];
		psaumes[0][6] = ['140', '141', '5'];
		psaumes[1][0] = ['109', '113B', '12'];
		psaumes[1][1] = ['44-I', '44-II', '4'];
		psaumes[1][2] = ['48-I', '48-II', '9'];
		psaumes[1][3] = ['61', '66', '6'];
		psaumes[1][4] = ['71-I', '71-II', '10'];
		psaumes[1][5] = ['114', '120', '11'];
		psaumes[1][6] = ['118-14', '15', '5'];
		psaumes[2][0] = ['109', '110', '12'];
		psaumes[2][1] = ['122', '123', '4'];
		psaumes[2][2] = ['124', '130', '9'];
		psaumes[2][3] = ['125', '126', '6'];
		psaumes[2][4] = ['131-I', '131-II', '10'];
		psaumes[2][5] = ['134-I', '134-II', '11'];
		psaumes[2][6] = ['112', '115', '5'];
		psaumes[3][0] = ['109', '111', '12'];
		psaumes[3][1] = ['135-1', '135-2', '4'];
		psaumes[3][2] = ['136', '137', '9'];
		psaumes[3][3] = ['138-I', '138-II', '6'];
		psaumes[3][4] = ['143-I', '143-II', '10'];
		psaumes[3][5] = ['144-I', '144-IIa', '11'];
		psaumes[3][6] = ['121', '129', '5'];
		if (temps==4) { // en carême, le cantique du dimanche est le NT8
			psaumes[0][0][2]='8';
			psaumes[1][0][2]='8';
			psaumes[2][0][2]='8';
			psaumes[3][0][2]='8';
		}

		if (temps==5 && (semaine==1 || (semaine==2 && jour==0))) {	// cas particulier de l'octave de Pâques
			for (var j=1; j<=6; j++) {
				psaumes[0][j] = ['109', '113A', '12'];
			}
				psaumes[1][0] = ['109', '113A', '12'];
		}

	} // fin des psaumes pour les vêpres

	return psaumes[semaine_p-1][jour];

} // fin de la fonction Psaumes()
