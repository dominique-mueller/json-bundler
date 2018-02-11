#!/usr/bin/env node

'use strict';

const path = require( 'path' );

const chalk = require( 'chalk' );
const chokidar = require( 'chokidar' );
const log = require( 'log-update' );
const yargs = require( 'yargs' );

const JSONBundler = require( '../index.js' ).JSONBundler;

const arrowSymbol = process.platform === 'win32' ? '→' : '➜';

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

	console.log( '' );
	console.log( chalk.white.bold.underline( 'JSON Bundler' ) );
	console.log( '' );

	const startTime = new Date().getTime();

	console.log( chalk.white.bold( '  Entry File' ) );
	console.log( chalk.gray( `    ${ arrowSymbol } ${ cliParameters.entryFile.replace( /\\/g, '/' ) }` ) );
	console.log( '' );
	const jsonBundler = new JSONBundler();
	jsonBundler.bundle( cliParameters.entryFile, cliParameters.outFile, cliParameters.minified );

	const relativePaths = jsonBundler.paths.map( ( jsonPath ) => {
		return path.relative( process.cwd(), jsonPath ).replace( /\\/g, '/' );
	} );
	relativePaths.shift(); // Ignore entry file

	console.log( chalk.white.bold( '  Referenced files' ) );
	relativePaths.forEach( ( jsonPath ) => {
		console.log( chalk.gray( `    ${ arrowSymbol } ${ jsonPath }` ) );
	} );
	console.log( '' );

	console.log( chalk.white.bold( '  Output File' ) );
	console.log( chalk.gray( `    ${ arrowSymbol } ${ cliParameters.outFile.replace( /\\/g, '/' ) }` ) );

	const finishTime = new Date().getTime();
	const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

	console.log( '' );
	console.log( chalk.green.bold( `Success! [${ processTime } seconds]` ) );
	console.log( '' );

	// Run in watch mode
	if ( cliParameters.watch ) {

		// Watch files
		console.log( '' );
		console.log( chalk.white.bold.underline( 'JSON Bundler (WATCH MODE)' ) );
		console.log( '' );
		let watchedFiles = jsonBundler.paths;
		const watcher = chokidar.watch( watchedFiles, {
			awaitWriteFinish: {
				stabilityThreshold: 250 // Prevent reading the file too early
			}
		} );

		// Handle file changes
		watcher.on( 'change', ( changedPath ) => {

			log( ` > File "${ path.basename( changedPath ) }" changed, bundling ...` );
			jsonBundler.bundle( cliParameters.entryFile, cliParameters.outFile );
			log( ` > File "${ path.basename( changedPath ) }" changed, bundling ...`, 'done!' );
			log.done();
			const newPaths = jsonBundler.paths;

			const added = newPaths.filter( currentPath => !watchedFiles.includes( currentPath ) );
			if ( added.length > 0 ) {
				watcher.add( added );
			}

			const removed = watchedFiles.filter( currentPath => !newPaths.includes( currentPath ) );
			if ( removed.length > 0 ) {
				watcher.unwatch( removed );
			}

			watchedFiles = newPaths;

		} );

	}

} catch ( error ) {

	console.error( error );
	process.exit( 1 );

}
