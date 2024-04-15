using Newtonsoft.Json;

namespace IndicaLMR.Classes
{
    public class Vios
    {
        private readonly HttpClient _httpClient;
        private readonly string urlBase = "https://lmradvogados.vios.com.br/api/integracoes/redator/cliente/esta-cadastrado/";

        public Vios(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("Authorization-Vios", Conexao.TokenVios);
        }

        public async Task<bool> VerificarCadastro(string cpf)
        {
            var response = await _httpClient.GetAsync(urlBase + cpf);
            response.EnsureSuccessStatusCode();
            var conteudo = await response.Content.ReadAsStringAsync();
            var responseObj = JsonConvert.DeserializeObject<RespostaAPI>(conteudo);
            return responseObj!.Esta_Cadastrado;
        }

        public class RespostaAPI
        {
            public bool Esta_Cadastrado { get; set; }
            public int Id { get; set; }
        }
    }
}
