const express = require('express');
const app = express();
const cors = require('cors')
app.use(cors({origin: '*'}));

app.set('port', process.env.PORT || 3002);
app.use(express.json());
app.use(require('./routes/crawl'))


var server = app.listen(app.get('port'), ()=>{
    console.log('server on port ', app.get('port'));
});

server.timeout = 1000;