import _ from 'lodash';

const formatValue = (value) => {
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }

  if (typeof value === 'string') {
    return `'${value}'`;
  }

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  return String(value);
};

const plain = (tree, path = '') => {
  const lines = tree.flatMap((node) => {
    const currentPath = path ? `${path}.${node.key}` : node.key;

    switch (node.type) {
      case 'added':
        return `Property '${currentPath}' was added with value: ${formatValue(node.value)}`;
      case 'removed':
        return `Property '${currentPath}' was removed`;
      case 'changed':
        return `Property '${currentPath}' was updated. From ${formatValue(node.value1)} to ${formatValue(node.value2)}`;
      case 'nested':
        return plain(node.children, currentPath);
      case 'unchanged':
        return [];
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  });

  return lines.join('\n');
};

export default plain;
