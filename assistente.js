class AssistenteVendasB2B {
  constructor() {
    this.leads = [];
    this.cidades = new Set();
    this.segmentos = new Set();
  }

  // Adicionar um novo lead ao banco de dados
  adicionarLead(lead) {
    if (!lead.nome || !lead.empresa || !lead.cidade || !lead.segmento) {
      throw new Error("Dados incompletos. Por favor, forneça nome, empresa, cidade e segmento.");
    }
    
    // Adicionar ID único ao lead
    lead.id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    // Adicionar data de criação
    lead.dataCriacao = new Date();
    
    // Status inicial: Novo
    lead.status = "Novo";
    
    // Histórico de contatos vazio inicialmente
    lead.historicoContatos = [];
    
    // Adicionar ao banco de dados
    this.leads.push(lead);
    
    // Atualizar conjuntos de cidades e segmentos
    this.cidades.add(lead.cidade);
    this.segmentos.add(lead.segmento);
    
    return lead.id;
  }

  // Filtrar leads por cidade
  filtrarPorCidade(cidade) {
    if (!cidade) return this.leads;
    
    return this.leads.filter(lead => 
      lead.cidade.toLowerCase() === cidade.toLowerCase()
    );
  }

  // Filtrar leads por segmento
  filtrarPorSegmento(segmento) {
    if (!segmento) return this.leads;
    
    return this.leads.filter(lead => 
      lead.segmento.toLowerCase() === segmento.toLowerCase()
    );
  }

  // Filtrar leads por múltiplos critérios
  filtrarLeads(filtros) {
    let resultado = this.leads;
    
    if (filtros.cidade) {
      resultado = resultado.filter(lead => 
        lead.cidade.toLowerCase() === filtros.cidade.toLowerCase()
      );
    }
    
    if (filtros.segmento) {
      resultado = resultado.filter(lead => 
        lead.segmento.toLowerCase() === filtros.segmento.toLowerCase()
      );
    }
    
    if (filtros.status) {
      resultado = resultado.filter(lead => 
        lead.status.toLowerCase() === filtros.status.toLowerCase()
      );
    }
    
    return resultado;
  }

  // Obter lista de todas as cidades
  listarCidades() {
    return [...this.cidades].sort();
  }

  // Obter lista de todos os segmentos
  listarSegmentos() {
    return [...this.segmentos].sort();
  }

  // Registrar um contato com um lead
  registrarContato(idLead, tipoContato, descricao) {
    const lead = this.leads.find(l => l.id === idLead);
    
    if (!lead) {
      throw new Error("Lead não encontrado.");
    }
    
    const contato = {
      data: new Date(),
      tipo: tipoContato, // ex: "email", "telefone", "reunião"
      descricao,
      resultado: null // será preenchido posteriormente
    };
    
    lead.historicoContatos.push(contato);
    return contato;
  }

  // Atualizar status de um lead
  atualizarStatusLead(idLead, novoStatus) {
    const statusesValidos = ["Novo", "Contatado", "Interessado", "Qualificado", "Proposta", "Fechado", "Perdido"];
    
    if (!statusesValidos.includes(novoStatus)) {
      throw new Error(`Status inválido. Use um dos seguintes: ${statusesValidos.join(", ")}`);
    }
    
    const lead = this.leads.find(l => l.id === idLead);
    
    if (!lead) {
      throw new Error("Lead não encontrado.");
    }
    
    lead.status = novoStatus;
    lead.dataAtualizacao = new Date();
    
    return lead;
  }

  // Gerar relatório de prospecção
  gerarRelatorioProspeccao() {
    const total = this.leads.length;
    const porStatus = {};
    const porCidade = {};
    const porSegmento = {};
    
    // Inicializar contadores de status
    ["Novo", "Contatado", "Interessado", "Qualificado", "Proposta", "Fechado", "Perdido"].forEach(status => {
      porStatus[status] = 0;
    });
    
    // Contar leads por status, cidade e segmento
    this.leads.forEach(lead => {
      // Contar por status
      porStatus[lead.status] = (porStatus[lead.status] || 0) + 1;
      
      // Contar por cidade
      porCidade[lead.cidade] = (porCidade[lead.cidade] || 0) + 1;
      
      // Contar por segmento
      porSegmento[lead.segmento] = (porSegmento[lead.segmento] || 0) + 1;
    });
    
    return {
      totalLeads: total,
      distribuicaoPorStatus: porStatus,
      distribuicaoPorCidade: porCidade,
      distribuicaoPorSegmento: porSegmento,
      taxaConversao: porStatus["Fechado"] / total || 0
    };
  }

  // Sugerir próximos leads a contatar
  sugerirProximosContatos(quantidade = 5) {
    // Priorizar leads qualificados que ainda não receberam proposta
    const leadsQualificados = this.leads.filter(lead => 
      lead.status === "Qualificado"
    ).sort((a, b) => 
      // Ordenar por data de atualização (mais recentes primeiro)
      b.dataAtualizacao - a.dataAtualizacao
    );
    
    // Se não houver leads qualificados suficientes, incluir leads interessados
    let sugestoes = [...leadsQualificados];
    
    if (sugestoes.length < quantidade) {
      const leadsInteressados = this.leads.filter(lead => 
        lead.status === "Interessado"
      ).sort((a, b) => b.dataAtualizacao - a.dataAtualizacao);
      
      sugestoes = sugestoes.concat(leadsInteressados);
    }
    
    // Limitar ao número solicitado
    return sugestoes.slice(0, quantidade);
  }
}

// Exemplo de uso:
function exemploUso() {
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
  
  // Filtrar leads por cidade
  const leadsSaoPaulo = assistente.filtrarPorCidade("São Paulo");
  console.log("Leads em São Paulo:", leadsSaoPaulo.length);
  
  // Filtrar leads por segmento
  const leadsVarejo = assistente.filtrarPorSegmento("Varejo");
  console.log("Leads no segmento de Varejo:", leadsVarejo.length);
  
  // Filtrar por múltiplos critérios
  const leadsFiltrados = assistente.filtrarLeads({
    cidade: "Rio de Janeiro",
    status: "Novo"
  });
  console.log("Leads no Rio de Janeiro com status Novo:", leadsFiltrados.length);
  
  // Registrar contato com um lead
  const idLead = assistente.leads[0].id;
  assistente.registrarContato(
    idLead, 
    "email", 
    "Enviado apresentação da empresa e catálogo de produtos"
  );
  
  // Atualizar status do lead
  assistente.atualizarStatusLead(idLead, "Contatado");
  
  // Gerar relatório
  const relatorio = assistente.gerarRelatorioProspeccao();
  console.log("Relatório de prospecção:", relatorio);
  
  // Sugerir próximos contatos
  const sugestoes = assistente.sugerirProximosContatos(3);
  console.log("Sugestões de próximos contatos:", sugestoes);
  
  // Listar cidades e segmentos disponíveis
  console.log("Cidades:", assistente.listarCidades());
  console.log("Segmentos:", assistente.listarSegmentos());
}
