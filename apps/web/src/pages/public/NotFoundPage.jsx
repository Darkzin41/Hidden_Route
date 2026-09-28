import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <span className="eyebrow">Erro 404</span>
      <h1>Essa rota ainda não existe.</h1>
      <p>Talvez o caminho tenha mudado ou o endereço esteja incompleto.</p>
      <Link className="button button--primary" to="/">
        <ArrowLeft size={18} /> Voltar ao início
      </Link>
    </section>
  );
}
