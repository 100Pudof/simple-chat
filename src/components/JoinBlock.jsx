import React from 'react'
import axios from 'axios';

export default function JoinBlock({ onLogin }) {
    const [roomId, setRoomId] = React.useState('');
    const [userName, setUserName] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const onEnter = async () =>  {
        if (!roomId || !userName) {
            return alert('vvedi dannye');
        }
        const obj = {
            roomId,
            userName,
        };

        setIsLoading(true);
        await axios.post('/rooms', obj).then(() => {
            onLogin(obj);
        });
    };
    return (
        <div className="join-block">
            <div className="block-input">
                
                <input
                    type="text"
                    placeholder="Room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Ваше имя"
                    value={userName}
                    pattern="^[a-zA-Z\s]+$"
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button onClick={onEnter} disabled={isLoading} className="btn btn-success">
                    {isLoading ? 'ВХОД...' : 'ВОЙТИ'}
                </button>
            </div>
        </div>
    )
}
