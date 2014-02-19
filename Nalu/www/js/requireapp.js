// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "js",
    "paths": {
      "app": "../libraries",
      "nalusApp": "app"
    }
});

// Load the main app module to start the app
//requirejs(["nalus"]);
require(["nalus"], function($) {	//level 2 dependencies
	require(["nalusApp","specials"], function($) {
		Nalu.App.init();
	});
});

