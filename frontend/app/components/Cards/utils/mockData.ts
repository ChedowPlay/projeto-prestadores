{
  /*Renderiza os cards de exemplo*/
}
export type Card = {
  worker: {
    name: string;
    bio: string;
    category: [string];
    image: string;
    price: number;
    email?: string;
    telefone: string;
    endereco: string;
    id: number;
    galeria?: string[];
    job: { category: string[]; description: string; price: number }[];
  };
};

export const allCards: Card[] = [
  {
    worker: {
      name: "Maria Helena",
      bio: "Tenho mais de 10 anos de experiência criando eventos. Estou em busca de novos clientes!",
      job: [
        {
          category: ["Serviços Domésticos", "Faxina"],
          description:
            "Sou especialista em limpeza profunda de casas e apartamentos. Minha missão é garantir um ambiente impecável e saudável, com atenção aos mínimos detalhes. Ofereço serviços personalizados para atender às suas necessidades específicas, utilizando produtos de alta qualidade e técnicas eficientes. Estou em busca de novos clientes na área de Ipanema para proporcionar um lar mais limpo e organizado, garantindo sua satisfação e conforto.",
          price: 150,
        },
      ],
      category: ["Eventos"],
      image:
        "https://forbes.com.br/wp-content/uploads/2022/07/lideranca-feminina-forbesmulher.jpg",
      price: 150,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 123,
      galeria: [
        "/images/prestador1/pic-1.png",
        "/images/prestador1/pic-2.png",
        "/images/prestador1/pic-3.png",
        "/images/prestador1/pic-4.png",
        "/images/prestador1/pic-5.png",
        "/images/prestador1/pic-6.png",
      ],
    },
  },
  {
    worker: {
      name: "João",
      bio: "Sou Marido de Aluguel, faço faxina, reparos eletricos, reparo e desentupimento de canos, pau pra toda obra. Estou em busca de novos clientes na área de Ipanema.",
      category: ["Serviços Domésticos"],
      job: [
        {
          category: ["Serviços Domésticos", "Faxina"],
          description:
            "Sou especialista em limpeza profunda de casas e apartamentos. Minha missão é garantir um ambiente impecável e saudável, com atenção aos mínimos detalhes. Ofereço serviços personalizados para atender às suas necessidades específicas, utilizando produtos de alta qualidade e técnicas eficientes. Estou em busca de novos clientes na área de Ipanema para proporcionar um lar mais limpo e organizado, garantindo sua satisfação e conforto.",
          price: 100,
        },
        {
          category: ["Reparos e Manutenções", "Eletricista", "Encanador"],
          description:
            "Também trabalho com reparos e manutenções elétricas e hidráulicas. Minha missão é garantir que sua casa ou empresa esteja sempre em perfeito funcionamento, com segurança e eficiência. Ofereço serviços personalizados para atender às suas necessidades específicas, utilizando materiais de alta qualidade e técnicas avançadas. Estou em busca de novos clientes na área para proporcionar um ambiente mais seguro e funcional, garantindo sua satisfação e tranquilidade.",
          price: 300,
        },
      ],
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuZxUbsRb7AY_y-3tPcJwXADvYHexzj_CbgA&s",
      price: 100,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 124,
    },
  },
  {
    worker: {
      name: "Ana Souza",
      bio: "Advogada especializada em direito trabalhista, tenho horários vagos todas as manhãs.",
      category: ["Assessoria Jurídica"],
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      price: 350,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 125,
      job: [],
    },
  },
  {
    worker: {
      name: "João Pedro",
      bio: "Professor de inglês com mais de 5 anos de experiência.",
      category: ["Educação"],
      image: "https://randomuser.me/api/portraits/men/50.jpg",
      price: 100,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 126,
      job: [],
    },
  },
  {
    worker: {
      name: "Juliana Souza",
      bio: "Aulas particulares de inglês para crianças e adultos, com metodologia personalizada.",
      category: ["Educação e Treinamento"],
      image: "https://randomuser.me/api/portraits/women/38.jpg",
      price: 80,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 127,
      job: [],
    },
  },
  {
    worker: {
      name: "Fernando Lima",
      bio: "Programador full-stack especializado em React e Node.js.",
      category: ["Desenvolvimento de Software"],
      image: "https://randomuser.me/api/portraits/men/40.jpg",
      price: 250,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 128,
      job: [],
    },
  },
  {
    worker: {
      name: "Laura Martins",
      bio: "Especialista em marketing digital e gestão de redes sociais.",
      category: ["Marketing Digital"],
      image: "https://randomuser.me/api/portraits/women/30.jpg",
      price: 180,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 129,
      job: [],
    },
  },
  {
    worker: {
      name: "Rodrigo Alves",
      bio: "Personal trainer com foco em emagrecimento e hipertrofia.",
      category: ["Saúde e Bem-estar"],
      image: "https://randomuser.me/api/portraits/men/28.jpg",
      price: 120,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 130,
      job: [],
    },
  },
  {
    worker: {
      name: "Patrícia Oliveira",
      bio: "Nutricionista com experiência em dietas para esportistas.",
      category: ["Saúde e Bem-estar"],
      image: "https://randomuser.me/api/portraits/women/35.jpg",
      price: 200,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 131,
      job: [],
    },
  },
  {
    worker: {
      name: "Ricardo Santos",
      bio: "Eletricista com certificação técnica e experiência em instalações residenciais.",
      category: ["Serviços Gerais"],
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      price: 90,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 132,
      job: [],
    },
  },
  {
    worker: {
      name: "Camila Ribeiro",
      bio: "Arquiteta especializada em projetos residenciais modernos.",
      category: ["Arquitetura e Design"],
      image: "https://randomuser.me/api/portraits/women/29.jpg",
      price: 300,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 133,
      job: [],
    },
  },
  {
    worker: {
      name: "Marcos Vinícius",
      bio: "Desenvolvedor mobile com experiência em Flutter e React Native.",
      category: ["Desenvolvimento de Software"],
      image: "https://randomuser.me/api/portraits/men/27.jpg",
      price: 220,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 134,
      job: [],
    },
  },
  {
    worker: {
      name: "Isabela Costa",
      bio: "Consultora financeira especializada em investimentos e planejamento financeiro.",
      category: ["Consultoria Financeira"],
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      price: 400,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 135,
      job: [],
    },
  },
  {
    worker: {
      name: "Gustavo Freitas",
      bio: "Fotógrafo profissional para eventos e ensaios fotográficos.",
      category: ["Fotografia"],
      image: "https://randomuser.me/api/portraits/men/33.jpg",
      price: 150,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 136,
      job: [],
    },
  },
  {
    worker: {
      name: "Viviane Almeida",
      bio: "Professora de yoga e meditação, aulas individuais ou em grupo.",
      category: ["Bem-estar"],
      image: "https://randomuser.me/api/portraits/women/37.jpg",
      price: 120,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 137,
      job: [],
    },
  },
  {
    worker: {
      name: "Eduardo Pereira",
      bio: "Mecânico especializado em manutenção preventiva de veículos.",
      category: ["Serviços Automotivos"],
      image: "https://randomuser.me/api/portraits/men/44.jpg",
      price: 100,
      email: "email@email.com",
      telefone: "123456789",
      endereco: "Rua A, 123",
      id: 138,
      job: [],
    },
  },
];
