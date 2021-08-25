const sql = require('mssql')
const dbSettings = {
    user: 'Administrador',
    password :'18342020A#',
    server:'prueba-server2021.database.windows.net',
    database: 'tesdb',
    options:{
        encrypt:true,
        trusServerCertificate:true,
    }

}
const getConn = async()=>{
    const pool = await sql.connect(dbSettings)
    return pool;
}
module.exports={
    getConn,
    sql
}