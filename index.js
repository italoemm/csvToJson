var fs = require('fs');
var path = require('path')
var _=require('lodash')


var filePath = path.join(__dirname, 'input.csv');

var f = fs.readFileSync(filePath, {encoding: 'utf-8'}, 
    function(err){console.log(err);});

class Modelo  {
    
    constructor(fullname,eid,classes,addresses,invisible,see_all){
        this.fullname = fullname;
        this.eid=eid;
        this.classes = classes;
        this.invisible=invisible;
        this.see_all = see_all;
        this.addresses = addresses;
    }
       
    converterArrayEmail(){
        this.addresses.forEach((address,i) =>{
            if(address.address instanceof Array && address.type.includes("email")) {
                address.address.forEach((vetor) =>{
                     this.addresses.push({
                      type: address.type,
                      tags: address.tags,
                      address:vetor
                })
                })
                this.addresses.splice(i,1);
            }
        });
        console.log("Dentro do converterArrayEmail()")
        console.log(this.addresses)
        console.log("\n")
    }
    
    validarRegistro(){
        var aux = []
        
       aux = this.addresses.filter((address) => address.address.length != 0);
      
       this.addresses = aux.filter((address) => {
        var add= address.address
        var celTAM = 13
        var telTAM = 12
        var celTest = false;
        var telTest = false; 
        var isEmail = (/^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/.test(add)) ? true : false
        if(address.type=="email" && isEmail) return address;
           
        else if(address.type=="phone") {
            add = "55" + add.replace(" ","");
           if(/[0-9]+/.test(add) && /[1-9]+/.test(add.substring(2,4))){
	               if(/[0-8]+/.test(add.substring(4,5))){
                                        telTest=true
                                    }else if(add.substring(4,5)=="9"){
                                         celTest=true
                                    }
                    }          
             address.address = add
            if(celTest== true && add.length == celTAM)  return address;        
            if(telTest== true && add.length == telTAM) return address;
        }
        });
       console.log("Dentro do ValidarRegistro()")
       console.log(this.addresses)
       console.log("\n")
    }
    
    concatenarObjetos(objetos){
      objetos.forEach((obj2,j) => {
             if(_.isEqual(this, obj2)==false && this.fullname==obj2.fullname && this.eid==obj2.eid){
               console.log("My class: ")
               console.log(this.addresses)
               console.log("Param: ")
               console.log(obj2.addresses)
               console.log("\n") 
               obj2.addresses.forEach((address) => this.addresses.push(address)); 
               obj2.classes.forEach((clasS) => this.classes.push(clasS));
                 
               this.see_all = (this.see_all == true) ?  this.see_all : obj2.see_all;
               this.invisible = (this.invisible == true) ?  this.invisible : obj2.invisible;
               objetos.splice(j,1)   
           }
        })
}
    
    concatenarEmailcomTag(){
        
        this.addresses.forEach((address1,i) =>{
                    this.addresses.forEach((address2,j) =>{
                        if(address1.address == address2.address){
                            if(i!=j){
                            address2.tags.forEach((tagOfAdress2) =>{
                                this.addresses[i].tags.push(tagOfAdress2)
                            })
                                this.addresses.splice(j,1);
                            } 
                        }
                   })
                })
        console.log("Dentro do ConcatenarEmailComTag()")
        console.log(this.addresses)
        console.log("\n")
    }
        
    retornar(){
     return JSON.stringify ({
    fullname: this.fullname,
    eid:  this.eid,
    classes: this.classes,
    addresses: this.addresses,
    invisible: this.invisible,
    see_all: this.see_all 
     }, null, 2)
    }
    
}

/*
var tratarCabecalho = ((cabecalho) =>{
     cabecalho = cabecalho.split(',');
       for(var i=0 ; i<cabecalho.length ; i++){
        if(cabecalho[i].startsWith('"')){
            var aux = cabecalho[i] +"," + cabecalho[i+1]
            cabecalho[i]= cabecalho[i].replace(cabecalho[i],aux);
            cabecalho.splice(i+1,1);
    }
    }
    cabecalho[3]="class2"
    console.log(cabecalho)      
    return cabecalho;
});
*/

var tratarCabecalho = ((cabecalho) =>{
     var cabec = cabecalho.split(',');
    
       for(var i=0 ; i<cabec.length ; i++){
        if(cabec[i].startsWith('"')){
            var aux="";
            var percorrer = true;
            while(percorrer){
            aux = aux + cabec[i] + "," 
                
            if(cabec[i].endsWith('"')) {
                percorrer = false 
            }else {cabec.splice(i,1)}
                
            }
            var aux =  '"' + aux.substring(1,aux.length-1);
            cabec[i]= cabec[i].replace(cabec[i],aux);
        }
    }
    cabec[3]="class2" 
    return cabec;
})


var concatenarSala = ((linha) => {
        var aux="";
        var cont = 0;
       for (var i=0; i<linha.length; i++){
           if(linha[i].includes('Sala') && linha[i+1].includes('Sala')){
              aux = aux + "/ " + linha[i]+' / '+ linha[i+1] ;
              cont++;
           }else if(linha[i].includes('Sala') ==true && linha[i+1].includes('Sala')==false) {              
                linha[i] = (aux=="") ? linha[i] : aux.substring(1);
                if(linha[i+1]==""){   
                    //mantenho vazio class2
                }else{
                     linha.splice(i-cont,cont-1)
                }
               }
               
           }
    return linha;
});


