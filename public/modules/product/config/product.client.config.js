'use strict';

angular.module('product').run(['Menus',
	function(Menus) {
	  // Set top bar menu items
	  Menus.addMenuItem('topbar', 'Avatar', 'product/avatar');
	}
]);
