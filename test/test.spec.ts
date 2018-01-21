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
            test( 'no-references', 'json', false );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'no-references', 'json5', false );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'no-references', 'json', true );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'no-references', 'json5', true );
        } );

    } );

    describe( '(one-level references)', () => {

        it( 'should bundle the JSON file', () => {
            test( 'one-level-references', 'json', false );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'one-level-references', 'json5', false );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'one-level-references', 'json', true );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'one-level-references', 'json5', true );
        } );

    } );

    describe( '(one-level references and merging)', () => {

        it( 'should bundle the JSON file', () => {
            test( 'one-level-merge-references', 'json', false );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'one-level-merge-references', 'json5', false );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'one-level-merge-references', 'json', true );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'one-level-merge-references', 'json5', true );
        } );

    } );

    describe( '(two-level references)', () => {

        it( 'should bundle the JSON file', () => {
            test( 'two-level-references', 'json', false );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'two-level-references', 'json5', false );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'two-level-references', 'json', true );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'two-level-references', 'json5', true );
        } );

    } );

    describe( '(two-level references and merging)', () => {

        it( 'should bundle the JSON file', () => {
            test( 'two-level-merge-references', 'json', false );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'two-level-merge-references', 'json5', false );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'two-level-merge-references', 'json', true );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'two-level-merge-references', 'json5', true );
        } );

    } );

    describe( '(node_modules references)', () => {

        it( 'should bundle the JSON file', () => {
            test( 'node-module-references', 'json', false );
        } );

        it( 'should bundle the JSON5 file', () => {
            test( 'node-module-references', 'json5', false );
        } );

        it( 'should bundle and minify the JSON file', () => {
            test( 'node-module-references', 'json', true );
        } );

        it( 'should bundle and minify the JSON5 file', () => {
            test( 'node-module-references', 'json5', true );
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

        it( 'should throw an error if TODO', () => {

            let error: any = null;
            try {
                new JSONBundler().bundle( './test/no-references/src/input.json', './test/no-references/dist/"output.json' ); // Invalid file name
            } catch ( jsonBundlerError ) {
                error = jsonBundlerError;
            }

            expect( error ).not.toBeNull();
            expect( error.message ).toContain( `An error occured while writing the file "${ path.resolve( './test/no-references/dist/"output.json' ) }".` );

        } );

    } );

} );

function test( folderName: string, jsonType: 'json' | 'json5', minified: boolean ): void {

    new JSONBundler().bundle( `./test/${ folderName }/src/input.${ jsonType }`, `./test/${ folderName }/dist/output.json`, minified );

    const output: any = JSON.parse( fs.readFileSync( `./test/${ folderName }/dist/output.json`, 'utf-8' ) );
    const expectedOutput: any = JSON.parse( fs.readFileSync( `./test/${ folderName }/src/expected-output.json`, 'utf-8' ) );

    expect( output ).toEqual( expectedOutput );

}
