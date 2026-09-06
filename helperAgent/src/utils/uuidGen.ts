import {v4} from 'uuid'

const uuidGen = ()=>{
    const id = v4()
    return id
}

export default uuidGen;