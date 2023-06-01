import {createServer} from "express-zod-api"
import {config} from "./config"
import {routing} from "./route"

createServer(config, routing)