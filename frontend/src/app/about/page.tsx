'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Users, MapPin, Target, Lightbulb, Award } from 'lucide-react';
import { Footer } from '@/components/layout/footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sobre Nós</h1>
            <p className="text-gray-600 text-lg">Conheça a história e missão da PorPerto</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 text-center">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <div className="text-2xl font-bold">LB</div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Conectando a Comunidade de Mozelos</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Uma plataforma que fortalece os laços entre vizinhos, promovendo ajuda mútua e construindo uma comunidade mais unida.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Nossa Missão</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Facilitar a conexão entre vizinhos em Mozelos, criando uma rede de apoio onde todos podem contribuir com as suas competências e receber ajuda quando necessário, fortalecendo o espírito de comunidade.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">Nossa Visão</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Ser a plataforma de referência para comunidades locais em Portugal, demonstrando que a tecnologia pode aproximar pessoas e criar laços genuínos de vizinhança e solidariedade.
                </p>
              </div>
            </div>

            {/* Story */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Heart className="w-6 h-6 text-red-500 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-900">A Nossa História</h2>
              </div>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A PorPerto nasceu da observação de que, mesmo numa era hiperconectada, muitos vizinhos não se conhecem nem se ajudam mutuamente. Em Mozelos, como em muitas outras localidades, existem pessoas com diversas competências e disponibilidade para ajudar, mas falta um meio eficaz de as conectar com quem precisa.
                </p>
                <p>
                  Em 2025, decidimos criar uma solução digital que fosse simples, segura e focada na comunidade local. A nossa plataforma permite que os residentes de Mozelos se conectem de forma natural, oferecendo e solicitando ajuda em diversas áreas, desde pequenas reparações a companhia para idosos.
                </p>
                <p>
                  Acreditamos que a tecnologia deve servir para aproximar pessoas, não para as distanciar. Por isso, a PorPerto foi desenhada para facilitar encontros reais e criar relacionamentos genuínos entre vizinhos.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-900">Os Nossos Valores</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comunidade</h3>
                  <p className="text-sm text-gray-600">Fortalecemos os laços entre vizinhos, criando uma verdadeira comunidade de apoio mútuo.</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Confiança</h3>
                  <p className="text-sm text-gray-600">Promovemos um ambiente seguro onde todos podem confiar uns nos outros.</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Local</h3>
                  <p className="text-sm text-gray-600">Focamos no que está perto, valorizando as relações de proximidade geográfica.</p>
                </div>
              </div>
            </div>

            {/* How it Works */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Como Funciona</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Registo</h3>
                  <p className="text-sm text-gray-600">Crie a sua conta usando o Google e complete o seu perfil com as suas competências.</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Explore</h3>
                  <p className="text-sm text-gray-600">Veja os pedidos de ajuda na sua área ou crie o seu próprio pedido.</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Conecte</h3>
                  <p className="text-sm text-gray-600">Comunique através do chat integrado e combine os detalhes da ajuda.</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    4
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Avalie</h3>
                  <p className="text-sm text-gray-600">Após a ajuda, avalie a experiência e construa a sua reputação na comunidade.</p>
                </div>
              </div>
            </div>

            {/* Community Focus */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Porquê Mozelos?</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Começámos em Mozelos porque acreditamos que as melhores soluções nascem localmente. Esta comunidade tem características únicas que tornam possível criar uma rede de apoio genuína:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Comunidade próxima:</strong> O tamanho ideal para todos se conhecerem gradualmente</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Diversidade de competências:</strong> Residentes com diferentes profissões e experiências</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Espírito de entreajuda:</strong> Tradição portuguesa de vizinhança solidária</span>
                </li>
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Junte-se à Nossa Comunidade</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Tem sugestões, questões ou quer saber mais sobre a PorPerto? Estamos sempre disponíveis para conversar com a nossa comunidade.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Entre em Contacto
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}