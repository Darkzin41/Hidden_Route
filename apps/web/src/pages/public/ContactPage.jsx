import { Clock3, MapPin, MessageSquareText } from "lucide-react";
import { ContactForm } from "../../features/contact/ContactForm.jsx";
import { api } from "../../shared/api/api-client.js";
import { ParallaxHero } from "../../shared/ui/ParallaxHero.jsx";

export default function ContactPage() {
  return (
    <>
      <ParallaxHero
        compact
        image="/images/location.webp"
        eyebrow="Canal aberto"
        title="Converse com a Hidden Route"
        description="Sugira uma praia, apresente um negócio local ou envie uma dúvida para a equipe."
      />
      <section className="section section--sand contact-section">
        <div className="container contact-layout">
          <div className="contact-copy">
            <span className="eyebrow">Estamos por perto</span>
            <h2>Sua mensagem ajuda a melhorar o mapa.</h2>
            <p className="lead">
              Este é o canal oficial do projeto. Cada mensagem fica registrada
              para que a equipe possa acompanhar com organização.
            </p>
            <div className="contact-facts">
              <div>
                <MapPin aria-hidden="true" />
                <span>
                  <strong>Base do projeto</strong>São Luís, Maranhão
                </span>
              </div>
              <div>
                <Clock3 aria-hidden="true" />
                <span>
                  <strong>Retorno</strong>Conforme disponibilidade da equipe
                </span>
              </div>
              <div>
                <MessageSquareText aria-hidden="true" />
                <span>
                  <strong>Boas contribuições</strong>Rotas, correções e
                  parcerias locais
                </span>
              </div>
            </div>
          </div>
          <ContactForm
            onSubmit={(values) => api.post("/api/contact", values)}
          />
        </div>
      </section>
    </>
  );
}
