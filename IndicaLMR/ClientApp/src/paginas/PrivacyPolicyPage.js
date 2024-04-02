import Recursos from '../classes/Recursos';
import style from './PrivacyPolicy.module.css';

function PrivacyPolicyPage() {
    const recursos = new Recursos();
    const LMRLogo = recursos.getLMRLogo();

    return (
        <div className={style.politica}>
            <LMRLogo className={style.logolmr} />
            <h1>Política de Privacidade</h1>
            <p>Na LMR Advogados Associados, privacidade e segurança são prioridades e nos comprometemos com a
                transparência do tratamento de dados pessoais dos nossos usuários/clientes. Por isso, esta presente
                Política de Privacidade estabelece como é feita a coleta, uso e transferência de informações de clientes
                ou outras pessoas que acessam ou usam nosso site</p>
            <p>Ao utilizar nossos serviços, você entende que coletaremos e usaremos suas informações pessoais nas formas
                descritas nesta Política, sob as normas da Constituição Federal de 1988 (art. 5º, LXXIX; e o art. 22º,
                XXX - incluídos pela EC 115/2022), das normas de Proteção de Dados (LGPD, Lei Federal 13.709/2018), das
                disposições consumeristas da Lei Federal 8078/1990 e as demais normas do ordenamento jurídico brasileiro
                aplicáveis.</p>
            <p>Dessa forma, a LUCINEIA MARTINS RODRIGUES - SOCIEDADE DE ADVOGADOS, doravante denominada simplesmente como
                "LMR Advogados Associados", inscrita no CNPJ/MF sob o nº 27.988.538/0001-02, no papel de Controladora de
                Dados, obriga-se ao disposto na presente Política de Privacidade.</p>

            <h2>1. Quais dados coletamos sobre você e para qual finalidade?</h2>
            <p>Nosso site/aplicação coleta e utiliza alguns dados pessoais seus, de forma a viabilizar a prestação
                de serviços e aprimorar a experiência de uso.</p>
            <h3>1.1. Dados pessoais fornecidos pelo titular</h3>
            <ul>
                <li>Nome completo (identificação/personalização)</li>
                <li>CPF (identificação)</li>
                <li>Número de telefone (identificação)</li>
            </ul>
            <h3>1.2. Dados pessoais coletados automaticamente</h3>
            <ul>
                <li>Nenhum dado</li>
            </ul>

            <h2>2. Como coletamos os seus dados?</h2>
            <p>Nesse sentido, a coleta dos seus dados pessoais ocorre da seguinte forma:</p>
            <ul>
                <li>Por meio de cadastro inicial na aplicação;</li>
                <li>Através da atualização de dados previamente fornecidos.</li>
            </ul>
            <h3>2.1. Consentimento</h3>
            <p>É a partir do seu consentimento que tratamos os seus dados pessoais. O consentimento é a manifestação
                livre, informada e inequívoca pela qual você autoriza a LMR Advogados Associados a tratar seus dados.</p>
            <p>Assim, em consonância com a Lei Geral de Proteção de Dados, seus dados só serão coletados, tratados e
                armazenados mediante prévio e expresso consentimento.</p>
            <p>O seu consentimento será obtido de forma específica para cada finalidade acima descrita, evidenciando o
                compromisso de transparência e boa-fé da LMR Advogados Associados para com seus usuários/clientes, seguindo
                as regulações legislativas pertinentes.</p>
            <p>Ao utilizar os serviços da LMR Advogados Associados e fornecer seus dados pessoais, você está ciente e
                consentindo com as disposições desta Política de Privacidade, além de conhecer seus direitos e
                como exercê-los.</p>
            <p>A qualquer tempo e sem nenhum custo, você poderá revogar seu consentimento.</p>
            <p>É importante destacar que a revogação do consentimento para o tratamento dos dados pode implicar a
                impossibilidade da performance adequada de alguma funcionalidade do site que dependa da operação.
                Tais consequências serão informadas previamente.</p>

            <h2>3. Quais são os seus direitos?</h2>
            <p>A LMR Advogados Associados assegura a seus usuários/clientes seus direitos de titular previstos no artigo
                18 da Lei Geral de Proteção de Dados. Dessa forma, você pode, de maneira gratuita e a qualquer tempo:</p>
            <ul>
                <li>
                    <strong>Confirmar a existência de tratamento de dados</strong>, de maneira simplificada ou em formato
                    claro e completo.
                </li>
                <li>
                    <strong>Acessar seus dados</strong>, podendo solicitá-los em uma cópia legável sob forma impressa ou
                    por meio eletrônico, seguro e idôneo.
                </li>
                <li>
                    <strong>Corrigir seus dados</strong>, ao solicitar a edição, correção ou atualização destes.
                </li>
                <li>
                    <strong>Limitar seus dados</strong> quando desnecessários, excessivos ou tratados em desconformidade com
                    a legislação através da anonimização, bloqueio ou eliminação.
                </li>
                <li>
                    <strong>Solicitar a portabilidade de seus dados</strong>, através de um relatório de dados cadastrais
                    que a LMR Advogados Associados trata a seu respeito.
                </li>
                <li>
                    <strong>Eliminar seus dados</strong> tratados a partir de seu consentimento, exceto nos casos previstos
                    em lei.
                </li>
                <li>
                    <strong>Revogar seu consentimento</strong>, desautorizando o tratamento de seus dados.
                </li>
                <li>
                    <strong>Informar-se sobre a possibilidade de não fornecer seu consentimento</strong> e sobre as consequências da negativa.
                </li>
            </ul>

            <h2>4. Como você pode exercer seus direitos de titular?</h2>
            <p>Para exercer seus direitos de titular, você deve entrar em contato com a LMR Advogados Associados através dos
                seguintes meios disponíveis:</p>
            <ul>
                <li>Pela aplicação (edição de dados);</li>
                <li>Pelo e-mail <a href="mailto:suporte@lmradvogados.com.br">suporte@lmradvogados.com.br</a>.</li>
            </ul>
            <p>De forma a garantir a sua correta identificação como titular dos dados pessoais objeto da solicitação, é
                possível que solicitemos documentos ou demais comprovações que possam comprovar sua identidade. Nessa
                hipótese, você será informado previamente.</p>

            <h2>5. Como e por quanto tempo seus dados serão armazenados?</h2>
            <p>Seus dados pessoais coletados pela LMR Advogados Associados serão utilizados e armazenados durante o
                tempo necessário para a prestação do serviço ou para que as finalidades elencadas na presente Política
                de Privacidade sejam atingidas, considerando os direitos dos titulares dos dados e dos controladores.</p>
            <p>De modo geral, seus dados serão mantidos enquanto a relatóo contratual entre você e a LMR Advogados
                Associados perdurar. Findado o período de armazenamento dos dados pessoais, estes serão excluídos de
                nossas bases de dados ou anonimizados, ressalvadas as hipóteses legalmente previstas no artigo 16 lei
                geral de proteção de dados, a saber:</p>
            <ol>
                <li>Cumprimento de obrigação legal ou regulatória pelo controlador;</li>
                <li>Estudo por órgão de pesquisa, garantida, sempre que possível, a anonimização dos dados pessoais;</li>
                <li>Transferência a terceiro, desde que respeitados os requisitos de tratamento de dados dispostos nesta Lei; ou</li>
                <li>Uso exclusivo do controlador, vedado seu acesso por terceiro, e desde que anonimizados os dados.</li>
            </ol>
            <p>Isto é, informações pessoais sobre você que sejam imprescindíveis para o cumprimento de determinações
                legais, judiciais e administrativas e/ou para o exercício do direito de defesa em processos judiciais
                e administrativos serão mantidas, a despeito da exclusão dos demais dados.</p>
            <p>O armazenamento de dados coletados pela LMR Advogados Associados reflete o nosso compromisso
                com a segurança e privacidade dos seus dados. Empregamos medidas e soluções técnicas de proteção aptas
                a garantir a confidencialidade, integridade e inviolabilidade dos seus dados.</p>
            <p>Além disso, também contamos com medidas de segurança apropriadas aos riscos e com controle de acesso às
                informações armazenadas.</p>

            <h2>6. O que fazemos para manter seus dados seguros?</h2>
            <p>Para mantermos suas informações pessoais seguras, usamos ferramentas físicas, eletrônicas e gerenciais
                orientadas para a proteção da sua privacidade.</p>
            <p>Aplicamos essas ferramentas levando em consideração a natureza dos dados pessoais coletados,
                o contexto e a finalidade do tratamento e os riscos que eventuais violações gerariam para
                os direitos e liberdades do titular dos dados coletados e tratados.</p>
            <p>Entre as medidas que adotamos, destacamos as seguintes:</p>
            <ul>
                <li>Apenas pessoas autorizadas têm acesso a seus dados pessoais</li>
                <li>O acesso a seus dados pessoais é feito somente após o compromisso de confidencialidade</li>
                <li>Seus dados pessoais são armazenados em ambiente seguro e idôneo</li>
            </ul>
            <p>A LMR Advogados Associados se compromete a adotar as melhores posturas para evitar incidentes de segurança.
                Contudo, é necessário destacar que nenhuma página virtual é inteiramente segura e livre de riscos.
                É possível que, apesar de todos os nossos protocolos de segurança, problemas de culpa exclusivamente
                de terceiros ocorram, como ataques cibernéticos de hackers, ou também em decorrência da negligência ou
                imprudência do próprio usuário/cliente.</p>
            <p>Em caso de incidentes de segurança que possa gerar risco ou dano relevante para você ou qualquer um de
                nossos usuários/clientes, comunicaremos aos afetados e a Autoridade Nacional de Proteção de Dados sobre
                o ocorrido, em consonância com as disposições da Lei Geral de Proteção de Dados.</p>

            <h2>7. Com quem seus dados podem ser compartilhados?</h2>
            <p>Tendo em vista a preservação de sua privacidade, a LMR Advogados Associados não compartilhará seus dados
                pessoais com nenhum terceiro não autorizado.</p>
            <p>Seus dados serão armazenados em um banco de dados hospedado na plataforma Microsoft Azure, que atua como
                terceiro provedor de serviços responsável pelo armazenamento e proteção dos dados.</p>
            <p>Todavia, a Microsoft Azure tem suas próprias Políticas de Privacidade, que podem divergir desta.
                Recomendamos a leitura desses documentos, que você pode encontrar diretamente no site da Microsoft.</p>
            <p>Além disso, também existem outras hipóteses em que seus dados poderão ser compartilhados, que são:</p>
            <ol>
                <li>Determinação legal, requerimento, requisição ou ordem judicial, com autoridades judiciais, administrativas ou governamentais competentes.</li>
                <li>Caso de movimentações societárias, como fusão, aquisição e incorporação, de forma automática</li>
                <li>Proteção dos direitos da (nome empresarial simplificado) em qualquer tipo de conflito, inclusive os de teor judicial.</li>
            </ol>
            <h3>7.1. Transferência internacional de dados</h3>
            <p>Alguns dos terceiros com quem compartilhamos seus dados podem ser localizados ou possuir instalações
                localizadas em países estrangeiros. Nessas condições, de toda forma, seus dados pessoais estarão
                sujeitos à Lei Geral de Proteção de Dados e às demais legislações brasileiras de proteção de dados.</p>
            <p>Nesse sentido, a LMR Advogados Associados se compromete a sempre adotar eficientes padrões de segurança
                cibernética e de proteção de dados, nos melhores esforços de garantir e cumprir as exigências legislativas.</p>
            <p>Ao concordar com essa Política de Privacidade, você concorda com esse compartilhamento, que se dará conforme
                as finalidades descritas no presente instrumento.</p>

            <h2>8. Cookies ou dados de navegação</h2>
            <p>A LMR Advogados Associados faz uso de Cookies, que são arquivos de texto enviados pela plataforma ao seu
                computador e que nele se armazenam, que contém informações relacionadas à navegação do site. Em suma, os
                Cookies são utilizados para aprimorar a experiência de uso.</p>
            <p>Ao acessar nosso site e consentir com o uso de Cookies, você manifesta conhecer e aceitar a utilização de
                um sistema de coleta de dados de navegação com o uso de Cookies em seu dispositivo.</p>
            <p>A LMR Advogados Associados utiliza Cookies de autenticação JWT (JSON Web Tokens), que são utilizados
                para autenticação e autorização de usuários.</p>
            <p>Você pode, a qualquer tempo e sem nenhum custo, alterar as permissões, bloquear ou recusar os Cookies.
                Todavia, a revogação do consentimento de determinados Cookies pode inviabilizar o funcionamento
                correto de alguns recursos da plataforma.</p>
            <p>Para gerenciar os cookies do seu navegador, basta fazê-lo diretamente nas configurações do navegador,
                na área de gestão de Cookies.</p>

            <h2>9. Alteração desta Política de Privacidade</h2>
            <p>A atual versão da Política de Privacidade foi formulada e atualizada pela última vez em 1º de abril de 2024.</p>
            <p>Reservamos o direito de modificar essa Política de Privacidade a qualquer tempo, principalmente em função
                da adequação a eventuais alterações feitas em nosso site ou em âmbito legislativo. Recomendamos que você
                a revise com frequÊncia.</p>
            <p>Eventuais alterações entrarão em vigor a partir de sua publicação em nosso site e sempre lhe notificaremos
                acerca das mudanças ocorridas.</p>
            <p>Ao utilizar nossos serviços e fornecer seus dados pessoais após tais modificações, você as consente.</p>

            <h2>10. Responsabilidade</h2>
            <p>A LMR Advogados Associados prevê a responsabilidade dos agentes que atuam nos processos de tratamento de
                dados, em conformidade com os artigos 42 ao 45 da Lei Geral de Proteção de Dados.</p>
            <p>Nos comprometemos em manter esta Política de Privacidade atualizada, observando suas disposições e zelando
                por seu cumprimento.</p>
            <p>Além disso, também assumimos o compromisso de buscar condições técnicas e organizativas seguramente aptas a
                proteger todo o processo de tratamento de dados.</p>
            <p>Caso a Autoridade Nacional de Proteção de Dados exija a adoção de providências em relação ao tratamento
                de dados realizado pela LMR Advogados Associados, comprometemo-nos a segui-las.</p>
            <h3>10.1 Isenção de responsabilidade</h3>
            <p>Conforme mencionado no Tópico 6, embora adotemos elevados padrões de segurança a fim de evitar incidentes,
                não há nenhuma página virtual inteiramente livre de riscos. Nesse sentido, a LMR Advogados Associados não
                se responsabiliza por:</p>
            <ol>
                <li>Quaisquer consequências decorrentes da negligência, imprudência ou imperêcia dos usuários em
                    relação a seus dados individuais. Garantimos e nos responsabilizamos apenas pela segurança dos
                    processos de tratamento de dados e do cumprimento das finalidades descritas no
                    presente instrumento. Destacamos que a responsabilidade em relação à confidencialidade dos
                    dados de acesso é do usuário.</li>
                <li>Ações maliciosas de terceiros, como ataques de hackers, exceto se comprovada conduta culposa ou
                    deliberada da LMR Advogados Associados. Destacamos que em caso de incidentes de segurança que possam
                    gerar risco ou dano relevante para você ou qualquer um de nossos usuários/clientes,
                    comunicaremos aos afetados e a Autoridade Nacional de Proteção de Dados sobre o ocorrido e
                    cumpriremos as providências necessárias.</li>
                <li>Inveracidade das informações inseridas pelo usuário/cliente nos registros necessários para a utilização
                    dos serviços da LMR Advogados Associados; quaisquer consequências decorrentes de informações falsas ou
                    inseridas de má-fé são de inteiramente responsabilidade do usuário/cliente.</li>
            </ol>

            <h2>11. Encarregado de Proteção de Dados</h2>
            <p>A LMR Advogados Associados disponibiliza os seguintes meios para que você possa entrar em contato conosco
                para exercer seus direitos de titular: <a href="mailto:suporte@lmradvogados.com.br">suporte@lmradvogados.com.br</a> (endereço de e-mail).</p>
        </div>
    );
}

export default PrivacyPolicyPage;