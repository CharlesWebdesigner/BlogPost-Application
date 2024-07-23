const http=require('http')
const app=require('./app')
const {port}=require('./keys')
let PortUrl=port || 3000;
const server=http.createServer(app)
server.listen(PortUrl,()=>console.log(`Server is running on port: ${port}`))