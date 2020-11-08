Diafimisi = {};

$(document).ready(function() {
	Diafimisi.kimeno1DOM = $('#kimeno1');
	Diafimisi.kimeno2DOM = $('#kimeno2');
	Diafimisi.kimeno3DOM = $('#kimeno3');
	Diafimisi.kimeno4DOM = $('#kimeno4');
	Diafimisi.display1();
});

Diafimisi.display1 = function() {
	Diafimisi.kimeno4DOM.finish().fadeOut(200);
	Diafimisi.kimeno1DOM.finish().fadeIn();
	setTimeout(Diafimisi.display2, 3000);
};

Diafimisi.display2 = function() {
	Diafimisi.kimeno1DOM.finish().fadeOut(40);
	Diafimisi.kimeno2DOM.finish().css({
		top: '24px',
		left: 0,
		opacity: 1,
	}).fadeIn(600).animate({
		top: '6px',
		fontSize: '30px',
	}, 1600);
	setTimeout(Diafimisi.display3, 1600);
};

Diafimisi.display3 = function() {
	Diafimisi.kimeno3DOM.finish().css({
		left: 0,
		opacity: 1,
		color: '',
	}).fadeIn().animate({
		color: 'rgb(235, 255, 154)',
	}, 2000);
	setTimeout(Diafimisi.display4, 4000);
};

Diafimisi.display4 = function() {
	Diafimisi.kimeno2DOM.finish().animate({
		left: '-=400px',
		opacity: 0,
	});
	Diafimisi.kimeno3DOM.finish().animate({
		left: '+=400px',
		opacity: 0,
	});
	Diafimisi.kimeno4DOM.finish().css({
		color: '',
	}).fadeIn().animate({
		color: 'rgb(235, 255, 154)',
	}, 2000);
	setTimeout(Diafimisi.display1, 12000);
};
