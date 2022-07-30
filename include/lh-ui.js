function ShowModal(prefixe) {
	var modal = document.getElementById(prefixe+'modal');
	modal.show();
}

function HideModal(prefixe) {
	var modal = document.getElementById(prefixe+'modal');
	modal.hide();
}

function Initialisation_evenements(office) {
  // Cette fonction gère les événements suivants :
  // - affichage du calendrier / mise à jour de la date choisie dans la barre de menu
  // - sélection de l'invitatoire les laudes
  // - sélection de l'heure pour le milieu du jour (tierce / sexte / none)
  // - sélection de l'antienne mariale pour les complies
  // office : lectures, laudes ...

  var prefixe = Prefixe_office(office);

  var $input = $('#'+prefixe+'calendrier').pickadate({
    onOpen: function() {
      ShowModal(prefixe);
    },
    onClose: function() {
      HideModal(prefixe);
    }
  });
  var picker = $input.pickadate('picker');
  $('#'+prefixe+'date').click(function(event) {
    if (picker.get('open')) {
      picker.close();
    } else {
      picker.open();
    }
    event.stopPropagation();
  });

  ons.getScriptPage().onInit = function() {
    picker.set('select', Date_choisie());
  };

  // gestion des changements de date
  $('#'+prefixe+'calendrier').on('change', function() {
    $('#'+prefixe+'date').html(this.value);
    var date_form = (picker.get('select', 'yyyy/mm/dd'));
    sessionStorage.setItem('date_c', date_form);
    Remplir_office(office);
  });

if (office === 'lectures') {
    $('#l_switch_latin').bind('change', function (event) {
      if (document.getElementById('l_switch_latin').checked) {
        $('#l_tedeum').load('lectures/tedeum_la.html');
      } else {
        $('#l_tedeum').load('lectures/tedeum.html');
      }
    });
  }

  if (office === 'laudes') {
    // gestion de la sélection l'invitatoire pour les laudes
    // on affiche le psaume 94 par défaut
    $('#la_select_inv').val(94).attr('selected', 'selected');
    $('#la_psaume_inv').load('psaumes/psaume94.html');
		Select_dynamique('#la_select_inv', '#la_psaume_inv', 'psaumes/psaume', '.html');
  }

  if (office === 'milieu') {
    // gestion de la sélection l'hymne pour le milieu du jour
    $('#m_select_hymne').bind('change', function (event) {
      var office_milieu=$('#m_select_hymne option:selected').val();
      $('#m_hymne').load(sessionStorage.getItem('m_hymne'+office_milieu));
    });
  }

  if (office === 'complies') {
    // gestion de la sélection l'antienne mariale pour les complies
		Select_dynamique('#c_select_marie', '#c_marie', 'complies/', '.html');
  }
// gestion de l'affichage en latin des cantiques évangéliques
  // (laudes, vêpres et complies)
  var prefixe = Prefixe_office(office);
  var cantique = "cantiques/NT";
  switch(office) {
    case 'laudes':
      cantique = cantique +"2";
      break;
    case 'vepres':
      cantique = cantique +"1";
      break;
    case 'complies':
      cantique = cantique +"3";
      break;
  }
  $('#'+prefixe+'switch_latin').bind('change', function (event) { 
    if (document.getElementById(prefixe+'switch_latin').checked) {
      $('#'+prefixe+'cantique_ev').load(cantique+'_la.html');
    } else {
      $('#'+prefixe+'cantique_ev').load(cantique+'.html');
    }
  });

} // fin de la fonction Initialisation_evenements()

function Ouvre_menu () {
	var menu = document.getElementById('menu');
	menu.open();
}
function Ouvre_menu_g () {
	var menu = document.getElementById('menu-g');
	menu.open();
}
function Ferme_menu () {
	var menu = 	document.getElementById('menu');
	var menu_g = 	document.getElementById('menu-g');
	menu.close();
	menu_g.close();
}

function Charge_page (page) {
	var content = document.getElementById('content');
	var menu = document.getElementById('menu');
	var menu_g = document.getElementById('menu-g');

	menu_g.load('');
	// on modifie le menu en fonction du style de page
	// pour la liturgie des heures
	var page_lh = ['lectures', 'laudes', 'milieu', 'vepres', 'complies'];
	for (var i=0; i<page_lh.length; i++) {
		if (page === page_lh[i]+'.html') {
			menu_g.load('menu-lh.html');
		}
	}
	// pour les prières
	if (page.search('prieres/')>-1) {
			menu_g.load('menu-prieres.html');
	}

	// on modifie le nom de la page si l'utilisateur a choisi la présentation avec onglets
	var page_onglets = ['lectures', 'laudes', 'milieu', 'vepres', 'complies'];

	if (localStorage.getItem('onglets') === 'true') {
		for (var i=0; i<page_onglets.length; i++) {
			if (page === page_onglets[i]+'.html') {
				page = page.replace('.html', 't.html');
			}
		}
	}

	content.load(page)
		.then(Ferme_menu());
};


