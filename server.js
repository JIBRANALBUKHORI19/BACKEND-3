const express = require('express');
const mysql = require("mysql2");
const app = express();
const port = 5000

const connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : '',
        database : 'mahasiswa'
    });
    connection.connect(error =>{
        if (error) throw error;
        console.log("Server Aktif ")
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//mahasiswa 
app.post('/mahasiswa', (req, res) => {
    const mahasiswaBaru = req.body;

    connection.query("INSERT INTO data SET ?", mahasiswaBaru,(err) => {
        if (err) {
            console.log("error : ", err);
            res.status(500).send({
                message : err.message || "terjadi kesalahan saat insert data"
            });
        }
        else
            res.send(mahasiswaBaru)
    });
});

app.get('/mahasiswa', (req, res) => {
    const qstring = "SELECT * FROM data";
    connection.query(qstring, (err,data) => {
        if (err) {
            console.log("error : ", err);
            res.status(500).send({
                message : err.message || "terjadi kesalahan saat get data"
            });
        }
        else
            res.send(data)
    });
});

app.get('/mahasiswa/:nim', (req, res) => {
    const qstring = `SELECT * FROM data WHERE nim = '${req.params.nim}'`;
    connection.query(qstring, (err,data) =>{
        if (err) {
            console.log("error: ", err);
            res.status(500).send({
                message : err.message || "Terjadi kesalahan saat get data spesifik"
            });
        }
        else 
            res.send(data)
    });
});

app.put('/mahasiswa/:nim', (req, res) => {
    const nim = req.params.nim;
    const mhs = req.body;
    const qstring = `UPDATE data
                    SET nama = '${mhs.nama}', angkatan = '${mhs.angkatan}', prodi = '${mhs.prodi}'
                    WHERE nim = '${nim}'`
    connection.query(qstring, (err, data) =>{
        if (err){
            res.status(500).send({
                message : "error dalam UPDATE mahasiswa dengan nim " + nim
            });
        }
        else if (data.affectedRows == 0){
            res.status(404).send({
                message : `Not found mahasiswa dengan nim ${nim}.`
            });
        }
        else {
            console.log("updated data: ", {nim: nim, ... mhs});
            res.send({nim : nim, ... mhs});
        }
    });
});

app.delete('/mahasiswa/:nim', (req, res) => {
    const nim = req.params.nim
    const qstring = `DELETE FROM data WHERE nim = '${nim}'`
    connection.query(qstring, (err,data) => {
        if (err) {
            res.status(500).send({
                message : "Error dalam menghapus data mahasiswa dengan nim " + nim
            });
        }
        else if (data.affectedRows == 0){
            res.status(404).send({
                message : `NOT found mahasiswa dengan nim ${nim}.`
            });
        }
        else
            res.send(`Mahasiswa dengan nim = ${nim} telah dihapus`)
    });
});

app.listen(port, () =>{
    console.log(`server berjalan pada localhost:${port}`);
});