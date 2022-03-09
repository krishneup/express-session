import { crudControllers } from '../../utils/cruds'
import {User} from './user.model'


export const CrudUser = crudControllers(User)



export const ensureAuthenticated = async(req:any, res:any, next:any) => {
   
    
    if ( !req.isAuthenticated()) { 
        
        return await res.status(403).json({ // Worked
            status_code: 0,
            error_msg: "Require Params Missings",
        });

    console.log(req.user)
        
    
    }
    
    console.log(req.user)
    next(); 

}

export const belongstoUser = (req:any, res:any, next:any) => {

    if(req.user.id !== req.params.id){
        
        return res.status(403).json({ // Worked
            status_code: 0,
            error_msg: "The content doesnt belongs to you",
        });
    }
    next();
}



