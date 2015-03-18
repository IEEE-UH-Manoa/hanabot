var http = require('http');
module.exports = function(robot) {
    robot.respond(/tasks/i, function(msg){
        //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
        var options = {
          host: 'api.ieeeatuhm.com',
          path: '/tasks'
        };

        callback = function(response) {
          var str = '';

          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            str += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
            parse_tasks(str, function(output){
                msg.send(output);
            });
          });
        }

        http.request(options, callback).end();
    });
}

function parse_tasks(response, callback){
    var output = ' ';
    var data = JSON.parse(response);

    var output = data.map(function(even){
            return "   - " + even;
        }) 
        .join("\n");
        

    output = "\n" 
        + "*IEEE Officers be slacking:* \n" 
        + "```" + output + "```";

    callback(output);
}
