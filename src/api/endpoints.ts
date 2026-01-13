const url_Dev = 'http://localhost:54863'
const url_Prod = 'http://aw8kco8ck8k4c8s4ckcg440g.217.15.170.97.sslip.io'

const BASE_URL = url_Prod


export const API_ENDPOINTS = {
    produtos: {
        findAll: `${BASE_URL}/produto/findAll`,
        findAllProdutoPai: `${BASE_URL}/produto/findAllByProdutiPai`,
        findAllVariacoes: `${BASE_URL}/produto/findAllVariacoes/`,
        getProdutosAPI: `${BASE_URL}/produto/getProdutosAPI`,
        updateFoto: `${BASE_URL}/produto/updateFoto/`, // Adicionar ID do Produto
        changeAtivo: `${BASE_URL}/produto/changeAtivo/`, // Adicionar ID do Produto
        visualizarFoto: `${BASE_URL}/uploads/`, // Adicionar img_url do Produto
        updateEstoque: `${BASE_URL}/produto/updateEstoque/1`
    }
}