namespace IndicaLMR.Models
{
    public class UsuarioModel
    {
        public int? id { get; set; }
        public string? nome { get; set; }

        public string email { get; set; }
        public string? senha { get; set; }
        public bool? administrador {  get; set; }
        public UsuarioModel? usuarioAntigo { get; set; }
    }
}
