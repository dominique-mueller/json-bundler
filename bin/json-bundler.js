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

	// Run in watch mode
	if ( cliParameters.watch ) {

		console.log( '' );
		console.log( chalk.white.bold.underline( 'JSON Bundler' ) );
		console.log( '' );

		// Initial run
		console.log( `  ${ arrowSymbol } Create bundle`, chalk.gray( `(${ cliParameters.entryFile })` ) );
		const jsonBundler = new JSONBundler();
		jsonBundler.bundle( cliParameters.entryFile, cliParameters.outFile );
		console.log( `  ${ arrowSymbol } Write bundle`, chalk.gray( `(${ cliParameters.outFile })` ) );

		// Watch files
		console.log( `  ${ arrowSymbol } Watching for changes ...` );
		let watchedFiles = jsonBundler.paths;
		const watcher = chokidar.watch( watchedFiles, {
			awaitWriteFinish: {
				stabilityThreshold: 250 // Prevent reading the file too early
			}
		} );

		// Handle file changes
		watcher.on( 'change', ( changedPath ) => {

			log( `   > File "${ path.basename( changedPath ) }" changed, bundling ...` );
			jsonBundler.bundle( cliParameters.entryFile, cliParameters.outFile );
			log( `   > File "${ path.basename( changedPath ) }" changed, bundling ...`, 'done!' );
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

	// Run once
	} else {

		const startTime = new Date().getTime();

		console.log( '' );
		console.log( chalk.white.bold.underline( 'JSON Bundler' ) );
		console.log( '' );

		console.log( `  ${ arrowSymbol } Create bundle`, chalk.gray( `(${ cliParameters.entryFile })` ) );
		new JSONBundler().bundle( cliParameters.entryFile, cliParameters.outFile, cliParameters.minified );
		console.log( `  ${ arrowSymbol } Write bundle`, chalk.gray( `(${ cliParameters.outFile })` ) );

		const finishTime = new Date().getTime();
		const processTime = ( ( finishTime - startTime ) / 1000 ).toFixed( 2 );

		console.log( '' );
		console.log( chalk.green.bold( `Success! [${ processTime } seconds]` ) );
		console.log( '' );

		process.exit( 0 );

	}

} catch ( error ) {

	console.error( error );
	process.exit( 1 );

}
