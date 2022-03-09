interface Types {
    port:number,
    dburl:string,
}




// it is recommended to use secret key and refresh token information in a env file
const config = <Types>{
    port:5000,
    dburl:"mongodb://localhost:27017/mytest"
    
}

export default config;