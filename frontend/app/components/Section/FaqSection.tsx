import "bootstrap/dist/css/bootstrap.min.css";

import { Accordion, Card, Container, useAccordionButton } from "react-bootstrap";
import React, { useState } from "react";

import Image from "next/image";
import minusIcon from "@/public/images/Minus-icon.png";
import plusIcon from "@/public/images/Plus-icon.png";

// Perguntas do FAQ
const questions: string[] = [
    "O que é a Di boa Club?",
    "A Di boa vale a pena?",
    "A Di boa é Segura?",
    "Qual o meio de contato da Di boa Club?",
    "Por onde consigo acessar os serviços da Di boa Club?",
    "Em quais canais posso relatar um problema?",
    "Quem pode divulgar serviços na Di boa Club?",
    "Como faço para divulgar meu serviço?",
    "Não estou recebendo o e-mail de contato, o que faço?",
    "Não consigo fazer meu login, o que faço?",
    "Como editar meu cadastro?",
    "Posso excluir ou desativar meu cadastro?",
    "Quais são as formas de pagamento disponíveis?",
];

// Respostas do FAQ
const answers: string[] = [
    "A Di boa é uma plataforma de divulgação de serviços onde você consegue encontrar diversos trabalhadores para as suas demandas.",
    
    "Nossa plataforma oferece acesso rápido e direcionado aos perfis dos mais diversos autônomos, com dinamismo e negociação direto com o prestador! Facilidade na sua mão.",
    
    "Nossa plataforma cobra a validação dos dados de cada prestador, as negociações são feitas diretamente pelo cliente com o prestador. Nada de máscaras aqui!",
    
    "Você pode entrar em contato conosco por nossas redes como Instagram e Facebook. Aproveita e já nos segue.",
    
    "Você consegue acessar os serviços clicando no botão 'Quero Contratar' ou clicando aqui.",
    
    "Temos um ícone com o nome Suporte, por lá, nossos profissionais estarão disponíveis para sanar qualquer dúvida!",
    
    "Todos podem divulgar seus serviços em nossa plataforma! Seja você um profissional autônomo, uma pequena empresa ou até mesmo alguém que oferece serviços de forma independente, nosso espaço está aberto para você. Não importa o ramo de atuação: beleza, construção, tecnologia, educação, entre outros — aqui, todos têm a oportunidade de alcançar novos clientes e expandir seus negócios. Nossa missão é conectar pessoas que oferecem serviços com quem precisa deles, de forma simples e acessível. Cadastre-se, divulgue seu trabalho e comece a ser encontrado por quem está procurando exatamente o que você oferece!",
    
    "Você precisa fazer seu cadastro no seu perfil com o serviço que deseja divulgar. Você pode divulgar mais de um serviço e do seu jeito! Mas cuidado, precisa verificar seus limites, confira as nossas assinaturas na tabela.",
    
    "1. Verifique sua caixa de spam ou lixo eletrônico: O e-mail pode ter sido filtrado como spam. Certifique-se de verificar essas pastas na sua conta de e-mail.\n" +
    "2. Confirme o endereço de e-mail informado: Verifique se o endereço de e-mail que você forneceu está correto, sem erros de digitação.\n" +
    "3. Tente novamente mais tarde: Pode haver um atraso temporário no envio dos e-mails. Aguarde alguns minutos e tente realizar a ação novamente.\n" +
    "4. Adicione nosso e-mail à sua lista de contatos: Para garantir que nossos e-mails cheguem corretamente à sua caixa de entrada, adicione nosso endereço de e-mail à sua lista de contatos ou à sua lista de remetentes confiáveis.\n" +
    "5. Verifique as configurações do servidor de e-mail: Se você estiver utilizando um servidor de e-mail corporativo ou personalizado, certifique-se de que ele não esteja bloqueando os e-mails do nosso site.\n" +
    "6. Entre em contato com o suporte: Se nenhuma das opções acima funcionar, entre em contato com nossa equipe de suporte técnico para que possamos investigar mais a fundo o problema.",
    
    "1. Verifique suas credenciais:\n" +
    "   • Confirme o Usuário e Senha: Certifique-se de que está digitando corretamente seu e-mail, nome de usuário e senha. Verifique letras maiúsculas e minúsculas.\n" +
    "   • Recupere a Senha: Se não tiver certeza da senha, clique na opção 'Esqueci minha senha' para redefini-la.\n" +
    "2. Teste em outros navegadores ou dispositivos:\n" +
    "   • Às vezes, o problema pode estar relacionado ao navegador. Tente acessar o site em outro navegador (como Chrome, Firefox ou Edge) ou em outro dispositivo (como celular ou tablet).\n" +
    "3. Verifique conexões de rede:\n" +
    "   • Certifique-se de que sua conexão com a internet está estável. Reinicie o modem ou tente se conectar a outra rede, se possível.\n" +
    "4. Verifique o status do site:\n" +
    "   • O site pode estar enfrentando problemas técnicos. Use ferramentas como o DownDetector para verificar se há relatos de indisponibilidade.\n" +
    "5. Entre em contato com o suporte:\n" +
    "   • Se nenhuma das etapas anteriores funcionar, entre em contato com o suporte do site. Forneça informações detalhadas, como capturas de tela do erro e o dispositivo que está utilizando.",
    
    "1. Editar Perfil:\n" +
    "   • Acesse sua conta com login e senha.\n" +
    "   • Vá até a seção 'Meu Perfil' ou 'Configurações'.\n" +
    "   • Atualize as informações desejadas, como foto, descrição ou dados de contato, e salve as alterações.\n" +
    "2. Desativar Perfil:\n" +
    "   • No menu de configurações, procure pela opção 'Desativar Perfil'.\n" +
    "   • Confirme sua escolha. Seu perfil será temporariamente ocultado, e você poderá reativá-lo a qualquer momento.\n" +
    "3. Excluir Perfil:\n" +
    "   • Acesse a área de configurações ou suporte.\n" +
    "   • Clique em 'Excluir Conta' e siga as instruções para confirmar a exclusão.\n" +
    "   • Lembre-se: essa ação é permanente e todos os seus dados serão removidos da plataforma.",
    
    "Sim! Apesar de ficarmos tristes com estas decisões, você tem esta opção acessando seu perfil, nas configurações.",
    
    "Na Di boa Club, os pagamentos são feitos do modo mais seguro, 'téte a téte', diretamente entre Prestador e Cliente! No ícone de contato, você tem, de forma segura, a conexão feita com as partes e você pode acertar o pagamento."
];

