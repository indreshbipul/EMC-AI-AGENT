import fs from 'fs/promises';
import path from 'path';

const cwd = process.cwd();
const db_FilePath = path.join(cwd,"src","db","db.json");

type dbData = {
    containerId : string, 
    projectId : string,
    createdAt : Date
}

export const getRecord = async (projectId: string) => {
    try {
        const data = await fs.readFile(db_FilePath, "utf-8");
        const records = JSON.parse(data);
        return records.find((record: dbData) => record.projectId === projectId) as dbData;

    } catch (err) {
        throw err;
    }
};

export const createRecord = async(containerId : string, projectId : string)=>{
    try{
        const data = await fs.readFile(db_FilePath, "utf-8");
        let records = JSON.parse(data);
        if(records.length <= 0){
            records = []
        }
        records.push({
            containerId,
            projectId,
            createdAt :  new Date(Date.now())
        })
        await fs.writeFile(db_FilePath, JSON.stringify(records, null, 2));
        return true;
    }
    catch(err){
        throw err;
    }
}

export const deleteRecord = async(projectId : string)=>{
    try{
        const data = await fs.readFile(db_FilePath, "utf-8");
        const records =  JSON.parse(data);
        const updatedRecords = records.filter((record: dbData) => record.projectId !== projectId);
        await fs.writeFile(db_FilePath, JSON.stringify(updatedRecords, null, 2));
        return true;
    }
    catch(err){
        throw err;
    }

}

export const updatedRecord = async(containerId : string, projectId : string) =>{
    try{
        const data = await fs.readFile(db_FilePath, "utf-8")    ;
        const records = JSON.parse(data);
        records.forEach((record : dbData) =>{
            if(record.projectId === projectId){
                record.containerId = containerId;
            }
        })
        await fs.writeFile(db_FilePath, JSON.stringify(records,null,2));
        return true;
    }
    catch(err){
        throw err;
    }
}