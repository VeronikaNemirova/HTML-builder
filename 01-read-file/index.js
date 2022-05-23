const fs = require('fs');

const stream = new fs.ReadStream(__dirname + '/text.txt', {encoding: 'utf-8'});
 
stream.on('readable', function(){
    const data = stream.read();
    if (data) {
        console.log(data);
    }
});