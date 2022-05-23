const fs = require('fs');
const readline = require('readline');
// try {
//     fs.writeFileSync(
//       __dirname + '/text.txt',
//       '',
//       'utf8'
//     );
//     console.log('Hello! What do you want to write?');
//   } catch (e) {
//     console.log(e);
//   }
const stream = fs.createWriteStream(
  __dirname + '/text.txt',
  'utf8'
);
stream.on('error', (err) => console.log(`Err: ${err}`));
stream.on('finish', () => console.log('Hello!'));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Hello! Enter a sentence: '
});
rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'exit':
      rl.close();
      break;
    default:
      sentence = line + '\n'
      stream.write(sentence);
      rl.prompt();
      break;
  }
}).on('close', () => {
  stream.end();
  stream.on('finish', () => {
    console.log(`All your sentences have been written to text.txt`);
  })

});


// process.stdin.on('data', data => {
//   console.log(`${data.toString()}`);
//   stream.write(`${data.toString()}`);

// stream.end();
//   process.exit();
// });