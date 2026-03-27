import "bootstrap/dist/css/bootstrap.min.css";

import { Accordion, Card, Container, useAccordionButton } from "react-bootstrap";
import React, { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const questions: string[] = [
  "O que é a Marca Modelo?",
  "Essa demo vale a pena?",
  "A Marca Modelo é segura?",
  "Qual o meio de contato da Marca Modelo?",
  "Por onde consigo acessar os serviços da Marca Modelo?",
  "Em quais canais posso relatar um problema?",
  "Quem pode divulgar serviços na Marca Modelo?",
  "Como faço para divulgar meu serviço?",
  "Não estou recebendo o e-mail de contato, o que faço?",
  "Não consigo fazer meu login, o que faço?",
  "Como editar meu cadastro?",
  "Posso excluir ou desativar meu cadastro?",
  "Quais são as formas de pagamento disponíveis?",
];

const answers: string[] = [
  "A Marca Modelo é uma versão demonstrativa de uma plataforma de divulgação de serviços, pensada para apresentar a experiência de busca, navegação e contato entre clientes e profissionais.",
  "Sim. A demo foi redesenhada para comunicar melhor a proposta do produto, com visual mais limpo, navegação objetiva e uma jornada mais agradável para quem está avaliando a solução.",
  "Sim. A proposta da interface prioriza clareza das informações, confiança na navegação e uma estrutura simples para facilitar a tomada de decisão do usuário.",
  "Você pode centralizar os contatos da demo pelas redes sociais exibidas no rodapé ou pelos canais institucionais definidos para a apresentação do projeto.",
  "Você consegue acessar os serviços clicando em 'Explorar serviços' ou usando os atalhos principais da home da demo.",
  "Os canais de suporte e contato podem ser apresentados na própria navegação da demo ou no rodapé, conforme o contexto da apresentação.",
  "Todos podem divulgar seus serviços na Marca Modelo: profissionais autônomos, pequenos negócios e prestadores independentes de diferentes áreas.",
  "Basta realizar o cadastro, completar seu perfil profissional e selecionar os serviços que deseja apresentar na plataforma.",
  "Verifique a caixa de spam, confirme se o e-mail foi digitado corretamente e tente novamente após alguns minutos. Se necessário, acione o suporte responsável pela demo.",
  "Confira suas credenciais, tente outro navegador ou dispositivo e valide se sua conexão está estável. Se o problema persistir, entre em contato com o suporte.",
  "Acesse sua conta, vá até a área de perfil ou configurações e atualize as informações desejadas para manter sua apresentação sempre atualizada.",
  "Sim. A plataforma pode oferecer opções para desativar temporariamente ou excluir o cadastro, de acordo com as regras definidas para o ambiente demonstrativo.",
  "Na demo, os pagamentos são apresentados como combinados diretamente entre cliente e prestador, destacando uma jornada simples e transparente para negociação.",
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
      <Card className={`border-0 rounded-4 mb-3 shadow-sm ${isOpen ? "bg-light" : "bg-white"} transition-all`}>
        <Card.Header
          className="d-flex justify-content-between align-items-center p-3"
          onClick={toggleAccordion}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <span className="fw-semibold fs-6">{question}</span>
          {isOpen ? <FiMinus size={20} /> : <FiPlus size={20} />}
        </Card.Header>
      </Card>

      <Accordion.Collapse eventKey={eventKey}>
        <div className="bg-white rounded-4 px-4 pb-4 pt-2 shadow-sm mb-3 border border-light">
          {answers[parseInt(eventKey, 10)].split("\n").map((line, i) => (
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
