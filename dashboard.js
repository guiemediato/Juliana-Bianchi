// dashboard.js
function atualizarDashboard() {
    // Gerar relatório
    const relatorio = assistente.gerarRelatorioProspeccao();
    
    // Atualizar contadores
    document.getElementById('total-leads').textContent = relatorio.totalLeads;
    
    // Distribuição por status
    const statusHTML = Object.entries(relatorio.distribuicaoPorStatus)
        .map(([status, quantidade]) => {
            if (quantidade > 0) {
                const porcentagem = ((quantidade / relatorio.totalLeads) * 100).toFixed(1);
                return `<div class="status-bar">
                    <span>${status}: ${quantidade} (${porcentagem}%)</span>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${porcentagem}%"></div>
                    </div>
                </div>`;
            }
            return '';
        })
        .join('');
    
    document.getElementById('status-distribution').innerHTML = statusHTML;
    
    // Top cidades
    const cidadesHTML = Object.entries(relatorio.distribuicaoPorCidade)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([cidade, quantidade]) => {
            return `<li>${cidade}: ${quantidade} leads</li>`;
        })
        .join('');
    
    document.getElementById('top-cidades').innerHTML = cidadesHTML;
    
    // Top segmentos
    const segmentosHTML = Object.entries(relatorio.distribuicaoPorSegmento)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([segmento, quantidade]) => {
            return `<li>${segmento}: ${quantidade} leads</li>`;
        })
        .join('');
    
    document.getElementById('top-segmentos').innerHTML = segmentosHTML;
}