function Charge_page_auto () {
	// charge l'office en fonction de l'heure
	var hours = new Date().getHours();
	var office = "complies.html";
	if (hours < 21)
		office = "vepres.html";
	if (hours < 17)
		office = "milieu.html";
	if (hours < 9)
		office = "laudes.html";
	if (hours < 7)
		office = "lectures.html";

	Charge_page(office);

}

function Plein_ecran() {

	var toolbar = document.querySelector('ons-toolbar');
	if (toolbar.style.display === 'none') {
		toolbar.setVisibility(true);
		if (document.querySelector('ons-tabbar') != null) {
			document.querySelector('ons-tabbar').setTabbarVisibility(true);
		}
		$("#plein-ecran").attr('icon', 'md-fullscreen');
	} else {
		toolbar.setVisibility(false);
		if (document.querySelector('ons-tabbar') != null) {
			document.querySelector('ons-tabbar').setTabbarVisibility(false);
		}
		$("#plein-ecran").attr('icon', 'md-fullscreen-exit');
	}

} // fin de la fonction Plein_ecran()


function Cache_menu(id_page) {
	// cette fonction permet de cacher automatiquement la	barre de menu quand on 'scroll'

	if (localStorage.getItem('menu_mobile') === 'true') {
		document.addEventListener('init', function(e) {
			var scrollValue = 0;
			var page = e.target;

			page.querySelector('.page__content').addEventListener('scroll', function (e) {
				var delta = this.scrollTop - scrollValue;1;
				if (Math.abs(delta) > 8) {
					//console.log(delta, scrollValue);

					var cacher = delta > 0 && scrollValue > 36;
					document.querySelector('ons-toolbar').setVisibility(!cacher);
					if (document.querySelector('ons-tabbar') != null) {
						document.querySelector('ons-tabbar').setTabbarVisibility(!cacher);
					}
					//$('#tabbar').attr('hide-tabs', cacher);
					scrollValue = this.scrollTop;
				}
			});
		})
	}
} // fin de la fonction Cache_menu()

function Affiche_menu() {
	document.querySelector('ons-toolbar').setVisibility(true);
	if (document.querySelector('ons-tabbar') != null) {
		document.querySelector('ons-tabbar').setTabbarVisibility(true);
	}
}

function Mode_nuit() {
	// Cette fonction modifie les feuillets de style en fonction de
	// la valeur de mode_nuit (dans les parametres locaux)

	var mode_nuit=(localStorage.getItem("mode_nuit") === 'true');
	if (mode_nuit) {
		$("#css-onsen1").attr('href',"include/onsenui/onsen-css-components-night.min.css");
		$("#css-onsen2").attr('href',"include/onsenui/theme-night.css");
		$("#css-lh").attr('href',"include/lh-night.css");
	} else {
		$("#css-onsen1").attr('href',"include/onsenui/onsen-css-components.min.css");
		$("#css-onsen2").attr('href',"include/onsenui/theme.css");
		$("#css-lh").attr('href',"include/lh.css");
	}

} // fin de la fonction Mode_nuit()

function Change_mode_nuit() {
	// inverse la valeur de mode_nuit
	localStorage.setItem('mode_nuit', (localStorage.getItem('mode_nuit') === 'false'));
	Mode_nuit();
}

function Select_dynamique (id_select, id_destination, prefixe, suffixe) {
	// Fonction qui permet de gérer les différents <select> qui engendre
	// des modifications dans les pages
	// deux paramètres : l'id du <select>, l'id à modifier, le préfixe et le suffixe
	// à ajouter à la valeur du select pour avoir le chemin complet du fichier à charger
	// elle crée l'événement qui effectue la modification la div en cas de changement

	$(id_select).bind('change', function (event) {
		var valeur = $(id_select+' option:selected').val();
		$(id_destination).load(prefixe+valeur+suffixe);
	});

} // fin de la fonction Select_dynamique_ev()

function Select_dynamique_init(id_select, select_content, id_destination, prefixe, suffixe) {
	// Fonction qui alimente le contenu d'un select dynamique
	// et crée l'événement qui effectura sa modification dynamique
	// 5 paramètres :  l'id du <select>, le fichier où l'on trouve son contenu,
	// l'id à modifier, le préfixe et le suffixe (à ajouter pour trouver le fichier).
	$(id_select).load(select_content, function() {
		var fichier = prefixe+$(id_select+' option:selected').val()+suffixe;
		$(id_destination).load(fichier);
	});
	$(id_select).bind('change', function (event) {
		var fichier = prefixe+$(id_select+' option:selected').val()+suffixe;
		$(id_destination).load(fichier);
	});
} // fin de la fonction Select_dynamique_init()
