import { Link } from 'react-router-dom';
import { ArrowUpRight, Rotate3D, Scan, MousePointer2, Keyboard, Layers3 } from 'lucide-react';
import { assetUrl } from '../utils/assets';
export default function ExperiencePage() {
  return (
    <div className="page-width experience-page">
      <div className="page-intro">
        <span className="eyebrow">LA EXPERIENCIA / TACTICAL 360</span>
        <h1>
          Comprender empieza
          <br />
          por observar.
        </h1>
        <p>
          Un espacio para explorar el diseño del equipamiento, con el producto siempre en el centro.
        </p>
      </div>
      <div className="experience-banner">
        <img
          src={assetUrl('/images/atlas-sand-perspective.webp')}
          alt="Modelo ilustrativo ATLAS Sand en perspectiva"
        />
        <div>
          <span className="eyebrow">EXPLORACIÓN INTERACTIVA</span>
          <h2>
            Cada ángulo.
            <br />A tu ritmo.
          </h2>
          <Link to="/producto/atlas-sand" className="button primary">
            Probar el visor <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
      <div className="guide-grid">
        {[
          {
            icon: Rotate3D,
            title: 'Gira en 360°',
            text: 'Arrastra con el ratón o con un dedo. Las vistas frontal, posterior, lateral y superior te llevan directamente al ángulo que buscas.',
          },
          {
            icon: MousePointer2,
            title: 'Acércate al detalle',
            text: 'Usa la rueda, pellizca con dos dedos o pulsa + y −. Haz doble clic en una pieza para centrar la cámara. Restablece la vista en cualquier momento.',
          },
          {
            icon: Scan,
            title: 'Explora componentes',
            text: 'Activa el modo Componentes y selecciona un marcador o un elemento del selector. Los puntos acompañan a la geometría al girar el modelo.',
          },
          {
            icon: Layers3,
            title: 'Mira hacia adentro',
            text: 'La vista Interior aparece únicamente cuando el modelo tiene geometría interna. En ATLAS puedes observar la carcasa y las almohadillas modeladas.',
          },
          {
            icon: Keyboard,
            title: 'También con teclado',
            text: 'Navega con Tab y activa controles con Enter o Espacio. Dentro del visor, usa flechas para elegir vistas, + y − para el zoom, y 0 para restablecer.',
          },
        ].map((item) => (
          <article key={item.title}>
            <item.icon size={26} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
        <article className="guide-disclosure">
          <span className="eyebrow">TRANSPARENCIA POR DISEÑO</span>
          <h3>Una demostración, con alcance claro.</h3>
          <p>
            Los GLB y renders son originales e ilustrativos. Las fichas omiten pesos, materiales y
            certificaciones no documentados.
          </p>
          <a
            className="text-link"
            href={assetUrl('/documents/catalogo-demo.html')}
            target="_blank"
            rel="noreferrer"
          >
            Consultar documentación <ArrowUpRight size={16} />
          </a>
        </article>
      </div>
    </div>
  );
}