const FAQ = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <Container className="py-4">
      <h2 className="text-center fw-bold mb-4">FAQ</h2>
      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key as string)}>
        {questions.map((question, index) => (
          <FAQItem key={index} eventKey={index.toString()} question={question} activeKey={activeKey} />
        ))}
      </Accordion>
    </Container>
  );
};

// Interface das props do componente FAQItem
interface FAQItemProps {
  eventKey: string;
  question: string;
  activeKey: string | null;
}

const FAQItem: React.FC<FAQItemProps> = ({ eventKey, question, activeKey }) => {
  const isOpen = activeKey === eventKey;
  const toggleAccordion = useAccordionButton(eventKey);

  return (
    <div>
      {/* Pergunta */}
      <Card
        className={`border-0 rounded-3 mb-3 shadow-sm ${
          isOpen ? "bg-light" : "bg-white"
        } transition-all`}
      >
        <Card.Header
          className="d-flex justify-content-between align-items-center p-3"
          onClick={toggleAccordion}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <span className="fw-semibold fs-6">{question}</span>
          <Image
            src={isOpen ? minusIcon : plusIcon}
            alt="Toggle Icon"
            width={20}
            height={20}
            style={{
              transition: "transform 0.2s ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </Card.Header>
      </Card>

      {/* Resposta */}
      <Accordion.Collapse eventKey={eventKey}>
        <div className="bg-white rounded-3 px-4 pb-4 pt-2 shadow-sm mb-3 border border-light">
          {answers[parseInt(eventKey)].split("\n").map((line, i) => (
            <p key={i} className="mb-2 text-secondary" style={{ lineHeight: "1.6" }}>
              {line}
            </p>
          ))}
        </div>
      </Accordion.Collapse>
    </div>
  );
};

export default FAQ;
