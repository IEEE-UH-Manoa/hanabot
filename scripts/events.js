var http = require('http');
module.exports = function(robot) {
    robot.respond(/events/i, function(msg){
        //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
        var options = {
          host: 'api.ieeeatuhm.com',
          path: '/events-upcoming'
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
            // var date_string = (new Date(Date.parse(an_event.date))).toDateString();
            var monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ];
            var dayNames =["Sun", "Mon", "Tue", "Wed", "Thu",
              "Fri", "Sat"];

            var date = (new Date(Date.parse(an_event.date)));
            var date_string = dayNames[date.getDay()] + ", " 
                + monthNames[date.getMonth()] + " " 
                + date.getDate() + " ";
            
            return date_string + "\t\t" + "" 
                + an_event.eventname + "";
        })
        .join("\n");
        

    var header = "*Date*\t\t\t*Event*\n";
    output = "\n" 
        + "Here are the next two week's events: \n" 
        + ">>>\n"
        + header
        + output;

    callback(output);
}
