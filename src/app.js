const express = require('express');
const { Server } = require('socket.io');
const app = express();
const handlebars = require('express-handlebars');
const routerViews = require('./router/views.router');

const httpServer = app.listen(8080, () => {
  console.log('server is running on port 8080');
});
const io = new Server(httpServer);

let messages = []

io.on('connection', (socket) =>{
    console.log('New user logged in!');
    socket.on('new-user', (data)=>{
        socket.broadcast.emit('new-user', data);
    });
    socket.emit('history', messages);
    setTimeout(()=>{
        messages = []
    }, 30000)
    socket.on('message', (data)=>{
        messages.push(data);
        setTimeout(()=>{
            messages = []
        }, 30000)
        io.emit('message', data);
        
    });
});


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', routerViews);