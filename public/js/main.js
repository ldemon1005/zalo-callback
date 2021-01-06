requirejs.config({
    paths: {
        vendor: '../vendor',
		postmonger: 'vendor/postmonger'
    },
    shim: {
        //<editor-fold desc="hello">
        'vendor/jquery.min': {
            exports: '$'
        },
		'portalweb': {
			deps: ['vendor/jquery.min', 'vendor/postmonger']
		}
        //</editor-fold>
    }
});

requirejs( ['vendor/jquery.min', 'portalweb'], function( $, portalweb ) {
	//console.log( 'REQUIRE LOADED' );
});

requirejs.onError = function( err ) {
	//console.log( "REQUIRE ERROR: ", err );
	if( err.requireType === 'timeout' ) {
		console.log( 'modules: ' + err.requireModules );
	}

	throw err;
};
