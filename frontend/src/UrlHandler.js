export default function UrlHandler(){
	let url;
	switch (process.env.NODE_ENV) {
		case 'production':
			url = process.env.REACT_APP_API_URL;
			break;
		case 'development':
		default:
			url = 'http://localhost:8080/';
	}
	return url;
}



