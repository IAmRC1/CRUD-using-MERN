import axios from 'axios'
import { alertInfo, } from '../utils/helper'

const apiResponse = async (args) => {
	return axios({
		...args,
		headers: {
			'token': localStorage.getItem('token')?localStorage.getItem('token'):'' ,
		}
	})
		.catch(error => {
			if (error.response) {
				if (error.response.status === 401) {
					alertInfo('error', "Unauthorised access")
				}
			} else if (error.request) {
				alertInfo('error', "Server is not reponding")
			} else {
				alertInfo('error', "Oops something went wrong! please try again later")
			}
			alertInfo('error', alert.config)
		});
}

export { apiResponse };