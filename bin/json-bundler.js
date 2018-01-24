#!/usr/bin/env node

'use strict';

const JSONBundler = require( '../index.js' ).JSONBundler;
const yargs = require( 'yargs' );

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

	.alias( 'help', 'h' )
	.alias( 'version', 'v' )
	.strict( true )
	.argv;

// Run
try {
	new JSONBundler().bundle( cliParameters.entryFile, cliParameters.outFile, cliParameters.minified );
	process.exit( 0 );
} catch ( error ) {
	process.exit( 1 );
}
