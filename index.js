var fs = require('fs')
  , comments = require('comment-parser')
  , repeat = require('string-repeater')
  , USAGE ='usage' 
  , NAME = 'name'
  , PARAM = 'param';

/**
 *  @usage var parse = require('mdapi');
 *  parse(['index.js'], {stream: process.stdout});
 */

/**
 *  Concatenate input files into a single string.
 *  
 *  @name concat
 *
 *  @param {Array} files List of input file to load.
 *  @param {String} output The output string.
 *  @param {Function} cb Callback function.
 */
function concat(files, output, cb) {
  var file = files.shift();
  output = output || '';
  function onRead(err, contents) {
    if(err) {
      return cb(err); 
    }
    output += contents;
    if(!files.length) {
      return cb(null, output); 
    } 
    concat(files, output, cb);
  }
  fs.readFile(file, onRead);
}

/**
 *  Print the markdown from the parsed ast.
 *
 *  @name print
 *
 *  @param {Object} ast The parsed comments abstract syntax tree.
 *  @param {Object} opts Parse options.
 *  @param {Function} cb Callback function.
 */
function print(ast, opts, cb) {
  var stream = opts.stream
    , level = opts.level;

  function done(err) {
    cb(err || null); 
  }

  // find a tag
  function findTag(name, ast) {
    for(var i = 0;i < ast.tags.length;i++) {
      if(ast.tags[i].tag === name) {
        return ast.tags[i]; 
      }
    }
  }

  // collect tags
  function collect(name, ast) {
    var o = [];
    for(var i = 0;i < ast.tags.length;i++) {
      if(ast.tags[i].tag === name) {
        o.push(ast.tags[i]);
      }
    }
    return o;
  }


  // print a heading
  function heading(str, level) {
    stream.write(repeat('#', level) + ' ' + str); 
  }

  // print newline(s)
  function newline(num) {
    num = num || 1; 
    stream.write(repeat('\n', num)); 
  }

  function fenced(code, lang) {
    stream.write('```'); 
    if(typeof lang === 'string') {
      stream.write(lang); 
    }
    newline();
    stream.write(code);
    newline();
    stream.write('```'); 
  }

  // print the function signature
  function signature(name, token) {
    var sig = '('
      , params = collect(PARAM, token);

    stream.write('```'); 
    if(typeof opts.lang === 'string') {
      stream.write(opts.lang); 
    }

    params.forEach(function(param, index) {
      if(index) {
        sig += ', '; 
      }
      sig += param.name;
    })

    sig += ')';

    newline();
    stream.write(name);
    stream.write(sig);
    newline();
    stream.write('```'); 

    return params;
  }

  // initial heading
  if(typeof opts.heading === 'string') {
    heading(opts.heading, level); 
    newline(2);
    level++;
  }

  // walk the ast
  ast.forEach(function(token) {
    //console.dir(token);

    var tag = findTag(NAME, token)
      , name
      , usage = findTag(USAGE, token)
      , params;

    if(usage) {
      fenced(usage.name + ' ' + usage.description, opts.lang);
      newline(2);
    }

    if(!tag || !tag.name) {
      return; 
    }

    name = tag.name;
    
    // method heading
    heading(name, level);
    newline(2);

    // method signature
    params = signature(name, token);
    newline(2);

    // method description
    stream.write(token.description);
    newline(2);

    // parameter list
    params.forEach(function(param) {
      stream.write('* ' + param.name + ': ' + param.description);
      newline();
    })
    newline();

  })

  stream.once('finish', done);

  if(stream !== process.stdout) {
    stream.end(); 
  }else{
    done();
  }
}

/**
 *  Parse an array of files into a markdown string.
 *
 *  @name parse
 *
 *  @param {Array} files List of files to parse.
 *  @param {Object} opts Parse options.
 *  @param {Function} cb Callback function.
 */
function parse(files, opts, cb) {
  if(typeof opts === 'function') {
    cb = opts; 
    opts = null;
  }

  opts = opts || {};

  // stream to print to
  opts.stream = opts.stream || process.stdout;

  // starting level for headings
  opts.level = opts.level || 1;

  opts.heading = opts.heading || 'API';

  // language for function signature
  opts.lang = opts.lang || 'javascript';

  // disable trim by default
  //opts.trim = typeof(opts.trim) === 'boolean' ? opts.trim : false;

  files = Array.isArray(files) ? files : [];

  concat(files.slice(), null, function onLoad(err, result) {
    if(err) {
      return cb(err); 
    }

    var ast = comments(result);

    function onPrint(err) {
      if(err) {
        return cb(err);
      }
      cb();
    }

    print(ast, opts, onPrint);
  })
}

parse.concat = concat;
parse.print = print;

module.exports = parse;
