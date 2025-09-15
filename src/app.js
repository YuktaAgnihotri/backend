import cookieParser from "cookie-parser";
import express  from "express"

const app = express();

app.use(cors({
    origin : process.env.CORS_PORT,
    credential : true 
}))

/*configurations */
app.use((express.json({limit:"16kbs"})))  //this sets the speed of api loading
app.use((express.urlencoded({limit:"16kbs"}))) // this loads query in url like searching make cake the space is understood by browser 
app.use(express.static("public"))  // this is used to store any static file like pdf image in server 
app.use(cookieParser) 

export {app}