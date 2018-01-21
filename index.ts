export * from './src/json-bundler';

import { JSONBundler } from './src/json-bundler';

new JSONBundler().bundle( './test/entry.json5', './dist/result.json' );
new JSONBundler().bundle( './test/entry.json5', './dist/result.min.json', true );
