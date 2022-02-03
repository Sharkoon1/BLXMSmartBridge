function get(url){
    let token = localStorage.getItem("token");

    return fetch(url, { method: "get", headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if(res.status === 403) {
            localStorage.removeItem("token");
            window.location.reload();
        }
        
        return res.json();
    });
}


function post(url, body){
    let token = localStorage.getItem("token");

    return fetch(url, { method: "post", body: JSON.stringify(body) , headers: { 'Authorization': `Bearer ${token}` } }).then(res => {
        if(res.status === 403) {
            localStorage.removeItem("token");
            window.location.reload();
        }

        return res.json(); 
    });
}

export { get, post }
