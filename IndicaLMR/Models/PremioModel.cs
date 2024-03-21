namespace IndicaLMR.Models
{
    public class PremioModel
    {
        public int Id { get; set; }
        public int Valor { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public bool Disponivel { get; set; }
        public PremioModel? premioAntigo { get; set; }
    }
}
