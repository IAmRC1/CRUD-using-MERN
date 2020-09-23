import axios from 'axios'

const token = localStorage.getItem('token');

const apiResponse = async (args) => {
	return axios({
		...args,
		headers: {
			'token': token,
		}
	})
		.catch(error => {
			if (error.response) {
				if (error.response.status === 401) {
          localStorage.removeItem('token')
					alertInfo('error', "Unauthorised access")
					window.location.href = "/login"
				}
			} else if (error.request) {
				alertInfo('error', "Server is not reponding")
			} else {
				alertInfo('error', "Oops something went wrong! please try again later")
			}
			throw error
		});
}

export { apiResponse };