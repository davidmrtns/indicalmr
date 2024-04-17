using IndicaLMR.Classes;
using IndicaLMR.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace IndicaLMR.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly Vios _vios;

        public AuthController(Vios vios)
        {
            _vios = vios;
        }

        [HttpPost("autenticar")]
        public IActionResult Autenticar([FromBody] ParceiroModel parceiroModel)
        {
            Parceiro parceiro = Parceiro.Autenticar(parceiroModel.cpf, parceiroModel.senha);

            if (parceiro != null)
            {
                string token = Token.CriarTokenParceiro(parceiro.Id, parceiro.Nome, parceiro.Cpf, parceiro.Telefone);

                HttpContext.Session.SetString("_LoggedUser", JsonSerializer.Serialize(parceiro));
                Response.Cookies.Append("Authorization", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(1))
                });
                return Ok(true);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost("novo-parceiro")]
        public async Task<IActionResult> CadastrarParceiro([FromBody] ParceiroModel parceiroModel)
        {
            try
            {
                bool resultado = await _vios.VerificarCadastro(parceiroModel.cpf!);
                if (resultado)
                {
                    if (parceiroModel.telefone.Length == 11 && parceiroModel.telefone.All(char.IsDigit))
                    {
                        if (parceiroModel.cpf.Length == 11 && parceiroModel.cpf.All(char.IsDigit))
                        {
                            try
                            {
                                Parceiro parceiro = new Parceiro(parceiroModel.nome, parceiroModel.telefone, parceiroModel.cpf, 0, parceiroModel.senha);
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

        [HttpGet("novo-parceiro/{telefone}")]
        public IActionResult VerificarNovoParceiro(string telefone)
        {
            ParceiroDTO dto = Parceiro.VerificarNovoParceiro(telefone);

            if (dto.NovoParceiro != null)
            {
                return Ok(dto);
            }
            else
            {
                return NoContent();
            }
        }

        [HttpGet("novo-parceiro/cliente/{cpf}")]
        public async Task<IActionResult> VerificarNovoParceiroCliente(string cpf)
        {
            try
            {
                bool resultado = await _vios.VerificarCadastro(cpf);
                return Ok(resultado);
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpGet("parceiro-existente/{cpf}")]
        public IActionResult VerificarParceiroIndica(string cpf)
        {
            try
            {
                int resultado = Parceiro.VerificarParceiro(cpf);
                return Ok(resultado);
            }
            catch
            {
                return BadRequest(0);
            }
        }

        [HttpPost("atualizar-dados")]
        public IActionResult AtualizarDados([FromBody] ParceiroModel parceiroModel)
        {
            try
            {
                bool resposta = Parceiro.AtualizarDados((int)parceiroModel.id!, parceiroModel.cpf, parceiroModel.senha);
                return Ok(resposta);
            }
            catch
            {
                return BadRequest();
            }
        }

        [Authorize]
        [HttpGet("validar")]
        public bool Validar()
        {
            Parceiro parceiro;

            try
            {
                parceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser"))!;
            }
            catch
            {
                parceiro = null;
            }

            if (parceiro != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        [Authorize]
        [HttpGet("usuario")]
        public string BuscarUsuario()
        {
            string usuario = null;

            try
            {
                usuario = HttpContext.Session.GetString("_LoggedUser")!;
            }
            catch
            {
                usuario = null;
            }

            return usuario;
        }

        [Authorize]
        [HttpGet("atualizar")]
        public IActionResult AtualizarUsuario()
        {
            try
            {
                Parceiro parceiro = JsonSerializer.Deserialize<Parceiro>(HttpContext.Session.GetString("_LoggedUser"))!;
                parceiro.AtualizarCredito();
                HttpContext.Session.SetString("_LoggedUser", JsonSerializer.Serialize(parceiro));
                return Ok(true);
            }
            catch
            {
                return Ok(false);
            }
        }

        [Authorize]
        [HttpGet("desconectar")]
        public bool Desconectar()
        {
            try
            {
                HttpContext.Session.Clear();
                HttpContext.Session.Remove("Authorization");
                return true;
            }
            catch
            {
                return false;
            }
        }

        [HttpPost("escritorio/autenticar")]
        public IActionResult AutenticarEscritorio([FromBody] UsuarioModel usuarioModel)
        {
            Usuario usuario = Usuario.Autenticar(usuarioModel.email, usuarioModel.senha);

            if (usuario != null)
            {
                string token = Token.CriarTokenUsuario(usuario.Id, usuario.Nome, usuario.Email, usuario.Administrador, usuario.Financeiro);

                HttpContext.Session.SetString("_LoggedOfficeUser", JsonSerializer.Serialize(usuario));
                Response.Cookies.Append("Authorization", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    IsEssential = true,
                    SameSite = SameSiteMode.Strict
                });
                return Ok(true);
            }
            else
            {
                return Unauthorized();
            }
        }

        [Authorize]
        [HttpGet("escritorio/validar")]
        public bool ValidarEscritorio()
        {
            Usuario usuario;

            try
            {
                usuario = JsonSerializer.Deserialize<Usuario>(HttpContext.Session.GetString("_LoggedOfficeUser"))!;
            }
            catch
            {
                usuario = null;
            }

            if (usuario != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
