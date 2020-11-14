const mysql=require('mysql');
const config=require('./db-config.json');

const pool=mysql.createPool(config);

function getConnection(callback){
    pool.getConnection((err,conn)=>{
        if(!err)
        callback(conn);
    });
}

module.exports=getConnection;