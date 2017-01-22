/**
 * An inverted index class.
 * @class
 */
class InvertedIndex {
  /**
   * @constructor
   */
  constructor() {
    this.index = {};
  }

  /**
   * A token method
   * @param {Array} words
   * @returns {Array} Returns array
   */
  static tokenize(words) {
    // exclude start and end white-space
    return words.trim().replace(/[^a-zA-Z 0-9]+/g, '').split(/\s/);
  }

  /**
   * A method to filter for unique words
   * @param {Array} words
   * @returns {Array} Returns array
   */
  static distinctWords(words) {
    const tokens = InvertedIndex.tokenize(words);
    return tokens.filter((item, index) =>
      tokens.indexOf(item) === index);
  }

  /**
   * A method to create index
   * @param {Object} filePath
   * @returns {Object} Returns object containing index
   */
  createToIndex(filePath) {
    const wordsToIndex = [];
    const index = {};
    filePath.forEach((doc) => {
      if (doc.text) {
        wordsToIndex
          .push(`${doc.title.toLowerCase()} ${doc.text
           .toLowerCase()}`);
      }
    });
    const uniqueContent = InvertedIndex.distinctWords(wordsToIndex.join(' '));
    uniqueContent.forEach((word) => {
      index[word] = [];
      wordsToIndex.forEach((document, indexPosition) => {
        if (document.indexOf(word) > -1) {
          index[word].push(indexPosition);
        }
      });
    });
    this.index = index;
    return index;
  }

  createIndex(filename, docToIndex) {
    // this object stores the index of the current document
    const newindex = {};
    const wordsToIndex = [];
    docToIndex.forEach((document) => {
      wordsToIndex
        .push(`${document.title.toLowerCase()} ${document.text
           .toLowerCase()}`);
    });
    const uniqueContent = InvertedIndex.distinctWords(wordsToIndex.join(' '));
    uniqueContent.forEach((word) => {
      newindex[word] = [];

      wordsToIndex.forEach((doc, indexPosition) => {
        if (doc.indexOf(word) > -1) {
          newindex[word].push(indexPosition);
        }
      });
    });
    this.index[filename] = newindex;
    return this.index;
  }

  /**
   * A method
   *@returns {Object} Returns object of an index of createIndex
   */
  getIndex(filename) {
    return this.index[filename];
  }

  /**
   * Search index method
   * @param {String} filename search index
   * @param {String} query term(s) to search for
   * @returns {Object} Returns result of searched index.
   */
  searchIndex(query, filename) {
    console.log(this.index);
    filename = Object.keys(this.index);
    console.log(filename);
    this.searchResult = {};
    this.searchTerms = query.toLowerCase().match(/\w+/g);
    filename.forEach((current) => {
      console.log(current);
      this.searchTerms.forEach((term) => {
        if (Object.hasOwnProperty.call(this.index[current], term)) {
          if (term in this.index[current]) {
            this.searchResult[term] = this.index[current][term];
          } else {
            return false;
          }
        }
      });
    });
    return this.searchResult;
  }

  /**
   * A method to validate json file
   * @param {String} file
   * @returns {Array} Returns boolean and a message.
   */
  validateFile(file) {
    if (typeof file !== 'object' || file.length === 0) {
      return [false, 'File is empty please a new file'];
    }

    try {
      this.jsonFile = file;
      let check = true;
      this.jsonFile.forEach((key) => {
        if (key.title !== undefined && file.text !== undefined) {
          check = false;
        }
        if (key.title === undefined && file.text === undefined) {
          check = false;
        }
      });
      if (!check) {
        return [false, 'Invalid File Content'];
      }
      return [true, 'File Uploaded Successfully'];
    } catch (err) {
      if (err instanceof SyntaxError) {
        return [false, 'syntax error'];
      }
      return [false, 'Invalid File Content'];
    }
  }
}

const words = [{
    "title": "Alice in Wonderland",
    "text": "Alice falls into a rabbit hole and enters a world full of imagination."
  },

  {
    "title": "The Lord of the Rings: The Fellowship of the Ring.",
    "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
  }
]

const newwords = [{
    title: 'My name is dammy',
    text: 'Alice falls into a rabbit hole and enters a world full of imagination.'
  },

  {
    title: 'The Lord of the Rings: The Fellowship of the Ring and Tola.',
    text: 'An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring.'
  }
];
const index = new InvertedIndex();
index.createIndex('words.json', words);
index.createIndex('newwords.json', newwords);
// console.log(index.getIndex('newwords.json'));
console.log(index.searchIndex('alice a dammy'));
