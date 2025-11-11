import { Config } from '../services/config'
let baseURL=Config?.serverAPIUrl
export const APICONFIG = {
	
	// Diamond parking api start 
	getUserLoginUrl: `${baseURL}user/login`,
	getUserProfileUrl: `${baseURL}user/userProfile`,

}


