/* eslint-disable prefer-template */
import escapeHtml from 'escape-html';

const REGEX_MULTILINE = /{{([\s\S]*?)}}/g;

enum TokenType {
  text,
  cmd,
}

interface Token {
  val: string;
  type: TokenType;
}

export type YingFunc = (arg: unknown) => string;

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
(global as any)._e = (html: string) => escapeHtml(html);

export default function compile(str: string): YingFunc {
  const regex = REGEX_MULTILINE;
  let match = regex.exec(str);
  let idx = 0;
  const tokens: Token[] = [];
  let text;
  while (match !== null) {
    if (match.index > idx) {
      text = str.substring(idx, match.index);
      tokens.push({ val: text, type: TokenType.text });
    }

    tokens.push({ val: match[1] ?? '', type: TokenType.cmd });
    idx = match.index + (match[0]?.length ?? 0);

    match = regex.exec(str);
  }
  if (str.length > idx) {
    text = str.substring(idx, str.length);
    tokens.push({ val: text, type: TokenType.text });
  }

  let funcBody = '"use strict";';
  funcBody += 'd=d||{};';

  funcBody += 'let res="";';
  tokens.forEach((token) => {
    if (token.type === TokenType.text) {
      funcBody += 'res+=' + JSON.stringify(token.val) + ';';
    } else {
      // type == TOKEN_TYPE_CMD
      const tokenHead = token.val[0];
      switch (tokenHead) {
        case '=':
          funcBody += 'res+=((' + token.val.substr(1).trim() + ')||"");';
          break;

        case '#':
          funcBody += 'res+= ((function(){' + token.val.substr(1).trim() + '})()||"");';
          break;

        case '~':
          funcBody += token.val.substr(1).trim();
          break;

        default:
          funcBody += 'res+=_e(d.' + token.val.trim() + '||"");';
          break;
      }
    }
  });
  funcBody += 'return res;';

  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function('d', funcBody) as YingFunc;
}
