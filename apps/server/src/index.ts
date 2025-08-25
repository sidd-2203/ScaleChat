import * as http from "node:http"
import SocketService from "./services/socket.js"


async function init(){
    const socketService=new SocketService();
    const httpserver=http.createServer();
    socketService.io.attach(httpserver);
    const PORT=process.env.PORT ?process.env.PORT :8000;
    httpserver.listen(PORT,()=>{
        console.log(`Http server started at PORT :${PORT}`);
    })
    socketService.initListeners();
}
init();