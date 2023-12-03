var usuarioModel = require("../models/usuarioModel");

var sessoes = [];


var atuacaoModel = require("../models/atuacaoModel");

function buscarAcoes(req, res) {

    atuacaoModel.buscarAcoes()
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}


function buscarAcao(req, res) {
    var idAcao = req.params.idAcao
    
    atuacaoModel.buscarAcao(idAcao)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        )
        .catch(
            function (erro) {
                console.log(erro);
                console.log(erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}



function adicionar(req, res) {
    var nome = req.body.nome
    var descricao = req.body.descricao


    if(nome == undefined){
        console.log("Nome indefinido")
    } else if (descricao == undefined){
        console.log("Descricao indefinida")
    } else{
    atuacaoModel.adicionar(nome, descricao)
    .then(function (resultado) {
        res.json(true);
    }).catch(function (erro) {
        console.log(erro);
        console.log( erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
  }
}






module.exports = {
    buscarAcoes,
    buscarAcao,
    adicionar
}   