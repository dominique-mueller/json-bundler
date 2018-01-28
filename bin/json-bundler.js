#!/usr/bin/env node

'use strict';

const path = require( 'path' );

const yargs = require( 'yargs' );
const chokidar = require( 'chokidar' );

const JSONBundler = require( '../index.js' ).JSONBundler;

/**
 * List of available CLI parameters:
 */
const cliParameters = yargs

	// Entry file path
	.option( 'entryFile', {
		alias: 'e',
		describe: 'Path to the entry JSON / JSON5 file',
		type: 'string',
		required: true
	} )

	// Out file path
	.option( 'outFile', {
		alias: 'o',
		describe: 'Path to the output JSON / JSON5 file',
		type: 'string',
		required: true
	} )

	// Minification flag
	.option( 'minified', {
		alias: 'm',
		describe: 'Minified output flag',
		type: 'boolean',
		boolean: true,
		default: false
	} )

	// Watch mode
	.option( 'watch', {
		alias: 'w',
		describe: 'Watch flag',
		type: 'boolean',
		boolean: true,
		default: false
	} )

	.alias( 'help', 'h' )
	.alias( 'version', 'v' )
	.strict( true )
	.argv;

// Run
try {

	// Run in watch mode
	if ( cliParameters.watch ) {

		// Initial run
		console.log( 'Bundling ...' );
		const jsonBundler = new JSONBundler();
		jsonBundler.bundle( cliParameters.entryFile, cliParameters.outFile );
		console.log( 'Done.' );

		// Watch files
		let watchedFiles = jsonBundler.paths;
		const watcher = chokidar.watch( watchedFiles );
		console.log( `Watching ${ watchedFiles.length } files now, waiting for changes.` );

		// Handle file changes
		watcher.on( 'change', ( changedPath ) => {

			console.log( `-> File "${ path.basename( changedPath ) }" has changed. Bundling ...` );
			jsonBundler.bundle( cliParameters.entryFile, cliParameters.outFile );
			const newPaths = jsonBundler.paths;
			console.log( 'Done.' )

			const added = newPaths.filter( currentPath => !watchedFiles.includes( currentPath ) );
			if ( added.length > 0 ) {
				watcher.add( added );
				console.log( `   Added ${ added.length } files to the watcher.` )
			}

			const removed = watchedFiles.filter( currentPath => !newPaths.includes( currentPath ) );
			if ( removed.length > 0 ) {
				watcher.unwatch( removed );
				console.log( `   Removed ${ removed.length } files from the watcher.` )
			}

			watchedFiles = newPaths;

		} );

	// Run once
	} else {

		console.log( 'Bundling ...' );
		new JSONBundler().bundle( cliParameters.entryFile, cliParameters.outFile, cliParameters.minified );
		process.exit( 0 );
		console.log( 'Done.' );

	}

} catch ( error ) {

	console.error( error );
	process.exit( 1 );

}
