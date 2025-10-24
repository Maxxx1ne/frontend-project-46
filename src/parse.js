const fs = require('fs');
const path = require('path');

/**
 * Парсит файл по указанному пути
 * @param {string} filepath - путь к файлу
 * @returns {Object} parsed data
 */
const parseFile = (filepath) => {
  const absolutePath = path.resolve(process.cwd(), filepath);
  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  
  // Определяем формат по расширению
  const ext = path.extname(absolutePath).toLowerCase();
  
  switch (ext) {
    case '.json':
      return JSON.parse(fileContent);
    // Здесь можно добавить поддержку других форматов (yaml, ini и т.д.)
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
};

module.exports = parseFile;
