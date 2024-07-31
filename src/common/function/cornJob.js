const { Cron } = require("croner");
require("dotenv").config();
function cornJob() {
    const job = Cron(
        '0/5 * * * * *', //every 5 second
        function(){
            console.log("test cron");
        },
        {timezone: 'Asia/Tehran'}
    )

}
module.exports = {
  cornJob,
};
