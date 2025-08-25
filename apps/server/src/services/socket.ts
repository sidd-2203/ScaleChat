import {Server} from 'socket.io'
import {Redis}  from 'ioredis';
import type { RedisOptions } from 'ioredis';

const pub=new Redis(process.env.REDIS_URL);
const sub=new Redis(process.env.REDIS_URL);
class SocketService{
    private _io:Server;

    constructor(){
        console.log("Init Socket Service ...");
        this._io=new Server({
            cors:{
                allowedHeaders:["*"],
                origin:'*'
            }
        });
        sub.subscribe("MESSAGES")
    }
    public initListeners(){
        const io=this.io;
        console.log("Initialize socket listeners .....")
        io.on('connect',(socket)=>{
            console.log(`New Socket Connected ${socket.id}`);
            socket.on('event:message',async({message}:{message:string})=>{
                console.log(`New Message Recieved ${message}`);
                await pub.publish('MESSAGES',JSON.stringify({message}));
            })
        })
        sub.on('message',(channel,message)=>{
            if(channel=== "MESSAGES"){
                console.log("New Message from redis",message);
                io.emit('message',message);
            }
        })
    }
    get io(){
        return this._io;
    }   

}
export default SocketService;