/* eslint-disable prefer-template */
import escapeHtml from 'escape-html';
import MarkdownDownIt from 'markdown-it';

const REGEX_MULTILINE = /{{([\s\S]*?)}}/g;
const md = MarkdownDownIt({ html: true });

enum TokenType {
  text,
  cmd,
}

interface Token {
  val: string;
  type: TokenType;
}

export type YingFunc<T> = (arg: T) => string;

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
(globalThis as any)._e = (html: string) => escapeHtml(html);
// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/no-explicit-any
(globalThis as any)._markdown = (html: string) => md.render(html);

export default function compile<T = unknown>(str: string): YingFunc<T> {
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
    idx = match.index + match[0].length;

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
  return new Function('d', funcBody) as YingFunc<T>;
}
