import { describe, expect, test } from '@jest/globals';
import * as fs from 'fs';
import * as RESP from './resp';

describe('resp', () => {
  test('parse followed by stringify yields the original value', () => {
    const docsResp = fs.readFileSync(require.resolve('./docs.resp')).toString();
    const docs = RESP.parse(docsResp);
    expect(RESP.stringify(docs)).toEqual(docsResp);
  });
});
