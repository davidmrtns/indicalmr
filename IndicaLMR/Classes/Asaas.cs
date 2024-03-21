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
            _httpClient.DefaultRequestHeaders.Add("access_token", "$aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAzOTg3MDU6OiRhYWNoXzM3NTI5YmFmLTlhZjEtNDRiMy04ZDIxLTg1ZmY3NDZlMjBkMw==");
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

        public async Task<Data[]> ListarCobrancas(string id)
        {
            var response = await _httpClient.GetAsync(urlBase + "payments?customer=" + id + "&status=PENDING");
            response.EnsureSuccessStatusCode();
            var conteudo = await response.Content.ReadAsStringAsync();
            var responseObj = JsonConvert.DeserializeObject<RespostaAPI>(conteudo);
            return responseObj.Data;
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
