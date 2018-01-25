import * as path from 'path';

import * as chokidar from 'chokidar';

import { JSONBundler } from './json-bundler';

export function watch() {

	console.log( 'RUN ...' );
	const jsonBundler: JSONBundler = new JSONBundler();
	jsonBundler.bundle( './test/two-level-merge-references/src/input.json', './dist/result.json' );
	console.log( 'Done.' );

	// Watch files
	let watchedFiles: Array<string> = jsonBundler.paths;
	const watcher: any = chokidar.watch( watchedFiles );
	console.log( `Watching ${ watchedFiles.length } files now. Waiting for changes ...` );

	// React on file changes
	watcher.on( 'change', ( changedPath ) => {

		console.log( `-> File "${ path.basename( changedPath ) }" has changed. Building ...` );
		jsonBundler.bundle( './test/two-level-merge-references/src/input.json', './dist/result.json' );
		const newPaths: Array<string> = jsonBundler.paths;

		const added = newPaths.filter( currentPath => !watchedFiles.includes( currentPath ) );
		watcher.add( added );
		if ( added.length > 0 ) {
			console.log( `   Added ${ added.length } files to the watcher.` )
		}

		const removed = watchedFiles.filter( currentPath => !newPaths.includes( currentPath ) );
		watcher.unwatch( removed );
		if ( removed.length > 0 ) {
			console.log( `   Removed ${ removed.length } files from the watcher.` )
		}

		watchedFiles = newPaths;

	} );
	// watcher.on( 'unlink', ( path ) => {
	// 	console.log( 'DELETE' );
	// 	jsonBundler.bundle( './test/two-level-merge-references/src/input.json', './dist/result.json' );
	// } );
	// TODO: More watcher, e.g. delete dir - does it matter?

	// TODO: Add / remove files to be watched
	// TODO: Caching of the original files?

}

watch();
