let handler = require('./index');

handler.handler( {},
    {}, //content
    function(data,ss) {
        console.log(data)
    })