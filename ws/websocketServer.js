const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8090 });

const channels = {};

wss.on('connection', function connection(ws) {
    let currentChannel = null;

    ws.on('message', function incoming(message) {
        try {
            const { channel, action, data, userId } = JSON.parse(message);

            // 加入頻道
            if (action === 'join' && channel) {
                if (!channels[channel]) {
                    channels[channel] = new Set();
                }
                channels[channel].add(ws);
                currentChannel = channel;
                // console.log(`${userId} 加入了頻道`);
            }

            // 離開頻道
            else if (action === 'leave') {
                if (currentChannel && channels[currentChannel]) {
                    channels[currentChannel].delete(ws);
                    console.log(currentChannel, '系統', `${userId} 離開了頻道`);
                    currentChannel = null;
                }
            }

            // 發送訊息到頻道
            else if (action === 'message' && currentChannel) {
                broadcast(currentChannel, userId, data);
                console.log(userId, data);
            }
        } catch (e) {
            console.error('解析訊息時發生錯誤', e);
        }
    });

    ws.on('close', function() {
        if (currentChannel && channels[currentChannel]) {
            channels[currentChannel].delete(ws);
            console.log(currentChannel, '系統', '有人離開了頻道');        }
    });
});

function broadcast(channel, userId, message) {
    if (channels[channel]) {
        channels[channel].forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ userId, message }));
            }
        });
    }
}
