const { text } = require("express");
let strikeModel = require("../models/strikeModel");

let sessoes = [];

function listar(req, res) {
    console.log('no controller');
    let codInstituicao = req.params.codInstituicao;
    let dataHora = req.params.dataHora;
    let ativo = req.params.ativo === 'true';
    let valido = req.params.valido === 'true';
    let invalido = req.params.invalido === 'true';
    let inativo = req.params.inativo === 'true';
    let textoBusca = req.params.textoBusca;

    let situacoes = [ativo, valido, invalido, inativo];
    let condicoes = [];

    console.log('textoBusca = ' + textoBusca);

    if (situacoes.filter(Boolean).length >= 2) {
        condicoes.push("AND")

        if (ativo) {
            condicoes.at(0) == "AND" ? condicoes.push(`situacao = 'Ativo'`) : 
            condicoes.push(`OR situacao = 'Ativo'`);
        }

        if (valido) {
            condicoes.at(0) == "AND" ? condicoes.push(`situacao = 'Válido'`) : 
            condicoes.push(`OR situacao = 'Válido'`);
        }

        if (invalido) {
            condicoes.at(0) == "AND" ? condicoes.push(`situacao = 'Inválido'`) : 
            condicoes.push(`OR situacao = 'Inválido'`);
        }

        if (inativo) {
            condicoes.at(0) == "AND" ? condicoes.push(`situacao = 'Inativo'`) : 
            condicoes.push(`OR situacao = 'Inativo'`);
        }
    } else if (!ativo && !valido && !invalido && !inativo) {
        condicoes.push("AND situacao != 'Inativo'");
    } else {
        if (ativo) {
            condicoes.push(" AND situacao = 'Ativo'");
        }

        if (valido) {
            condicoes.push(" AND situacao = 'Válido'");
        }

        if (invalido) {
            condicoes.push(" AND situacao = 'Inválido'");
        }

        if (inativo) {
            condicoes.push(" AND situacao = 'Inativo'");
        }
    }

    if (textoBusca !== 'false') {
        condicoes.push(`nome LIKE '%${textoBusca}%'`);
    }

    let orderBy = '';

    if (dataHora === 'mais_recente') {
        orderBy = ' ORDER BY dataHora';
    } else if (dataHora === 'mais_antigo') {
        orderBy = ' ORDER BY dataHora DESC';
    }

    var query = condicoes.join(' ');

    console.log('controller, query = ' + query);

    strikeModel.listar(codInstituicao, query)
        .then(function (resultado) {
            console.log('no then do controller');
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).send("Nenhum resultado encontrado!");
            }
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os strikes: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


function listarSituacao(req, res) {
    console.log('no controller');
    let codInstituicao = req.params.codInstituicao;
    let situacao = req.params.situacao;

    strikeModel.listarSituacao(codInstituicao, situacao)
    .then(function (resultado) {
        console.log('no then do controller');
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os strikes com situação: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function contadores(req, res) {
    console.log('no controller');
    let codInstituicao = req.params.codInstituicao;

    strikeModel.contadores(codInstituicao)
    .then(function (resultado) {
        console.log('no then do controller');
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os contadores dos strikes: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function excluirStrike(req, res) {
    console.log('no controller', req.body);
    let checkboxIds = req.body.checkboxIdsServer;
    let usarIdMaquina = req.body.usarIdMaquina;
    let texto = '';

    if(checkboxIds != '') {
        if(usarIdMaquina) {
            texto = `WHERE fkMaquina IN(${checkboxIds})`;
        } else {
            texto = `WHERE idStrike IN(${checkboxIds})`;
        }
    }

    console.log('texto: ' + texto);

    strikeModel.excluirStrike(texto)
    .then(function (resultado) {
        console.log('no then do controller');

        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao excluir o(s) strike(s): ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function editarStrike(req, res) {
    console.log('no controller da edição do strike', req.body);
    let motivo = req.body.motivo;
    let duracao = req.body.duracao;
    let situacao = req.body.situacao;
    let idStrike = req.body.idStrike;
    let checkboxIds = req.body.checkboxIdsServer;
    let texto = '';
    texto = ` 
        motivo = '${motivo}',
        duracao = ${duracao},
        fkSituacao = ${situacao}
        WHERE idStrike IN(${checkboxIds})
    `;

    console.log('texto: ' + texto);

    strikeModel.editarStrike(texto)
    .then(function (resultado) {
        console.log('no then do controller');

        res.status(200).json(resultado);
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao editar o(s) strike(s): ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function strikePMes(req, res) {
    let idInstituicao = req.params.idInstituicao;
    let opcao = req.params.opcao;
    
    let qtdMes;

    switch(opcao){
        case "1":
             qtdMes = "MONTH(strike.dataHora) = MONTH(GETDATE());";
        break;

        case "2":
             qtdMes = "strike.dataHora >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 2, 0) AND strike.dataHora < DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) + 1, 0);";
        break;

        case "3":
             qtdMes = "dataHora >= DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) - 6, 0) AND dataHora < DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()) + 1, 0);";
        break;

        default:
            qtdMes = "MONTH(strike.dataHora) = MONTH(GETDATE());";
        break;
    }

    strikeModel.strikePMes(idInstituicao, qtdMes)
    .then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os contadores dos strikes: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}


function kpiInfos(req, res) {
    let idInstituicao = req.params.idInstituicao;

    strikeModel.kpiInfos(idInstituicao)
    .then(function (resultado) {
        console.log('no then do controller');
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Erro ao buscar informações de kpi: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function acaoETempoUsuarioEspecifico(req, res) {

    let idFuncionario = req.params.idFuncionario;

    strikeModel.acaoETempoUsuarioEspecifico(idFuncionario)
    .then(function (resultado) {
        console.log('no then do controller');
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!");
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log(erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function strikesToast(req, res) {
    let idInstituicao = req.params.codInstituicao;
   
    strikeModel.strikesToast(idInstituicao)
        .then((response) => {
            res.json(response)
        })
        .catch((err) => {
            console.log(err);
            console.log(err.sqlMessage);
            res.status(500).json(err.sqlMessage);
        })
}


module.exports = {
    listar,
    listarSituacao,
    contadores,
    strikePMes,
    kpiInfos,
    excluirStrike,
    acaoETempoUsuarioEspecifico,
    strikesToast,
    editarStrike
}