import axios from "axios";
import { Env } from "../services/env";

axios.defaults.baseURL = `http://localhost:${Env.PORT}`;
