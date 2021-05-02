const { Router } = require('express');
const router = Router();
const response = require('../network/response');


const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : '172.16.0.176',
  user     : 'root',
  password : 'BdConalep3=',
  database : 'conalep3'
});
 
connection.connect();

let maxTemp = 37.5;



router.post('/consult', (req, res) => {
    let ids = req.body.id;
    let temps = req.body.temp;
	let date = req.body.date;
    let hour = req.body.hour
    let stat;
	let data;
    
    // if (temp1==ids){
    //     response.error(req,res,"Ya registrado")
    //     return false;
    //     console.log("Yap")
    // }
    console.log(req.body)
    
	connection.query(generateQuery(ids,hour,date,stat,temps,1),(error, results, fields)=> {

		if (error) throw error;
		data = results;
        
		if(temps>=maxTemp){
                alarma();
            if(data!=0 && ids!="unknow"){
                stat = 0;
                msgPadres(22,"no entro")
                console.log("[USUARIO > TTEMP]")
                connection.query(generateQuery(ids,hour,date,stat,temps,2),(err)=>{
                    if(err)throw error;
                    if(!err) {
                    console.log("Guardado")
                    }
                })
                response.error(req,res,"Temperatura Muy alta")
            }else{
                console.log("USUARIO DESCONOCIDO")
            }
        }


        if(temps<=maxTemp && ids!="unknow" && data!=0){
                stat = 1;
                connection.query(generateQuery(ids,hour,date,stat,temps,2),(err)=>{
                    if(err)throw error;
                    if(!err) {
                    console.log("Guardado")
                    }
                })
                msgPadres(22,"Entro a la hora...")
                console.log("[USUARIO PASA]")
                response.success(req,res,"Correct User");
        }else{
                console.log("Usuario Desconocido")
                console.log("Alarma.. Desconocido")
        }
        
	});	
});


router.post("/test",(req,res)=>{

	let ids = req.body.id;
	let temps = req.body.temp;
    let mainResponse = "Test Of Response"
    let forceError = 0
    console.log("NEW TEST POST: ",ids, temps)    
    console.log(req.body)
    if(forceError){

        response.error(req,res,mainResponse)
    }else{
        response.success(req,res,mainResponse)
    }
});


router.post("/report",(req,res)=>{
    let date = req.body.date
    let ids = req.body.id
    let hour = req.body.hour
    let stat = 0
    let temps = 0;
    console.log(req.body)
    connection.query(generateQuery(ids,hour,date,stat,temps,3),(error,results,fields)=>{
        if(error) throw error;
        console.log(results)
        response.success(req,res,results)

    })
    //Comparar BD de usuarios con los que se registraron y enviar mensajes a los padres 
})



router.post("/c",(req,res)=>{
    connection.query("select * from reportes",(error,results,fields)=>{
    if(error) throw error;
    response.success(req,res,results)

    })
})

router.put("/cobro",(req,res)=>{
	let ids = req.body.id;
	let importe = req.body.importe;
    console.log(req.body)
    connection.query(`select Fondos from alumnos_conalep3 where Matrícula='${ids}'`,(error,result)=>{
        if(error) throw error;
        let money = result[0].Fondos;
        console.log(money)
        if(money>=importe){
            connection.query(`update alumnos_conalep3 set Fondos=${money-importe} where Matrícula='${ids}'`,(err,respons)=>{
                if(error)throw err
                console.log(money-importe)
                response.success(req,res, `¡Hecho! Dinero restante: ${money-importe}`)
             })
        }else{
        response.error(req,res,"Credito Insuficiente")
        }
    })

});

function alarma(){
	console.log("Alarma");

}
function msgPadres(num,text){
	console.log("MSG TO: ",num, text)

}
function generateQuery(ids,hour,date,stat,temp,select){
        switch(select){
            case 1:
                return `select * from alumnos_conalep3 where Matrícula='${ids}'`;
                break;
            case 2 :
                return  `insert into reportes (hora,Fecha,Entro,temperatura,Matrícula) values('${hour}','${date}','${stat}','${temp}','${ids}')`
                break;
            case 3:
                return `select * from reportes where Fecha='${date}'`;
                break;
            default:
                return "none";
        }
}


module.exports = router;
