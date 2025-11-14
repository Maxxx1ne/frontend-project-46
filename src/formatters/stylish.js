import _ from 'lodash';

const formatValue = (value, depth) => {
  if (_.isPlainObject(value)) {
    const indent = ' '.repeat(depth * 4);
    const bracketIndent = ' '.repeat((depth - 1) * 4);
    const lines = Object.entries(value).map(([key, val]) => {
      return `${indent}  ${key}: ${formatValue(val, depth + 1)}`;
    });
    return ['{', ...lines, `${bracketIndent}}`].join('\n');
  }

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  return String(value);
};

const stylish = (tree, depth = 1) => {
  const indent = ' '.repeat(depth * 4 - 2);
  const bracketIndent = ' '.repeat((depth - 1) * 4);

  const lines = tree.map((node) => {
    switch (node.type) {
      case 'added':
        return `${indent}+ ${node.key}: ${formatValue(node.value, depth)}`;
      case 'removed':
        return `${indent}- ${node.key}: ${formatValue(node.value, depth)}`;
      case 'unchanged':
        return `${indent}  ${node.key}: ${formatValue(node.value, depth)}`;
      case 'changed':
        return [
          `${indent}- ${node.key}: ${formatValue(node.value1, depth)}`,
          `${indent}+ ${node.key}: ${formatValue(node.value2, depth)}`,
        ].join('\n');
      case 'nested':
        return `${indent}  ${node.key}: ${stylish(node.children, depth + 1)}`;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });

  return ['{', ...lines, `${bracketIndent}}`].join('\n');
};

export default stylish;
