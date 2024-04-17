using IndicaLMR.Classes;
using IndicaLMR.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text.Json;

namespace IndicaLMR.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class ApiController : ControllerBase
    {
        private readonly Asaas _asaas;

        public ApiController(Asaas asaas)
        {
            _asaas = asaas;
        }

        [Authorize(Policy = "Admin")]
        [HttpPost("inserir-parceiro")]
        public IActionResult InserirParceiro([FromBody] ParceiroModel parceiroModel)
        {
            if (parceiroModel.telefone.Length == 11 && parceiroModel.telefone.All(char.IsDigit))
            {
                if (parceiroModel.cpf.Length == 11 && parceiroModel.cpf.All(char.IsDigit))
                {
                    try
                    {
                        Parceiro parceiro = new Parceiro(parceiroModel.nome, parceiroModel.telefone, parceiroModel.cpf, parceiroModel.tipo.Value, parceiroModel.senha);
                        return Ok(parceiro.CadastrarParceiro());
                    }
                    catch
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    return BadRequest("O CPF deve possuir apenas números e conter 11 dígitos");
                }
            }
            else
            {
                return BadRequest("O telefone deve possuir apenas números e conter 11 dígitos");
            }
        }

        [HttpPost("criar-indicacao")]
        public IActionResult CriarIndicacao([FromBody] ParceiroIndicadoModel parceiroIndicado)
        {
            if (parceiroIndicado.telefone.Length == 11 && parceiroIndicado.telefone.All(char.IsDigit))
            {
                Parceiro indicado = new Parceiro(parceiroIndicado.telefone, parceiroIndicado.nome);

                try
                {
                    int idIndicado = (int)indicado.CadastrarParceiroIndicado();

                    if (idIndicado != 0)
                    {
                        Indicacao indicacao = new Indicacao(0, parceiroIndicado.parceiro, idIndicado);
                        indicacao.CriarIndicacao();
                        return Ok();
                    }
                    else
                    {
                        return Conflict();
                    }
                }
                catch
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest("O telefone deve possuir apenas números e conter 11 dígitos");
            }
        }

        [HttpPost("criar-transacao")]
        public IActionResult CriarTranscacao([FromBody] TransacaoModel novaTransacao)
        {
            try
            {
                Transacao transacao;
                int tipoParceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!.Tipo;

                if (tipoParceiro == 0)
                {
                    if (novaTransacao.premio != null)
                    {
                        int valor = Premio.BuscarValor((int)novaTransacao.premio);
                        transacao = new Transacao(0, novaTransacao.parceiro, valor, 2, novaTransacao.premio, false);
                    }
                    else
                    {
                        transacao = new Transacao(0, novaTransacao.parceiro, novaTransacao.valor, novaTransacao.tipo, novaTransacao.premio, false);
                    }

                    int credito = Parceiro.ConsultarCredito(novaTransacao.parceiro);

                    if (transacao.CriarTransacao(credito))
                    {
                        return Ok(true);
                    }
                    else
                    {
                        return Ok(false);
                    }
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("buscar-parceiro/{cpf}")]
        public IActionResult BuscarParceiro(string cpf)
        {
            try
            {
                Parceiro parceiro = Parceiro.BuscarParceiro(cpf);

                if(parceiro == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(parceiro);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("contar-indicacoes")]
        public IActionResult ContarIndicacoes()
        {
            try
            {
                Parceiro parceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!;

                if (parceiro == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(Parceiro.ContarIndicacoes(parceiro.Id));
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("contar-indicacoes-fechadas")]
        public IActionResult ContarIndicacoesFechadas()
        {
            try
            {
                Parceiro parceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!;

                if (parceiro == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(Parceiro.ContarIndicacoesFechadas(parceiro.Id));
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("contar-indicacoes-id/{id}")]
        public IActionResult ContarIndicacoesId(int id)
        {
            try
            {
                return Ok(Parceiro.ContarIndicacoes(id));
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("contar-indicacoes-fechadas-id/{id}")]
        public IActionResult ContarIndicacoesFechadasId(int id)
        {
            try
            {
                return Ok(Parceiro.ContarIndicacoesFechadas(id));
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("buscar-dados-parceiro")]
        public IActionResult BuscarParceiro()
        {
            try
            {
                int id = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!.Id;
                Parceiro parceiro = Parceiro.BuscarParceiro(id);

                if (parceiro == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(parceiro);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("buscar-dados-parceiro/{id}")]
        public IActionResult BuscarParceiroId(int id)
        {
            try
            {
                Parceiro parceiro = Parceiro.BuscarParceiro(id);

                if (parceiro == null)
                {
                    return NotFound();
                }
                else
                {
                    return Ok(parceiro);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("listar-indicacoes")]
        public IActionResult ListarIndicacoes([FromQuery] int pagina, [FromQuery] int tamanhoPagina)
        {
            try
            {
                int id = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!.Id;

                List<Parceiro> indicacoes = Parceiro.ListarIndicacoes(id, pagina, tamanhoPagina);

                if (indicacoes == null)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(indicacoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-indicacoes-id/{id}")]
        public IActionResult ListarIndicacoesPorId(int id, [FromQuery] int pagina, [FromQuery] int tamanhoPagina)
        {
            try
            {
                List<Parceiro> indicacoes = Parceiro.ListarIndicacoes(id, pagina, tamanhoPagina);

                if (indicacoes == null)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(indicacoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("listar-transacoes")]
        public IActionResult ListarTransacoes([FromQuery] int pagina, [FromQuery] int tamanhoPagina)
        {
            try
            {
                int id = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!.Id;

                List<Transacao> transacoes = Transacao.ListarTransacoes(id, pagina, tamanhoPagina);

                if (transacoes == null)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(transacoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("asaas")]
        public async Task<IActionResult> UsarAsaas()
        {
            string cpf = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!.Cpf;

            try
            {
                string id = await _asaas.BuscarId(cpf);
                var boletos = await _asaas.ListarCobrancas(id);
                return Ok(boletos);
            }
            catch (Exception erro)
            {
                string msg = erro.Message;
                return BadRequest();
            }
        }

        [HttpPatch("editar-dados")]
        public IActionResult EditarDados([FromBody] ParceiroModel parceiro)
        {
            try
            {
                Parceiro parceiroAntigo = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser")!)!;
                Parceiro parceiroNovo = new Parceiro(parceiro.nome, parceiro.telefone, parceiro.senha);
                Parceiro parceiroAtualizado = parceiroAntigo.EditarParceiro(parceiroNovo);

                string token = Token.CriarTokenParceiro(parceiroAtualizado.Id, parceiroAtualizado.Nome, parceiroAtualizado.Cpf, parceiroAtualizado.Telefone);

                HttpContext.Session.SetString("_LoggedUser", JsonSerializer.Serialize(parceiroAtualizado));
                Response.Cookies.Append("Authorization", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.Strict
                });

                return Ok(true);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpDelete("excluir-conta")]
        public IActionResult ExcluirConta()
        {
            try
            {
                Parceiro parceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser"));
                return Ok(parceiro.DesativarParceiro());
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [HttpGet("listar-premios-disponiveis")]
        public IActionResult ListarPremiosDisponiveis()
        {
            try
            {
                List<Premio> premios = Premio.ListarPremiosDisponiveis();
                return Ok(premios);
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [HttpGet("real-em-ponto")]
        public IActionResult ObterValorRealPonto()
        {
            try
            {
                return Ok(Configuracao.ValorRealPonto());
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-indicacoes/{id}")]
        public IActionResult ListarIndicacoesParceiro(int id, [FromQuery] int pagina, [FromQuery] int tamanhoPagina)
        {
            try
            {
                List<Parceiro> indicacoes = Parceiro.ListarIndicacoes(id, pagina, tamanhoPagina);

                if (indicacoes == null)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(indicacoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-transacoes/{id}")]
        public IActionResult ListarTransacoesParceiro(int id, [FromQuery] int pagina, [FromQuery] int tamanhoPagina)
        {
            try
            {
                List<Transacao> transacoes = Transacao.ListarTransacoes(id, pagina, tamanhoPagina);

                if (transacoes == null)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(transacoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-parceiros")]

        public IActionResult ListarParceiros([FromQuery] int pagina, [FromQuery] int tamanhoPagina, [FromQuery] string? nome = null, [FromQuery] string? cpf = null, [FromQuery] int? tipo = null)
        {
            try
            {
                List<Parceiro> parceiros = Parceiro.ListarParceiros(nome, cpf, tipo, pagina, tamanhoPagina);
                return Ok(parceiros);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-transacoes-filtro")]
        public IActionResult ListarTransacoesInterno([FromQuery] int pagina, [FromQuery] int tamanhoPagina, [FromQuery] int? tipo = null, [FromQuery] bool? baixa = null, [FromQuery] string? nome = null, [FromQuery] string? cpf = null)
        {
            try
            {
                List<Transacao> transacoes = Transacao.ListarTransacoesFiltro(pagina, tamanhoPagina, tipo, baixa, nome, cpf);

                if (transacoes == null)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(transacoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-transacoes-por-parceiro/{id}")]
        public IActionResult ListarTransacoesPorParceiro(int id, [FromQuery] int pagina, [FromQuery] int tamanhoPagina)
        {
            try
            {
                List<Transacao> transacoes = Transacao.ListarTransacoesPorParceiro(id, pagina, tamanhoPagina);

                if (transacoes == null)
                {
                    return NoContent();
                }
                else
                {
                    return Ok(transacoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-configuracoes")]
        public IActionResult ListarConfiguracoes()
        {
            try
            {
                List<Configuracao> configuracoes = Configuracao.ListarConfiguracoes();

                if (configuracoes.IsNullOrEmpty())
                {
                    return NoContent();
                }
                else
                {
                    return Ok(configuracoes);
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPost("criar-premio")]
        public IActionResult CriarPremio([FromBody] PremioModel premioModel)
        {
            try
            {
                Premio premio = new Premio(premioModel.Id, premioModel.Nome, premioModel.Descricao, premioModel.Valor, premioModel.Disponivel);
                return Ok(premio.CriarPremio());
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPost("editar-premio")]
        public IActionResult EditarPremio([FromBody] PremioModel premioModel)
        {
            try
            {
                Premio premioAntigo = new Premio(premioModel.premioAntigo.Id, 
                    premioModel.premioAntigo.Nome, premioModel.premioAntigo.Descricao, 
                    premioModel.premioAntigo.Valor, premioModel.premioAntigo.Disponivel);

                Premio premioNovo = new Premio(premioModel.Id, premioModel.Nome, premioModel.Descricao, premioModel.Valor, premioModel.Disponivel);
                
                Premio premioAtualizado = premioAntigo.AlterarPremio(premioNovo);
                return Ok(premioAtualizado);
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete("excluir-premio/{id}")]
        public IActionResult ExcluirPremio(int id)
        {
            try
            {
                return Ok(Premio.ExcluirPremio(id));
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-premios")]
        public IActionResult ListarPremios()
        {
            try
            {
                List<Premio> premios = Premio.ListarPremios();
                return Ok(premios);
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPost("criar-usuario")]
        public IActionResult CriarUsuario([FromBody] UsuarioModel usuarioModel)
        {
            try
            {
                Usuario usuario = new Usuario(0, usuarioModel.nome, usuarioModel.email, usuarioModel.senha, (bool)usuarioModel.administrador!, false);
                return Ok(usuario.CriarUsuario());
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("listar-usuarios")]
        public IActionResult ListarUsuarios()
        {
            try
            {
                List<Usuario> usuarios = Usuario.ListarUsuarios();
                return Ok(usuarios);
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPost("editar-usuario")]
        public IActionResult EditarUsuario([FromBody] UsuarioModel usuarioModel)
        {
            try
            {
                Usuario usuarioAntigo = new Usuario((int) usuarioModel.usuarioAntigo.id!, usuarioModel.usuarioAntigo.nome, 
                    usuarioModel.usuarioAntigo.email, usuarioModel.usuarioAntigo.senha, (bool) usuarioModel.usuarioAntigo.administrador!, false);

                Usuario usuarioNovo = new Usuario((int) usuarioModel.id, usuarioModel.nome, usuarioModel.email, usuarioModel.senha, (bool) usuarioModel.administrador, false);

                Usuario usuarioAtualizado = usuarioAntigo.AlterarUsuario(usuarioNovo);
                return Ok(usuarioAtualizado);
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPatch("editar-senha-parceiro")]
        public IActionResult EditarSenhaParceiro([FromBody] SenhaModel senhaModel)
        {
            try
            {
                if (senhaModel.senha == senhaModel.confirmacao)
                {
                    return Ok(Parceiro.AtualizarSenha(senhaModel.id, senhaModel.senha));
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpDelete("excluir-usuario/{id}")]
        public IActionResult ExcluirUsuario(int id)
        {
            try
            {
                return Ok(Usuario.ExcluirUsuario(id));
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpGet("atualizar-configuracao/{chave}")]
        public IActionResult AtualizarConfiguracao(string chave, [FromQuery] int valor)
        {
            try
            {
                return Ok(Configuracao.AtualizarValor(chave, valor));
            }
            catch
            {
                return BadRequest(false);
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPatch("mudar-status/{id}")]
        public IActionResult MudarStatus(int id)
        {
            try
            {
                Parceiro.MudarStatus(id);
                return Ok(true);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPatch("mudar-status-parceiro/{dado}")]
        public IActionResult MudarStatusCpf(string dado, [FromQuery] int tipo=0)
        {
            try
            {
                Parceiro.MudarStatusCpfTelefone(dado, tipo);
                return Ok(true);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPatch("mudar-status-transacao/{id}")]
        public IActionResult MudarStatusTransacao(int id)
        {
            try
            {
                Transacao.MudarStatus(id);
                return Ok(true);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize(Policy = "Admin")]
        [HttpPatch("mudar-status-repasse/{id}")]
        public IActionResult MudarStatusRepasse(int id)
        {
            try
            {
                Parceiro.MudarStatusRepasse(id);
                return Ok(true);
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
