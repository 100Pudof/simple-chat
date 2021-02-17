
const express = require('express'); // подключение фреймворка экспресс, оболочка над нод.джс
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server,{cors:{origin:"*"}});


app.use(express.static('./build'));
app.use(express.json());

let port = process.env.PORT ||  9999;
const rooms = new Map();

 // app.use(express.urlencoded({extended: true})) метод для считывания из url данных. 
app.get('/rooms/:idd', (req, res) => {
    const { idd: roomId } = req.params;
    const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
      }
    : { users: [],
        messages: [],
      };

    res.json(obj);
    
});

app.post('/rooms', (req, res) => {
        const {roomId, userName} = req.body;

        if(!rooms.has(roomId)) {
            rooms.set(roomId, new Map([ // .set тоже самое, что и Map(). создается ключ, это  roomId и его значение new Map();
                ['users', new Map()],
                ['messages', []],
            ])
            );
        };
        
        res.json(rooms);
})
// rooms.set = {
//     'id10': {
//         'users': { },
//         'messages': [],
//     }
// }

io.on('connection', socket => { // .on == если юзер законектился 
    socket.on('ROOM:JOIN', (data) => { // и передал action 'ROOM:JOIN', с данными (data)
        socket.join(data.roomId); // отправить данные в конкретную комнату (roomId) к примеру message
        
        rooms.get(data.roomId).get('users').set(socket.id, data.userName); // .set == Map(); .set({ key: 'value' })
        //  .get(roomId) = получаем доступ в определенную комнату, пришедшую из action;
        //  .get('users') = в ней получаем доступ к юзерам;
        //  .set(socket.id, data.userName) = добавляем id cocket  и имя пользователя, пришедшее из action;
        
        const users = [...rooms.get(data.roomId).get('users').values()]; // создаем копию всех юзеров в определенной комнате
    
        socket.to(data.roomId).broadcast.emit('ROOM:SET_USERS', users);
        // сокет соединение именно в конкретной комнате c помощью .emit() сообщает всем пользователям находящимся в комнате.
        // кроме меня = .broadcast
        // .emit('ROOM:JOINED', users) = все пользователи получат массив с количеством всех пользователей. 
        });

        socket.on('ROOM:NEW_MESSAGE', (data) => {
            const message = {
                userName: data.userName,
                text: data.text,
            };
            console.log('data.text: ',data.text)
            rooms.get(data.roomId).get('messages').push(message);
            socket.to(data.roomId).broadcast.emit('ROOM:NEW_MESSAGE', message);
        })


        socket.on('disconnect', () => { // если пользовател вышел
            rooms.forEach((value, roomId) => { // roomId - ключ объекта, value - значение объекта. forEach - ищутся совпадения
                if(value.get('users').delete(socket.id)) { // сразу и проверка и удаление. если в ключе users есть значение (socket.id) , оно удаляется
                const users = [...value.get('users').values()];
                socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
                }
            });
        })
    console.log('user connected', socket.id)
})

server.listen(port, (err) => {
    if (err) {
        throw Error(err);
    };
    console.log('Server on')
});
