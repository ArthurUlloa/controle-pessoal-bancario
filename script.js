// Pega os elementos do HTML

const form = document.getElementById("formTransacao");

const descricaoInput = document.getElementById("descricao");

const valorInput = document.getElementById("valor");

const categoriaInput = document.getElementById("categoria");

const tipoInput = document.getElementById("tipo");

const listaTransacoes = document.getElementById("listaTransacoes");

const filtro = document.getElementById("filtro");

const saldoElemento = document.getElementById("saldo");

const receitasElemento = document.getElementById("receitas");

const despesasElemento = document.getElementById("despesas");


// Busca as transações salvas

let transacoes = JSON.parse(
    localStorage.getItem("transacoes")
) || [];


// Quando enviar o formulário

form.addEventListener("submit", function(event) {

    event.preventDefault();


    const descricao = descricaoInput.value.trim();

    const valor = Number(valorInput.value);

    const categoria = categoriaInput.value;

    const tipo = tipoInput.value;


    // Verificação

    if (descricao === "" || valor <= 0) {

        alert("Preencha os campos corretamente.");

        return;
    }


    // Cria uma nova transação

    const novaTransacao = {

        id: Date.now(),

        descricao: descricao,

        valor: valor,

        categoria: categoria,

        tipo: tipo

    };


    // Adiciona na lista

    transacoes.push(novaTransacao);


    // Salva no navegador

    salvarTransacoes();


    // Atualiza a tela

    atualizar();


    // Limpa o formulário

    form.reset();

});


// Salvar no LocalStorage

function salvarTransacoes() {

    localStorage.setItem(
        "transacoes",
        JSON.stringify(transacoes)
    );

}


// Atualizar tudo

function atualizar() {

    calcularResumo();

    mostrarTransacoes();

}


// Calcular saldo, receitas e despesas

function calcularResumo() {

    let receitas = 0;

    let despesas = 0;


    transacoes.forEach(function(transacao) {

        if (transacao.tipo === "receita") {

            receitas += transacao.valor;

        } else {

            despesas += transacao.valor;

        }

    });


    const saldo = receitas - despesas;


    receitasElemento.textContent =
        formatarMoeda(receitas);


    despesasElemento.textContent =
        formatarMoeda(despesas);


    saldoElemento.textContent =
        formatarMoeda(saldo);

}


// Mostrar transações

function mostrarTransacoes() {

    listaTransacoes.innerHTML = "";


    let transacoesFiltradas = transacoes;


    // Aplicar filtro

    if (filtro.value !== "todos") {

        transacoesFiltradas = transacoes.filter(
            function(transacao) {

                return transacao.tipo === filtro.value;

            }
        );

    }


    // Se não tiver nenhuma

    if (transacoesFiltradas.length === 0) {

        listaTransacoes.innerHTML = `
            <p class="vazio">
                Nenhuma transação encontrada.
            </p>
        `;

        return;
    }


    // Mostrar da mais recente para a mais antiga

    transacoesFiltradas
        .slice()
        .reverse()
        .forEach(function(transacao) {


            const div = document.createElement("div");

            div.classList.add("transacao");


            const sinal =
                transacao.tipo === "receita"
                    ? "+"
                    : "-";


            div.innerHTML = `

                <div class="info">

                    <h3>
                        ${transacao.descricao}
                    </h3>

                    <p>
                        ${transacao.categoria}
                    </p>

                </div>


                <div class="valor">

                    <span class="${transacao.tipo}">

                        ${sinal}
                        ${formatarMoeda(transacao.valor)}

                    </span>


                    <button
                        class="excluir"
                        onclick="excluirTransacao(${transacao.id})"
                    >

                        Excluir

                    </button>

                </div>

            `;


            listaTransacoes.appendChild(div);

        });

}


// Excluir transação

function excluirTransacao(id) {

    transacoes = transacoes.filter(
        function(transacao) {

            return transacao.id !== id;

        }
    );


    salvarTransacoes();

    atualizar();

}


// Formatar dinheiro

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// Atualizar quando mudar o filtro

filtro.addEventListener(
    "change",
    mostrarTransacoes
);

// Inicializar aplicação

atualizar();