const { Router } = require("express");
var uniqid = require('uniqid');
const { getConn, sql } = require("../database/conn");
const router = Router();
router.get("/",(req,res)=>{
    res.send('hola')
})
router.get("/personas", async (req, res) => {
  try {
    const pool = await getConn();
    const result = await pool.request().query("SELECT * FROM personasdb");
    console.log(result);
    res.json(result.recordset);
  } catch (error) {
    console.log(error);
  }
});

router.get("/personas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConn();
    const result = await pool
      .request()
      .input("id", id)
      .query("SELECT  * FROM personasdb where id =@id");
    console.log(result);
    if(result.recordset.length === 0){
      res.json({result:'FAIL', msg:'No se Encuentra info'});
     
    } 
    res.json(result.recordset[0]);
  } catch (error) {
    console.log(error);
  }
});

router.post("/personas", async (req, res) => {
  const id=uniqid()
  const { nombre, pais } = req.body;
  try {
    const pool = await getConn();
    await pool
      .request()
      .input("id", sql.VarChar, id)
      .input("nombre", sql.VarChar, nombre)
      .input("pais", sql.VarChar, pais)
      .query("INSERT INTO personasdb (id,nombre,pais) VALUES (@id,@nombre,@pais)");
    res.json({
      status: "Persona Guardada",
      data: {
        id,
        nombre,
        pais,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

router.put("/personas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, pais } = req.body;
    const pool = await getConn();
    const result = await pool
      .request()
      .input("id", id)
      .input("nombre", sql.VarChar, nombre)
      .input("pais", sql.VarChar, pais)
      .query(
        "UPDATE personasdb SET nombre = @nombre, pais= @pais WHERE id = @id"
      );
    console.log(result);
    if(result.rowsAffected == 0 ){
      res.json({
        msg:'no se pudo actualizar id no existe'
      })
    }else{
      res.json({
        status: "Persona Actualizada",
      });

    }
    
  } catch (error) {
    console.log(error);
  }
});

router.delete("/personas/:id",async(req, res)=>{
    try {
        const { id } = req.params;
        const pool = await getConn()
        let result=await pool
            .request()
            .input("id",id)
            .query('DELETE FROM personasdb WHERE id=@id')
        console.log(result)
        console.log(result.rowsAffected == 0 ? 'no hay data' : 'si')
        if(result.rowsAffected == 0 ){
          res.json({
            msg:'no se pudo eliminar id no existe'
          })
        }else{
          res.json('Persona Eliminada')

        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
