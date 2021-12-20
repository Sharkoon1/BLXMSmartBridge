export default function UrlHandler(){
	let url;

	switch (process.env.NODE_ENV) {
		case 'production':
			url = 'https://server-smart-bridge.herokuapp.com/';
			break;
		case 'development':
		default:
			url = 'http://localhost:8080/';
	}
	return url;
}



