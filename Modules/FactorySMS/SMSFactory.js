import Ayfatel from './APIs/Ayfatel.js';
import Pusula from './APIs/Pusula.js';
import Mutlucell from './APIs/Mutlucell.js';

const messageAPIs = {
    Ayfatel,
    Pusula,
    Mutlucell
}

class SMSFactory {    
    //classes = { Ayfatel, Pusula };
    //classes = { "Ayfatel": Ayfatel, "Pusula": Pusula };
    
    constructor(name, user_name, password, origin) {       
        try {
            return new messageAPIs[name](user_name, password, origin);
        } catch (error) {
            console.log(error)
        }
    }
    
}

export default SMSFactory

/**
 * bu class gelen string isimde class'ı dynamic olarak üretir instance'ı return eder
 * dönen instancedan çalıştırılacak olan metod SMSInterface'de belli
 * yeni bir message api olduğunda APIs kalsöründe messageAPIs objesine/array'ına yazılır yazılır buraya dahil edilir 
 */