namespace IndicaLMR.Models
{
    public class TransacaoModel
    {
        public int id { get; set; }
        public int parceiro { get; set; }
        public int valor { get; set; }
        public int tipo { get; set; }
        public int? premio { get; set; }
        public bool baixa { get; set; }
    }
}
