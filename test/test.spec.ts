import * as fs from 'fs';
import * as path from 'path';

import { JSONBundler } from './../src/json-bundler';

/**
 * Test Suite
 */
describe( 'JSON bundler', () => {

    it( 'should instantiate', () => {

        const jsonBundler: JSONBundler = new JSONBundler();

        expect( jsonBundler ).toBeDefined();

    } );

    describe( '(no references)', () => {

        it( 'should bundle the JSON file', () => {
            test( 'no-references', 'json', false, [], [] );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'no-references', 'json5', false, [], [] );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'no-references', 'json', true, [], [] );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'no-references', 'json5', true, [], [] );
        } );

    } );

    describe( '(one-level references)', () => {

        const paths: Array<string> = [
            './shared/copyright'
        ];

        it( 'should bundle the JSON file', () => {
            test( 'one-level-references', 'json', false, paths, [] );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'one-level-references', 'json5', false, paths, [] );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'one-level-references', 'json', true, paths, [] );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'one-level-references', 'json5', true, paths, [] );
        } );

    } );

    describe( '(one-level references and merging)', () => {

        const paths: Array<string> = [
            './shared/copyright'
        ];

        it( 'should bundle the JSON file', () => {
            test( 'one-level-merge-references', 'json', false, paths, [] );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'one-level-merge-references', 'json5', false, paths, [] );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'one-level-merge-references', 'json', true, paths, [] );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'one-level-merge-references', 'json5', true, paths, [] );
        } );

    } );

    describe( '(two-level references)', () => {

        const paths: Array<string> = [
            './shared/footer',
            './shared/copyright'
        ];

        it( 'should bundle the JSON file', () => {
            test( 'two-level-references', 'json', false, paths, [] );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'two-level-references', 'json5', false, paths, [] );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'two-level-references', 'json', true, paths, [] );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'two-level-references', 'json5', true, paths, [] );
        } );

    } );

    describe( '(two-level references and merging)', () => {

        const paths: Array<string> = [
            './shared/footer',
            './shared/copyright'
        ];

        it( 'should bundle the JSON file', () => {
            test( 'two-level-merge-references', 'json', false, paths, [] );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'two-level-merge-references', 'json5', false, paths, [] );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'two-level-merge-references', 'json', true, paths, [] );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'two-level-merge-references', 'json5', true, paths, [] );
        } );

    } );

    describe( '(node_modules references)', () => {

        const externalPaths: Array<string> = [
            './json-bundler-test/copyright'
        ];

        it( 'should bundle the JSON file', () => {
            test( 'node-module-references', 'json', false, [], externalPaths );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'node-module-references', 'json5', false, [], externalPaths );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'node-module-references', 'json', true, [], externalPaths );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'node-module-references', 'json5', true, [], externalPaths );
        } );

    } );

    describe( '(errors)', () => {

        it( 'should throw an error if a referenced file is not JSON / JSON5', () => {

            let error: any = null;
            try {
                new JSONBundler().bundle( './test/errors/src/input-invalid-file-type.json', './test/errors/dist/output.json' );
            } catch ( jsonBundlerError ) {
                error = jsonBundlerError;
            }

            expect( error ).not.toBeNull();
            expect( error.message.split( '\n' )[ 0 ] ).toBe( `The file "${ path.resolve( './test/errors/src/does-not-exist.txt' ) }" is not of type JSON / JSON5.` );
            expect( error.message.split( '\n' )[ 1 ] ).toBe( `Details: File is referenced in "${ path.resolve( './test/errors/src/input-invalid-file-type.json' ) }".` );

        } );

        it( 'should throw an error if a referenced file does not exist', () => {

            let error: any = null;
            try {
                new JSONBundler().bundle( './test/errors/src/input-reference-does-not-exist.json', './test/errors/dist/output.json' );
            } catch ( jsonBundlerError ) {
                error = jsonBundlerError;
            }

            expect( error ).not.toBeNull();
            expect( error.message.split( '\n' )[ 0 ] ).toContain( `An error occured while reading the file "${ path.resolve( './test/errors/src/does-not-exist.json' ) }".` );
            expect( error.message.split( '\n' )[ 1 ] ).toBe( `Details: File is referenced in "${ path.resolve( './test/errors/src/input-reference-does-not-exist.json' ) }".` );

        } );

        it( 'should throw an error if a referenced file is invalid JSON', () => {

            let error: any = null;
            try {
                new JSONBundler().bundle( './test/errors/src/input-invalid-syntax.json', './test/errors/dist/output.json' );
            } catch ( jsonBundlerError ) {
                error = jsonBundlerError;
            }

            expect( error ).not.toBeNull();
            expect( error.message.split( '\n' )[ 0 ] ).toContain( `An error occured while parsing the file "${ path.resolve( './test/errors/src/shared/invalid.json' ) }" as JSON.` );
            expect( error.message.split( '\n' )[ 1 ] ).toBe( `Details: File is referenced in "${ path.resolve( './test/errors/src/input-invalid-syntax.json' ) }".` );

        } );

        it( 'should throw an error if a referenced file is invalid JSON5', () => {

            let error: any = null;
            try {
                new JSONBundler().bundle( './test/errors/src/input-invalid-syntax.json5', './test/errors/dist/output.json' );
            } catch ( jsonBundlerError ) {
                error = jsonBundlerError;
            }

            expect( error ).not.toBeNull();
            expect( error.message.split( '\n' )[ 0 ] ).toContain( `An error occured while parsing the file "${ path.resolve( './test/errors/src/shared/invalid.json5' ) }" as JSON5.` );
            expect( error.message.split( '\n' )[ 1 ] ).toBe( `Details: File is referenced in "${ path.resolve( './test/errors/src/input-invalid-syntax.json5' ) }".` );

        } );

        it( 'should throw an error if writing the bundle fails', () => {

            let error: any = null;
            try {
                new JSONBundler().bundle( './test/no-references/src/input.json', 'X:/test/result.json' ); // Path does not exist (duh!)
            } catch ( jsonBundlerError ) {
                error = jsonBundlerError;
            }

            expect( error ).not.toBeNull();
            expect( error.message ).toContain( `An error occured while writing the file "${ path.resolve( 'X:/test/result.json' ) }".` );

        } );

    } );

} );

function test( folderName: string, jsonType: 'json' | 'json5', minified: boolean, paths: Array<string>, externalPaths: Array<string> ): void {

    const jsonBundler: JSONBundler = new JSONBundler();
    jsonBundler.bundle( `./test/${ folderName }/src/input.${ jsonType }`, `./test/${ folderName }/dist/output.json`, minified );

    const output: any = JSON.parse( fs.readFileSync( `./test/${ folderName }/dist/output.json`, 'utf-8' ) );
    const expectedOutput: any = JSON.parse( fs.readFileSync( `./test/${ folderName }/src/expected-output.json`, 'utf-8' ) );

    const expectedPaths: Array<string> = [ 'input', ...paths ]
        .map( ( filePath: string ): string => {
            return path.resolve( 'test', folderName, 'src', `${ filePath }.${ jsonType }` );
        } );
    const expectedExternalPaths: Array<string> = externalPaths
        .map( ( externalFilePath: string ): string => {
            return path.resolve( process.cwd(), 'node_modules', `${ externalFilePath }.${ jsonType }` );
        } );

    expect( output ).toEqual( expectedOutput );
    expect( jsonBundler.paths.sort() ).toEqual( [ ...expectedPaths, ...expectedExternalPaths ].sort() ); // Ignore order

}
