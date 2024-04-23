using Newtonsoft.Json;

namespace IndicaLMR.Classes
{
    public class Asaas
    {
        private readonly HttpClient _httpClient;
        private readonly string urlBase = "https://api.asaas.com/v3/";

        public Asaas(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("access_token", Conexao.TokenAsaas);
        }

        public async Task<string> BuscarId(string cpf)
        {
            var response = await _httpClient.GetAsync(urlBase + "customers?cpfCnpj=" + cpf);
            response.EnsureSuccessStatusCode();
            var conteudo = await response.Content.ReadAsStringAsync();
            var responseObj = JsonConvert.DeserializeObject<RespostaAPI>(conteudo);
            string id = responseObj.Data[0].Id;
            return id;
        }

        public async Task<RespostaAPI> ListarCobrancas(string id, int pagina)
        {
            int offset = pagina == 1 ? 0 : (pagina - 1) * 5;
            var response = await _httpClient.GetAsync(urlBase + "payments?customer=" + id + "&status=PENDING&limit=6&offset=" + offset);
            response.EnsureSuccessStatusCode();
            var conteudo = await response.Content.ReadAsStringAsync();
            var resposta = JsonConvert.DeserializeObject<RespostaAPI>(conteudo);
            resposta.HasMore = 5 < resposta.Data.Length ? true : false;
            resposta.Data = resposta.Data.Length > 5 ? resposta.Data.SkipLast(1).ToArray() : resposta.Data;
            return resposta;
        }
    }

    public class RespostaAPI
    {
        public string Object { get; set; }
        public bool HasMore { get; set; }
        public int TotalCount { get; set; }
        public int Limit { get; set; }
        public int Offset { get; set; }
        public Data[] Data { get; set; }
    }

    public class Data
    {
        public string Object { get; set; }
        public string Id { get; set; }
        public string DateCreated { get; set; }
        public float? Value { get; set; }
        public string? Description { get; set; }
        public string? BillingType { get; set; }
        public string? Status { get; set; }

        [JsonConstructor]

        public Data(string objeto, string id, string dataCriacao, float? valor = null, string? descricao = null, string? tipo = null, string? status = null)
        {
            Object = objeto;
            Id = id;
            DateCreated = dataCriacao;
            Value = valor;
            Description = descricao;
            BillingType = tipo;
            Status = status;
        }
    }
}
