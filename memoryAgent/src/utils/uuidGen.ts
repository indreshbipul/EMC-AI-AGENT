import {v4} from 'uuid'

const uuidGen = ()=>{
    const uuid = v4();
    return uuid;
}

export default uuidGen;