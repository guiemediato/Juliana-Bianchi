// Inicializar o assistente
const assistente = new AssistenteVendasB2B();

// Adicionar alguns leads de exemplo
assistente.adicionarLead({
    nome: "João Silva",
    empresa: "Tech Solutions",
    cargo: "Diretor de Operações",
    telefone: "(11) 98765-4321",
    email: "joao.silva@techsolutions.com",
    cidade: "São Paulo",
    segmento: "Tecnologia",
    tamanhoEmpresa: "Médio",
    observacoes: "Interessado em soluções de automação"
});
  
assistente.adicionarLead({
    nome: "Maria Santos",
    empresa: "Construtora Horizonte",
    cargo: "Gerente de Compras",
    telefone: "(21) 97654-3210",
    email: "maria.santos@horizonteconstrutora.com",
    cidade: "Rio de Janeiro",
    segmento: "Construção Civil",
    tamanhoEmpresa: "Grande",
    observacoes: "Buscando novos fornecedores"
});
  
assistente.adicionarLead({
    nome: "Carlos Oliveira",
    empresa: "Supermercados Economia",
    cargo: "Diretor Comercial",
    telefone: "(31) 96543-2109",
    email: "carlos.oliveira@economia.com",
    cidade: "Belo Horizonte",
    segmento: "Varejo",
    tamanhoEmpresa: "Grande",
    observacoes: "Expansão para novas regiões"
});

// Função para atualizar a tabela de leads
function atualizarTabelaLeads(leads) {
    const tbody = document.getElementById('leads-tbody');
    tbody.innerHTML = '';
    
    leads.forEach(lead => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${lead.nome}</td>
            <td>${lead.empresa}</td>
            <td>${lead.cidade}</td>
            <td>${lead.segmento}</td>
            <td>${lead.status}</td>
            <td>
                <button class="btn-editar" data-id="${lead.id}">Editar</button>
                <button class="btn-atualizar-status" data-id="${lead.id}">Atualizar Status</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Função para atualizar os filtros
function atualizarFiltros() {
    const selectCidade = document.getElementById('filtro-cidade');
    const selectSegmento = document.getElementById('filtro-segmento');
    
    // Limpar opções existentes (manter a primeira)
    while (selectCidade.options.length > 1) {
        selectCidade.remove(1);
    }
    
    while (selectSegmento.options.length > 1) {
        selectSegmento.remove(1);
    }
    
    // Adicionar cidades
    assistente.listarCidades().forEach(cidade => {
        const option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        selectCidade.appendChild(option);
    });
    
    // Adicionar segmentos
    assistente.listarSegmentos().forEach(segmento => {
        const option = document.createElement('option');
        option.value = segmento;
        option.textContent = segmento;
        selectSegmento.appendChild(option);
    });
}

// Inicializar a tabela e filtros
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar todos os leads inicialmente
    atualizarTabelaLeads(assistente.leads);
    
    // Configurar filtros
    atualizarFiltros();
    
    // Adicionar evento ao botão de filtrar
    document.getElementById('btn-filtrar').addEventListener('click', () => {
        const cidade = document.getElementById('filtro-cidade').value;
        const segmento = document.getElementById('filtro-segmento').value;
        
        const filtros = {};
        if (cidade) filtros.cidade = cidade;
        if (segmento) filtros.segmento = segmento;
        
        const leadsFiltrados = assistente.filtrarLeads(filtros);
        atualizarTabelaLeads(leadsFiltrados);
    });
    
    // Adicionar evento ao formulário de novo lead
    document.getElementById('form-lead').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const novoLead = {
            nome: document.getElementById('nome').value,
            empresa: document.getElementById('empresa').value,
            cidade: document.getElementById('cidade').value,
            segmento: document.getElementById('segmento').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value,
            cargo: "Não informado"
        };
        
        assistente.adicionarLead(novoLead);
        
        // Atualizar tabela e filtros
        atualizarTabelaLeads(assistente.leads);
        atualizarFiltros();
        
        // Limpar formulário
        document.getElementById('form-lead').reset();
    });
});

// Salvar dados no localStorage
function salvarDados() {
    localStorage.setItem('leadsData', JSON.stringify(assistente.leads));
}

// Carregar dados do localStorage
function carregarDados() {
    const dados = localStorage.getItem('leadsData');
    if (dados) {
        assistente.leads = JSON.parse(dados);
        // Recriar os conjuntos de cidades e segmentos
        assistente.cidades = new Set();
        assistente.segmentos = new Set();
        assistente.leads.forEach(lead => {
            assistente.cidades.add(lead.cidade);
            assistente.segmentos.add(lead.segmento);
        });
    }
}

// Tentar carregar dados salvos
try {
    carregarDados();
} catch (e) {
    console.error("Erro ao carregar dados:", e);
}

// Salvar dados quando a página for fechada
window.addEventListener('beforeunload', salvarDados);
