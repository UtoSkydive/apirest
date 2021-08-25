const { Router } = require("express");
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
    res.send(result.recordset[0]);
  } catch (error) {
    console.log(error);
  }
});

router.post("/personas", async (req, res) => {
  const { nombre, pais } = req.body;
  try {
    const pool = await getConn();
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("pais", sql.VarChar, pais)
      .query("INSERT INTO personasdb (nombre,pais) VALUES (@nombre,@pais)");
    res.json({
      status: "Persona Guardada",
      data: {
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
    res.json({
      status: "Persona Actualizada",
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/personas/:id",async(req, res)=>{
    try {
        const { id } = req.params;
        const pool = await getConn()
        await pool
            .request()
            .input("id",id)
            .query('DELETE FROM personasdb WHERE id=@id')
        res.json('Persona Eliminada')
    } catch (error) {
        console.log(error)
    }
})
module.exports = router;
