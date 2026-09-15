const MAX_SVG_LENGTH = 100_000;

export function validateCardInput(input) {
  const errors = {};
  if (!input.questionText?.trim()) errors.questionText = 'A pergunta é obrigatória.';
  if (!input.answerText?.trim()) errors.answerText = 'A resposta é obrigatória.';
  const questionSvgError = validateSvg(input.questionSvg);
  const answerSvgError = validateSvg(input.answerSvg);
  if (questionSvgError) errors.questionSvg = questionSvgError;
  if (answerSvgError) errors.answerSvg = answerSvgError;
  return errors;
}

export function validateSvg(svg = '') {
  if (!svg.trim()) return null;
  if (svg.length > MAX_SVG_LENGTH) return 'O SVG excede 100 KB.';
  if (!/^\s*<svg\b[\s\S]*<\/svg>\s*$/i.test(svg)) return 'Informe um SVG completo e válido.';
  if (/<(?:script|foreignObject)\b|\son\w+\s*=|javascript\s*:/i.test(svg)) return 'O SVG contém conteúdo não permitido.';
  return null;
}
