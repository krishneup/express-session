const bcrypt = require('bcrypt');


const SALT_WORK_FACTOR:number = 10;


const HashPass = (plainPassword:string) => {
    return new Promise<void>((resolve, reject) => {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err: any, salt: any) {
            bcrypt.hash(plainPassword, salt, function(err: any, hash: any) {
                resolve(hash)
                reject("hashing error occured")
            });
        });
    })
}

export { HashPass }