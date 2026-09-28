export function buildSeedData() {
  return {
    beaches: [
      {
        slug: "ponta-verde",
        name: "Ponta Verde",
        location: "São José de Ribamar, MA",
        summary:
          "Águas tranquilas, areia dourada e um ritmo que convida a ficar mais um pouco.",
        description:
          "A Praia da Ponta Verde é apresentada pelo projeto como um refúgio próximo de São Luís. A paisagem reúne mar, faixa de areia e pequenos serviços locais, criando um passeio voltado ao descanso e ao contato com a natureza. Antes da visita, confirme as condições de acesso, maré e funcionamento dos estabelecimentos.",
        heroImage: "/images/ponta-verde-hero.webp",
        mapUrl: "https://maps.app.goo.gl/dLCEDSbK6Uberv1L7",
        status: "published",
        featured: true,
        images: [
          {
            imagePath: "/images/ponta-verde-hero.webp",
            altText: "Faixa de areia e mar na Praia da Ponta Verde",
            sortOrder: 0,
          },
          {
            imagePath: "/images/ponta-verde-detail.webp",
            altText: "Vista ampla da Praia da Ponta Verde",
            sortOrder: 1,
          },
        ],
      },
      {
        slug: "jucatuba",
        name: "Juçatuba",
        location: "São José de Ribamar, MA",
        summary: "Conteúdo em revisão pela equipe Hidden Route.",
        description:
          "Este registro permanece em rascunho até que descrição, acesso e localização sejam confirmados.",
        heroImage: null,
        mapUrl: null,
        status: "draft",
        featured: false,
        images: [],
      },
      {
        slug: "unicamping",
        name: "Unicamping",
        location: "São Luís, MA",
        summary: "Conteúdo em revisão pela equipe Hidden Route.",
        description:
          "Este registro permanece em rascunho até que descrição, acesso e localização sejam confirmados.",
        heroImage: null,
        mapUrl: null,
        status: "draft",
        featured: false,
        images: [],
      },
    ],
    partners: [
      {
        beachSlug: "ponta-verde",
        name: "Recanto da Júlia",
        category: "restaurant",
        description:
          "Restaurante apresentado no projeto original. Confirme horários e serviços diretamente no local.",
        image: "/images/recanto-julia.webp",
        address: null,
        phone: null,
        whatsappUrl: null,
        instagramUrl: null,
        websiteUrl: null,
        mapUrl: null,
        status: "published",
      },
      {
        beachSlug: "ponta-verde",
        name: "Paraíso dos Reis",
        category: "inn",
        description:
          "Pousada apresentada no projeto original. Contatos e disponibilidade ainda aguardam confirmação.",
        image: "/images/paraiso-reis.webp",
        address: null,
        phone: null,
        whatsappUrl: null,
        instagramUrl: null,
        websiteUrl: null,
        mapUrl: null,
        status: "published",
      },
    ],
  };
}
