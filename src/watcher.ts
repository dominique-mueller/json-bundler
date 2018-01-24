import * as chokidar from 'chokidar';

import { JSONBundler } from './json-bundler';

export function watch() {

	console.log( 'RUN ...' );
	const jsonBundler: JSONBundler = new JSONBundler();
	jsonBundler.bundle( './test/two-level-merge-references/src/input.json', './dist/result.json' );
	console.log( 'Done.' );

	const watcher: any = chokidar.watch( jsonBundler.paths );
	watcher.on( 'change', ( path ) => {
		console.log( 'CHANGE' );
		jsonBundler.bundle( './test/two-level-merge-references/src/input.json', './dist/result.json' );
	} );
	watcher.on( 'unlink', ( path ) => {
		console.log( 'DELETE' );
		jsonBundler.bundle( './test/two-level-merge-references/src/input.json', './dist/result.json' );
	} );
	// TODO: More watcher, e.g. delete dir - does it matter?

	// TODO: Add / remove files to be watched
	// TODO: Caching of the original files?

}

watch();