var dividirLinha = ((csv) => {
  var linhas = csv.split('\n') // dividir as linhas
  var cabecalho = tratarCabecalho(linhas[0]);  
  
  return _.tail(linhas).map((linha) => {
       linha = linha.split(','); // divido as Strings
       linha = concatenarSala(linha);

       linha = linha.map((palavra) =>{
           palavra = palavra.trim().replace(/[\"?:)(]/g, '') // e removo os caracteres especiais das de cada string, mas mantenho o "/ e @",
           if(palavra.includes("/")){
            palavra = palavra.split('/')
            palavra = palavra.map((p) => p.trim());
           }
           return palavra;
       });
  
    return _.zipObject(cabecalho, linha);
  });
});

/*
    var objs=dividirLinha(f)
    var objetos =[];

       objetos = objs.map((obj) =>{
     
          var fullname=obj.fullname
          var eid=obj.eid
          var classes= (obj.class2 =="") ? obj.class : obj.class2
          var invisible = (obj.invisible=="" || obj.invisible=="0") ? false : true
          var see_all =  (obj.see_all=="") ? false : true
          var addresses= []
          var criterios = ["phone","email"];
          var pessoas = ["Pai","Mãe","Aluno"]
          
        criterios.forEach((criterio)=>{
           pessoas.forEach((pessoa)=>{
                if(criterio=="phone"){
                    addresses.push({
                      type: criterio, 
                      tags:(pessoa=="Mãe") ? ["Responsavel", "Mãe"] : [pessoa],
                      address:(pessoa=="Mãe") ? obj['"phone Responsável,Mãe"'] : (pessoa=="Pai") ? obj["phone Pai"] : obj["phone Aluno"]
                          })
                }else if(criterio=="email"){ 
                      addresses.push({
                      type: criterio, 
                      tags:(pessoa=="Pai") ? ["Responsavel", "Pai"] : [pessoa],
                      address:(pessoa=="Mãe") ? obj["email Mãe"] : (pessoa=="Pai") ? obj['"email Responsável,Pai"'] : obj["email Aluno"]
                                   })
                    }
                })
              }) 
        return  new Modelo(fullname,eid,classes,addresses,invisible,see_all)
        })
        
*/

var comecar = (() => {
    
var objs=dividirLinha(f)
var objetos =[];
console.log(objs)
var cabec= Object.keys( objs[ 0 ] ).map(key => key)
var pEmail  = [];
var pPhone  = [];

    cabec = cabec.filter((cabec) =>{
            if(cabec.includes("phone")){
                cabec = cabec.replace(/[\\"]+/,"");
                cabec = (cabec.endsWith('"')) ? cabec.replace(cabec.charAt(cabec.length-1), "") : cabec;
               pPhone.push(cabec.split(/[\s,]+/));
               return cabec;
            }else if(cabec.includes("email")) {
                cabec = cabec.replace(/[\\"]+/,"");
                cabec = (cabec.endsWith('"')) ? cabec.replace(cabec.charAt(cabec.length-1), "") : cabec;
               pEmail.push(cabec.split(/[\s,]+/));
             return cabec;
            }
        })

    objetos = objs.map((obj,i) =>{
          var fullname=obj.fullname
          var eid=obj.eid
          var classes= (obj.class2 =="") ? obj.class : obj.class2
          var invisible = (obj.invisible=="" || obj.invisible=="0") ? false : true
          var see_all =  (obj.see_all=="" ||obj.see_all=="no") ? false : true
          var addresses= [];
        
             Object.keys(obj).map(key => {
          
                if(key.includes("phone")){
                    var tag = (key==cabec[2]) ?  _.tail(pPhone[1]) : (key==cabec[1]) ? _.tail(pPhone[0]) : (key==cabec[5])? _.tail(pPhone[2]) : ""
                    if(tag!=""){
                    addresses.push({ 
                      type: "phone", 
                      tags:tag,
                      address:obj[key]
                          })
                           }
                }else if(key.includes("email")){ 
                var tag= (key == cabec[0]) ? _.tail(pEmail[0]) : (key == cabec[3]) ?  _.tail(pEmail[1]) : (key == cabec[4]) ? _.tail(pEmail[2]) : ""
                 if(tag!=""){
                  addresses.push({
                      type: "email", 
                      tags: tag,
                      address: obj[key]
                    })
                    }
                    }
  
                })
       
         return  new Modelo(fullname,eid,classes,addresses,invisible,see_all)
    })

objetos.forEach(o =>{
    o.converterArrayEmail();
    o.validarRegistro();      
})

objetos.forEach(o =>{
    o.concatenarObjetos(objetos);
    o.concatenarEmailcomTag()     
})


var json = objetos.map(o => o.retornar()); 

fs.writeFileSync("output.json", json , 'utf8')
})

comecar();

