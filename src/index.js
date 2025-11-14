import { readFileSync } from 'fs'
import path from 'path'
import _ from 'lodash'
import parse from './parsers.js'
import getFormatter from './formatters/index.js'

const getAbsolutePath = filepath => path.resolve(process.cwd(), filepath)

const readFile = filepath => {
  const absolutePath = getAbsolutePath(filepath)
  return readFileSync(absolutePath, 'utf-8')
}

const getFormat = filepath => path.extname(filepath).slice(1)

const buildTree = (obj1, obj2) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  const allKeys = _.sortBy(_.union(keys1, keys2))

  return allKeys.map((key) => {
    const value1 = obj1[key]
    const value2 = obj2[key]

    if (!_.has(obj2, key)) {
      return { key, type: 'removed', value: value1 }
    }

    if (!_.has(obj1, key)) {
      return { key, type: 'added', value: value2 }
    }

    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return { key, type: 'nested', children: buildTree(value1, value2) }
    }

    if (!_.isEqual(value1, value2)) {
      return {
        key,
        type: 'changed',
        value1,
        value2,
      }
    }

    return { key, type: 'unchanged', value: value1 }
  })
}

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const data1 = readFile(filepath1)
  const data2 = readFile(filepath2)

  const format1 = getFormat(filepath1)
  const format2 = getFormat(filepath2)

  const obj1 = parse(data1, format1)
  const obj2 = parse(data2, format2)

  const tree = buildTree(obj1, obj2)
  const formatter = getFormatter(formatName)

  return formatter(tree)
}

export default genDiff
