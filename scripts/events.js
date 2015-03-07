var http = require('http');
module.exports = function(robot) {
    robot.respond(/events/i, function(msg){
        //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
        var options = {
          host: 'api.ieeeatuhm.com',
          path: '/events-mongo'
        };

        callback = function(response) {
          var str = '';

          //another chunk of data has been recieved, so append it to `str`
          response.on('data', function (chunk) {
            str += chunk;
          });

          //the whole response has been recieved, so we just print it out here
          response.on('end', function () {
            parse_events(str, function(output){
                msg.send(output);
            });
          });
        }

        http.request(options, callback).end();
    });
}


function parse_events(response, callback){
    var output = ' ';
    var data = JSON.parse(response);

    var output = data
        .filter(function(an_event){
            var today = new Date();
            if( Date.parse(an_event.date) >= today ) return true;
            else return false;
        })
        .map(function(an_event){
            return "__" + an_event.eventname + ":__  " + "_" + (new Date(Date.parse(an_event.date))).toDateString() + "_";
        })
        .join("\n");
        

    output = "\n" 
        + "*Here are the upcoming events:* \n" 
        + "----------------------------------\n"
        + output;

    callback(output);
}
