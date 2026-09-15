import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCardInput, validateSvg } from '../../src/tools/duvido/application/card-validator.js';
test('validates required card text', () => { assert.equal(validateCardInput({ questionText: '', answerText: '', questionSvg: '', answerSvg: '' }).questionText, 'A pergunta é obrigatória.'); });
test('rejects executable SVG content', () => { assert.equal(validateSvg('<svg><script>alert(1)</script></svg>'), 'O SVG contém conteúdo não permitido.'); });
