//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------
let indent = 0;
let baseLine = 0;

const processorDef = {
  preprocess: function(text, filename) {
    text = text || '';
    baseLine = 0;
    indent = 0;
    baseLine = text.slice(text.indexOf('<script>')).split('\n').length;
    const match = text.match(/<script>((.|\n)*)<\/script>/m);
    if (match && match.length > 0) {
      const indentMatch = match[1].match(/(^(\s)*)/);
      if (indentMatch && indentMatch.length > 0) {
        indent = indentMatch[1].replace('\n', '').length;
      }
      const cntScript = match[1].replace(
        new RegExp(`\n {${indent}}`, 'gi'),
        '\n'
      );
      return [cntScript];
    }
    return [''];
  },
  postprocess: function(messages, filename) {
    if (messages.length > 0) {
      return messages[0].map(item => {
        return Object.assign({}, item, {
          line: baseLine && item.line ? 3 + baseLine + item.line : item.line,
          column: indent && item.column ? indent + item.column : item.column,
          endColumn:
            indent && item.endColumn ? indent + item.endColumn : item.endColumn,
          endLine:
            baseLine && item.endLine
              ? 3 + baseLine + item.endLine
              : item.endLine
        });
      });
    }
    return [];
  }
};

// import processors
module.exports.processors = {
  '.mix': processorDef,
  '.ux': processorDef
};
